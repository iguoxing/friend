var total_micro_second = 20 * 1000;
var md5 = require('../../../static/js/md5.js')

//获取应用实例
var app = getApp()

var user_info = app.getUserInfo();

Page({
    data:{
      tis:'',
      tisshow:'',
      clock:'获取',
      buttom_zt:'true',
      text_mobile:'手机号',
      text_mobile_note:'请输入您要绑定的手机号',
      text_button:'绑定'

    },
    bind_mobile_submit:function(e){
      var that = this

      if(e.detail.value.mobile.length == 0 || e.detail.value.mobile_code.length==0){
          that.setData({
                tis:'手机号和验证码都是必填项喔！',
                tisshow:'background:#17b2e0;'
            })
      }
      else if(e.detail.value.mobile.length != 11){
          that.setData({
              tis:'请输入正确的手机号!',
              tisshow:'background:#17b2e0;'
          })
      }
      else{

          // 提交修改手机号请求

          var mobile = e.detail.value.mobile;
          var code = md5.hex_md5(e.detail.value.mobile_code);
          wx.request({
            url: app.globalData.domain+app.globalData.htApiUrl,
            data: {
              act:'bind_mobile',
              mobile:mobile,
              code:code,
              uid:user_info.user_id,
              sign:user_info.sign
            },
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
              if(res.data.err == 0){
                that.setData({
                    tis:res.data.msg,
                    tisshow:'background:blue;'
                })

                
                wx.switchTab({
                  url: '/pages/userApiUrl/userApiUrl'
                })
              }
              else
              {
                that.setData({
                    tis:res.data.msg,
                    tisshow:'background:#17b2e0;'
                })
              }
            }
          })
          
        

      }

    },
    listenermobileInput:function(e){
      this.data.mobile2 = e.detail.value;
    },
    get_sms_code:function(e){

      var that = this;

      if(this.data.mobile2.length != 11){
        this.setData({
              tis:'请输入正确的手机号',
              tisshow:'background:#17b2e0;'
          })
      }
      else{
        // 发送短信

        var mobile = this.data.mobile2;

          if(!user_info.user_id){
            this.setData({
                tis:'您的登录状态异常,请重新登录',
                tisshow:'background:#17b2e0;'
            })
          }

          wx.request({
            url: app.globalData.domain+app.globalData.htApiUrl,
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                act:'sendSMS',
                mobile:mobile,
                smstemp:'SMS_78255030',
                uid:user_info.user_id
            },
            success: function(res) {

              if(res.data.err == 0){
                that.setData({
                    tis:'发送成功！',
                    tisshow:'background:#17b2e0;'
                })

                // 修改按钮为不可点击

                that.setData({
                  buttom_zt:'false'
                })

                that.countdown(that);//倒计时

                // 保存验证码到this

                that.data.sms_code = res.data.code;
                that.data.mobile = res.data.mobile;

              }
              else if(res.data.err == 2){
                that.setData({
                    tis:'手机号格式不正确',
                    tisshow:'background:#17b2e0;'
                })
              }
              else if(res.data.err == 5){
                that.setData({
                    tis:'您接收短信手机与您绑定手机不符',
                    tisshow:'background:#17b2e0;'
                })
              }
              else{
                that.setData({
                    tis:'发送失败',
                    tisshow:'background:#17b2e0;'
                })
              }

            }
          })
      }
    },
    hidetis:function(){
      this.setData({
            tis:'',
            tisshow:'background:#fff;'
        })
    },
    countdown:function(that){
        // 渲染倒计时时钟 
          that.setData({ 
            clock:that.dateformat(total_micro_second) 
          }); 
          
          if (total_micro_second <= 1) { 
            that.setData({ 
              clock:"获取",
              buttom_zt:'true'
            }); 
            // timeout则跳出递归 
            return ; 
          }   
          setTimeout(function(){ 
            // 放在最后-- 
            total_micro_second -= 10; 
            that.countdown(that); 
          } 
          ,10)
    }
    ,
    dateformat:function(micro_second){
      // 秒数 
      var second = Math.floor(micro_second / 1000); 
      // 小时位 
      var hr = Math.floor(second / 3600); 
      // 分钟位 
      var min = Math.floor((second - hr * 3600) / 60); 
      // 秒位 
      var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60; 
      // 毫秒位，保留2位 
      var micro_sec = Math.floor((micro_second % 1000) / 10); 
      return hr + ":" + min + ":" + sec;
    },
    onShow:function(){
      var that = this

      //检查状态

      var user_info = app.getUserInfo();//获取最新的缓存

      if(user_info != null)
      {

        // 检查sign,若不通过则直接注销登录

        if(user_info.mobile_phone != 0){
            that.setData({
                tis:'当前绑定的手机:'+user_info.mobile_phone,
                tisshow:'background:#fff;color:#000',
                text_mobile_note:'请输入完整的原手机号码',
                text_mobile:'原手机号',
                text_button:'解绑'
            })
        }
        
      }
      else{
        that.setData({
              tis:'请您先登录！',
              tisshow:'background:#17b2e0;',
              buttom_zt:'false'
          })
      }
      
    }


})