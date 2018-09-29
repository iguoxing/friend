// pages/category_info/category_info.js
var core = require('../../static/js/core.js');
var app = getApp();
var page_number = 0;
var is_loadMore = 1;
var category_id = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods_list: [],
        is_goods_list: 0,
        footer_text: '加载中...',
        xianshimoshi: 1,
        cat_list: [],
        catindex: 0,
        scroll_into_view: '',
        searchinput: '',
        cat_parent_id: 0,
        cat_type: 'tuan'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this

        if (options.type) {
            that.setData({
                cat_type: options.type
            })
        }


        // 请求分类信息
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'category',
            category_id: options.category_id
        }, function (res) {

            if (res.data.err == 0) {
                that.setData({
                    cat_list: res.data.cat_list,
                    cat_parent_id: res.data.cat_parent_id
                })
                if (options.category_id) {
                    that.setData({
                        scroll_into_view: 'cat_' + options.category_id,
                        catindex: options.category_id
                    })
                }
            }

        });

        category_id = options.category_id;

        page_number = 0;
        is_loadMore = 1;

        if (options.category_id >= 0) {
            this.loadMore(options.category_id);
        }

    },
    cat_tabClick: function (e) {
        // console.log(e.currentTarget.dataset.cat_id);

        var that = this;
        is_loadMore = 1;
        page_number = 0;
        that.setData({
            catindex: e.currentTarget.dataset.cat_id,
            goods_list: [],
            footer_text: '加载中...'
        })
        category_id = e.currentTarget.dataset.cat_id;
        this.loadMore(e.currentTarget.dataset.cat_id);
    },
    tab_xiansi: function () {
        var that = this

        if (that.data.xianshimoshi == 1) {
            that.setData({
                xianshimoshi: 2
            })
        }
        else {
            that.setData({
                xianshimoshi: 1
            })
        }
    },
    loadMore: function (category_id) {
        var that = this;

        if (is_loadMore == 0) {
            return 0;
        }

        is_loadMore = 0;

        wx.showLoading({
            title: '加载中...'
        })

        page_number++
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'ajax_goods_list',
            page: page_number,
            cat_id: category_id,
            cat_type: that.data.cat_type
        }, function (res) {

            wx.hideLoading();


            if (res.data.err == 0) {
                that.setData({
                    goods_list: that.data.goods_list.concat(res.data.best_list)
                })

                if (res.data.best_list.length > 0) {
                    that.setData({
                        is_goods_list: 1
                    })
                }
                else {
                    that.setData({
                        is_goods_list: 0
                    })
                }

                is_loadMore = res.data.list_count;
                if (is_loadMore == 0) {
                    that.setData({
                        footer_text: '没有更多商品了!'
                    })
                }
            }

        });
    },


    onReachBottom: function () {
        // 上拉触底
        console.log(category_id);
        this.loadMore(category_id);
    }
    ,
    to_search: function (e) {
        // 开始搜索 pages/search/search

        wx.navigateTo({
            url: '/pages/search/search?keywords=' + this.data.searchinput
        })

    },
    searchinput: function (e) {
        // 记录用户输入的搜索词
        this.setData({
            searchinput: e.detail.value
        })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})