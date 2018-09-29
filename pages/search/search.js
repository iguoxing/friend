// pages/search/search.js
var util = require('../../static/js/util.js');
var core = require('../../static/js/core.js');
var page_number = 1;
var app = getApp();
var keywords = '';
var is_loadMore = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list:[],
    scrollHeight: 0,
    footer_text: '请输入关键词...',
    keywords:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    keywords = options.keywords
    that.setData({
      keywords: options.keywords
    })

    that.to_search(null, keywords);
  },
  to_search: function (e, keywords){

    if(e != null){
      keywords = e.detail.value;
    }
    
    var that = this

    wx.showLoading({
      title: '加载中...'
    })

    that.setData({
      goods_list: [],
      footer_text: '加载中...'
    })
      core.requestApi(app.globalData.htApiUrl,{
          act: 'search',
          keywords: keywords,
          page: page_number
      },function (res) {

          wx.hideLoading();

          if (res.data.err == 0) {
              that.setData({
                  goods_list: res.data.list,
                  keywords: keywords,
                  footer_text:'加载中...'
              })

              is_loadMore = res.data.list_count;

              if (res.data.list_count == 0){
                  that.setData({
                      footer_text: '没有更多了!'
                  })
              }
          }

      },'GET');
  },
  onReachBottom: function () {
    // 上拉触底
    // console.log('loadMore');
    this.loadMore();
  },
  loadMore: function (e) {
    
    var that = this;

    if (is_loadMore == 0) {
      return 0;
    }

    is_loadMore = 0;

    wx.showLoading({
      title: '加载中...'
    })

    page_number++
      core.requestApi(app.globalData.htApiUrl,{
          act: 'search',
          page: page_number,
          keywords: keywords
      },function (res) {
          wx.hideLoading();

          if (res.data.err == 0) {
              that.setData({
                  goods_list: that.data.goods_list.concat(res.data.list)
              })
              is_loadMore = res.data.list_count;
              if (is_loadMore == 0) {
                  that.setData({
                      footer_text: '没有更多了!'
                  })
              }
          }

      },'GET');
  }
})