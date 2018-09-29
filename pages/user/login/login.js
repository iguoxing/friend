var md5 = require('../../../static/js/md5.js')
var app = getApp();
Page({
  data:{
        tis:'',
        tisshow:''
    },
    login_submit:function(e){

        var that = this

        if(e.detail.value.user_name.length==0 || e.detail.value.password.length==0){
            console.log('检查不通过！');
            that.setData({
                    tis:'用户名和密码都是必填项喔！',
                    tisshow:'background:#17b2e0;'
                })
        }
        else
        {
            var user_name = e.detail.value.user_name;
            var password = md5.hex_md5(e.detail.value.password);

            // 数据检查通过，执行登录功能，等待api
            wx.request({
                url: app.globalData.domain+app.globalData.htApiUrl,
                header: {
                    'Content-Type': 'application/json'
                },
                data: {
                    act:'login',
                    username:user_name,
                    password:password
                },
                success: function(res) {
                    if(res.data.err == 1){
                        that.setData({
                            tis:'用户名或密码错误！',
                            tisshow:'background:#17b2e0;'
                        })
                    }
                    else if(res.data.err == 2){
                        that.setData({
                            tis:'无法使用手机登录,该手机号被至少2个用户绑定！',
                            tisshow:'background:#17b2e0;'
                        })
                    }
                    else if(res.data.err == 3){
                        that.setData({
                            tis:'未知错误，请稍候再试！',
                            tisshow:'background:#17b2e0;'
                        })
                    }
                    else if(res.data.err == 0){
                        that.setData({
                            tis:'登录成功！',
                            tisshow:'background:#17b2e0;'
                        })

                        // 将数据存储到本地
                        try {
                            wx.setStorageSync('userInfo', res.data);
                        } catch (e) {
                            console.log('保存用户信息到缓存出错！');
                        }

                        
                        wx.switchTab({
                            url: '/pages/userApiUrl/userApiUrl?id=3'
                        })
                    }
                }
            })






        }
    },
    hidetis:function(){
        this.setData({
            tis:'',
            tisshow:'background:#fff;'
        })
    }
    ,
    tapwx_login:function(){
        var that = this;

        wx.showToast({
            title: '请稍后...',
            icon: 'loading',
            duration: 10000
        })

        wx.login({
            success: function(res) {
                if (res.code) {
                //code
                that.data.wx_code = res.code;

                    wx.getUserInfo({
                        success: function (res2) {
                            //拿到code，同时拿到基本信息，开始注册

                            var userInfo = res2.userInfo
                            var nickName = userInfo.nickName
                            var avatarUrl = userInfo.avatarUrl
                            var gender = userInfo.gender

                            // 读取上级资料
                            
                            try {
                            var p_id = wx.getStorageSync('p_id')
                                if (p_id) {
                                    console.log(p_id);
                                }
                            } catch (e) {
                                var p_id=0;
                            }

                            wx.request({
                                url: app.globalData.domain+app.globalData.htApiUrl,
                                header: {
                                    'Content-Type': 'application/json'
                                },
                                data:{
                                    act:'Wx_login',
                                    js_code:that.data.wx_code,
                                    nickName:nickName,
                                    avatarUrl:avatarUrl,
                                    gender:gender,
                                    p_id:p_id
                                }
                                ,
                                success: function(res) {

                                    wx.hideToast()

                                    if(res.data.err == 0){
                                        that.setData({
                                            tis:'登录成功！',
                                            tisshow:'background:#17b2e0;'
                                        })

                                        // 将数据存储到本地
                                        try {
                                            wx.setStorageSync('userInfo', res.data);
                                        } catch (e) {
                                            console.log('保存用户信息到缓存出错！');
                                        }

                                        console.log('开始跳转');

                                        
                                        wx.switchTab({
                                            url: '/pages/userApiUrl/userApiUrl?id=3'
                                        })
                                    }
                                    else if(res.data.err == 6){
                                        that.setData({
                                            tis:res.data.msg,
                                            tisshow:'background:#17b2e0;'
                                        })
                                    }
                                    else{
                                        that.setData({
                                            tis:res.data.msg,
                                            tisshow:'background:#17b2e0;'
                                        })

                                        return 0;
                                    }

                                }
                            })


                        },
                        fail:function(res2){
                            that.setData({
                                tis:'获取您的信息失败，请稍后再试！',
                                tisshow:'background:#17b2e0;'
                            })
                        }
                    })

                } else {
                    that.setData({
                        tis:'获取授权失败，请稍后再试！',
                        tisshow:'background:#17b2e0;'
                    })
                }
            }
        });





    }
})