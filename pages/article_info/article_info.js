var core = require('../../static/js/core.js');
var app = getApp()
var pl_text = '';
var ht_id = 0;
Page({
    data: {
        tisshow: '',
        tis: '',
        ht_info: '',
        text_arr: []
    },
    onLoad: function (query) {
        ht_id = query.article_id;
        console.log(ht_id);
    },
    onShow: function () {
        this.get_ht(ht_id);
    },
    get_ht: function (ht_id) {
        var that = this

        if (ht_id) {
            core.requestApi(app.globalData.htApiUrl, {
                act: 'get_ht_info',
                id: ht_id
            }, function (res) {
                if (res.data.err == 0) {
                    that.setData({
                        ht_info: res.data.ht_info,
                        text_arr: res.data.text_arr
                    })

                }
                else {
                    console.error(res);
                    that.setData({
                        tis: '对不起,您访问的话题不见了...',
                        tisshow: 'background:#e64340'
                    })
                }
            });

        }
        else {
            that.setData({
                tis: '对不起,您访问的话题不见了...',
                tisshow: 'background:#e64340'
            })
        }
    }
})