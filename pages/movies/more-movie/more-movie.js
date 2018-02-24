var app = getApp();
var util = require("../../../utils/util.js");

//电影更多页面
Page({

    data: {
        totalCount: 0,
        //判断电影数据movies是否为空
        isEmpty: true,
    },

    onLoad: function (options) {
        //获取电影分类
        var category = options.category;
        //对电影分类进行数据绑定
        this.setData({
            category: category,
        });
        //电影数据api
        var dataUrl = "";
        //根据电影分类从豆瓣获取不同的数据
        switch (category) {
            case "正在热映": {
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
                break;
            }
            case "即将上映": {
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
                break;
            }
            case "Top250": {
                dataUrl = app.globalData.g_doubanBase + "/v2/movie/top250";
                break;
            }
        }
        this.setData({
            requestUrl: dataUrl,
        });
        util.http(dataUrl, this.processDoubanData);
    },

    //回调函数，处理豆瓣穿回来的电影数据，并进行数据绑定
    processDoubanData: function (data) {
        var movies = [];
        for (var idx in data.subjects) {
            //获取其中一个电影信息
            var subject = data.subjects[idx];
            //获取电影名称并截取
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                //电影名称
                title: title,
                //电影评分
                average: subject.rating.average,
                //电影封面
                coverageUrl: subject.images.large,
                //电影id
                movieId: subject.id,
                //电影星级,数据类型:[1,1,1,1,1]或者[1,1,1,0,0]之类
                stars: util.convertToStarsArray(subject.rating.stars),
            };
            var array = util.convertToStarsArray(subject.rating.stars);
            movies.push(temp);
        }
        var totalMovies = [];
        //如要绑定新加载的数据，需要和旧有的数据合并
        if (!this.data.isEmpty) {
            //把新增加的电影数据与之前的电影数据合并
            totalMovies = this.data.movies.concat(movies);
        }else {
            totalMovies = movies;
            this.setData({
                isEmpty: false,
            });
        }
        //数据绑定
        this.setData({
            movies: totalMovies,
            totalCount: this.data.totalCount + 20,
        });
        //隐藏Loading图标
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
    },

    onReady: function (options) {
        var category = this.data.category;
        //动态设置导航标题栏
        wx.setNavigationBarTitle({
            title: category,
        });
    },

    //下拉到底部，加载更多数据
    onScrollLower: function (event) {
        //获取新数据
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount +"&count=" + 20;
        util.http(nextUrl, this.processDoubanData);
        //显示Loading图标
        wx.showNavigationBarLoading();
    },

    //下拉刷新
    onPullDownRefresh: function (event) {
        var refreshUrl = this.data.requestUrl + "?start=0&count=20";
        //清空电影数据
        this.setData({
            movies: [],
            isEmpty: true,
            totalCount: 0,
        });
        util.http(refreshUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },

    //点击电影回调的方法
    onMovieTap: function (event) {
        //获取movieId
        var movieId = event.currentTarget.dataset.movieid;
        //跳转到电影详情页面
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId,
        });
    },

});