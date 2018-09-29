// pages/share_tuan3/share_tuan3.js
var core = require('../../static/js/core.js');
var s_miao;

/* 秒级倒计时 */
function count_down(that) {
    // 渲染倒计时时钟
    date_format(s_miao, that);

    if (s_miao <= 0) {
        that.setData({
            clock: "拼团已经截止"
        });
        // timeout则跳出递归
        return;
    }
    setTimeout(function () {
            // 放在最后--
            s_miao -= 1;
            count_down(that);
        }
        , 1000)
}

// 时间格式化输出，如03:25:19。每1s都会调用一次
function date_format(micro_second, that) {
    // 秒数
    var second = Math.floor(micro_second);

    // 天位
    var tian = Math.floor(second / 86400);
    var tian_miao = tian * 86400;//天数所占秒数

    // 小时位
    var hr = Math.floor((second - tian_miao) / 3600);


    // 分钟位
    var min = fill_zero_prefix(Math.floor(((second - tian_miao) - (hr * 3600)) / 60));
    // 秒位
    var sec = fill_zero_prefix((second - (hr * 3600) - (min * 60) - tian_miao));

    that.setData({
        tian: tian,
        hr: hr,
        min: min,
        sec: sec
    })

    return 0;
}

// 位数不足补零
function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
}

var app = getApp();
var team_sign = 0;
var user_info = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_explain_tuan: 0,
        is_team: 0,
        is_teammen: 0,
        is_loding_pay: 0,
        team_info: [],
        goods_info: [],
        team_mem: [],
        team_start: [],
        team_d_num_arr: [],
        hr: 0,
        min: 0,
        sec: 0,
        tian: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        team_sign = options.team_sign
        var that = this

        //检查状态
        var user_info = app.getUserInfo();
        if (user_info == null) return;

        var sign = user_info.sign;
        var uid = user_info.user_id;

        // 发送请获取团购信息
        core.requestApi(app.globalData.shopApiUrl, {
            act: 'share_tuan',
            uid: uid,
            sign: sign,
            team_sign: team_sign
        }, function (res) {
            that.setData({
                is_team: res.data.is_team,
                is_teammen: res.data.is_teammen,
                is_loding_pay: res.data.is_loding_pay,
                team_info: res.data.team_info,
                goods_info: res.data.goods_info,
                team_mem: res.data.team_mem,
                team_start: res.data.team_start,
                team_d_num_arr: res.data.team_info.d_num_arr
            });
            s_miao = res.data.s_miao;
            count_down(that);
        });

    },
    show_explain_tuan: function () {
        if (this.data.show_explain_tuan == 0) {
            this.setData({
                show_explain_tuan: 1
            })
        }
        else {
            this.setData({
                show_explain_tuan: 0
            })
        }
    },
    add_tuan: function () {
        wx.navigateTo({
            url: '/pages/tuan/tuan?goods_id=' + this.data.goods_info.goods_id + '&goods_number=' + 1 + '&team_sign=' + team_sign
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '快来参团就差你了！',
            path: '/pages/goods/goods?goods_id=17'
        }
    }
})