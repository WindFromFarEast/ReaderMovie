var app = getApp();
var util = require("../../utils/util.js");

Page({

    data: {
        //电影首页默认显示
        containerShow: true,
        //搜索页面默认隐藏
        searchPannelShow: false,
        //搜索栏右侧取消图标默认隐藏
        searchCancelShow: false,
        //
        searchText: "",
    },

    onLoad: function (options) {
        //正在热映api的尾地址
        var inTheatersUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        //即将上映api的尾地址
        var comingSoonUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        //top250api的尾地址
        var top250Url = app.globalData.g_doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        //
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "Top250");
    },

    //从指定的豆瓣api获取数据
    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-type': 'application/json'
            },
            success: function (result) {
                that.processDoubanData(result.data, settedKey, categoryTitle);
            },
            fail: function (result) {

            },
        });
    },

    //处理从豆瓣获取的数据，进行数据绑定
    processDoubanData: function (doubanData, settedKey, categoryTitle) {
        var movies = [];
        for (var idx in doubanData.subjects) {
            //获取其中一个电影信息
            var subject = doubanData.subjects[idx];
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
            console.log(array);
            movies.push(temp);
        }
        //数据绑定
        if (settedKey === "inTheaters") {
            this.setData({
                inTheaters: {
                    movies: movies,
                    categoryTitle: categoryTitle,
                },
            });
        } else if (settedKey === "comingSoon") {
            this.setData({
                comingSoon: {
                    movies: movies,
                    categoryTitle: categoryTitle,
                },
            });
        } else if (settedKey === "top250") {
            this.setData({
                top250: {
                    movies: movies,
                    categoryTitle: categoryTitle,
                },
            });
        } else if (settedKey === "searchResult") {
            this.setData({
                searchResult: {
                    movies: movies,
                    categoryTitle: categoryTitle,
                }
            });
        }
    },

    //点击更多跳转到更多页面
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
        });
    },

    //聚焦到搜索框时回调的方法
    onBindFocus: function (event) {
        //隐藏电影首页,显示搜索页面,显示取消搜索图标
        this.setData({
            containerShow: false,
            searchPannelShow: true,
            searchCancelShow: true,
        });
    },

    //聚焦搜索框后点击确定时回调的方法
    onBindConfirm: function (event) {
        //获取input搜索框输入的内容
        var text = event.detail.value;
        //调用豆瓣搜索api
        var searchUrl = app.globalData.g_doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
        //
        this.setData({
            searchText: text,
        });
    },

    //点击搜索栏右边的取消图标后回调的方法
    onCancelSearchTap: function (event) {
        //显示电影首页,隐藏搜索页面,隐藏取消搜索图标
        this.setData({
            containerShow: true,
            searchPannelShow: false,
            searchCancelShow: false,
            searchResult: {},
            searchText: "",
        });
    },

    //点击电影回调的方法
    onMovieTap: function (event) {
        //获取movieId
        var movieId = event.currentTarget.dataset.movieid;
        //跳转到电影详情页面
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId,
        });
    },

});