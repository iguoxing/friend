var app=getApp()
var pages = 0;
var load_more = 0;
Page({
  data: {
    tis:'',
    tisshow:'',
    collect_goods:[],
    load_footer:'正在加载更多...',
    load_style:''
  },
  onLoad:function(){
    // 发送请求获取初始收藏列表
    this.load_list();
  },
  onUnload:function(){
    load_more = 0;
    pages = 0;
  },
  load_list:function(){
    pages++;

    var that = this;

    var user_info = app.getUserInfo();

    if(load_more != 0){
      return 0;
    }

    wx.request({
      url: app.globalData.domain+app.globalData.userApiUrl,
      data: {
        act: 'comment_list' ,
        page: pages,
        uid:user_info.user_id,
        sign:user_info.sign
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.err == 0){
          that.setData({
            collect_goods:that.data.collect_goods.concat(res.data.comment_list)
          })

          console.log(that.data.collect_goods);

          
          if(res.data.list_count == 0){
              that.setData({
                load_footer:'没有更多评价了...'
              })
              load_more = 1;
            }

        }
        else{
          that.setData({
            tis:res.data.msg,
            tisshow:'height:30px;',
            load_footer:'没有更多评价了...'
          })
          load_more = 1;
        }
      }
    })
  }

})