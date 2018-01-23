// page/component/cash/cash.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var sessionInfo = wx.getStorageSync('login_token');


    //加载颜色
    var color = getApp().globalData.color;
    that.setData({
      color: color
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    })

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
        } else if (status == 'pass') {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  formSubmit: function (e) {
    var data = e.detail.value;
    var sessionInfo = wx.getStorageSync('login_token');
    data['fee'] = data.fee;
    data['tel'] = data.tel;

    wx.request({
      url: 'https://xcx.7192.com/Home/Agent/saveCash',
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
              url: '/page/component/agent/agent',
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