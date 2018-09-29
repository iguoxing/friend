// pages/spike/spike.js
var page = 0;
var nextPage = 1;
var app = getApp();
var t;
function getFormatDate(goods_info) {

  var timestamp = goods_info.gmt_end_time_xcx

  // 天数
  var t = Math.floor(timestamp / 86400);

  var y_miao = timestamp - (t * 86400);//减去天数之后的余秒

  // console.log('减去天数之后的余秒' + y_miao);

  var h = Math.floor(y_miao / 3600);//小时数

  y_miao = y_miao - (h * 3600);//小时数计算后剩余的秒数

  // console.log('小时数计算后剩余的秒数' + y_miao);

  var i = Math.floor(y_miao / 60);

  var y_miao = y_miao - (i * 60);//分钟数计算后剩余的秒数

  // console.log('分钟数计算后剩余的秒数' + y_miao);

  var s = Math.floor(y_miao);

  goods_info.t = t;
  goods_info.h = h;
  goods_info.i = i;
  goods_info.s = s;

  return goods_info;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_id:0,
    goodslist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    app.weixin_login(0);
    
  },
  get_goods_list:function(){
    var that = this

    if (nextPage == 0){
      console.log('没有下页了...')

      return 0;
    }

    page++

    wx.request({
      url: app.globalData.domain + app.globalData.shopApiUrl,
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        act: 'spike',
        page: page
      },
      success: function (res) {
        if(res.data.err == 0){
          that.setData({
            goodslist: that.data.goodslist.concat(res.data.goodslist)
          })

          that.miao_djs();
          nextPage = res.data.nextPage

        }
      }
    })
  },
  miao_djs: function () {

    var that = this

    var goodslist = this.data.goodslist;


    t = setTimeout(function () {

      // 将列表中所有的时间戳减去1

      for (var i in goodslist) {
        if (goodslist[i].gmt_end_time_xcx > 0){
          goodslist[i].gmt_end_time_xcx--;

          goodslist[i] = getFormatDate(goodslist[i]);

          goodslist[i].is_time = 1;
        }
        else
        {
          goodslist[i].is_time = 0;
        }
      }

      that.setData({
        goodslist: goodslist
      })

      that.miao_djs();
    }, 1000);

  },
  tab_nav:function(e){
    var that = this

    that.setData({
      nav_id: e.currentTarget.dataset.nav_id
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

    this.setData({
      nav_id: 0,
      goodslist: []
    })

    page = 0;
    nextPage = 1;

    clearTimeout(t);

    this.get_goods_list();
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
    this.get_goods_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})