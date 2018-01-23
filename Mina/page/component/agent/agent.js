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
    modalHidden: true,
  },

  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  }, 
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
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
        console.log(status);
        console.log(res);
        if (status == 'wait') {
          that.setData({
            shopName: sessionInfo.shopName,
            status: 'wait'
          })
        } else if (status == 'pass'){
          that.setData({
            shopName: sessionInfo.shopName,
            referName: res.data.info.referName,
            account: res.data.info.account,
            status: 'pass'
          })
        } else {
          that.setData({
            shopName: sessionInfo.shopName,
            referName: res.data.info.referName,
            agreeMent: res.data.info.agreeMent,
            status: 'none'
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


  

  
  formSubmit: function (e) {
    var data = e.detail.value;
    var sessionInfo = wx.getStorageSync('login_token');
    data['agentName'] = data.agentName;
    data['agentTel'] = data.agentTel;

    wx.request({
      url: 'https://xcx.7192.com/Home/Agent/saveApply',
      data: {
        'data': data,
        'sessionInfo': sessionInfo,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data.success) {
          wx.showModal({
            title: '信息提交成功',
            content: res.data.content,
            showCancel: false
          })

          setTimeout(function () {
            wx.navigateTo({
              url: '/page/component/home/home',
            })
          }, 2000);
        } else {
          wx.showModal({
            title: '提交失败',
            content: res.data.content,
            showCancel: false
          })
        }
      },
      fail: function (res) {

      }
    })
  }
  
})
