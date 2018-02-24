/*不能用绝对路径，只能用相对路径*/
var postData = require('../../data/posts-data.js');

Page({

    data: {

    },

    onLoad: function (options) {
        this.setData({
            posts_key: postData.postsList,
        });
    },

    onPostTap: function (event) {
        var postId = event.currentTarget.dataset.postid;
        //跳转到新闻详情页面
        wx.navigateTo({
            url: 'post-detail/post-detail?postid=' + postId,
        })
    },

    //点击轮播图跳转到相应的新闻详情页
    onSwiperTap:function (event) {
        var postId = event.target.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?postid=' + postId,
        });
    },
});