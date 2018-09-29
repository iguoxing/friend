var total_micro_second = 20 * 1000;
var md5 = require('../../../static/js/md5.js')
var app = getApp();
Page({
    data:{
      tis:'',
      tisshow:'',
      clock:'获取',
      buttom_zt:'true',
      sms_code:'',
      mobile:''
    },
    get_pass_submit:function(e){
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
        // 检查密码

        if(e.detail.value.new_password.length < 6){
            that.setData({
                  tis:'密码不能小于6位喔!',
                  tisshow:'background:#17b2e0;'
              })
        }
        else{
          // 提交修改密码请求

          var mobile = e.detail.value.mobile;
          var new_password = md5.hex_md5(e.detail.value.new_password);
          var code = md5.hex_md5(e.detail.value.mobile_code);
          wx.request({
            url: app.globalData.domain+app.globalData.htApiUrl,
            data: {
              act:'update_password',
              mobile:mobile,
              new_password:new_password,
              code:code
            },
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
              if(res.data.err == 0){
                that.setData({
                    tis:'修改成功，请重新登录!',
                    tisshow:'background:#17b2e0;'
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

          wx.request({
            url: app.globalData.domain+app.globalData.htApiUrl,
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                act:'sendSMS',
                mobile:mobile,
                smstemp:'SMS_78320048'
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
    onLoad:function(){
      
    }


})