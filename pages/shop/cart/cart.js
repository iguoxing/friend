var core = require('../../../static/js/core.js');
var app = getApp();
var check_list = '';
Page({
    data: {
        cart_list: 'null',
        tis: '购物车还是空的',
        tis2: '去选购',
        tisurl: '/pages/index/index',
        sum_goods_price: 0,
        check_list: '',
        edit_rec_id: 0,
        borderh10: 600,
        is_quanxuan: 1
    },
    onShow: function () {
        // 读取购物车

        var that = this

        var user_info = app.getUserInfo();
        if(null==user_info)return;
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'cart',
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            that.setData({
                cart_list: res.data.cart_list,
                sum_goods_price: res.data.sum_goods_price,
                is_quanxuan: res.data.is_quanxuan
            })

            // 设置下滑框的高度
            wx.getSystemInfo({
                success: function (res) {

                    if (that.data.cart_list == 'null') {

                        that.setData({
                            borderh10: res.windowHeight - 300
                        });

                    }
                    else {
                        that.setData({
                            borderh10: res.windowHeight - (that.data.cart_list.length * 125)
                        });
                    }
                }
            });
        });

    },
    changebox: function (e) {
        //发送选择状态列表到后台，获取新列表

        console.log(e);

        var value = '';
        for (var i = 0; i < e.detail.value.length; i++) {
            value = value + e.detail.value[i] + "|";
        }

        if (value == '') {
            value = 'no';
        }

        check_list = value;
        console.log('这些被选择:' + check_list);

        this.setData({
            check_list: check_list
        })

        this.send_change_list(check_list, 0, 0, 0, 0);

    },
    num_jian: function (e) {
        //   console.log(e.target.dataset.cart_id+'数量-'+1);
        this.send_change_list(check_list, e.target.dataset.cart_id, 0, 1, 0, 0);
    },
    num_jia: function (e) {
        //   console.log(e.target.dataset.cart_id+'数量+'+1);
        this.send_change_list(check_list, e.target.dataset.cart_id, 1, 0, 0, 0);
    },
    num_change: function (e) {
        //   console.log(e.target.dataset.cart_id+'数量改为'+e.detail.value);
        this.send_change_list(check_list, e.target.dataset.cart_id, 0, 0, e.detail.value, 0);
    },
    send_change_list: function (check_list, rec_id, number_jia, number_jian, number_change, is_del) {

        var that = this
        var user_info = app.getUserInfo();

        core.requestApi(app.globalData.shopApiUrl, {
            act: 'cart',
            uid: user_info.user_id,
            sign: user_info.sign,
            checked: check_list,
            rec_id: rec_id,
            number_jia: number_jia,
            number_jian: number_jian,
            number_change, number_change,
            is_del: is_del
        }, function (res) {
            // console.log(res);
            that.setData({
                cart_list: res.data.cart_list,
                sum_goods_price: res.data.sum_goods_price,
                is_quanxuan: res.data.is_quanxuan
            })

            // 设置下滑框的高度
            wx.getSystemInfo({
                success: function (res) {

                    if (that.data.cart_list == 'null') {

                        that.setData({
                            borderh10: res.windowHeight - 300
                        });

                    }
                    else {
                        that.setData({
                            borderh10: res.windowHeight - (that.data.cart_list.length * 125)
                        });
                    }
                }
            });

        });
    },
    del_goods: function (e) {
        var that = this
        wx.showModal({
            title: '提示',
            content: '您确定要移除这个商品吗？',
            success: function (res) {
                if (res.confirm) {
                    that.send_change_list(check_list, e.target.dataset.cart_id, 0, 0, 0, 1);
                }
            }
        })

    },
    edit_cart_goods: function (e) {
        this.setData({
            edit_rec_id: e.currentTarget.dataset.edit_rec_id
        })
    }
    ,
    edit_cart_goods_ok: function (e) {
        this.setData({
            edit_rec_id: 0
        })
    },
    quanxuan_botton_tap: function () {
        if (this.data.is_quanxuan == 1) {
            // 取消全部选择
            this.send_change_list('no', 0, 0, 0, 0, 0);
        }
        else {
            // 选择全部
            this.send_change_list('quanxuan', 0, 0, 0, 0, 0);
        }
    }
})