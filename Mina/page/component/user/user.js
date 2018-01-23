// page/component/new-pages/user/user.js
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{},
    server: '',
  },
  onLoad(){
    var self = this;
    var server = getApp().globalData.server;
    self.setData({ server: server });
    var token = wx.getStorageSync('login_token');
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    }),

    /**
     * 发起请求获取订单列表信息
     */
    wx.request({
      url: server + '/index.php/Home/Index/getOrderList',
      data: {
        token: token,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success(res){
        console.info(res);
        self.setData({
          orders: res.data.orderList
        })
      }
    })
  },
  onShow(){
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  /**
   * 发起支付请求
   */
  payOrders(){
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function(res){
        console.log(res)
      },
      fail: function(res) {
        wx.showModal({
          title:'支付提示',
          content:'<text>',
          showCancel: false
        })
      }
    })
  }
})