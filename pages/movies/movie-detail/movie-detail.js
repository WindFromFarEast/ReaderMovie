var app = getApp();
var util = require("../../../utils/util.js");

Page({

    data: {
        movie: {},
    },

    onLoad: function (options) {
        //获取movieId
        var movieId = options.id;
        //获取对应movieId的电影信息api
        var url = app.globalData.g_doubanBase + "/v2/movie/subject/" + movieId;
        //
        util.http(url, this.processDoubanData);
    },

    processDoubanData: function (data) {
        if (!data) {
            return;
        }
        //获取导演信息
        var director = {
            avatar: "",
            name: "",
            id: "",
        };
        //空值判断
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars;
            }
            director.name = data.directors[0].name;
            if (data.directors[0].avatars.id != null) {
                director.id = data.directors[0].id;
            }
        }
        //获取当前id的电影所有信息
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.originalTitle,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            genres: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary,
        };
        //数据绑定
        this.setData({
            movie: movie,
        });
    },

    //查看图片
    viewMoviePostImg: function (event) {
        console.log("点击了图片");
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src],
        });
    },

});