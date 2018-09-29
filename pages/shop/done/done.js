var core = require('../../../static/js/core.js');
var app = getApp();

Page({
    data: {
        tis: '',
        tisshow: ''
    },
    onLoad: function (query) {
        var that = this
        var user_info = app.getUserInfo();

        if (query.pay_id && query.pay_log) {
            //发送请求结算
            core.requestApi(app.globalData.shopApiUrl, {
                act: 'pay_order',
                uid: user_info.user_id,
                sign: user_info.sign,
                pay_log: query.pay_log,
                pay_id: query.pay_id
            }, function (res) {
                if (res.data.err == 0) {
                    that.setData({
                        tis: res.data.msg,
                        tisshow: 'height: 30px;margin: 20rpx auto;background:#09bb07;'
                    })
                }
                else {
                    that.setData({
                        tis: res.data.msg,
                        tisshow: 'height: 30px;margin: 20rpx auto;'
                    })
                }
            });

        }
        else {
            that.setData({
                tis: '网络异常,请返回重试...',
                tisshow: 'height: 30px;margin: 20rpx auto;'
            })
        }
    },
    url_index: function () {
        wx.switchTab({
            url: '/pages/index/index'
        })
    }
})