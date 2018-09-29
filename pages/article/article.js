// pages/category/category.js
var core = require('../../static/js/core.js');
var app = getApp();
var page_number = 0;
var is_loadMore = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list:[],
    scrollHeight:0,
    footer_text:'加载中...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    // 设置下滑框的高度
    wx.getSystemInfo({
        success:function(res){
            that.setData({
                scrollHeight:res.windowHeight
            });
        }
    });

  },
  loadMore:function(e){
    var that = this;

    if (is_loadMore == 0){
      return 0;
    }

    is_loadMore = 0;

    wx.showLoading({
      title:'加载中...'
    })

    page_number++

      core.requestApi(app.globalData.shopApiUrl,{
          act: 'ajax_article_list',
          page: page_number,
          cat_id: 23
      },function (res) {

          wx.hideLoading();


          if (res.data.err == 0) {
              that.setData({
                  goods_list: that.data.goods_list.concat(res.data.best_list)
              })
              is_loadMore = res.data.list_count;
              if (is_loadMore == 0){
                  that.setData({
                      footer_text:'没有更多了!'
                  })
              }
          }

      });
  },
  to_search:function(e){
    console.log('开始搜索文章');
  },
  onShow:function(){
    this.setData({
      goods_list:[]
    })
    page_number = 0;
    is_loadMore = 1;
    this.loadMore();
  }
})