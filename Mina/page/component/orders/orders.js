// page/component/orders/orders.js
Page({
  data:{
    address:{},
    hasAddress: false,
    total:0,
    orders:[],
    server: '',
    toastHidden: true,
  },

  onReady() {
    var that = this;
    var server = getApp().globalData.server;
    that.setData({ server: server })
    var carts = wx.getStorageSync('carts');
console.info(carts);
    this.setData({orders: carts});
    this.getTotalPrice();
  },
  
  onShow:function(){
    const self = this;
    wx.getStorage({
      key:'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  chooseAddress() {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        var res = res;
        console.info(res);
        that.setData({
          hasAddress: true,
          address: res,
        })
      }
    })
  },

  toPay() {
    var that = this;
    var address = that.data.address;
    var orders = that.data.orders;
    var token = wx.getStorageSync('login_token');
    var server = getApp().globalData.server;

    if (JSON.stringify(address) == "{}") {
      showNotice(that, '请输入收货人地址');
    }
    wx.request({
      url: server + '/index.php/Home/Index/saveOrder',
      data: {
        token: token,
        address: address,
        orders: orders,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        var res = res.data;
        if (res.success) {
          var payInfo = res.payInfo;
          wx.request({
            url: server + '/index.php/Home/Pay/prepay',
            data: {payInfo:payInfo, token: token},
            success: function (res) {
              var data = res.data;
              if (!data.status) {
                showNotice(that, data['errmsg']);
              }
              wx.request({
                url: server + '/index.php/Home/Pay/pay',
                data: { prepay_id: data.data.data.prepay_id , token: token},
                success: function (_payResult) {
                  var payResult = _payResult.data;
                  wx.requestPayment({
                    'timeStamp': payResult.timeStamp.toString(),
                    'nonceStr': payResult.nonceStr,
                    'package': payResult.package,
                    'signType': payResult.signType,
                    'paySign': payResult.paySign,
                    'success': function (succ) {
                      wx.request({
                        url: server + '/index.php/Home/Index/changeOrder',
                        data: {
                          orderId: payInfo.orderId,
                          token: token,
                          status: 2,
                          orderType: orders[0].orderType,
                        },
                        header: {
                          'content-type': 'application/json'
                        },
                        method: 'GET',
                        success: function (res) {
                          if (res.data.success) {
                            if (orders[0].orderType == 'buy') {
                              wx.redirectTo({
                                url: '/page/component/orderList/orderList?id=0',
                              })
                            } else {
                              wx.redirectTo({
                                url: '/page/component/groupBuy/groupBuy?tid=' + payInfo.tid,
                              })
                            }
                          } else {
                            showNotice(that, res.data.content);
                          }
                        }
                      })
                    },
                    'fail': function (err) {
                      showNotice(that, err);
                    },
                    'complete': function (comp) {

                    }
                  })
                }
              })
            }
          })
        } else {
          showNotice(that, res.content);
        }
        /*if (orders[0].orderType == 'buy') {
          wx.redirectTo({
            url: '/page/component/orderList/orderList?id=0',
          })
        } else {
          wx.redirectTo({
            url: '/page/component/groupBuy/groupBuy?tid=' + res.data.id,
          })
        }*/
        
      }
    })

  }
})

function showNotice(self, content) {
  self.setData({ toastHidden: false, noticeContent: content })
  setTimeout(function () { self.setData({ toastHidden: true }) }, 1500)
  return false;
}
