var core = require('../../../static/js/core.js');
var app = getApp();
var pronince_id = '';
var district_id = '';
var city_id = '';
var to_type = '';
var goods_id = 0;
var flow_type = 'one';
var goods_number = 1;
var team_sign = '';
Page({
    data: {
        address_id: 0,
        province_list: [],
        city_list: [],
        district_list: [],
        provinceindex: '',
        cityindex: '',
        districtindex: '',
        loading: false,
        err_tis: '',
        err_tis_style: '',
        user_address: [{'consignee': '', 'mobile': ''}],
        button_text: '保存',
        is_pronince: 1,
        is_city: 1,
        is_district: 1
    },
    onLoad: function (query) {
        // 请求记录
        var that = this;
        var user_info = app.getUserInfo();
        // console.log();
        if (query.address_id) {
            // 编辑
            that.setData({
                address_id: query.address_id
            })
        }

        if (query.type == 'flow') {
            that.setData({
                button_text: '保存并继续结算'
            })

            to_type = 'flow';
        }

        // 团购资料记录
        goods_id = query.goods_id
        flow_type = query.flow_type
        goods_number = query.goods_number
        team_sign = query.team_sign
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'edit_address',
            uid: user_info.user_id,
            sign: user_info.sign,
            address_id: that.data.address_id
        }, function (res) {
            if (res.data.err == 0) {
                console.log(res);
                that.setData({
                    province_list: res.data.province_list,
                    user_address: res.data.user_address
                })
            }
            else {
                that.setData({
                    err_tis_style: 'display:block;',
                    err_tis: res.data.msg
                })
            }
        });


    },
    changepronince: function (e) {
        //   改变省份
        //   console.log(e);
        var that = this;

        that.setData({
            provinceindex: e.detail.value
        })
        //   将选择的省份id发送到后台，获取城市列表
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'get_region',
            address_id: e.detail.value
        }, function (res) {
            if (res.data.err == 0) {
                that.setData({
                    is_pronince: 0,
                    city_list: res.data.list
                })
                pronince_id = res.data.parent_id;
            }
        });

    },
    changecity: function (e) {
        //   改变城市
        //   console.log(e.detail.value);
        var that = this;

        if (pronince_id != '') {
            that.setData({
                cityindex: e.detail.value
            })

            // 发送请求获取区域列表
            core.requestApi(app.globalData.shopApiUrl, {
                act: 'get_region',
                address_id: e.detail.value,
                parent_id: pronince_id
            }, function (res) {
                if (res.data.err == 0) {
                    that.setData({
                        is_city: 0,
                        district_list: res.data.list
                    })
                    city_id = res.data.parent_id;
                }
            });
        }
        else {
            console.log('请先选择省份');
        }


    },
    changedistrict: function (e) {
        //   改变区域
        //   console.log(e.detail.value);
        var that = this;

        that.setData({
            districtindex: e.detail.value
        })

        if (city_id != '') {
            core.requestApi(app.globalData.shopApiUrl, {
                act: 'get_region',
                address_id: e.detail.value,
                parent_id: city_id
            }, function (res) {
                if (res.data.err == 0) {

                    that.setData({
                        is_district: 0
                    })

                    district_id = res.data.parent_id;
                }
            });
        }
    },
    save_address: function (e) {

        var that = this
        var user_info = app.getUserInfo();

        that.setData({
            loading: true
        })


        // 发送请求保存收货地址
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'save_address',
            uid: user_info.user_id,
            sign: user_info.sign,
            consignee: e.detail.value.consignee,
            mobile: e.detail.value.mobile,
            province: pronince_id,
            city: city_id,
            district: district_id,
            address: e.detail.value.address,
            zipcode: e.detail.value.zipcode,
            email: e.detail.value.email,
            address_id: that.data.address_id,
            defalut: 1
        }, function (res) {
            that.setData({
                loading: false
            })
            // console.log(res);
            if (res.data.err == 0) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 1000
                })

                if (to_type == 'flow' && flow_type == 'one') {
                    wx.redirectTo({
                        url: '/pages/shop/flow/flow?id=1'
                    })
                }
                else if (to_type == 'flow' && flow_type == 'tuan') {
                    // goods_id=7&goods_number=1&team_sign=218
                    wx.redirectTo({
                        url: '/pages/tuan/tuan?goods_id=' + goods_id + '&goods_number=' + goods_number + '&team_sign=' + team_sign
                    })
                }
                else {
                    /*wx.redirectTo({
                        url: '/pages/userApiUrl/address/address?id=1'
                    })*/
                    wx.navigateBack(1);
                }
            }
            else {
                that.setData({
                    err_tis_style: 'display:block;',
                    err_tis: res.data.msg
                })
            }
        });

    }

})