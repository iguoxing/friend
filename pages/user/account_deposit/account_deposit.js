
//获取应用实例
var app = getApp()

var user_info = app.getUserInfo();

Page({
    data:{
      tis:'',
      tisshow:'',
      button_load:''
    },
    onShow:function(){
      var that = this

      //检查状态

      var user_info = app.getUserInfo();//获取最新的缓存

      if(user_info == 'false')
      {

        that.setData({
              tis:'请您先登录！',
              tisshow:'background:#17b2e0;'
          })
        
      }

      
    },
    hidetis:function(){
      this.setData({
            tis:'',
            tisshow:'background:#fff;'
        })
    },
    bind_submit:function(e){

      var that = this;

      that.setData({
        button_load:'true'
      })

      if(e.detail.value.amount > 0){
        // 获取code发送请求
        wx.login({
          success: function(res2) {
            if (res2.code) {
              that.send_deposit(res2.code,e);
            } else {
              that.setData({
                  tis:res2.errMsg,
                  tisshow:'background:#17b2e0;'
              })
            }
          }
        });

      }
      else{
        that.setData({
              tis:'金额不能小于0喔！',
              tisshow:'background:#17b2e0;'
          })
      }
    },
    send_deposit:function(user_code,e){

      var that = this;

      var user_info = app.getUserInfo();//获取最新的缓存
      // console.log(user_info);
      

      wx.request({
          url: app.globalData.domain+app.globalData.userApiUrl,
          data: {
            act:'account_deposit',
            uid:user_info.user_id,
            sign:user_info.sign,
            amount:e.detail.value.amount,
            user_note:e.detail.value.note,
            user_name:user_info.user_name,
            user_code:user_code
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data)

            if(res.data.err == 0){
              // 发起支付
              // console.log('timeStamp=');
              // console.log(res.data.order.timeStamp.toString());

              wx.requestPayment({
                'timeStamp': res.data.order.timeStamp.toString(),
                'nonceStr': res.data.order.nonceStr,
                'package': res.data.order.package,
                'signType': 'MD5',
                'paySign': res.data.order.paySign,
                'complete':function(res2){
                  wx.redirectTo({
                    url: '/pages/userApiUrl/wallet/wallet?id=1'
                  })

                  wx.showToast({
                    title: '支付完成,充值稍后自动到账!',
                    icon: 'success',
                    duration: 2000
                  })

                  that.setData({
                    button_load:''
                  })

                }
              })
            }
            else{
              that.setData({
                  tis:res.data.msg,
                  tisshow:'background:#17b2e0;'
              })
            }

          }
        })
    }


})