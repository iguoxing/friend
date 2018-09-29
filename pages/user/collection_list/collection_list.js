var core = require('../../../static/js/core.js');
var app = getApp()
var pages = 0;
var load_more = 0;
Page({
    data: {
        tis: '',
        tisshow: '',
        collect_goods: [],
        load_footer: '正在加载更多...',
        load_style: ''
    },
    onLoad: function () {
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

        if (load_more != 0) {
            return 0;
        }
        core.requestApi(app.globalData.userApiUrl, {
            act: 'collection_list',
            page: pages,
            uid: user_info.user_id,
            sign: user_info.sign
        }, function (res) {
            if (res.data.err == 0) {
                if (res.data.collect_goods != 'null') {
                    that.setData({
                        collect_goods: that.data.collect_goods.concat(res.data.collect_goods)
                    })
                }


                if (res.data.list_count == 0) {
                    that.setData({
                        load_footer: '没有更多收藏了...'
                    })
                    load_more = 1;
                }

            }
            else {
                that.setData({
                    tis: res.data.msg,
                    tisshow: 'height:30px;',
                    load_footer: '没有更多收藏了...'
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
            core.requestApi(app.globalData.userApiUrl, {
                act: 'del_collection',
                uid: user_info.user_id,
                sign: user_info.sign,
                coll_id: e.target.dataset.coll_id
            }, function (res) {

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
                            load_footer: '没有更多收藏了...'
                        })
                        load_more = 1;
                    }
                }

            });


        }
    }

})