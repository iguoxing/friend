// pages/store_info/store_info.js
var core = require('../../static/js/core.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nav_id: 0,
        suppliers: [],
        mall_goods_list: [],
        tuan_goods_list: [],
        is_show_share: 0
    },
    change_nav: function (e) {
        this.setData({
            nav_id: e.currentTarget.dataset.nav_id
        })
    },
    is_show_share: function () {
        this.setData({
            is_show_share: 1
        })
    },
    hidden_share: function () {
        this.setData({
            is_show_share: 0
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'store_info',
            id: options.id
        }, function (res) {

            if (res.data.err == 0) {
                that.setData({
                    suppliers: res.data.suppliers,
                    mall_goods_list: res.data.mall_goods_list,
                    tuan_goods_list: res.data.best_list
                })
            }

        });
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