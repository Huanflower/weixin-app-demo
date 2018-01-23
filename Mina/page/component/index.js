// 实例化app.js
var app = getApp();
Page({
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    //jx_left:'/image/s1.png',
    //jx_right:'/image/s2.png',
    //jx_bottom:'/image/s3.png',
    //goodsList: [{ id: 1, title: '', fm_img: '/image/s1.png', now_price: ''}],
    loading: true,
    canScroll: true,
    p: 1,
    tabbarHidden: true,
  },

  onLoad: function(e) {
    wx.showShareMenu({
      withShareTicket: true
    })
  
    // 获取推荐人的refer_id
    var refer_id = e.refer_id;
    //console.log('推荐人'+refer_id);
    var that = this;
    var server = getApp().globalData.server;
    var token = wx.getStorageSync('login_token');
    console.log(token);
    var shopToken = getApp().globalData.shopToken;

    // 获取当前页面链接
    var _curPageArr = getCurrentPages();
  
    // 获取经过处理的底部导航数据
    var tabBar = app.getTabbarData(_curPageArr);

    // 数据赋值
    that.setData({ server: server, tabbarList: tabBar})

    //加载颜色
    var color = getApp().globalData.color;
    that.setData({
      color: color
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })
    
    // 获取页面初始数据
    wx.request({
      url: server + '/index.php/Home/Index/index',
      data: {
        'position': '0,1,2,3',
        'page': 1,
        'user_id': token.id,
        'refer_id': refer_id,
        tokens: shopToken,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        var res = res;
        that.setData({
          imgUrls: res.data.imgUrls,
          goodsList: res.data.goodsList,
          color: res.data.config.color,
          showCateList: res.data.showCateList,
        })

        wx.setNavigationBarTitle({
          title: res.data.config.name,
        })
      }
    })
  },


  /**
  * 用户点击右上角分享
  */


  onShareAppMessage: function (res) {
    var token = wx.getStorageSync('login_token');
    var server = getApp().globalData.server;
    var shareImg = server + token.shopLogo;

    console.log(shareImg);
    return {
      title: token.shopName,
      desc: '最具人气的小程序!',
      imageUrl: shareImg,
      path: '/page/component/index?refer_id=' + token.id,
      success: function (res) {
        wx.showShareMenu({
          withShareTicket: true
        })
        // 转发成功
        //console.log(token);
        wx.showToast({
          title: '转发成功',
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
        })
      }
    }
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
  secondTabbar: function(e) {
    var type = e.currentTarget.dataset.type;
    var token = wx.getStorageSync('login_token');
    console.log(token);
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

  

  //下滑显示更多
  searchScrollLower: function () {
    var that = this;
    var token = wx.getStorageSync('login_token');
    var page = that.data.p;

    if (!that.data.canScroll) {
      return false;
    }

    that.setData({
      canScroll: false,
    }),

    wx.request({
      url: 'https://xcx.7192.com/index.php/Home/Index/getList',
      data: {
        'p': page,
        token: token,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        if (res.data.goodsList) {
          var goodsList = that.data.goodsList;
          page = page + 1;
          that.setData({ loading: true, canScroll: true })
          that.setData({
            goodsList: goodsList.concat(res.data.goodsList),
            p: page,
          })
        }
      },
      fail: function (res) {

      }
    })
  },

  adsTo(e) {
    console.info(e);
    var cate_id = parseInt(e.currentTarget.dataset.cateid);
    var goods_id = parseInt(e.currentTarget.dataset.goodsid);
    var url = '';

    console.info(goods_id);
    if (goods_id) {
      url = '/page/component/details/details?id=' + goods_id;
    } else {
      url = '/page/component/list/list?id=' + cate_id;
    }

    wx.navigateTo({
      url: url,
    })
  }
})

