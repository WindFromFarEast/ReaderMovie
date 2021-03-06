Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        //获取用户信息
        wx.getUserInfo({
            success:function (result) {
                console.log(result);
                var username = result.userInfo.nickName;
                that.setData({
                    username: username,
                });
            }
        });
    },

    /*点击开启小程序之旅按钮后触发事件，跳转页面*/
    onTap: function (event) {
        /*从父级页面跳转到子级页面，即跳转后的页面左上角有返回键*/
        // wx.navigateTo({
        //     url: '../posts/post',
        // });

        /*平行跳转，即跳转后的页面左上角没有返回键*/
        wx.switchTab({
            url: '/pages/posts/post',
        });
    },
    
})