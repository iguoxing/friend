//index.js
var core = require('../../static/js/core.js');
var util = require('../../static/js/util.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        user: {'user_money': '￥0', 'pay_points': '0', 'headimg': '/static/images/icon/user-not.png'},
        userStatus: 'true',
        bindmobile: '绑定手机',
        page_data: 'user'
    },
    //事件处理函数
    onShow: function () {

        // console.log(this.data.user);

        var that = this

        //检查状态
        var user_info = app.getUserInfo();

        if (user_info != null) {
            that.setData({
                userInfo: user_info
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '微信登录失效，是否立即重新登录？',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        core.doLogin();
                    }
                }
            });
            return 0;
        }
        // 获取余额和消息数据
        var sign = user_info.sign;
        var uid = user_info.user_id;

        core.requestApi(app.globalData.htApiUrl, {
            act: 'get_user_info',
            sign: sign,
            uid: uid
        }, function (res) {
            if (res.data.err == 0) {
                // 将数据绑定到前台
                that.setData({
                    user: res.data,
                    userStatus: true
                });

                if (res.data.mobile_phone != 0) {
                    that.setData({
                        bindmobile: res.data.mobile_phone
                    })
                }

                core.saveUserStorage(res.data);

            } else {
                // 验证失败
                that.setData({
                    userStatus: false,
                    user: {},
                    bindmobile: '请先登录后绑定手机'
                })
                wx.showModal({
                    title: '提示',
                    content: '登录状态失效啦，是否立即重新登录？',
                    success: function (res) {
                        if (res.confirm) {
                            core.doLogin();
                            return 0;
                        }
                    }
                })
            }

        })

    },
    user_exit: function () {
        // 会员注销

        var that = this

        var user_info = app.getUserInfo();

        // console.log(user_info);

        wx.showModal({
            title: '注销吗？',
            content: '注销后您需要重新登录才能体验完整功能',
            success: function (res) {
                if (res.confirm) {

                    // 发送请求，修改sign
                    core.requestApi(app.globalData.htApiUrl,{
                        act: 'user_exit',
                        uid: user_info.user_id,
                        sign: user_info.sign
                    },function (res) {
                        if (res.data.err == 0) {
                            try {
                                wx.setStorageSync('userInfo', null);
                            } catch (e) {
                                console.log('会员注销-保存用户信息到缓存出错！');
                            }

                            wx.showToast({
                                title: '您已注销！',
                                icon: 'success',
                                duration: 2000
                            });
                            that.setData({
                                userStatus: 'false',
                                user: {'user_money': '￥0', 'y_money': '0'},
                                bindmobile: '请先登录'
                            })
                        }
                    });
                }

            }
        })

    },
    call_phone: function () {

        // 发送请求，获取管理员号码

        wx.makePhoneCall({
            phoneNumber: '18065157019'
        })

    }
})
