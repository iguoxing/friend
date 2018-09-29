// pages/tuan/tuan.js
var core = require('../../../static/js/core.js');
var app = getApp();
var express_id = 'null';//用户选择的配送方式
var shipping_id = 'null';
var postscript = '';
// var goods_suppliers_id = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shipping_list: [],
        goods_list: [],
        user_default_address: [],
        payment_list: [],
        user_money: 0.00,
        shipping_fee: 0,
        is_express: 0,
        goods_amount: 0,
        shipping_fee_sum: 0,
        goods_amount_sum: 0,
        goods_list_tmp: [],
        //用户选择的支付方式
        pay_id:null
    },
    onLoad: function () {

    },
    pointChange: function (e) {
        var that = this
        var suppliers_id = e.currentTarget.dataset.suppliers_id;

        var goods_list = that.data.goods_list

        var goods_list_tmp = that.data.goods_list_tmp;

        var point_list_tmp = new Array();//自提点列表

        for (var i in goods_list) {
            if (goods_list[i].suppliers_id == suppliers_id) {
                goods_list[i].point_list_tmp_id = e.detail.value;

                //获取这个商品的 point_list_tmp
                // point_list_tmp = that.data.goods_list[i].point_list_tmp;

                point_list_tmp[0] = new Array();
                point_list_tmp[0]['id'] = 0;
                point_list_tmp[0]['shop_name'] = '请选择自提点';

                var y = 1;
                for (var t in that.data.goods_list[i].point_list) {

                    point_list_tmp[y] = new Array();
                    point_list_tmp[y]['id'] = that.data.goods_list[i].point_list[t].id
                    point_list_tmp[y]['shop_name'] = that.data.goods_list[i].point_list[t].shop_name
                    y++;
                }

                // console.log(suppliers_id+'的自提点列表tmp')
                // console.log(point_list_tmp);

                // 记录用户选择的自取方式ID
                for (var x in goods_list_tmp) {
                    if (goods_list_tmp[x].suppliers_id == suppliers_id) {
                        goods_list_tmp[x].point_id = point_list_tmp[e.detail.value].id;
                        break;
                    }
                }

                // console.log('修改过自提点的临时商品列表')
                // console.log(goods_list_tmp);

                break;
            }
        }

        that.setData({
            goods_list: goods_list,
            goods_list_tmp: goods_list_tmp
        })
    },
    log_point_phone: function (e) {

        var that = this
        var goods_list_tmp = that.data.goods_list_tmp;

        for (var i in goods_list_tmp) {
            if (goods_list_tmp[i].suppliers_id == e.currentTarget.dataset.suppliers_id) {
                goods_list_tmp[i].log_point_phone = e.detail.value;
            }
        }

        that.setData({
            goods_list_tmp: goods_list_tmp
        })
    },
    pointdateChange: function (e) {
        var that = this
        var goods_list_tmp = that.data.goods_list_tmp;

        for (var i in goods_list_tmp) {
            if (goods_list_tmp[i].suppliers_id == e.currentTarget.dataset.suppliers_id) {
                goods_list_tmp[i].point_data = e.detail.value;
            }
        }

        // 修改前台显示的时间
        var goods_list = that.data.goods_list;

        for (var y in goods_list) {
            if (goods_list[y].suppliers_id == e.currentTarget.dataset.suppliers_id) {
                goods_list[y].point_data = e.detail.value;
            }
        }

        that.setData({
            goods_list_tmp: goods_list_tmp,
            goods_list: goods_list
        })
    },
    pointtimeChange: function (e) {
        var that = this
        var goods_list_tmp = that.data.goods_list_tmp;

        for (var i in goods_list_tmp) {
            if (goods_list_tmp[i].suppliers_id == e.currentTarget.dataset.suppliers_id) {
                goods_list_tmp[i].point_time = e.detail.value;
            }
        }

        // 修改前台显示的时间
        var goods_list = that.data.goods_list;

        for (var y in goods_list) {
            if (goods_list[y].suppliers_id == e.currentTarget.dataset.suppliers_id) {
                goods_list[y].point_time = e.detail.value;
            }
        }

        that.setData({
            goods_list_tmp: goods_list_tmp,
            goods_list: goods_list
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {

        var that = this

        //检查状态
        var user_info = app.getUserInfo();
        if(null==user_info)return;
        that.setData({
            user_money: user_info.user_money
        })

        // 发送请求获取结算信息，费用信息，配送信息，支付方式
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'flow',
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {

            // 建立商品列表的简约数组，记录配送方式等信息，提交订单时发送到后台
            var goods_list_tmp = [];
            var point_list_tmp = [];//自取方式

            for (var i in res.data.cart_list) {
                var suppliers_id = res.data.cart_list[i].suppliers_id;

                goods_list_tmp[suppliers_id] = [];
                // goods_list_tmp[suppliers_id]['goods_id'] = res.data.cart_list[i]['goods_id'];
                goods_list_tmp[suppliers_id]['suppliers_id'] = res.data.cart_list[i]['suppliers_id'];

                goods_list_tmp[suppliers_id]['shipping_fee'] = 0;//运费
                goods_list_tmp[suppliers_id]['shipping_id'] = 0;//配送方式未选择
                goods_list_tmp[suppliers_id]['express_id'] = 0;//配送方式未选择
                goods_list_tmp[suppliers_id]['shipping_code'] = '';//配送方式的标识符
                goods_list_tmp[suppliers_id]['point_id'] = 0;//自取点ID未选择
                goods_list_tmp[suppliers_id]['log_point_phone'] = '';//自取手机号
                goods_list_tmp[suppliers_id]['point_data'] = '';//自取日期
                goods_list_tmp[suppliers_id]['point_time'] = '';//自取时间

                // 自取方式的简约版
                point_list_tmp[suppliers_id] = [];

                point_list_tmp[suppliers_id][0] = '请选择自提点';

                if (res.data.cart_list[i].point_list != 'null') {
                    var y = 1;

                    for (var b in res.data.cart_list[i].point_list) {

                        point_list_tmp[suppliers_id][y] = res.data.cart_list[i].point_list[b].shop_name + ' ' + res.data.cart_list[i].point_list[b].address + ' ' + res.data.cart_list[i].point_list[b].mobile
                        y++;
                    }

                }

                res.data.cart_list[i].point_list_tmp = point_list_tmp[suppliers_id];
                res.data.cart_list[i].point_list_tmp_id = 0;

                // 设置自取的初始时间
                var time1 = Number(Date.parse(new Date()));

                var date = new Date(time1);

                var Y1 = date.getFullYear();
                var M1 = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//月份
                var D1 = date.getDate();//日
                var h1 = date.getHours();//小时

                res.data.cart_list[i].point_data = Y1 + '-' + M1 + '-' + D1;
                res.data.cart_list[i].point_time = Number(h1) + 1 + ':' + '00';

                goods_list_tmp[suppliers_id]['point_data'] = res.data.cart_list[i].point_data;//自取日期
                goods_list_tmp[suppliers_id]['point_time'] = res.data.cart_list[i].point_time;//自取时间

            }

            console.log('goods_list_tmp:');
            console.log(goods_list_tmp);

            console.log('point_list_tmp:');
            console.log(point_list_tmp);

            that.setData({
                goods_list: res.data.cart_list,
                user_default_address: res.data.user_default_address,
                payment_list: res.data.payment_list,
                goods_amount: res.data.goods_amount,
                goods_amount_sum: res.data.goods_amount,
                goods_list_tmp: goods_list_tmp
            })

            // goods_suppliers_id = res.data.goods_suppliers_id

            if (res.data.cart_list == 0) {
                wx.showModal({
                    title: '提示',
                    content: '您的购物车还没有商品！',
                    showCancel: false
                })
            }
        },'GET',function(res){
            if (res.data.err == 5) {
                // 跳转到收货地址设置页面
                wx.showModal({
                    title: '提示',
                    content: '您还没有设置收货地址，无法完成购物，要立即设置吗？',
                    confirmText: '去设置',
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/user/edit_address/edit_address?type=flow&flow_type=one'
                            })
                        } else if (res.cancel) {
                            wx.navigateBack();
                        }
                    }
                })
            }
            else {
                // 出错了
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res2) {
                        if (res2.confirm) {
                            if (res.data.is_back == 1) {
                                wx.navigateBack(1);
                            }
                        }
                    }
                })
            }
        });


    },

    shippingChange: function (e) {
        var user_info = app.getUserInfo();
        if(null==user_info)return;
        // express_id改变
        var that = this
        var suppliers_id = e.currentTarget.dataset.suppliers_id
        express_id = e.detail.value
        //发送商品ID和快递ID以及购买数量和团购标示到后台请求运费
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'select_shipping',
            uid: user_info.user_id,
            sign: user_info.sign,
            express_id: e.detail.value,
            shipping_id: 'null',
            flow_type: 'one',
            suppliers_id: suppliers_id
        }, function (res) {
            var goods_amount_sum = 0;//总费用
            var shipping_fee_sum = 0;//总运费
            var is_show_cac = 0;//不是自取
            var goods_list = that.data.goods_list_tmp;
            for (var i in goods_list) {
                if (goods_list[i].suppliers_id == suppliers_id) {
                    goods_list[i].shipping_fee = res.data.order_fee.shipping_fee;
                    goods_list[i].express_id = express_id;
                }
                // 计算总运费和总费用
                shipping_fee_sum = Number(shipping_fee_sum) + Number(goods_list[i].shipping_fee);//总运费
            }

            goods_amount_sum = Number(that.data.goods_amount) + Number(shipping_fee_sum);//总费用
            goods_amount_sum = goods_amount_sum.toFixed(2);

            // 遍历寻找用户选择的配送方式是不是自取
            var goods_list2 = that.data.goods_list;
            for (var y in goods_list2) {
                if (goods_list2[y].suppliers_id == suppliers_id) {
                    goods_list2[y].is_show_cac = 0;
                    for (var x in goods_list2[y].shipping_list) {

                        if (goods_list2[y].shipping_list[x]['id'] == express_id && goods_list2[y].shipping_list[x]['shipping_code'] == 'cac') {
                            // console.log('选的配送方式为');
                            // console.log(goods_list2[y].shipping_list[x]);
                            goods_list2[y].is_show_cac = 1;
                        }

                    }
                }
            }

            that.setData({
                goods_list_tmp: goods_list,
                shipping_fee_sum: shipping_fee_sum,
                goods_amount_sum: goods_amount_sum,
                goods_list: goods_list2
            })

        });
    },
    shipping2Change: function (e) {
        var user_info = app.getUserInfo();
        if(null==user_info)return;
        var that = this
        var suppliers_id = e.currentTarget.dataset.suppliers_id
        shipping_id = e.detail.value
        //发送商品ID和快递ID以及购买数量和团购标示到后台请求运费
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'select_shipping',
            uid: user_info.user_id,
            sign: user_info.sign,
            express_id: 'null',
            shipping_id: shipping_id,
            flow_type: 'one',
            suppliers_id: suppliers_id
        }, function (res) {
// 记录该商品的运费

            var goods_amount_sum = 0;//总费用
            var shipping_fee_sum = 0;//总运费

            var goods_list = that.data.goods_list_tmp;

            for (var i in goods_list) {
                if (goods_list[i].suppliers_id == suppliers_id) {
                    goods_list[i].shipping_fee = res.data.order_fee.shipping_fee
                    goods_list[i].shipping_id = shipping_id
                }
                // 计算总运费和总费用
                shipping_fee_sum = Number(shipping_fee_sum) + Number(goods_list[i].shipping_fee);
            }

            goods_amount_sum = Number(that.data.goods_amount) + Number(shipping_fee_sum);
            goods_amount_sum = goods_amount_sum.toFixed(2);

            // 遍历寻找用户选择的配送方式是不是自取
            var goods_list2 = that.data.goods_list;
            for (var y in goods_list2) {
                if (goods_list2[y].suppliers_id == suppliers_id) {
                    goods_list2[y].is_show_cac = 0;
                    for (var x in goods_list2[y].shipping_list) {

                        if (goods_list2[y].shipping_list[x]['shipping_id'] == shipping_id && goods_list2[y].shipping_list[x]['shipping_code'] == 'cac') {
                            // console.log('选的配送方式为:自提');
                            // console.log(goods_list2[y].shipping_list[x]);
                            goods_list2[y].is_show_cac = 1;
                        }

                    }
                }
            }

            that.setData({
                goods_list_tmp: goods_list,
                shipping_fee_sum: shipping_fee_sum,
                goods_amount_sum: goods_amount_sum,
                goods_list: goods_list2
            })

        });

    },
    payChange: function (e) {
        console.log(e.detail.value)
        var that = this;
        that.data.pay_id = e.detail.value||null;

    },
    flow_pay: function (e) {
        var that = this

        // 将订单信息，发送到后台建立订单，返回分享地址，在线支付时，返回在线地址的资料
        var pay_id = that.data.pay_id;
        if (pay_id == null) {
            wx.showModal({
                title: '提示',
                content: '请选择支付方式！',
                showCancel: false
            })
            return 0;
        }

        var goods_list_tmp = that.data.goods_list_tmp;
        var goods_list = that.data.goods_list;

        for (var i in goods_list_tmp) {
            if (goods_list_tmp[i].express_id == 0 && goods_list_tmp[i].shipping_id == 0) {
                wx.showModal({
                    title: '提示',
                    content: '请选择配送方式！',
                    showCancel: false
                })

                return 0;
            }

            // 遍历商品数组
            for (var x in goods_list) {
                if (goods_list[x].is_show_cac == 1 && goods_list[x].suppliers_id == goods_list_tmp[i].suppliers_id) {
                    // 检查自取数据

                    if (goods_list_tmp[i].point_id == 0) {
                        wx.showModal({
                            title: '提示',
                            content: '请选择自取点！',
                            showCancel: false
                        })

                        return 0;
                    }
                    else if (goods_list_tmp[i].log_point_phone == '') {
                        wx.showModal({
                            title: '提示',
                            content: '请填写自取手机号码！',
                            showCancel: false
                        })
                        return 0;
                    }
                    else if (goods_list_tmp[i].point_data == '') {
                        wx.showModal({
                            title: '提示',
                            content: '请选择自取日期！',
                            showCancel: false
                        })
                        return 0;
                    }
                }
            }

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
        if(null==user_info)return;
        var formData = [];
        formData.uid = user_info.user_id;
        formData.sign = user_info.sign;
        formData.pay_id = that.data.pay_id;;
        formData.postscript = postscript;
        formData.user_code = user_code;
        formData.address_id = that.data.user_default_address.address_id;

        // 将goods_list_tmp组合为json字符串
        var goods_list_tmp = that.data.goods_list_tmp;
        var json_s = '[';
        var goods_list_tmp_length = Number(goods_list_tmp.length) - 1;

        for (var i in goods_list_tmp) {
            json_s = json_s + '{"suppliers_id":' + goods_list_tmp[i].suppliers_id + ',"shipping_fee":' + goods_list_tmp[i].shipping_fee + ',"shipping_id":' + goods_list_tmp[i].shipping_id + ',"express_id":' + goods_list_tmp[i].express_id + ',"point_id":' + goods_list_tmp[i].point_id + ',"log_point_phone":"' + goods_list_tmp[i].log_point_phone + '","point_data":"' + goods_list_tmp[i].point_data + '","point_time":"' + goods_list_tmp[i].point_time + '"}';

            if (i < goods_list_tmp_length) {
                json_s = json_s + ',';
            }
        }

        json_s = json_s + ']';

        formData.goods_list_tmp = json_s;
        wx.request({
            url:  app.globalData.shopApiUrl + '?act=flow_done',
            data: formData,
            method: "post",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

                if (res.data.err == 0) {
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
                            'complete': function (pay_res) {
                                console.log('支付调起信息' + pay_res);
                                // 跳转到订单提交成功页面
                                wx.redirectTo({
                                    url: '/pages/shop/done/done?pay_id=' + res.data.pay_id + '&pay_log=' + res.data.pay_log
                                })
                            }
                        })
                    }
                    else {
                        // 跳转到提交成功页面
                        wx.redirectTo({
                            url: '/pages/shop/done/done?pay_id=' + res.data.pay_id + '&pay_log=' + res.data.pay_log
                        })
                    }

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

            }
        })
    },
    edit_postscript: function (e) {
        postscript = e.detail.value
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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