// pages/tuan/tuan.js
var core = require('../../static/js/core.js');
var app = getApp();
var goods_id = 0;
var goods_number = 1;
var express_id = null;//用户选择的配送方式
var pay_id = null;//用户选择的支付方式
var shipping_id = null
var postscript = '';
var team_sign = '';
var attr = null
var log_point_phone = 0;
var user_pointChange = 0;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        shipping_list: [],
        goods_info: [],
        order_fee: [],
        user_default_address: [],
        payment_list: [],
        user_money: 0.00,
        default_express_id: null,
        attr_text: '',
        is_show_user_address: 1,
        point_list: [],
        point_list_index: 0,
        point_data: 0,
        point_time: 0,
        is_show_body: 0
    },
    pointChange: function (e) {
        var that = this
        // 计算取货点的Id
        var point_list_tmp = new Array();
        point_list_tmp[0] = new Array();
        point_list_tmp[0]['id'] = 0;
        point_list_tmp[0]['shop_name'] = '请选择自提点';
        var y = 1;
        for (var i in that.data.goods_info.point_list) {

            point_list_tmp[y] = new Array();
            point_list_tmp[y]['id'] = that.data.goods_info.point_list[i].id
            point_list_tmp[y]['shop_name'] = that.data.goods_info.point_list[i].shop_name
            y++;
        }

        that.setData({
            point_list_index: e.detail.value
        })

        user_pointChange = point_list_tmp[e.detail.value].id

    },
    log_point_phone: function (e) {
        log_point_phone = e.detail.value;
    },
    pointdateChange: function (e) {
        this.setData({
            point_data: e.detail.value
        })
    },
    pointtimeChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            point_time: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        goods_id = options.goods_id
        goods_number = options.goods_number
        team_sign = options.team_sign
        attr = options.attr
        // console.log(attr);

        console.log('做到自提点选择功能pointChange')
    },

    shippingChange: function (e) {
        var user_info = app.getUserInfo();
        if (user_info == null) return;
        var that = this
        express_id = e.detail.value

        // 循环列表确认是否是上门取货
        var shipping_list = that.data.shipping_list

        var is_cac = 0;//不是上门取货

        for (var i in shipping_list) {
            if (shipping_list[i].shipping_id == e.detail.value && shipping_list[i].shipping_name == '上门取货') {
                is_cac = 1;
            }
        }

        if (is_cac == 1) {
            that.setData({
                is_show_user_address: 0
            })
        }
        else {
            that.setData({
                is_show_user_address: 1
            })
        }

        //发送商品ID和快递ID以及购买数量和团购标示到后台请求运费
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'select_shipping',
            uid: user_info.user_id,
            sign: user_info.sign,
            goods_id: goods_id,
            number: goods_number,
            express_id: e.detail.value,
            shipping_id: null,
            attr: attr
        }, function (res) {

            if (res.data.err == 0) {
                that.setData({
                    order_fee: res.data.order_fee
                })
            }

        });
    },
    shipping2Change: function (e) {
        var user_info = app.getUserInfo();
        if (user_info == null) return;
        console.log(e)
        var that = this
        shipping_id = e.detail.value


        // 循环列表确认是否是上门取货
        var shipping_list = that.data.shipping_list

        var is_cac = 0;//不是上门取货

        for (var i in shipping_list) {
            if (shipping_list[i].shipping_id == e.detail.value && shipping_list[i].shipping_name == '上门取货') {
                is_cac = 1;
            }
        }

        if (is_cac == 1) {
            that.setData({
                is_show_user_address: 0
            })
        }
        else {
            that.setData({
                is_show_user_address: 1
            })
        }
        //发送商品ID和快递ID以及购买数量和团购标示到后台请求运费
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'select_shipping',
            uid: user_info.user_id,
            sign: user_info.sign,
            goods_id: goods_id,
            number: goods_number,
            express_id: null,
            shipping_id: shipping_id,
            attr: attr
        }, function (res) {

            if (res.data.err == 0) {
                that.setData({
                    order_fee: res.data.order_fee
                })
            }

        });
    },
    payChange: function (e) {
        console.log(e.detail.value)
        pay_id = e.detail.value
    },
    flow_pay: function (e) {
        var that = this
        console.log(express_id + '&' + pay_id + '&' + postscript + '&shipping_id=' + shipping_id + '&goods_id=' + goods_id);
        // 将订单信息，发送到后台建立订单，返回分享地址，在线支付时，返回在线地址的资料

        if (pay_id == null) {
            wx.showModal({
                title: '提示',
                content: '请选择支付方式！',
                showCancel: false,
                success: function (res) {

                }
            })
            return 0;
        }

        if (pay_id == 1) {
            // 获取code
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
    send_order: function (user_code) {
        var that = this
        var user_info = app.getUserInfo();
        if (user_info == null) return;
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'tuan_done',
            uid: user_info.user_id,
            sign: user_info.sign,
            goods_id: goods_id,
            number: goods_number,
            express_id: express_id,
            pay_id: pay_id,
            postscript: postscript,
            shipping_id: shipping_id,
            team_sign: team_sign,
            user_code: user_code,
            attr: attr,
            point_id: user_pointChange,
            checked_mobile: log_point_phone,
            best_time: that.data.point_data + that.data.point_time
        }, function (res) {
            wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
            })

            if (res.data.pay_id == 1) {
                // 调起微信支付
                wx.requestPayment({
                    'timeStamp': res.data.order.timeStamp.toString(),
                    'nonceStr': res.data.order.nonceStr,
                    'package': res.data.order.package,
                    'signType': 'MD5',
                    'paySign': res.data.order.paySign,
                    'fail': function (rs) {
                        console.log('支付失败信息' + rs);
                        wx.showToast({
                            title: '支付取消',
                            icon: 'success',
                            duration: 2000
                        });
                        // 跳转到分享页面
                        wx.redirectTo({
                            url: '/pages/goods/goods?goods_id='+goods_id
                        })
                     },
                    'success': function (rs) {
                        console.log('支付成功信息' + rs);
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                        })
                        // 跳转到分享页面
                        wx.redirectTo({
                            url: '/pages/share_tuan/share_tuan?team_sign=' + res.data.team_sign
                        })
                    }
                })
            }
            else {
                // 跳转到分享页面
                wx.redirectTo({
                    url: '/pages/share_tuan/share_tuan?team_sign=' + res.data.team_sign
                })
            }
        }, 'GET', function (res) {
            if (res.data.err == 4) {
                // 跳转

                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    confirmText: '跳转',
                    success: function (res2) {
                        if (res2.confirm) {
                            wx.navigateTo({
                                url: '/pages/share_tuan/share_tuan?team_sign=' + res.data.user_team
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
            else if (res.data.err == 89) {
                // 显示错误提示
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res2) {
                        if (res2.confirm) {
                            wx.redirectTo({
                                url: '/pages/share_tuan/share_tuan?team_sign=' + res.data.team_sign
                            })
                        }
                    }
                })
            }
            else {
                // 显示错误提示
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res) {

                    }
                })
            }
        });
    },
    edit_postscript: function (e) {
        postscript = e.detail.value
    }
    ,

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        var that = this;
        var user_info = app.getUserInfo();
        if (user_info == null) return;
        var sign = user_info.sign;
        var uid = user_info.user_id;
        that.setData({
            user_money: user_info.user_money
        });
        // 发送请求获取商品信息，费用信息，配送信息，支付方式
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'goods_tuan',
            uid: uid,
            sign: sign,
            goods_id: goods_id,
            number: goods_number,
            attr: attr
        }, function (res) {
            var point_list_tmp = [];
            point_list_tmp[0] = '请选择自提点';
            var y = 1;
            for (var i in res.data.goods_info.point_list) {

                point_list_tmp[y] = res.data.goods_info.point_list[i].shop_name + ' ' + res.data.goods_info.point_list[i].address + '' + res.data.goods_info.point_list[i].mobile
                y++;
            }

            var time1 = Number(Date.parse(new Date()));

            var date = new Date(time1);

            var Y1 = date.getFullYear();
            var M1 = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月份
            var D1 = date.getDate();//日
            var h1 = date.getHours();//小时

            that.setData({
                point_data: Y1 + '-' + M1 + '-' + D1,
                point_time: Number(h1) + 1 + ':' + '00'
            })

            /* // 计算从当前起后7天是那7天
             var time1 = Number(Date.parse(new Date())) + 604800000;

             var date = new Date(time1);

             var M1 = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月份
             var D1 = date.getDate();//日
             var h1 = date.getHours();//小时

             console.log('7天后:' + M1 + D1 + h1);

             var time2 = Number(Date.parse(new Date()));

             var date2 = new Date(time2);

             var M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1);//月份

             var dateArray = [];
             dateArray[0] = [];
             dateArray[1] = [];
             dateArray[2] = [];

             if (M2 != M1){
               // 月份不同，显示两个月份
               dateArray[0][0] = M2;
               dateArray[0][0] = M1;
             }
             else
             {
               dateArray[0][0] = M1 + '月';
             }

             for(var i=0;i<=7;i++){
               dateArray[1][0] = [];
             }

             console.log(dateArray);*/

            // 循环配送方式，如果默认选择上门取货

            that.setData({
                shipping_list: res.data.shipping_list,
                goods_info: res.data.goods_info,
                order_fee: res.data.order_fee,
                user_default_address: res.data.user_default_address,
                payment_list: res.data.payment_list,
                default_express_id: res.data.default_express_id,
                attr_text: res.data.price_res.goods_attr,
                point_list: point_list_tmp,
                is_show_body: 1
            })

            var shipping_list = res.data.shipping_list

            for (var i in shipping_list) {
                if (shipping_list[i].shipping_code == 'cac' && shipping_list[i].checked) {
                    that.setData({
                        is_show_user_address: 0
                    })
                }
            }

            express_id = res.data.default_express_id
            shipping_id = res.data.default_shipping_id
        }, 'GET', function (res) {
            if (res.data.err == 5) {
                // 跳转到收货地址设置页面
                /*wx.navigateTo({
                  url: '/pages/userApiUrl/edit_address/edit_address?type=flow&goods_id=' + goods_id + '&flow_type=tuan&goods_number=' + goods_number
                })*/

                that.setData({
                    is_show_body: 0
                })

                // 跳转到收货地址设置页面
                wx.showModal({
                    title: '提示',
                    content: '您还没有设置收货地址，无法完成购物，要立即设置吗？',
                    confirmText: '去设置',
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/user/edit_address/edit_address?type=flow&goods_id=' + goods_id + '&flow_type=tuan&goods_number=' + goods_number + '&team_sign=' + team_sign
                            })
                        } else if (res.cancel) {
                            wx.navigateBack();
                        }
                    }
                })
            }
            else {
                that.setData({
                    is_show_body: 0
                })
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateBack(1);
                        }
                    }
                })

            }
        });

    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
    ,

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
    ,

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '快来参团就差你了！',
            path: '/pages/goods/goods?goods_id='+goods_id
        }
    }
})