var core = require('../../static/js/core.js');
var app = getApp();
var goods_id = 0;
var dx_list = new Array();
var change_typea = '';//选择的属性

function getFormatDate(timestamp) {

    // 天数
    var t = Math.floor(timestamp / 86400);

    var y_miao = timestamp - (t * 86400);//减去天数之后的余秒

    // console.log('减去天数之后的余秒' + y_miao);

    var h = Math.floor(y_miao / 3600);//小时数

    y_miao = y_miao - (h * 3600);//小时数计算后剩余的秒数

    // console.log('小时数计算后剩余的秒数' + y_miao);

    var i = Math.floor(y_miao / 60);

    var y_miao = y_miao - (i * 60);//分钟数计算后剩余的秒数

    // console.log('分钟数计算后剩余的秒数' + y_miao);

    var s = Math.floor(y_miao);

    return '剩余 '+ (t == 0 ? '' : (t + '天') ) + h + ':' + i + ':' + s +" 结束";
}

Page({
    data: {
        tis: '',
        tisshow: '',
        indicatorDots: false,
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
        goods_name: '',
        cart_number: 0,
        laber_name: '请选择',
        is_laber_name: 0,
        is_show_pre: 0,
        laber_pic: '￥0',
        is_show_back_top: 0,
        flow_type: 'none',
        suppliers: 0,
        goods_team_order: [],
    },
    onLoad: function (query) {
        goods_id = query.goods_id;
        app.weixin_login(0);

        var that = this;
        var user_info = app.getUserInfo();
        if (user_info == null) return;
        // 获取该商品详细详细信息
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'goods',
            goods_id: goods_id,
            uid: user_info.user_id
        }, function (res) {
            wx.hideLoading();
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

                that.setData({
                    is_laber_name: 1
                })
            }

            that.setData({
                goods_img_list: res.data.goods_gallery,
                goods_info: res.data.goods_info,
                goods_desc: goods_desc,
                user_is_collect: res.data.user_is_collect,
                goods_properties: spe,
                goods_name: res.data.goods_info.goods_name,
                cart_number: res.data.cart_number,
                laber_pic: '￥' + res.data.goods_info.shop_price,
                suppliers: res.data.suppliers,
                goods_team_order: res.data.goods_team_order,
                goods_team_order_length: res.data.goods_team_order_length
            })

            if (query.type) {
              that.setData({
                group_type:'buying'
              })
            }
            // console.info(that.data.group_type)

            that.miao_djs();
            that.miao_djs2();
        });
    },
    miao_djs: function () {

        var that = this

        var goods_info = that.data.goods_info;

        if (goods_info.is_miao == 0) {
            return 0;
        }


        setTimeout(function () {

            // 将列表中所有的时间戳减去1

            goods_info.gmt_end_time_xcx--;

            goods_info.gmt_end_time_text = getFormatDate(goods_info.gmt_end_time_xcx);

            that.setData({
                goods_info: goods_info
            })

            that.miao_djs();
        }, 1000);

    },
    miao_djs2: function () {

        var that = this

        var goods_team_order = that.data.goods_team_order;

        if (that.data.goods_team_order_length <= 0) {
            return 0;
        }


        setTimeout(function () {

            // 将列表中所有的时间戳减去1
            var i;
            for (i in goods_team_order) {
                if (goods_team_order[i].s_miao > 0) {

                    goods_team_order[i].s_miao--;
                    goods_team_order[i].s_miao_text = getFormatDate(goods_team_order[i].s_miao);

                }
            }

            that.setData({
                goods_team_order: goods_team_order
            })

            that.miao_djs2();
        }, 1000);

    },
    call_phone: function (e) {
        if (e.currentTarget.dataset.phone) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            })
        }
        else {
            wx.showModal({
                title: '提示',
                content: '商家未设置电话号码！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }

    },
    goods_collect: function (e) {
        // console.log(e.currentTarget.dataset.goods_id);
        var user_info = app.getUserInfo();

        var that = this;
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'goods_collect',
            goods_id: e.currentTarget.dataset.goods_id,
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
    change_num: function (e) {

        var that = this
        that.setData({
            goods_number: e.detail.value
        })
        that.send_change_type();
    },
    change_num_jia: function () {
        var that = this
        that.setData({
            goods_number: that.data.goods_number + 1
        })
        that.send_change_type();
    },
    change_num_jian: function () {
        var that = this
        that.setData({
            goods_number: that.data.goods_number - 1
        })

        if ((that.data.goods_number - 1) <= 0) {
            that.setData({
                goods_number: 1
            })
        }
        that.send_change_type();
    },
    onHide: function () {
        // 清空选择的属性信息
        dx_list = new Array();
        change_typea = '';
    },
    onUnload: function () {
        // 清空选择的属性信息
        dx_list = new Array();
        change_typea = '';
    },
    onShareAppMessage: function (res) {
        var user_info = app.getUserInfo();
        console.log(goods_id);
        return {
            title: this.data.goods_name,
            path: '/pages/goods/goods?goods_id=' + goods_id + '&id=' + user_info.user_id,
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    }
    ,
    is_show_pre_fun: function (e) {
        this.setData({
            is_show_pre: 1,
            flow_type: e.currentTarget.dataset.flow_type
        })
    },
    cancel_pre: function () {
        this.setData({
            is_show_pre: 0,
            flow_type: 'none'
        })
    },
    flow_done: function (e) {

        if (this.data.goods_number <= 0) {
            wx.showModal({
                title: '提示',
                content: '购买数量不能小于0哦！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })

            return 0;
        }

        console.log('购买类型:' + this.data.flow_type);

        if (this.data.flow_type == 'tuan') {
            // 将goods_id和购买基本信息发送到团购结算页面，一次只一个商品，再发送到后台建立订单
            wx.navigateTo({
                url: '/pages/tuan/tuan?goods_id=' + goods_id + '&goods_number=' + this.data.goods_number + '&attr=' + change_typea
            })
            return 0;
        }

        if (this.data.flow_type == 'one') {
            if (e.currentTarget.dataset.flow_done_type == 'add_cart') {
                console.log('单独购买-加入购物车');
                // 发送请求将商品加入购物车
                this.goods_to_cart(0);
            }
            else {
                console.log('单独购买-直接结算');
                this.goods_to_cart(1);
            }
        }
    },
    onPageScroll: function (e) {
        if (e.scrollTop >= 300) {
            this.setData({
                is_show_back_top: 1
            })
        }
        else {
            this.setData({
                is_show_back_top: 0
            })
        }
    },
    back_top: function () {
        wx.pageScrollTo({
            scrollTop: 1
        })
    },
    goods_to_cart: function (is_liji_flow) {
        var that = this

        var user_info = app.getUserInfo();

        core.requestApi(app.globalData.shopApiUrl, {
            act: 'to_cart',
            goods_id: goods_id,
            number: that.data.goods_number,
            uid: user_info.user_id,
            sign: user_info.sign,
            is_spec: 0,
            spec: change_typea,
            is_liji_flow: is_liji_flow,
            is_miao: that.data.goods_info.is_miao
        }, function (res) {
            if (is_liji_flow == 1) {
                // 直接跳转到购物车
                wx.reLaunch({
                    url: '/pages/shop/cart/cart'
                })
                return 0;
            }

            wx.showModal({
                title: '提示',
                content: '商品已添加到购物车！',
                confirmText: '去购物车',
                cancelText: '再看看',
                success: function (res) {
                    if (res.confirm) {
                        console.log('跳转到购物车');
                        wx.reLaunch({
                            url: '/pages/shop/cart/cart'
                        })
                    }
                }
            });
        }, 'GET', function (res) {
            if (res.data.err == 3) {
                wx.showModal({
                    title: '提示',
                    content: '对不起，该商品已经库存不足暂停销售',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
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
    }
    ,
    change_typea: function (e) {
        //   记录单选值

        // 切割字符串
        var strs = new Array(); //定义一数组
        strs = e.currentTarget.dataset.value.split("-"); //字符分割

        dx_list[strs[1]] = strs[0];

        var x;
        change_typea = '';
        for (x in dx_list) {
            change_typea = change_typea + dx_list[x] + ",";
        }

        change_typea = change_typea.substring(0, change_typea.length - 1);

        console.log('用户选择的属性:')
        console.log(change_typea);

        this.send_change_type();

    },
    send_change_type: function () {
        var that = this
        wx.showLoading({
            title: '请稍候...',
        })

        var user_info = app.getUserInfo();
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'change_attr',
            goods_id: goods_id,
            attr: change_typea,
            number: that.data.goods_number,
            uid: user_info.user_id,
            flow_type: that.data.flow_type
        }, function (res) {

            wx.hideLoading();
            var spe = [];
            if (res.data.goods_properties.spe != 'null') {
                var i;
                for (i in res.data.goods_properties.spe) {
                    spe.push(res.data.goods_properties.spe[i]);
                }
            }

            var goods_info = that.data.goods_info;

            goods_info.team_price = res.data.res.team_price;
            goods_info.shop_price = res.data.res.result;
            goods_info.goods_number = res.data.res.goods_attr_number;


            that.setData({
                goods_properties: spe,
                goods_number: res.data.number,
                goods_info: goods_info
            })
            console.log(that.data.goods_properties);

        });

    }
})