var core = require('../../../static/js/core.js');
var app = getApp();
var pay_type = 1;
var address_id = 0;
var order = '';
var button_load = 'false';
Page({
    data: {
        tis: '',
        tisshow: '',
        user_address_list: '',
        user_default_address: 'null',
        cart_list: 0,
        shipping_list: '',
        pay_radio_select: [{wx: 'pay_radio_select', yue: '', hdfk: ''}],
        goods_amount: 0,
        shipping_fee: 0,
        goods_amount_sum: 0,
        supp_shipping_fee: 0,
        order_note_AreaBlur: ''
    },
    onLoad: function () {
        var user_info = app.getUserInfo();
        var that = this
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'flow',
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            console.log(res.data)

            // 商品配送方式
            if (res.data.cart_list == '0') {
                that.setData({
                    tis: '请在购物车,选中待结的商品后再结算喔',
                    tisshow: 'height: auto;margin: 20rpx auto;'
                })
            }
            else {
                that.setData({
                    cart_list: res.data.cart_list,
                    shipping_list: res.data.shipping_list
                })
            }
            // 收货地址
            if (res.data.user_default_address != 'null') {
                that.setData({
                    user_default_address: res.data.user_default_address
                })

                address_id = res.data.user_default_address.address_id;
                that.get_amount_sum();

            }
            else {
                wx.redirectTo({
                    url: '/pages/userApiUrl/edit_address/edit_address?type=flow'
                })
            }

        });
    },
    pay_radioChange: function (e) {

        var that = this
        that.setData({
            pay_radio_select: [{wx: '', yue: '', hdfk: ''}]
        })

        if (e.detail.value == 1) {
            that.setData({
                pay_radio_select: [{wx: 'pay_radio_select', yue: '', hdfk: ''}]
            })
        }
        else if (e.detail.value == 2) {
            that.setData({
                pay_radio_select: [{wx: '', yue: 'pay_radio_select', hdfk: ''}]
            })
        }
        else if (e.detail.value == 3) {
            that.setData({
                pay_radio_select: [{wx: '', yue: '', hdfk: 'pay_radio_select'}]
            })
        }

        pay_type = e.detail.value;
    },
    order_note_AreaBlur: function (e) {
        this.setData({
            order_note_AreaBlur: e.detail.value
        })
    },
    get_amount_sum: function () {

        wx.showToast({
            title: '稍等一小会儿',
            icon: 'loading',
            duration: 10000
        })

        var user_info = app.getUserInfo();
        var that = this
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'get_order_amount',
            uid: user_info.user_id,
            address_id: address_id
        }, function (res) {

            wx.hideToast()


            if (res.data.err == 0) {
                that.setData({
                    goods_amount: res.data.amount,
                    shipping_fee: res.data.shipping_fee,
                    supp_shipping_fee: res.data.supp_shipping_fee,
                    goods_amount_sum: res.data.goods_amount_sum
                })
            }
            else {
                that.setData({
                    tis: '获取总额失败,请返回重试!',
                    tisshow: 'height: auto;margin: 20rpx auto;'
                })
            }
        });
    },
    order_done: function () {
        // console.log(pay_type);
        // console.log(address_id);

        this.setData({
            button_load: 'true'
        })

        var that = this
        if (pay_type == 1) {
            // 微信支付,获取用户codecode
            wx.login({
                success: function (res) {

                    if (res.code) {
                        that.send_order(res.code);
                        console.log('获取到的code' + res.code);
                    } else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                    }
                }
            });

        }
        else {
            that.send_order(0);
        }


    },
    send_order: function (code) {
        var user_info = app.getUserInfo();
        var that = this

        core.requestApi(app.globalData.shopApiUrl, {
            act: 'flow_done',
            uid: user_info.user_id,
            sign: user_info.sign,
            address_id: address_id,
            pay_id: pay_type,
            user_code: code
        }, function (res) {
            if (res.data.err == 0) {
                wx.showToast({
                    title: '订单提交成功!',
                    icon: 'success',
                    duration: 1000
                })

                var success_res = res;

                if (pay_type == 1) {
                    // console.log('发起支付');
                    // 发起支付
                    wx.requestPayment({
                        'timeStamp': res.data.order.timeStamp.toString(),
                        'nonceStr': res.data.order.nonceStr,
                        'package': res.data.order.package,
                        'signType': 'MD5',
                        'paySign': res.data.order.paySign,
                        'complete': function (res) {
                            wx.redirectTo({
                                url: '/pages/shop/done/done?pay_id=' + pay_type + '&pay_log=' + success_res.data.pay_log
                            })
                        }
                    })

                }
                else {
                    wx.redirectTo({
                        url: '/pages/shop/done/done?pay_id=' + pay_type + '&pay_log=' + res.data.pay_log
                    })
                }

                // order = res.data.order
            }
            else {
                that.setData({
                    tis: res.data.msg,
                    tisshow: 'height: auto;margin: 20rpx auto;'
                })
            }
        });
    }
})