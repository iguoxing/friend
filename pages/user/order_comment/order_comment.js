var app=getApp()
Page({
  data: {
    tis:'',
    tisshow:'',
    collect_goods:[]
  },
  onLoad:function(options){
    // 发送请求获取商品列表

    console.log(options);

    this.load_list(options.order_id);
  },
  edit_xingxing:function(e){

    var rank=e.target.dataset.rank;

    if(e.target.dataset.goods_id){
      // 将对应的商品的评价等级更改

      var goods_list = this.data.collect_goods;
      for(var i=0;i<goods_list.length;i++){

        if(goods_list[i].goods_id == e.target.dataset.goods_id){

          goods_list[i].comment_rank = rank;

          this.setData({
            collect_goods:goods_list
          })

        }

      }


    }

  },
  load_list:function(order_id){

    var that = this;

    var user_info = app.getUserInfo();


    wx.request({
      url: app.globalData.domain+app.globalData.userApiUrl,
      data: {
        act: 'order_goods_list' ,
        uid:user_info.user_id,
        sign:user_info.sign,
        order_id:order_id
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.err == 0){
          that.setData({
            collect_goods:that.data.collect_goods.concat(res.data.goods_list)
          })
        }
        else{
          that.setData({
            tis:res.data.msg,
            tisshow:'height:30px;'
          })
        }
      }
    })
  },
  post_comment:function(e){
    console.log(e.detail.value);

    var that = this;

    var user_info = app.getUserInfo();

    var goods_list = that.data.collect_goods;

    for(var i=0;i<goods_list.length;i++){
      goods_list[i].comment_text = e.detail.value[goods_list[i].goods_id];

      delete goods_list[i].goods_name;
      delete goods_list[i].goods_thumb;
      delete goods_list[i].goods_number;
      delete goods_list[i].goods_price;
    }

    console.log(goods_list);

    wx.request({
      url: app.globalData.domain+app.globalData.userApiUrl,
      data: {
        act: 'comment_send' ,
        uid:user_info.user_id,
        sign:user_info.sign,
        goods_list:goods_list
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.err == 0){
          wx.showToast({
            title: '评价成功,感谢您的支持！',
            icon: 'success',
            duration: 2000
          })

          wx.redirectTo({
            url: '/pages/userApiUrl/comment_list/comment_list?id=1'
          })

        }
        
      }
    })

  }

})