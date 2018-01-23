var WxParse = require('../../../wxParse/wxParse.js');
var util = require("../../../util/util.js");
Page({
  data:{
    goods: {
      id: 1,
      //image: '/image/goods1.png',
      title: '新鲜梨花带雨',
      now_price: 0.01,
      stock: '有货',
      content: '这里是梨花带雨详情。',
      parameter: '125g/个',
      service: '不支持退货',
      tj_img: [],
    },
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    server: '',
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    scrollTop: 0
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })


    var that = this;
    var id = options.id;
    var server = getApp().globalData.server;
    var token = wx.getStorageSync('login_token');
    var tid = options.tid;
    that.setData({ server: server, tid: tid })

    if (!token) {
      util.login().then(function() {
        token = wx.getStorageSync('login_token');
        getData(that, id, token);
      })
    } else {
      getData(that, id, token);
    }
    
    //加载颜色
    var color = getApp().globalData.color;
    that.setData({
      color: color
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })
  },

  addCount() {
    let num = parseInt(this.data.num);
    let stock = this.data.goods.stock;

    if (num < stock) {
      num++;
    }
    this.setData({
      num : num
    })
  },

  delCount() {
    var that = this;
    let num = this.data.num;
    if (num < 2) {
      return false;
    }
    num --;
    this.setData({
      num: num,
    })
  },

  addToCart(e) {
    const self = this;
    const num = this.data.num;
    var total = this.data.totalNum;
    var id = e.target.dataset.id;
    var token = wx.getStorageSync('login_token');
    var server = getApp().globalData.server;

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

    // 获取页面初始数据
    wx.request({
      url: server + '/index.php/Home/Index/addToCart',
      data: {
        'id': id,
        token: token,
        num: num
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {

      }
    })
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  toOrder(e) {
    var orderType = e.currentTarget.dataset.type;
    var goods = this.data.goods;
    var goodsInfo = {};
    var goodsCart = [];
    goodsInfo['goods_id'] = goods.id;
    goodsInfo['title'] = goods.title;
    goodsInfo['image'] = goods.fm_img;
    goodsInfo['price'] = goods.now_price;
    goodsInfo['num'] = 1;
    goodsInfo['id'] = goods.id;
    goodsInfo['orderType'] = orderType;
    if (orderType == 'tuan') {
      goodsInfo['price'] = goods.tuan_price;
      goodsInfo['max_buy'] = goods.max_buy;
      goodsInfo['last_buy_time'] = goods.last_buy_time;
    }
    goodsCart[0] = goodsInfo;
    console.info(goodsCart);
    wx.setStorageSync('carts', goodsCart);
    wx.navigateTo({
      url: '../orders/orders',
    })
  },

  collect(e) {
    var that = this;
    var token = wx.getStorageSync('login_token');
    var server = that.data.server;
    var id = e.currentTarget.dataset.id;

    wx.request({
      url: server + '/index.php/Home/Index/saveCollect',
      data: {
        id: id,
        token: token,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        var res = res.data;
        if (res.success) {
          that.setData({hasCollect: res.hasCollect});
        } else {

        }
      }
    })
  },
  
  toIndex() {
    wx.navigateTo({
      url: '/page/component/index',
    })
  }
 
})

function getData(that, id, token) {
  var server = that.data.server;
  // 获取页面初始数据
  wx.request({
    url: server + '/index.php/Home/Index/getGoodsDetail',
    data: {
      id: id,
      token: token,
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success: function (res) {
      var res = res;
      WxParse.wxParse('article', 'html', res.data.goodInfo.content, that, 5);
      if (res.data.count) {
        that.setData({ hasCarts: true })
      }
      that.setData({
        goods: res.data.goodInfo,
        totalNum: parseInt(res.data.count),
        hasCollect: res.data.hasCollect,
      })
      wx.setNavigationBarTitle({
        title: res.data.goodInfo.title,
      })
    }
  })
}