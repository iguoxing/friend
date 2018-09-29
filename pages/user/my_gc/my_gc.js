var core = require('../../../static/js/core.js');
var app = getApp()
var pages = 0;
var load_more = 0;
Page({
    data: {
        tis: '',
        tisshow: '',
        collect_goods: [],
        load_style: ''
    },
    onLoad: function () {

    },
    //事件处理函数
    onShow: function () {
        // 发送请求获取初始收藏列表
        this.load_list();
    },
    onUnload: function () {
        load_more = 0;
        pages = 0;
    },
    load_list: function () {
        pages++;

        var that = this;

        var user_info = app.getUserInfo();
        if (null == user_info) return;
        if (load_more != 0) {
            return 0;
        }
        core.requestApi(app.globalData.userApiUrl, {
            act: 'gc_list',
            page: pages,
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            var goods = res.data.collect_goods || [];
            if (goods.length > 0) {
                that.setData({
                    collect_goods: goods
                })
            }

            if (goods.length == 0) {
                that.setData({
                    load_footer: '没有更多了...'
                })
                load_more = 1;
            }
        });
    },
    del_collection: function (e) {

        var that = this;

        var user_info = app.getUserInfo();

        that.setData({
            load_style: 'display:block;'
        })

        if (e.target.dataset.coll_id) {
            // 发送请求删除该收藏
            console.log('删除广场' + e.target.dataset.coll_id);
            core.requestApi(app.globalData.userApiUrl,{
                act: 'del_gc',
                uid: user_info.user_id,
                sign: user_info.sign,
                coll_id: e.target.dataset.coll_id
            },function (res) {

                that.setData({
                    load_style: ''
                })

                if (res.data.err == 0) {
                    // 遍历数组
                    if (res.data.collect_goods != 'null') {

                        that.setData({
                            collect_goods: res.data.collect_goods
                        })
                    }
                    else {
                        that.setData({
                            collect_goods: [],
                            load_footer: '没有更多了...'
                        })
                        load_more = 1;
                    }
                }

            });

        }
    }

})