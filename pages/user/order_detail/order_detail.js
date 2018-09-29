// pages/show_news/show_news.js
var core = require('../../../static/js/core.js');
var app = getApp()
Page({
    data: {
        tis: '',
        tisshow: '',
        order_info: ''
    },
    onLoad: function (options) {

        var that = this

        var user_info = app.getUserInfo();
        if (user_info == null) return;

        if (options.msg) {
            that.setData({
                tis: options.msg,
                tisshow: 'height:30px;'
            })
        }

        if (!options.order_id) {
            that.setData({
                tis: '订单不存在喔喔！',
                tisshow: 'height:30px;'
            })
        }
        else {
            // 请求订单详情
            core.requestApi(app.globalData.userApiUrl, {
                act: 'order_detail',
                uid: user_info.user_id,
                sign: user_info.sign,
                order_id: options.order_id
            }, function (res) {
                that.setData({
                    order_info: res.data.order_info
                });
            });
        }
    }
})