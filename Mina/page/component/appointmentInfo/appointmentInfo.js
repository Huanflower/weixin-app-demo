// pages/userInfo/userInfo.js
var util = require("../../../util/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    appType: ['预约拍照', '预约选片', '预约看板', '预约取件'],
    currentIndex: 0,
    toastHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var appInfo = wx.getStorageSync('appInfo');
    that.setData({
      goodsId: appInfo.goodsId,
    })
  },

  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      currentIndex: e.detail.value
    });
  }, 

  formSubmit: function (e) {
    var data = e.detail.value;
    var that = this;
    var sessionInfo = wx.getStorageSync('login_token');
    var appInfo = wx.getStorageSync('appInfo');
    var userName = e.detail.value.userName;
    var tel = e.detail.value.tel;
    var type = that.data.currentIndex;

    if (userName.length == 0) {
      showNotice(that, '请输入预约人姓名');
    }

    if (tel.length == 0) {
      showNotice(that, '请输入预约人电话');
    }

    wx.request({
      url: 'https://xcx.7192.com/index.php/Home/Index/saveAppInfo',
      data: {
        'data': data,
        'token': sessionInfo,
        'appInfo': appInfo,
        'type': type
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: res.data.content,
            icon: 'success',
            duration: 2000,
          })

          setTimeout(function () {
            wx.navigateTo({
              url: '/page/component/home/home',
            })
          }, 2000);
        } else {
          showNotice(that, res.data.content);
        }
      },
      fail: function (res) {

      }
    })
  }
})

function showNotice(self, content) {
  self.setData({ toastHidden: false,  noticeContent: content})
  setTimeout(function () { self.setData({ toastHidden: true }) }, 1500)
  return false;
}