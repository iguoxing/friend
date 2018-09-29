//app.js
var core = require('static/js/core.js');
App({
    onLaunch: function (query) {

        if (query.query.id != false && query.query.id > 0) {
            console.log('推荐人是:' + query.query.id);
            // 将推荐人保存到本地存储，注册时读取出来
            wx.setStorage({
                key: "p_id",
                data: query.query.id
            })
        }

    },
    getUserInfo: function () {
        //获取缓存数据
        var userInfo =  core.getUserStorage();
        if( userInfo == null ){
            core.confirmLogin();
        }
        return userInfo;
    },
    globalData: {
        post_img_list: [],
        textare_value: '',
        title_value: '',
      domain: 'https://lht.happyht.com/',
      htApiUrl: 'https://lht.happyht.com/xcx/ht.php',
      shopApiUrl: 'https://lht.happyht.com/xcx/shop.php',
      userApiUrl: 'https://lht.happyht.com/xcx/xcx_user.php'
    }
    ,
    get_mark: function () {
        try {
            var mark = wx.getStorageSync('mark')
        } catch (e) {
            var mark = false;
        }
        return mark;
    },
    save_mark: function (mark) {
        // 将数据存储到本地
        try {
            wx.setStorageSync('mark', mark);
        } catch (e) {
            console.log('保存mark出错！');
        }
    }
    ,
    weixin_login: function (is_qz = 0, is_update = 0, that_tmp='') {
        var that = this
        var user_info = that.getUserInfo();

        console.log('开始登录');

        if ( user_info !=null ) {
            // 用户已登录
            console.log('用户已经登录!');
            return 1;
        } else {
            console.log('跳转到登陆页');
            core.doLogin();
            return 0;
        }

        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.getUserInfo({
                        success: function (res2) {
                            //拿到code，同时拿到基本信息，开始注册
                            var userInfo = res2.userInfo
                            var nickName = userInfo.nickName
                            var avatarUrl = userInfo.avatarUrl
                            var gender = userInfo.gender


                            wx.request({
                                url: that.globalData.domain + that.globalData.htApiUrl,
                                header: {
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    act: 'Wx_login',
                                    js_code: res.code,
                                    nickName: nickName,
                                    avatarUrl: avatarUrl,
                                    gender: gender
                                }
                                ,
                                success: function (res) {

                                    console.log(res);

                                    if (res.data.err == 0) {
                                        wx.showToast({
                                            title: '登录成功！',
                                            icon: 'success',
                                            duration: 2000
                                        })

                                        // 将数据存储到本地
                                        try {
                                            wx.setStorageSync('userInfo', res.data);
                                        } catch (e) {
                                            console.log('保存用户信息到缓存出错！');
                                        }
                                        if (is_update == 1) {
                                            that_tmp.setData({
                                                user: res.data,
                                                userInfo: res.data
                                            })
                                        }
                                    }
                                    else if (res.data.err == 6) {
                                        wx.showModal({
                                            title: '提示',
                                            showCancel: false,
                                            content: res.data.msg,
                                            success: function (res) {

                                            }
                                        })
                                    }
                                    else {

                                        wx.showModal({
                                            title: '提示',
                                            showCancel: false,
                                            content: res.data.msg,
                                            success: function (res) {

                                            }
                                        })

                                        return 0;
                                    }

                                }
                            })


                        },
                        fail: function (res2) {
                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: '获取您的信息失败，请稍后再试！',
                                success: function (res) {

                                }
                            })
                        }
                    })

                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '获取授权失败，请稍后再试！',
                        success: function (res) {

                        }
                    })
                }
            }
        });
    }
});
