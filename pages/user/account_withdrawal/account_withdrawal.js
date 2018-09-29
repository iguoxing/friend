
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

          that.send_deposit(e);


      }
      else{
        that.setData({
              tis:'金额不能小于0喔！',
              tisshow:'background:#17b2e0;'
          })
      }
    },
    send_deposit:function(e){

      var that = this;

      var user_info = app.getUserInfo();//获取最新的缓存
      // console.log(user_info);
      

      wx.request({
          url: app.globalData.domain+app.globalData.userApiUrl,
          data: {
            act:'account_withdrawal',
            uid:user_info.user_id,
            sign:user_info.sign,
            amount:e.detail.value.amount,
            user_note:e.detail.value.note,
            user_name:user_info.user_name
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data);
            if(res.data.err == 0){

              wx.showToast({
                title: '申请提现成功,管理会尽快打款！',
                icon: 'success',
                duration: 2000
              })

              that.setData({
                  button_load:''
              })
            }
            else
            {
              that.setData({
                  tis:res.data.msg,
                  tisshow:'background:#17b2e0;',
                  button_load:''
              })
            }
          }
        })
    }


})