// page/component/list/list.js
Page({
  data:{
    goodsList: [],
    server: '',
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    var token = wx.getStorageSync('login_token');
    var server = getApp().globalData.server;
    var self = this;
    self.setData({server: server});

    wx.request({
      url: server + '/index.php/Home/Index/getCateGoods',
      data: {
        token: token,
        id: id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        self.setData({
          goodsList: res.data.goodsList,
          topImg: res.data.img,
          cateInfo: res.data.cateInfo,
        }),
        wx.setNavigationBarTitle({
          title: res.data.cateInfo.title,
        })
      }
    })

    var shopToken = getApp().globalData.shopToken;
    wx.request({
      url: 'https://xcx.7192.com/index.php/Home/Index/getColor',
      data: {
        tokens: shopToken,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var color = res.data.color;
        console.log(res);
        self.setData({
          color: color
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: color
        })
      }
    })


  },
  
})