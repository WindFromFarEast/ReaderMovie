var postsData = require('../../../data/posts-data.js');
//从app.json中获取全局对象
var app = getApp();

Page({
    data:{
        //标示音乐是否正在播放
        isPlayingMusic: false,
    },

    onLoad:function (option) {
        //获取当前文章的postId
        var postId = option.postid;
        //为了让该页面下的其他方法能调用onLoad方法里获取到的postId
        this.setData({
            currentPostId: postId,
        });
        //获取当前文章的详细数据
        var postData = postsData.postsList[postId];
        //将当前文章的详细数据保存到data对象中
        this.setData(postData);
        //从缓存中获取所有文章的收藏状态
        var postsCollected = wx.getStorageSync('posts_collected');
        /**
         * post_collected = {
         *     0: 'false',
         *     1: 'false',
         *     2: 'false',
         *     3: 'false',
         *     4: 'false',
         * }
         */
        //获取当前文章的收藏状态
        if (postsCollected) {
            var collected = postsCollected[postId];
            //将当前文章的收藏状态存在data对象中
            this.setData({
                collected: collected,
            });
        }else {
            //若第一次使用小程序，没有相关的缓存，则创建文章收藏状态的缓存
            var postsCollected = {};
            //默认当前文章为未收藏状态
            postsCollected[postId] = false;
            wx.setStorageSync("posts_collected", postsCollected);
        }
        //为了让封面上的音乐图标和总控开关一致，监听音乐播放状态
        this.addMusicListener();
        //根据app.js中的全局变量改变音乐播放状态图标
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true,
            });
        }else {
            this.setData({
                isPlayingMusic: false,
            });
        } 
    },

    //点击收藏图标触发的事件
    onCollectionTap:function (event) {
        //从缓存中获取所有文章的收藏情况
        var postsCollected = wx.getStorageSync("posts_collected");
        //获取当前文章的收藏情况
        var collected = postsCollected[this.data.currentPostId];
        //收藏->未收藏,未收藏->收藏
        collected = !collected;
        postsCollected[this.data.currentPostId] = collected;
        //更新文章是否收藏的缓存
        wx.setStorageSync('posts_collected', postsCollected);
        //更新data下的当前文章的收藏状态,从而实现收藏图标的切换
        this.setData({
            collected: collected,
        });
        //提示用户收藏成功或取消收藏成功
        if (collected) {
            wx.showToast({
                title: '收藏成功',
                duration: 1000,
            });
        }else {
            wx.showToast({
                title: '取消收藏',
                duration: 1000,
            });
        }

        // wx.showModal({
        //     title: '收藏',
        //     content: '是否收藏该文章',
        //     showCancel: "true",
        //     cancelText: "不收藏",
        //     cancelColor: '#333',
        //     confirmText: "收藏",
        //     confirmColor: "#405f80",
        // });
    },

    //点击分享图标触发的事件
    onShareTap:function (event) {
        wx.showActionSheet({
            itemList: [
                "分享给微信好友",
                "分享到朋友圈",
                "分享到QQ",
                "分享到微博",
            ],
            itemColor: "#405f80",
            success:function (res) {

            }
        });
    },

    //点击音乐图标触发的事件
    onMusicTap:function (event) {
        //isPlayingMusic用来表示音乐是否正在播放
        var isPlayingMusic = this.data.isPlayingMusic;
        //根据音乐播放状态执行不同的逻辑
        if (isPlayingMusic) {
            //音乐正在播放则暂停音乐
            wx.pauseBackgroundAudio();
            //改变音乐播放状态的标志变量
            this.setData({
                isPlayingMusic: false,
            });
        }else {
            //音乐没有播放则播放音乐
            wx.playBackgroundAudio({
                dataUrl: this.data.music.url,
                title: this.data.music.title,
                coverImgUrl: this.data.music.coverImg,
            });
            //改变音乐播放状态的标志变量
            this.setData({
                isPlayingMusic: true,
            });
        }
    },

    //为了让封面上的音乐图标和总控开关一致，监听音乐播放状态
    addMusicListener:function () {
        var that = this;
        //音乐在播放，将音乐图标设置为播放图标
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true,
            });
            //同时将app.js中保存音乐播放状态的全局变量设置为true
            app.globalData.g_isPlayingMusic = true;
            //使用全局变量保存当前播放歌曲的文章id
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        //音乐暂停，将音乐图标设置为暂停图标
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false,
            });
            //同时将app.js中保存音乐播放状态的全局变量设置为true
            app.globalData.g_isPlayingMusic = false;
            //清空当前播放歌曲的文章id
            app.globalData.g_currentMusicPostId = null;
        });
        //音乐播放完毕，将音乐图标设置为播放图标
        wx.onBackgroundAudioStop(function () {
            this.setData({
                isPlayingMusic: false,
            });
            //同时将app.js中保存音乐播放状态的全局变量设置为true
            app.globalData.g_isPlayingMusic = false;
            //清空当前播放歌曲的文章id
            app.globalData.g_currentMusicPostId = null;
        });
    },

})