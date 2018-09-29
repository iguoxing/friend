//message.js
Page({
  data:{
    test:'测试'
  },
  onLoad:function (){
    var that = this;
    wx.request({
      url: 'https://ececho.cn/xcx/ht.php',
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {

          that.setData({
            test: res.data
          })

      },
      complete: function(res){
        console.log('测试页请求完成');
        console.log(res);

      }
    })
  }
  
})
