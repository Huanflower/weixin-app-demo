App({
  onLaunch: function () {
    //console.log('App Launch');
    login();
    var that = this;
    var shopToken = that.globalData.shopToken;
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
        that.globalData.color = color;
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: color
        })
      }
    })
  },
  onShow: function () {
    var color = this.globalData.color;
    console.log(1);
    console.log(color);
    console.log(2);
  },

  onHide: function () {
    //console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    server: 'https://xcx.7192.com',
    shopToken: 'e98b8fdab3124b2c67422e0ea7cdc82e',
    color: '',
    list: [
      {
        "pagePath": "/page/component/index",
        "text": "首页",
        "iconPath": "/image/12.png",
        "selectedIconPath": "/image/11.png",
        "clas": "menu-item",
        "selectedColor": "#4EDF80",
        "bindtap": "",
        active: true
      },
      {
        "pagePath": "/page/component/category/category",
        "text": "分类",
        "iconPath": "/image/22.png",
        "selectedIconPath": "/image/21.png",
        "selectedColor": "#4EDF80",
        "clas": "menu-item",
        "bindtap": "",
        active: false
      },
      {
        "pagePath": "",
        "text": "联系我们",
        "iconPath": "/image/32.png",
        "selectedIconPath": "/image/31.png",
        "selectedColor": "#4EDF80",
        "clas": "menu-item",
        "bindtap": "tabbarChange",
        active: false
      },
      {
        "pagePath": "/page/component/home/home",
        "text": "我的",
        "iconPath": "/image/42.png",
        "selectedIconPath": "/image/41.png",
        "selectedColor": "#4EDF80",
        "clas": "menu-item",
        "bindtap": "",
        active: false
      },
    ],  
  },
  getTabbarData: function (_curPageArr) {
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }

    var tabBar = this.globalData.list;
    for (var i = 0; i < tabBar.length; i++) {
      tabBar[i].active = false;
      if (tabBar[i].pagePath == _pagePath) {
        tabBar[i].active = true;//根据页面地址设置当前页面状态    
      }
    }

    return tabBar;
  }
})

function login() {
  wx.login({
    success: function (data) {
      var code = data.code;
      wx.getUserInfo({
        success: function (data) {
          //console.info(data);
          var rawData = data.rawData;
          var signature = data.signature;
          var encryptedData = data.encryptedData;
          var iv = data.iv;
          var userInfo = data.userInfo;
          var session3rd = wx.getStorageSync('login_token');
          var shopToken = getApp().globalData.shopToken;

          wx.request({
            url: 'https://xcx.7192.com/index.php/Home/Index/wxLogin',
            data: {
              'code': code,
              'rawData': rawData,
              'signature': signature,
              'iv': iv,
              'encryptedData': encryptedData,
              'userInfo': userInfo,
              'session3rd': session3rd,
              'shopToken': shopToken,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
              var result = res.data;
              if (!result.success) {
                wx.showToast({
                  title: result.content,
                })
              } else {
                wx.showToast({
                  title: result.content,
                }),
                  wx.setStorageSync('login_token', result.info);
              }
            },
            fail: function (data) {

            }
          })
        }
      })
    }
  })
}

