// pages/user/user_info/user_info.js
var core = require('../../../static/js/core.js');
var app = getApp();
Page({
    data: {
        tis: '',
        tisshow: '',
        user_info: [],
        load_style: '',
        edit_user_name_style: '',
        edit_user_name_style2: 'display:none',
        focus: false,
        sex_array: ['保密', '男', '女']
    },
    onLoad: function () {
        // 获取用户基本信息
        var that = this;
        var user_info = app.getUserInfo();

        core.requestApi(app.globalData.userApiUrl, {
            act: 'check_user_sign',
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            console.log(res.data)
            if (res.data.err == 0) {
                that.setData({
                    user_info: res.data.user_info
                })
            }
            else {
                that.setData({
                    tis: res.data.msg,
                    tisshow: 'display: block;'
                })
            }
        });

    },
    change_headimg: function () {
        // 用户修改头像

        var that = this;

        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

                that.setData({
                    load_style: 'display:block;'
                })

                var tempFilePaths = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: app.globalData.domain + app.globalData.htApiUrl,
                    filePath: tempFilePaths,
                    name: 'img',
                    formData: {
                        'act': 'update_img'
                    },
                    success: function (res) {
                        var data = res.data

                        if (data != 'false') {
                            console.log(data);//图片路径
                            // 发送请求修改头像

                            var user_info = app.getUserInfo();

                            wx.request({
                                url: app.globalData.domain + app.globalData.userApiUrl,
                                data: {
                                    act: 'edit_user_info',
                                    uid: user_info.user_id,
                                    sign: user_info.sign,
                                    type: 'headimg',
                                    value: data
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: function (res) {

                                    that.setData({
                                        load_style: 'display:none;'
                                    })

                                    if (res.data.err == 0) {
                                        var user_info_new = that.data.user_info;
                                        user_info_new.headimg = data;

                                        that.setData({
                                            user_info: user_info_new
                                        })
                                    }
                                }
                            })

                        }
                        else {
                            // 上传失败
                            that.setData({
                                tisshow: 'background:#17b2e0',
                                tis: '图片上传失败,请重试'
                            })
                        }
                    }
                })

            }
        })

    },
    edit_user_name: function () {
        var that = this

        that.setData({
            edit_user_name_style: 'display:none;',
            edit_user_name_style2: 'display:block;',
            focus: true
        })

        console.log(that.data.focus)
    },
    updata_user_name: function (e) {
        console.log(e.detail.value);

        var that = this;

        var user_info = app.getUserInfo();

        wx.showModal({
            title: '提示',
            content: '您确定将昵称修改为:' + e.detail.value + '吗？',
            success: function (res) {
                if (res.confirm) {

                    that.setData({
                        load_style: 'display:block;'
                    })

                    wx.request({
                        url: app.globalData.domain + app.globalData.userApiUrl,
                        data: {
                            act: 'edit_user_info',
                            uid: user_info.user_id,
                            sign: user_info.sign,
                            type: 'wx_name',
                            value: e.detail.value
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {

                            if (res.data.err == 0) {
                                var user_info_new = that.data.user_info;
                                user_info_new.wx_name = e.detail.value;

                                that.setData({
                                    user_info: user_info_new,
                                    edit_user_name_style: 'display:block;',
                                    edit_user_name_style2: 'display:none;',
                                    focus: false
                                })


                            }
                            else {
                                that.setData({
                                    tisshow: 'background:#17b2e0',
                                    tis: res.data.msg
                                })
                            }

                            that.setData({
                                load_style: 'display:none;'
                            })

                        }
                    })
                }
            }
        })
    },
    change_sex: function (e) {
        console.log(e.detail.value);

        var that = this;
        var user_info = app.getUserInfo();

        that.setData({
            load_style: 'display:block;'
        })

        wx.request({
            url: app.globalData.domain + app.globalData.userApiUrl,
            data: {
                act: 'edit_user_info',
                uid: user_info.user_id,
                sign: user_info.sign,
                type: 'sex',
                value: e.detail.value
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {

                if (res.data.err == 0) {
                    var user_info_new = that.data.user_info;
                    user_info_new.sex = e.detail.value;

                    that.setData({
                        user_info: user_info_new
                    })


                }
                else {
                    that.setData({
                        tisshow: 'background:#17b2e0',
                        tis: res.data.msg
                    })
                }

                that.setData({
                    load_style: 'display:none;'
                })

            }
        })

    },
    change_birthday: function (e) {
        console.log(e.detail.value);

        var that = this;
        var user_info = app.getUserInfo();

        that.setData({
            load_style: 'display:block;'
        })

        wx.request({
            url: app.globalData.domain + app.globalData.userApiUrl,
            data: {
                act: 'edit_user_info',
                uid: user_info.user_id,
                sign: user_info.sign,
                type: 'birthday',
                value: e.detail.value
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {

                if (res.data.err == 0) {
                    var user_info_new = that.data.user_info;
                    user_info_new.birthday = e.detail.value;

                    that.setData({
                        user_info: user_info_new
                    })


                }
                else {
                    that.setData({
                        tisshow: 'background:#17b2e0',
                        tis: res.data.msg
                    })
                }

                that.setData({
                    load_style: 'display:none;'
                })

            }
        })
    },
    clear_Storage: function () {
        wx.showModal({
            title: '提示',
            content: '您确定要清理所有缓存吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.clearStorage();

                    wx.showToast({
                        title: '清理缓存成功！',
                        icon: 'success',
                        duration: 2000
                    })

                }
            }
        })
    }
})