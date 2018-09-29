/**
 *  core 公共功能
 */
var util = require('../../static/js/util.js');
function getUserStorage() {
    //获取缓存数据
    var userInfo = null;
    try {
        userInfo = wx.getStorageSync('userInfo') || null;
    } catch (e) {
        userInfo = null;
    }
    return userInfo;
}
function saveUserStorage(userInfo){
    // 将数据存储到本地
    try {
        wx.setStorageSync('userInfo', userInfo);
    } catch (e) {
        console.log('保存用户信息到缓存出错！');
    }
}
//调用API 统一方法
function requestApi(apiUrl, postData, successCallback, method,failCallbak=null) {
    wx.showLoading({
        title: '请稍候...',
    });

    wx.request({
        url:  apiUrl,
        data: postData,
        header: {
            'Content-Type': 'application/json'
        },
        method: method || 'GET',
        success: function (res) {
           console.log({apiUrl:apiUrl,postData:postData,res:res.data});
            wx.hideLoading();
            if (isNotLogin(res)) {
                doLogin();
            } else if(isSuccess(res)){
                successCallback(res);
            }else{
                if(typeof failCallbak == 'function'){
                    failCallbak(res)
                }else {
                    util.errShow(res.data.msg);
                }
            }
        },
        fail: function (e) {
            wx.hideLoading();
            util.errShow(e);
        }
    })
}
/**
 * 请稍后进度提示
 */
function showLoading() {
    wx.showLoading({
        title: '请稍后...',
    });
}


/**
 * 是否没登陆
 * @param res
 */
function isNotLogin(res) {
    return res.data.err == 2;
}



/**
 * 提示登陆
 */
function confirmLogin() {
    wx.hideLoading();
    wx.showModal({
        title: '提示',
        content: '请您先登录哦！',
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定');
                doLogin();
            }
        }
    });
}

/**
 * 登陆
 */
function doLogin() {
    wx.setStorage({key: "userInfo", data: null});
    wx.navigateTo({
        url: '/pages/user_login/user_login?refPage='+encodeURIComponent(refPage())
    });
}

/**
 * refPage
 */
function refPage() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length-1] //获取当前页面的对象
    var url = currentPage.route;
    var options = currentPage.options
    return http_builder_url(url,options);
}

/**
 *
 * @param url
 * @param data
 * @returns {*}
 */
function http_builder_url(url, data) {
    if(typeof(url) == 'undefined' || url == null || url == '') {
        return '';
    }
    if(typeof(data) == 'undefined' || data == null || typeof(data) != 'object') {
        return '';
    }
    var param = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&')
    url += (url.indexOf("?") != -1) ? "" : "?";
    // for(var k in data) {
    //     url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
    //     console.log(url);
    // }
    url+=param
    console.log(url);
    return url;
}

/**
 * 是否成功
 * @param res
 * @returns {boolean}
 */
function isSuccess(res) {
    return res.data.err == 0;
}

/**
 * 微信登陆
 * @param userInfo
 */
function wxLogin(userInfo,url,refPage) {
    showLoading();
    wx.login({
        success: function (res) {
            if (res.code) {
                // 开始注册
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender

                // 获取p_id
                try {
                    var p_id = wx.getStorageSync('p_id')
                } catch (e) {
                    var p_id = 0;
                }
               // var url = this.globalData.domain + this.globalData.htApiUrl
                requestApi(url, {
                    act: 'Wx_login',
                    js_code: res.code,
                    nickName: nickName,
                    avatarUrl: avatarUrl,
                    gender: gender,
                    p_id: p_id
                }, function (res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: '登录成功！',
                        icon: 'success',
                        duration: 2000
                    });
                    // 将数据存储到本地
                    saveUserStorage(res.data);

                    // 跳转到首页
                    wx.reLaunch({
                        url: '/'+decodeURIComponent(refPage)
                    })
                    return 1;
                },'GET',function (res) {
                    if (res.data.err == 6) {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: res.data.msg,
                            success: function (res) {

                            }
                        })

                        return 0;
                    } else {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: res.data.msg,
                            success: function (res) {

                            }
                        })

                        return 0;
                    }
                });

            } else {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '获取您的信息失败，请稍后再试！'
                })
            }
        },
        fail: function () {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '获取您的信息失败，请稍后再试！'
            })
        }
    });
}

module.exports = {
    confirmLogin:confirmLogin,
    wxLogin: wxLogin,
    doLogin:doLogin,
    requestApi:requestApi,
    saveUserStorage:saveUserStorage,
    getUserStorage:getUserStorage
};