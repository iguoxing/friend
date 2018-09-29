// pages/category/category.js
var core = require('../../static/js/core.js');
var app = getApp();
var page_number = 0;
var is_loadMore = 1;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cat_list: [],
        catindex: 0,
        footer_text: '加载中...',
        scrollHeight: 0,
        searchinput: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var that = this;

        if (options.cat_id) {
            var e = {currentTarget: {dataset: {cat_id: options.cat_id}}};
            // console.log(e);
            that.cat_tabClick(e);
        }

        // 设置下滑框的高度
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight - 60
                });
            }
        });

        // 请求分类信息
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'category'
        }, function (res) {
            that.setData({
                cat_list: res.data.cat_list,
                catindex: res.data.cat_list[0].cat_id
            })

        });
        // this.loadMore();
    },
    cat_tabClick: function (e) {
        var that = this;
        that.setData({
            catindex: e.currentTarget.dataset.cat_id
        })
    },
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
    }
})