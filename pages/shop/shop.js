var startY;
var endY;
var Y_number = 0;
var app=getApp();
var page = 1;
var load_more = 0;
Page({
  data: {
    imgUrls: [
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    page_data:'shopApiUrl',
    searchplaceholder: '搜索其实很简单！',
    headerstyle:'',
    promoter_list:'',
    hot_list:'',
    best_list:'',
    load_footer:'正在加载',
    cart_number:0,
    user_notice:''
  },
  bodytouchmove:function(m){
    var touch = m.touches[0];
    // startX = touch.clientX;
    startY = touch.clientY;

  }
  ,
  bodytouchend:function(m){
    var touch = m.touches[0];
    
    endY = touch.clientY - startY;

    // console.log('滑动距离为'+endY);
    
    if(endY < 0){
      Y_number = Y_number+endY;
    }
    else{
      // 向上在滑
      Y_number = 0;
      
    }
    // console.log('总向下滑动距离为'+Y_number);

    if(Y_number < '-300'){
      this.setData({
        headerstyle:'background: #dbd9cd;'
      })
    }
    else{
      this.setData({
        headerstyle:''
      })
    }

  },
  onLoad:function(){
    var that = this;
    var user_info = app.getUserInfo();
    wx.request({
        method:'GET',
        url: app.globalData.domain+app.globalData.shopApiUrl,
        data: {
            act:'index',
            uid:user_info.user_id
        },
        success: function(res) {
            if(res.data.err == 0){
              that.setData({
                promoter_list:res.data.promoter_list,
                hot_list:res.data.hot_list,
                best_list:res.data.best_list,
                cart_number:res.data.cart_number,
                user_notice:res.data.user_notice
              })

              if(res.data.list_count == 0){
                that.setData({
                  load_footer:'没有更多推荐商品了...'
                })
                load_more = 1;
               }
            }
        }
    })
  },
  load_goods_list:function(){
    console.log('到底了');
    if(load_more == 0){
    page++;

    var that = this;
    wx.request({
        method:'GET',
        url: app.globalData.domain+app.globalData.shopApiUrl,
        data: {
            act:'ajax_goods_list',
            page:page,
            is_best:1
        },
        success: function(res) {
          
            if(res.data.err == 0){
              that.setData({
                best_list:that.data.best_list.concat(res.data.best_list)
              })

              if(res.data.list_count == 0){
                that.setData({
                  load_footer:'没有更多推荐商品了...'
                })
                load_more = 1;
               }

            }
            
        }
    })

    }
    

  },
  onchangesearch:function(e){
    wx.navigateTo({
      url: '/pages/search/search?search_value='+e.detail.value
    })
  }
})