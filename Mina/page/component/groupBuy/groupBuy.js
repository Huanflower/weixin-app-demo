// page/component/groupBuy/groupBuy.js
var util = require("../../../util/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: '',
    goodsInfo: {},
    tInfo: {},
    end_time: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.info(options.tid);
    var self = this;
    var server = getApp().globalData.server;
    var tid = options.tid;
    self.setData({ server: server })
    var token = wx.getStorageSync('login_token');

    if (!token) {
      util.login().then(function() {
        token = wx.getStorageSync('login_token');
        getData(self, tid, token);
      });
    } else {
      getData(self, tid, token);
    }



    //加载颜色
    var color = getApp().globalData.color;
    self.setData({
      color: color
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.goodsInfo.title,
      path: '/page/component/groupBuy/groupBuy?tid='+that.data.tInfo.id,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },

  toOrder(e) {
    var goods = this.data.goodsInfo;
    var tId = this.data.tInfo.id;
    var goodsInfo = {};
    var goodsCart = [];
    goodsInfo['goods_id'] = goods.id;
    goodsInfo['title'] = goods.title;
    goodsInfo['image'] = goods.fm_img;
    goodsInfo['price'] = goods.tuan_price;
    goodsInfo['num'] = 1;
    goodsInfo['id'] = goods.id;
    goodsInfo['orderType'] = 'tuan';
    goodsInfo['tId'] = tId;
    goodsCart[0] = goodsInfo;
    wx.setStorageSync('carts', goodsCart);
    wx.navigateTo({
      url: '../orders/orders',
    })
  }
})

function getData(self, tid, token) {
  console.info(token);
  var server = getApp().globalData.server;
  wx.request({
    url: server + '/index.php/Home/Index/getGroupbyInfo',
    data: {
      tid: tid,
      token: token
    },
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      self.setData({
        tMember: res.data.tMember,
        goodsInfo: res.data.goodsInfo,
        tInfo: res.data.tInfo,
        end_time: res.data.tInfo.lastTime,
        haveRec: res.data.haveRec,
      })

      countdown(self);
    }
  });
}

function countdown(that, endTime) {
  var EndTime = that.data.end_time;
  var NowTime = new Date().getTime();
  var total_micro_second = EndTime - NowTime || [];
  console.info(total_micro_second);
  // 渲染倒计时时钟
  that.setData({
    clock: dateformat(total_micro_second)
  });
  if (total_micro_second <= 0) {
    that.setData({
      clock: "活动已结束",
      
    });
    return;
  }
  setTimeout(function () {
    total_micro_second -= 1000;
    countdown(that);
  }
    , 1000)
}

// 时间格式化输出，如11:03 25:19 每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = Math.floor(second / 3600 % 24);
  // 分钟
  var min = Math.floor(second / 60 % 60);
  // 秒
  var sec = Math.floor(second % 60);
  return day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
}