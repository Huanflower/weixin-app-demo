//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    title: '利和同悦',
    swiperList: ['swiper1', 'swiper2', 'swiper3'],
    loading: true,
    canScroll: true,
    tabbarHidden: true,
    agentSta: true,
  },

  onLoad: function () {
    var that = this
    // 获取当前页面链接
    var _curPageArr = getCurrentPages();
    // 获取经过处理的底部导航数据
    var tabBar = app.getTabbarData(_curPageArr);

    // 数据赋值
    that.setData({ tabbarList: tabBar })

    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
    
    //加载颜色
    var color = getApp().globalData.color;
    that.setData({
      color: color
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })

    var sessionInfo = wx.getStorageSync('login_token');
    //获取初始信息开始
    wx.request({
      url: 'https://xcx.7192.com/index.php/Home/Agent/getInfo',
      data: { 'sessionInfo': sessionInfo },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var status = res.data.status;
        //console.log(status);
        //console.log(res);
        if (status == 'off') {
          that.setData({
            agentSta: false
          })
        } else {
          that.setData({
            agentSta: status
          })
        }
      }
    })

    


  },

  // 底部导航点击事件
  tabbarChange: function (e) {
    var url = e.currentTarget.dataset.url;
    var bindtap = e.currentTarget.dataset.bind;
    var tabbarHidden = this.data.tabbarHidden;
    var that = this;

    if (url) {
      wx.redirectTo({
        url: url,
      })
    }

    if (bindtap) {
      that.setData({
        tabbarHidden: !tabbarHidden
      });
    }
  },
  
  // 二级导航点击事件
  secondTabbar: function (e) {
    var type = e.currentTarget.dataset.type;
    var token = wx.getStorageSync('login_token');
    if (type == 'phone') {
      wx.makePhoneCall({
        phoneNumber: token.phone,
      })
    } else if (type == 'address') {
      wx.navigateTo({
        url: '/page/component/map/map',
      })
    }
  },

  toOrderList(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/component/orderList/orderList?id=' + id,
    })
  },

  showAddress: function() {
    wx.chooseAddress({
      success: function(data) {
        console.info(data);
      }
    })
  }

})
