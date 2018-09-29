// pages/square/square.js
var core = require('../../static/js/core.js');
var app = getApp();
var keywords = ''
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    get_list: function () {
        // 发送请求获取广场资料函数
        console.log('请求列表')
        var that = this
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'ajax_get_square',
            keywords: keywords
        }, function (res) {
            if (res.data.err == 0) {
                that.setData({
                    list: res.data.list
                })
            }
            else {
                list:[]
            }
        });
    },
    bindinput_seach: function (e) {
        keywords = e.detail.value
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        keywords = '';
        this.setData({
            list: []
        })
        this.get_list();
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