// pages/user_login/user_login.js
var util = require('../../static/js/util.js');
var core = require('../../static/js/core.js');
var app = getApp();
var refPage;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        login_bg: '',
        login_btton: '',
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        refPage = options.refPage
        core.requestApi(app.globalData.htApiUrl,
            {act: 'user_login_page'}, function (res) {
                if (res.data.err == 0) {
                    that.setData({
                        login_bg: res.data.login_bg,
                        login_btton: res.data.login_btton
                    })
                };
            },'GET');
        // 查看是否授权
        wx.getSetting({
            success: function(res){
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            console.log(res.userInfo)
                        }
                    })
                }
            }
        })
    },
    bindGetUserInfo: function (e) {
        console.log(e.detail.userInfo)
        if (e.detail.userInfo){
            console.log("用户按了允许授权按钮");
            core.wxLogin(e.detail.userInfo,app.globalData.htApiUrl,refPage);
        } else {
            console.log("用户按了拒绝按钮");
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})

