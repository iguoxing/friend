var core = require('../../../static/js/core.js');
var app = getApp();
var goods_id = 0;
var change_typea = '';
var change_typeb = '';
var dx_list = new Array();

Page({
    data: {
        tis: '',
        tisshow: '',
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        goods_img_list: [],
        goods_info: '',
        goods_desc: [],
        user_is_collect: 0,
        show_view_style: '',
        goods_properties: '',
        change_typeab_text: '',
        goods_number: 1,
        add_to_tis_style: 0,
        add_to_tis_text: ''
    },
    onLoad: function (query) {
        goods_id = query.goods_id;

        var that = this;
        var user_info = app.getUserInfo();

        // 获取该商品详细详细信息
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'goods',
            goods_id: goods_id,
            uid: user_info.user_id
        }, function (res) {
            console.log(res.data)
            if (res.data.err != 0) {
                that.setData({
                    tis: '您要的商品不见了...',
                    tisshow: 'height: 30px'
                })
            }
            else {

                if (res.data.goods_desc != 'null') {
                    var goods_desc = [];
                    var i;
                    for (i in res.data.goods_desc) {
                        goods_desc.push(res.data.goods_desc[i]);
                    }
                }

                if (res.data.goods_properties.spe != 'null') {
                    var spe = [];
                    var i;
                    for (i in res.data.goods_properties.spe) {
                        spe.push(res.data.goods_properties.spe[i]);
                    }
                }
                else {
                    var spe = 'null';
                }

                that.setData({
                    goods_img_list: res.data.goods_gallery,
                    goods_info: res.data.goods_info,
                    goods_desc: goods_desc,
                    user_is_collect: res.data.user_is_collect,
                    goods_properties: spe
                })
                // console.log('请求完毕:');
                // console.log(that.data.goods_properties);
            }
        });
    },
    goods_collect: function (e) {
        //   console.log(e.target.dataset.goods_id);
        var user_info = app.getUserInfo();

        var that = this;
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'goods_collect',
            goods_id: e.target.dataset.goods_id,
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            console.log(res.data);
            if (res.data.err == 0) {
                that.setData({
                    user_is_collect: res.data.user_is_collect
                })
            }
            else {
                that.setData({
                    tis: res.data.msg,
                    tisshow: 'height: 30px'
                })
            }
        });

    },
    show_view: function () {
        var that = this;

        if (that.data.goods_properties != 'null') {
            that.setData({
                show_view_style: 'display:block;'
            })
        }
        else {
            console.log('没有属性，直接加入购物车');
            that.add_to_cart();
        }
    },
    show_cancel: function () {
        this.setData({
            show_view_style: 'display:none;'
        })
    }
    ,
    change_typea: function (e) {
        //   记录单选值

        // 切割字符串
        var strs = new Array(); //定义一数组
        strs = e.detail.value.split("-"); //字符分割

        dx_list[strs[1]] = strs[0];

        var x;
        change_typea = '';
        for (x in dx_list) {
            change_typea = change_typea + dx_list[x] + ",";
        }

        change_typea = change_typea.substring(0, change_typea.length - 1);

        this.send_change_type();


    },
    change_typeb: function (e) {
        //   复选
        change_typeb = '';
        for (var i = 0; i < e.detail.value.length; i++) {


            if (typeof(e.detail.value[i + 1]) == "undefined") {
                change_typeb = change_typeb + e.detail.value[i];
            }
            else {
                change_typeb = change_typeb + e.detail.value[i] + ",";
            }

        }
        console.log(change_typeb);
        this.send_change_type();
    },
    send_change_type: function () {
        //   goods_id

        var that = this;

        console.log('单选')
        console.log(change_typea);

        // 拼接复选，单选
        var change_typeab = '';

        if (change_typea == '') {
            change_typeab = change_typeb;
        }
        else {
            if (change_typeb != '') {
                change_typeab = change_typea + "," + change_typeb;
            }
            else {
                change_typeab = change_typea;
            }
        }

        // console.log(change_typeab);
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'change_attr',
            goods_id: goods_id,
            attr: change_typeab,
            number: that.data.goods_number
        }, function (res) {
            // console.log(res.data);

            if (res.data.goods_properties != 'null') {
                var spe = [];
                var i;
                for (i in res.data.goods_properties) {
                    spe.push(res.data.goods_properties[i]);
                }
            }
            else {
                var spe = 'null';
            }

            that.setData({
                change_typeab_text: res.data.res,
                goods_properties: spe,
                goods_number: res.data.number
            })
        });


    },
    change_num: function (e) {
        var that = this
        that.setData({
            goods_number: e.detail.value
        })
        this.send_change_type();
    },
    change_num_jia: function () {
        var that = this
        that.setData({
            goods_number: that.data.goods_number + 1
        })
        this.send_change_type();
    },
    change_num_jian: function () {
        var that = this
        that.setData({
            goods_number: that.data.goods_number - 1
        })
        this.send_change_type();
    },
    add_to_cart: function () {
        var that = this;
        var user_info = app.getUserInfo();

        //   是否有规格
        var is_spec = 0;
        if (that.data.goods_properties != 'null') {
            is_spec = 1;
        }
        //  拼接复选，单选
        var change_typeab = '';

        if (change_typea == '') {
            change_typeab = change_typeb;
        }
        else {
            if (change_typeb != '') {
                change_typeab = change_typea + "," + change_typeb;
            }
            else {
                change_typeab = change_typea;
            }
        }
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'to_cart',
            uid: user_info.user_id,
            sign: user_info.sign,
            is_spec: is_spec,
            goods_id: goods_id,
            spec: change_typeab,
            number: that.data.goods_number
        }, function (res) {
            if (res.data.err == 0) {
                /*that.setData({
                    add_to_tis_style:1
                })*/

                wx.showToast({
                    title: '添加到购物车成功！',
                    icon: 'success',
                    duration: 2000
                })
                wx.reLaunch({
                    url: '/pages/shop/cart/cart?id=1'
                })
            }
            else {
                /*that.setData({
                    add_to_tis_style:2,
                    add_to_tis_text:res.data.msg
                })*/
                that.setData({
                    tis: res.data.msg,
                    tisshow: 'height:30px'
                })
            }
        });
    },
    close_cart_tis: function () {
        this.setData({
            add_to_tis_style: 0
        })
    }
})