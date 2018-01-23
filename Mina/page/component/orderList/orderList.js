var app = getApp();
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    orderType: ['all', 'dfk', 'dfh', 'dsh', 'ywc', 'dtk'],
    hasSend: false,
    promptHidden: true,
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var self = this;
    var current = e.detail.current;
    self.setData({
      currentTab: current
    });
    this.checkCor();
    getData(self, current);
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    var self = this;
    if (self.data.currentTaB == cur) { return false; }
    else {
      self.setData({
        currentTab: cur
      })
      getData(self, cur);
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var server = getApp().globalData.server;

    //加载颜色
    var color = getApp().globalData.color;
    that.setData({
      color: color
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    });


    that.setData({ server: server, currentTab:id });
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });

    getData(that, id);
  },
  
  chagenType: function(e) {
    var id = e.currentTarget.dataset.id;
    var changeType = e.currentTarget.dataset.type;
    var token = wx.getStorageSync('login_token');
    var self = this;
    var server = self.data.server;
    var currentTab = self.data.currentTab;

    wx.showModal({
      title: '提示',
      content: '您确定要执行此操作？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: server + '/index.php/Home/Index/changeOrderType',
            data: {
              id: id,
              token: token,
              changeType: changeType,
            },
            header: {
              'content-type': 'application/json'
            },
            success(res) {
              if (res.data.success) {
                getData(self, currentTab);
              } else {
                showPrompt(self);
              }
            }
          });
        }
      }
    })

    
  }
})

function getData(self, id) {
  var server = self.data.server;
  var token = wx.getStorageSync('login_token');
  var orderType = self.data.orderType[id];
  if (self.data.hasSend) {
    return false;
  }
  self.setData({
    hasSend: true,
  })
  wx.request({
    url: server + '/index.php/Home/Index/getOrderList',
    data: {
      id: id,
      token: token
    },
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      self.setData({hasSend: false});
      switch (orderType) {
        case 'all':
          self.setData({
            all: res.data.orderList,
          })
        break;
        case 'dfk':
          self.setData({
            dfk: res.data.orderList,
          })
          break;
        case 'dfh':
          self.setData({
            dfh: res.data.orderList,
          })
          break;
        case 'dsh':
          self.setData({
            dsh: res.data.orderList,
          })
          break;
        case 'ywc':
          self.setData({
            ywc: res.data.orderList,
          })
          break;
        case 'dtk':
          self.setData({
            dtk: res.data.orderList,
          })
          break;
      }
    }
  });
}

function showPrompt(self) {
  self.setData({
    promptHidden: false,
  })
  setTimeout(function() {self.setData({promptHidden: true})}, 1500);
}