//index.js
//获取应用实例
const util = require('../../static/js/util.js');
const core = require('../../static/js/core.js');
const app = getApp()
var team_sign;
var s_miao;
Page({
    data: {
        good_info: {},
        customer_num_left: 0, //还差几人
        is_teammen: 0,
        users: [],
        users_num: 0,
        countDown: {
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
        },
        actEndTime: 0,
        price_range: 0,
        opBtnText: '一键拼单'


    },


    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },


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
            var filtTeam = that.filtTeam(res.data.team_mem);
            var users = that.users2team(filtTeam, res.data.goods_info.team_num);
            var price_range = res.data.goods_info.shop_price - res.data.goods_info.team_price;
            if (res.data.is_teammen == 1 && res.data.is_loding_pay == 0) {
                wx.redirectTo({
                    url: '/pages/share_tuan/share_tuan?team_sign=' + team_sign
                });
                return;
            }
            that.setData({
                is_team: res.data.is_team,
                is_teammen: res.data.is_teammen,
                is_loding_pay: res.data.is_loding_pay,
                team_info: res.data.team_info,
                goods_info: res.data.goods_info,
                users: users,
                team_start: res.data.team_start,
                team_d_num_arr: res.data.team_info.d_num_arr,
                customer_num_left: res.data.goods_info.team_num - filtTeam.length,
                users_num: users.length,
                price_range: price_range
            });
            s_miao = res.data.s_miao;
            if (s_miao > 0 && that.data.customer_num_left > 0) {
                var newTime = Date.parse(new Date());
                that.data.actEndTime = newTime + s_miao * 1000;
                console.log(that.data.actEndTime)
                that.countDownFuc();
            } else {
                that.setOpBtnText();
            }
            if(s_miao<0){
                that.setData({'opBtnText': '活动已结束'});
            }else
            if (res.data.is_loding_pay > 0) {
                that.setData({'opBtnText': '您已参团,待支付'});
            }

        });
        // 执行倒计时函数
        //this.countDownFuc();

    },
    joinedTeam: function (list) {
        for (var k = 0, length = list.length; k < length; k++) {
            console.log(list[k]);
        }
    },
    filtTeam: function (list) {
        var rtList = [];
        for (var k = 0, length = list.length; k < length; k++) {
            if (list[k].pay_time > 0) {
                rtList.push(list[k]);
            }
        }
        return rtList;
    },

    users2team: function (list, count) {
        var rt = [];
        var defImg = {'headImageUrl': '../../images/who.png'};
        var max = count > 10 ? 10 : count;
        for (var i = 0; i < max; i++) {
            rt[i] = defImg;
        }
        if (list == null || list.length == 0) return rt;
        max = list.length > 10 ? 10 : list.length
        for (var i = 0; i < max; i++) {
            rt[i] = {'headImageUrl': list[i].headimg};
        }
        return rt;
    },
    timeFormatDay:function (param) {
        return param < 0 ? '':param+' 天';
    },

    timeFormat: function (param) { //小于10的格式化函数
        return param < 10 ? '0' + param : param;
    },

    countDownFuc: function () { //倒计时函数
        // 获取当前时间，同时得到活动结束时间数组
        //var newTime = new Date().getTime();
        var newTime = Date.parse(new Date());
        // console.log(newTime );

        var that = this;
        // 对结束时间进行处理渲染到页面
        var endTime = this.data.actEndTime;
        // console.log(endTime);
        var obj = null;
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
            var time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            var day = parseInt(time / (60 * 60 * 24));
            var hou = parseInt(time % (60 * 60 * 24) / 3600);
            var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            var sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
                day: that.timeFormatDay(day),
                hou: that.timeFormat(hou),
                min: that.timeFormat(min),
                sec: that.timeFormat(sec)
            }
            setTimeout(that.countDownFuc, 1000);
        } else { //活动已结束，全部设置为'00'
            obj = {
                day: '00',
                hou: '00',
                min: '00',
                sec: '00'
            }
        }
        // 渲染，然后每隔一秒执行一次倒计时函数
        that.setData({
            countDown: obj
        })
        // console.log("hehe");
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var that = this;
        return {
          title: '快来' + that.data.goods_info.team_price
            + '元一起拼' + that.data.goods_info.goods_name,
            path: '/pages/goods/goods?team_sign='+team_sign
        }
    },
    onViewGoodInfo: function (event) {
        var url = '/pages/goods/goods?goods_id=' + event.currentTarget.dataset.goodId
        // console.log('url->'+url)
        wx.navigateTo({
            url: url
        });
    },
    setOpBtnText() {
        if (s_miao <= 0) {
            this.setData({'opBtnText': '活动已结束'});
        } else if (this.data.customer_num_left <= 0) {
            this.setData({'opBtnText': '此团已满，点击开新团'});
        }
    },
    canBay: function () {
        return customer_num_left > 0;
    },
    join_tuan: function () {
        var that = this;
      if (that.data.customer_num_left <= 0){
        var url = '/pages/goods/goods?goods_id=' + this.data.goods_info.goods_id 
        // console.log('url->'+url)
        wx.navigateTo({
          url: url
        });
        }else
        if (that.data.customer_num_left > 0) {
            wx.navigateTo({
                url: '/pages/tuan/tuan?goods_id=' + this.data.goods_info.goods_id + '&goods_number=' + 1 + '&team_sign=' + team_sign
            })
        } else {
            that.setOpBtnText();
        }

    }
})