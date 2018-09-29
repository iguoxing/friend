// pages/brand_info/brand_info.js
var core = require('../../static/js/core.js');
var app = getApp();
var page_number = 0;
var is_loadMore = 1;
var brand_id = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        footer_text: '加载中...',
        goods_list: [],
        brand_info: {'brand_logo': 'http://lht.she985.com/xcx/images/no-pic.jpg'}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        brand_id = options.brand_id

        if (brand_id > 0) {
            // 发送请求,获取品牌下商品列表
            page_number = 0;
            is_loadMore = 1;
            that.load_goods_list();
        }
        else {
            is_loadMore = 0;
            that.setData({
                goods_list: [],
                footer_text: '您访问的品牌不存在！'
            })
        }

    },
    load_goods_list: function () {
        var that = this

        if (is_loadMore == 0) {
            that.setData({
                footer_text: '没有更多商品了...'
            })
            return 0;
        }

        page_number++;
        core.requestApi(app.globalData.shopApiUrl,{
            act: 'brand_info',
            brand_id: brand_id,
            page: page_number
        },function (res) {

            if (res.data.err == 0) {
                that.setData({
                    goods_list: that.data.goods_list.concat(res.data.best_list),
                    brand_info: res.data.brand_info
                })

                if (res.data.list_count == 0) {
                    // 没有更多了
                    is_loadMore = 0;
                    that.setData({
                        footer_text: '没有更多商品了...'
                    })
                }

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
        this.load_goods_list();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})