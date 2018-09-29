var core = require('../../../static/js/core.js');
var app = getApp();
Page({
    data: {
        user_address: [],
        add_err_tis: '',
        flow_tis_style: ''
    },
    onLoad: function (query) {
        // 请求列表
        this.get_address_list();

        if (query.type == 'flow') {
            this.setData({
                flow_tis_style: 'display:block'
            })
        }
    },
    set_address: function (e) {
        var that = this;
        var user_info = app.getUserInfo();
        if(null==user_info)return;
        if (e.target.dataset.address_id) {
            //   发送修改请求
            core.requestApi(app.globalData.shopApiUrl, {
                act: 'set_address',
                uid: user_info.user_id,
                sign: user_info.sign,
                address_id: e.target.dataset.address_id
            }, function (res) {
                if (res.data.err == 0) {
                    console.log('修改成功！');

                    wx.showToast({
                        title: '默认地址修改成功！',
                        icon: 'success',
                        duration: 1000
                    })

                    that.get_address_list();

                }
                else {
                    console.log('出错啦');
                }
            });
        }
    },
    del_address: function (e) {
        if (e.target.dataset.address_id) {
            var that = this
            var user_info = app.getUserInfo();

            wx.showModal({
                title: '删除提示',
                content: '您确定要删除这收货地址吗？',
                success: function (res) {
                    if (res.confirm) {
                        // console.log('用户点击确定'+e.target.dataset.address_id)
                        // 发送请求删除
                        core.requestApi(app.globalData.shopApiUrl, {
                            act: 'del_address',
                            uid: user_info.user_id,
                            sign: user_info.sign,
                            address_id: e.target.dataset.address_id
                        }, function (res) {
                            if (res.data.err == 0) {
                                // 删除成功
                                that.get_address_list();
                            }
                            else {
                                console.log('出错啦');
                            }
                        });


                    }
                }
            })

        }
        else {
            console.log('意外触发');
        }
    },
    get_address_list: function () {
        //   获取收货地址列表函数
        var that = this;
        var user_info = app.getUserInfo();
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'address_list',
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            if (res.data.err == 0) {

                if (res.data.user_address != 'null') {
                    that.setData({
                        user_address: res.data.user_address
                    })
                }
                else {
                    that.setData({
                        user_address: 'null',
                        add_err_tis: '您还没有收货地址！'
                    })
                }
            }
            else if (res.data.err == 1 || res.data.err == 2) {
                that.setData({
                    user_address: 'null',
                    add_err_tis: '您还没有登录喔！'
                })
            }
            else {
                that.setData({
                    user_address: 'null',
                    add_err_tis: '网络异常！'
                })
            }
        });
    }

})