//index.js
// 引入SDK核心类
var QQMapWX = require('../../static/js/qqmap/qqmap-wx-jssdk.js');
var util = require('../../static/js/util.js');
var core = require('../../static/js/core.js');
var qqmapsdk;
const app = getApp();
var t;
var t_buyting;


Page({
    data: {
        imgUrls: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        best_list: [],
        cat_list: [],
        catindex: 0,
        news: [],
        mall_goods_list: [],
        select_address: '中国',
        latitude: 0,
        longitude: 0,
        searchinput: ''
    },
    onLoad: function () {
        var that = this;
        //
        // wx.showLoading({
        //     title: '请稍后...',
        // })

        // app.weixin_login(0);
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'GGGBZ-O4H6W-DWTRS-OTWT4-TUKZO-PJBW2'
        });

    },
    onShareAppMessage: function () {
        var user_info = app.getUserInfo();
        return {
            title: '分享',
            path: '/pages/index/index?id=' + user_info.user_id,
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    },
    onShow: function () {
        // 读取缓存，如果存在缓存，不定位
        var that = this
        clearTimeout(t);
        try {
            var select_address = wx.getStorageSync('select_address')
            if (select_address) {
                // console.log(select_address);
                if (select_address == '全国') {
                    select_address = '中国';
                }
                that.setData({
                    select_address: select_address
                })
            } else {
                console.log('用户没有选择地址');
                //1、获取当前位置坐标
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        var latitude = res.latitude
                        var longitude = res.longitude

                        that.setData({
                            latitude: latitude,
                            longitude: longitude
                        });
                        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                        qqmapsdk.reverseGeocoder({
                            location: {
                                latitude: res.latitude,
                                longitude: res.longitude
                            },
                            success: function (addressRes) {
                                var address = addressRes.result.address_component.city;
                                console.log(address);
                                that.setData({
                                    select_address: address
                                });
                            }
                        })
                    }
                });
            }
        } catch (e) {
            console.log('未能获取到用户选择的地址' + e)
        }

        core.requestApi(app.globalData.shopApiUrl, {
            act: 'index'
        }, function (res) {
            if (res.data.err == 0) {
              console.log(res.data.buying_list)
                that.setData({
                    imgUrls: res.data.flash_xml,
                    best_list: res.data.best_list,
                    cat_list: res.data.cat_list,
                    news: res.data.news,
                    mall_goods_list: res.data.mall_goods_list,
                    miao_goods: res.data.miao_goods,
                    buying_goods: res.data.buying_list
                });
                // that.setData({
                //   buying_goods: [that.data.buying_goods[0]]
                // })
                t&&clearTimeout(t);
                t_buyting && clearTimeout(t_buyting);
                that.miao_djs();
                that.buying_djs();
            }

        },'GET');

    },
    miao_djs: function () {
        var that = this
        var miao_goods = that.data.miao_goods;
        t = setTimeout(function () {
            // 将列表中所有的时间戳减去1
            for (var i in miao_goods) {
                miao_goods[i].gmt_end_time_xcx--;
                miao_goods[i].gmt_end_time_text = util.getFormatDate(miao_goods[i].gmt_end_time_xcx);
            }
            that.setData({
                miao_goods: miao_goods
            })

            that.miao_djs();
        }, 1000);

    },
    buying_djs: function () {
        var that = this
        var buying_goods = that.data.buying_goods;
        t_buyting = setTimeout(function () {
            // 将列表中所有的时间戳减去1
            for (var i in buying_goods) {
                buying_goods[i].s_miao--;
                buying_goods[i].s_miao_text = util.getFormatDate(buying_goods[i].s_miao);
            }

            that.setData({
                buying_goods: buying_goods
            })

            that.buying_djs();
        }, 1000);

    },
    cat_tabClick: function (e) {
        console.log(e.currentTarget.dataset.cat_id);
        // 跳转到 pages/category_info/category_info并传ID
        wx.navigateTo({
            url: '/pages/category_info/category_info?category_id=' + e.currentTarget.dataset.cat_id + '&type=tuan'
        })
    },
    to_search: function (e) {
        // 开始搜索 pages/search/search

        wx.navigateTo({
            url: '/pages/search/search?keywords=' + this.data.searchinput
        })

    },
    searchinput: function (e) {
        // 记录用户输入的搜索词
        this.setData({
            searchinput: e.detail.value
        })
    }
});

