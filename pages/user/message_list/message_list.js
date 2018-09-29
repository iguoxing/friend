var app=getApp()
var pages = 0;
var load_more = 0;
var message_type = 0;
Page({
  data: {
    tis:'',
    tisshow:'',
    surplus_amount:0,
    feedback_list:[],
    load_footer:'正在加载更多留言...',
    message_type_text:'留言',
    submit_load:false
  },
  onLoad:function(){
    // 发送请求获取首个列表和余额
    this.load_list();
  },
  change_message_type:function(e){

    var message_type_new = '';

    switch(e.detail.value)
    {
      case '0':
        message_type_new = '留言';
        break;
      case '1':
        message_type_new = '投诉';
        break;
      case '2':
        message_type_new = '询问';
        break;
      case '3':
        message_type_new = '售后';
        break;
      case '4':
        message_type_new = '求购';
        break;
      default:
        message_type_new = '';
    }

    message_type = e.detail.value;

    this.setData({
      message_type_text:message_type_new
    })

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
        act: 'message_list' ,
        pages: pages,
        uid:user_info.user_id,
        sign:user_info.sign
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.err == 0){
          that.setData({
            feedback_list:that.data.feedback_list.concat(res.data.feedback_list)
          })
        }
        else{
          if(res.data.feedback_list != 'null'){
            that.setData({
              tis:res.data.msg,
              tisshow:'height:30px;'
            })
          }
        }

        if (res.data.list_count == 0) {
          that.setData({
            load_footer: '没有更多留言了...'
          })
          load_more = 1;
        }

        if (res.data.feedback_list.length == 0){
          that.setData({
            load_footer:'还没有您的留言...'
          })
          load_more = 1;
        }
        else
        {
          that.setData({
            load_footer: ''
          })
        }

      }
    })
  },
  send_message:function(e){
    var that = this

    that.setData({
      submit_load:true
    })

    console.log(e.detail.value.message_title);

    var user_info = app.getUserInfo();

    // 提交留言，等待api，此api要返回新的留言列表

    wx.request({
      url: app.globalData.domain+app.globalData.userApiUrl,
      data: {
        act: 'send_message' ,
        uid:user_info.user_id,
        sign:user_info.sign,
        msg_type:message_type,
        msg_title:e.detail.value.message_title,
        msg_content:e.detail.value.message_text
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {

        that.setData({
          submit_load:false
        })

        if(res.data.err == 0){
          that.setData({
            feedback_list:res.data.feedback_list
          })
          
          if(res.data.list_count == 0){
              that.setData({
                load_footer:'还没有您的留言...'
              })
              load_more = 1;
            }

        }
        else{
          that.setData({
            tis:res.data.msg,
            tisshow:'height:30px;'
          })
        }
        
      }
    })

  }
})