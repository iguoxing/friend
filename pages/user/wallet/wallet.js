var core = require('../../../static/js/core.js');
var app = getApp()
var pages = 0;//页码
var load_more = 1;//是否还可以加载

var user_info = [];
Page({
    data: {
        surplus_amount: 0,
        account_log: [],
        load_footer: '正在加载更多...',
        nav_id: 1,
        pay_points: 0
    },
    onShow: function () {
        // 发送请求获取首个列表和余额

        pages = 0;//页码
        load_more = 1;//是否还可以加载

        user_info = app.getUserInfo();

        this.setData({
            userInfo: user_info
        })

        this.load_list();
    },
    change_nav: function (e) {
        this.setData({
            nav_id: e.target.dataset.nav_id,
            account_log: [],
            load_footer: '正在加载更多...'
        })
        pages = 0;//页码
        load_more = 1;//是否还可以加载

        this.load_list();
    },
    load_list: function () {

        // 加载账目明细和申请记录函数
        var that = this;

        if (load_more == 0) {
            return 0;
        }

        pages++;

        if (that.data.nav_id == 1) {
            // 加载账目明细
            core.requestApi(app.globalData.userApiUrl, {
                act: 'account_detail',
                pages: pages,
                uid: user_info.user_id,
                sign: user_info.sign
            }, function (res) {

                if (res.data.err == 0) {
                    that.setData({
                        account_log: that.data.account_log.concat(res.data.account_log)
                    })
                }
                else {
                    // 提示错误
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

        }
        else if (that.data.nav_id == 4) {
            // 加载申请记录
            core.requestApi(app.globalData.userApiUrl, {
                act: 'get_withdrawal_log',
                pages: pages,
                uid: user_info.user_id,
                sign: user_info.sign
            }, function (res) {
                if (res.data.err == 0) {
                    that.setData({
                        account_log: that.data.account_log.concat(res.data.account_log)
                    })
                }
                else {
                    // 提示错误
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
        }
        else {
            // 不加载任何

            return 0;
        }
    },
    onReachBottom: function () {
        this.load_list();
    },
    account_cz_Submit: function (e) {
        console.log(e);
        var that = this
        if (e.detail.value.amount > 0) {
            // 获取code发送请求
            wx.login({
                success: function (res2) {
                    if (res2.code) {
                        that.send_deposit(res2.code, e);
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res2.errMsg,
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        })
                    }
                }
            });
        }
        else {
            wx.showModal({
                title: '提示',
                content: '充值金额不能小于0哦！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }
    },
    send_deposit: function (user_code, e) {
        var that = this;
        core.requestApi(app.globalData.userApiUrl, {
            act: 'account_deposit',
            uid: user_info.user_id,
            sign: user_info.sign,
            amount: e.detail.value.amount,
            user_note: e.detail.value.user_note,
            user_name: user_info.user_name,
            user_code: user_code
        }, function (res) {

            if (res.data.err == 0) {
                // 发起支付

                wx.requestPayment({
                    'timeStamp': res.data.order.timeStamp.toString(),
                    'nonceStr': res.data.order.nonceStr,
                    'package': res.data.order.package,
                    'signType': 'MD5',
                    'paySign': res.data.order.paySign,
                    'complete': function (res2) {

                        wx.showToast({
                            title: '支付完成充值稍后自动到账!',
                            icon: 'success',
                            duration: 2000
                        })

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
                        }
                    }
                })
            }

        });

    },
    account_deposit_Submit: function (e) {
        var that = this
        core.requestApi(app.globalData.userApiUrl, {
            act: 'account_withdrawal',
            uid: user_info.user_id,
            sign: user_info.sign,
            amount: e.detail.value.amount,
            user_note: e.detail.value.user_note
        }, function (res) {

            /*if (res.data.err == 0){
              // 扣除前台的用户余额
              user_info.user_money = Number(user_info.user_money) - Number(res.data.amount);

              that.setData({
                userInfo: user_info
              })
            }*/

            // 提示
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

        });
    }
})