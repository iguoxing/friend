var core = require('../../../static/js/core.js');
var app = getApp()
var pages = 0;
var load_more = 1;
Page({
    data: {
        order_list: [],
        load_footer: '正在加载更多...',
        nav_id: 0,
        wl_array: [],
        show_wl_view: 0,
        shipping_name: '',
        invoice_no: '',
        show_qrcode: 0,
        point_add_time: '',
        point_order_id: '',
        point: ''
    },
    onLoad: function (options) {
        // 发送请求获取首个列表和余额

        if (options.nav_id > 0) {
            this.setData({
                nav_id: options.nav_id
            })
        }

    },
    show_qrcode: function (e) {
        if (e.currentTarget.dataset.is_show == 1) {
            this.setData({
                show_qrcode: 1,
                point_add_time: e.currentTarget.dataset.add_time,
                point_order_id: e.currentTarget.dataset.order_id,
                point: e.currentTarget.dataset.point
            })
        }
        else {
            this.setData({
                show_qrcode: 0,
                point_add_time: '',
                point_order_id: '',
                point: ''
            })
        }

    },
    onShow: function () {
        pages = 0;
        load_more = 1;
        this.load_list();
    },
    onReachBottom: function () {
        this.load_list();
    },
    change_nav: function (e) {
        this.setData({
            nav_id: e.currentTarget.dataset.nav_id,
            order_list: [],
            load_footer: '正在加载更多...'
        })

        pages = 0;
        load_more = 1;
        this.load_list();
    },
    wl_view_close: function () {
        this.setData({
            show_wl_view: 0,
            wl_array: []
        })
    },
    cxwl: function (e) {
        var that = this
        console.log(e.currentTarget.dataset.order_id);

        // 发送请求查询物流
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'juhe_wuliu',
            order_id: e.currentTarget.dataset.order_id
        }, function (res) {
            if (res.data.err == 0) {
                // 弹出物流查询结果窗口
                that.setData({
                    show_wl_view: 1,
                    wl_array: res.data.list,
                    shipping_name: res.data.shipping_name,
                    invoice_no: res.data.invoice_no
                })
            }
            else {
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                })
            }

        });

    },
    load_list: function () {
        pages++;

        var that = this;

        var user_info = app.getUserInfo();

        if (load_more == 0) {
            return 0;
        }

        core.requestApi(app.globalData.userApiUrl, {
            act: 'order_list',
            page: pages,
            uid: user_info.user_id,
            sign: user_info.sign,
            composite_status: that.data.nav_id
        }, function (res) {
            if (res.data.err == 0) {
                that.setData({
                    order_list: res.data.orders
                })

                if (res.data.pager.page_count == res.data.pager.page) {
                    load_more = 0
                }
                else {
                    load_more = 1
                }
            }

        });
    },
    order_edit: function (e) {
        // 订单操作函数,接收订单号，以及操作标示符号
        console.log('对订单:' + e.target.dataset.order_id + "进行:" + e.target.dataset.edit);

        var user_info = app.getUserInfo();
        if(user_info==null)return;

        var that = this;

        if (!e.target.dataset.order_id) {
            return 0;
        }

        if (e.target.dataset.edit) {
            // 发送订单号和操作标示到后台
            core.requestApi(app.globalData.userApiUrl, {
                act: 'order_updata',
                edit_type: e.target.dataset.edit,
                order_id: e.target.dataset.order_id,
                uid: user_info.user_id,
                sign: user_info.sign
            },function(res){
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })

                that.setData({
                    order_list: [],
                    load_footer: '正在加载更多...'
                })

                pages = 0;
                load_more = 1;
                that.load_list();
            },'GET', function (res) {
                console.log(res.data)

                if (res.data.err == '07') {
                    // 微信支付,获取用户code
                    wx.login({
                        success: function (res2) {
                            if (res2.code) {
                                that.pay_order(res2.code, res.data.log_id, e.target.dataset.order_id);
                            } else {
                                console.log('获取用户信息失败！' + res2.errMsg)
                            }
                        }
                    });
                }
                else if (res.data.err == '88') {
                    // 微信支付,获取用户code
                    wx.login({
                        success: function (res2) {
                            if (res2.code) {
                                that.pay_order(res2.code, '', e.target.dataset.order_id, 1);
                            } else {
                                console.log('获取用户信息失败！' + res2.errMsg)
                            }
                        }
                    });
                }
                else {
                    // 将操作结果提示出来,刷新列表

                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })

                    that.setData({
                        order_list: [],
                        load_footer: '正在加载更多...'
                    })

                    pages = 0;
                    load_more = 1;
                    that.load_list();
                }

            });
        }

    },
    comment_order: function (e) {

        if (e.target.dataset.order_id) {
            wx.navigateTo({
                url: '/pages/userApiUrl/order_comment/order_comment?order_id=' + e.target.dataset.order_id
            })
        }

    },
    pay_order: function (code, log_id, order_id, is_tuan = 0) {
        var user_info = app.getUserInfo();
        var that = this

        if (is_tuan == 1) {
            var acct = 'wxpay_done_tuan';
        }
        else {
            var acct = 'wxpay_done';
        }
        core.requestApi(app.globalData.userApiUrl, {
            act: acct,
            uid: user_info.user_id,
            sign: user_info.sign,
            log_id: log_id,
            user_code: code,
            order_id: order_id
        }, function (res) {

            console.log(res);

            if (res.data.err == 0) {
                // 发起支付
                wx.requestPayment({
                    'timeStamp': res.data.order.timeStamp.toString(),
                    'nonceStr': res.data.order.nonceStr,
                    'package': res.data.order.package,
                    'signType': 'MD5',
                    'paySign': res.data.order.paySign,
                    'complete': function (res2) {
                        // 将操作结果提示出来,刷新列表

                        // wx.showModal({
                        //   title: '提示',
                        //   content: res.data.msg,
                        //   showCancel: false,
                        //   success: function (res) {
                        //     if (res.confirm) {
                        //       console.log('用户点击确定')
                        //     } else if (res.cancel) {
                        //       console.log('用户点击取消')
                        //     }
                        //   }
                        // })

                        that.setData({
                            order_list: [],
                            load_footer: '正在加载更多...'
                        })

                        pages = 0;
                        load_more = 1;
                        that.load_list();
                    }
                })
            }
            else {

                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })

                that.setData({
                    order_list: [],
                    load_footer: '正在加载更多...'
                })

                pages = 0;
                load_more = 1;
                that.load_list();
            }

        });


    }
})