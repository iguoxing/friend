// pages/stores/stores.js
var core = require('../../static/js/core.js');
var app = getApp();
var pages = 0;//页码
var load_more = 1;//是否还可以加载
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Hangye: [],
        stores: [],
        hangye_id: 0
    },
    change_Hangye: function (e) {
        this.setData({
            hangye_id: e.currentTarget.dataset.hangye_id,
            stores: []
        })

        pages = 0;
        load_more = 1;
        this.load_list();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        pages = 0;
        load_more = 1;
        this.load_list();
    },
    load_list: function () {
        var that = this

        if (load_more == 0) {
            return 0;
        }

        pages++;
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'stores',
            hangye_id: that.data.hangye_id,
            page: pages
        }, function (res) {

            if (res.data.err == 0) {
                that.setData({
                    stores: that.data.stores.concat(res.data.res)
                })
                if (res.data.page == 1) {
                    that.setData({
                        Hangye: res.data.Hangye
                    })
                }

                if (res.data.res.length <= 0) {
                    that.setData({
                        no_stores: '此分类下暂时还没有店铺哦!'
                    })
                }

                load_more = res.data.load_more
            }

        });
    },
    onReachBottom: function () {
        this.load_list();
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