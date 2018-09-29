var app = getApp()
Page({
  data:{
    tisshow:'display: none;',
    tis:'',
    affdb:false,
    logdb:false
  },
  onLoad:function(options){
    //检查状态
    var user_info = app.getUserInfo();
    var that = this

    if(user_info != null)
    {
      // 准备二维码，获取我推荐的会员，获取分成历史
      console.log(user_info);
      wx.request({
        url: app.globalData.domain+app.globalData.htApiUrl,
        data: {
          act: 'user_affiliate' ,
          uid:user_info.user_id,
          sign:user_info.sign
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {

          if(res.data.logdb.length == 0){
            var logdb = false;
          }
          else
          {
            var logdb = res.data.logdb;
          }

          if(res.data.affdb.length == 0){
            var affdb = false;
          }
          else
          {
            var affdb = res.data.affdb;
          }

         that.setData({
           affdb:affdb,
           logdb:logdb
         })
        }
      })

    }
    else{
      // 提示登录
      that.setData({
        tisshow:'display: block;',
        tis:'请先登录哦！'
      })
    }
  }
})