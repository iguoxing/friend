// pages/select_address/select_address.js
var core = require('../../static/js/core.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        province_list: [],
        select_one_tab: -2,
        city_list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        // 获取省份列表
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'edit_address',
            address_id: 0
        }, function (res) {
            if (res.data.err == 0) {
                console.log(res);
                that.setData({
                    province_list: res.data.province_list
                })
            }

        });
    },
    select_province: function (e) {
        var that = this
        that.setData({
            select_one_tab: e.currentTarget.dataset.id
        })

        if (e.currentTarget.dataset.id == -1) {
            console.log('用户选择:全国');

            // 将用户选择保存到缓存，跳转到首页
            try {
                wx.setStorageSync('select_address', '全国');
            } catch (e) {
                console.log('保存用户选择地址失败');
            }

            wx.switchTab({
                url: '/pages/index/index'
            })

            return 0;
        }

        wx.showLoading({
            title: '加载中',
        })

        //   将选择的省份id发送到后台，获取城市列表
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'get_region',
            address_id: e.currentTarget.dataset.id
        }, function (res) {
            wx.hideLoading();
            if (res.data.err == 0) {
                that.setData({
                    city_list: res.data.list
                })
            }
        });

    },
    select_city: function (e) {
        console.log('用户选择:' + e.currentTarget.dataset.name);
        // 将用户选择保存到缓存，跳转到首页
        try {
            wx.setStorageSync('select_address', e.currentTarget.dataset.name);
        } catch (e) {
            console.log('保存用户选择地址失败');
        }

        wx.switchTab({
            url: '/pages/index/index'
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