//util.js
function json2Form(json) {
    var str = [];
    for (var p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}

function page_footer_menu(that) {
    // 点亮菜单
    switch (that.__route__) {
        case 'pages/index/index':
            return 'index';
            break;
        case 'pages/userApiUrl/userApiUrl':
            return 'userApiUrl';
            break;
        case 'pages/shopApiUrl/shopApiUrl':
            return 'shopApiUrl';
            break;
        case 'pages/message/message':
            return 'message';
            break;
        default:
            return false;
    }
}

/**
 * 日期
 * @param timestamp
 * @returns {string}
 */
function getFormatDate(timestamp) {

    // 天数
    var t = Math.floor(timestamp / 86400);

    var y_miao = timestamp - (t * 86400);//减去天数之后的余秒

    // console.log('减去天数之后的余秒' + y_miao);

    var h = Math.floor(y_miao / 3600);//小时数

    y_miao = y_miao - (h * 3600);//小时数计算后剩余的秒数

    // console.log('小时数计算后剩余的秒数' + y_miao);

    var i = Math.floor(y_miao / 60);

    var y_miao = y_miao - (i * 60);//分钟数计算后剩余的秒数

    // console.log('分钟数计算后剩余的秒数' + y_miao);

    var s = Math.floor(y_miao);

    return t + '天' + h + '时' + i + '分' + s + '秒';
}

/**
 * 判断对象为空
 * @param o
 * @returns {boolean}
 */
function isEmpty(o) {
    return o == null;
}

/**
 *
 */
function errShow(msg) {
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定');
            }
        }
    });
}

/**
 * 获取屏幕宽高
 * @param e
 * @returns {{}}
 */
function imageSize(e) {
    var imageSize = {};
    var originalWidth = e.detail.width;//图片原始宽
    var originalHeight = e.detail.height;//图片原始高
    var originalScale = originalHeight/originalWidth;//图片高宽比
    console.log('originalWidth: ' + originalWidth)
    console.log('originalHeight: ' + originalHeight)
    //获取屏幕宽高
    wx.getSystemInfo({
        success: function (res) {
            var windowWidth = res.windowWidth;
            var windowHeight = res.windowHeight;
            var windowscale = windowHeight/windowWidth;//屏幕高宽比
            console.log('windowWidth: ' + windowWidth)
            console.log('windowHeight: ' + windowHeight)
            if(originalScale < windowscale){//图片高宽比小于屏幕高宽比
                //图片缩放后的宽为屏幕宽
                imageSize.imageWidth = windowWidth;
                imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
            }else{//图片高宽比大于屏幕高宽比
                //图片缩放后的高为屏幕高
                imageSize.imageHeight = windowHeight;
                imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
            }

        }
    })
    console.log('缩放后的宽: ' + imageSize.imageWidth)
    console.log('缩放后的高: ' + imageSize.imageHeight)
    return imageSize;
}


module.exports = {
    json2Form: json2Form,
    page_footer_menu: page_footer_menu,
    isEmpty: isEmpty,
    errShow:errShow,
    imageSize:imageSize,
    getFormatDate:getFormatDate
}
