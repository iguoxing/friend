// pages/user/my_tuan/my_tuan.js
var core = require('../../../static/js/core.js');
var app = getApp();
var pages = 0;
var is_loading = 1;//是否还可以加载
var bindinput_textarea = '';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        type_id: 0,
        order_list: [],
        common_bg: 0,
        squareOrderId: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        if (options.type_id > 0) {
            that.setData({
                type_id: options.type_id
            })
        }
    },
    change_type_id: function (e) {

        this.setData({
            type_id: e.currentTarget.dataset.type_id,
            order_list: []
        })

        pages = 0;
        is_loading = 1;//是否还可以加载
        this.load_list();
    },
    show_square: function (e) {
        // 弹出发布框
        var that = this
        that.setData({
            common_bg: (that.data.common_bg == 1 ? 0 : 1),
            squareOrderId: e.currentTarget.dataset.orderId
        });

    },
    bindinput_textarea: function (e) {
        bindinput_textarea = e.detail.value;
    },
    submitCommont: function (e) {
        // var show_square_order_id = e.currentTarget.dataset.order_id;
        // console.log('提交发布广场ID：' + show_square_order_id);
        console.log(e.detail);

        var that = this
        var user_info = app.getUserInfo();
        if (null == user_info) return;
        // 发送请求提交到广场
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'release_square',
            uid: user_info.user_id,
            sign: user_info.sign,
            order_id: that.data.squareOrderId,
            bindinput_textarea: e.detail.value.comment
        }, function (res) {
            wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success: function (res2) {
                    if (res2.confirm) {
                        console.log('用户点击确定');
                        if (res.data.err == 0) {
                            // 跳转到广场
                            wx.switchTab({
                                url: '/pages/square/square'
                            })
                        }
                    }
                }
            })
        });
    },
    load_list: function () {
        var that = this
        var user_info = app.getUserInfo();
        if (null == user_info) return;
        if (is_loading == 1) {
            pages++;
        }
        else {
            console.log('没有可以加载的了！');
            return 0;
        }
        ;

        core.requestApi(app.globalData.userApiUrl, {
            act: 'tuan_order_list',
            type_id: that.data.type_id,
            page: pages,
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            that.setData({
                order_list: that.data.order_list.concat(res.data.order_list)
            });
            is_loading = res.data.list_count;
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
        // 变量初始化
        pages = 0;
        is_loading = 1;//是否还可以加载
        this.setData({
            order_list: []
        });
        this.load_list();
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
        this.load_list();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})