// page/component/txlog/txlog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  onLoad: function () {
    var that = this
    var sessionInfo = wx.getStorageSync('login_token');
    //获取初始信息开始
    method: 'GET',
    wx.request({
      url: 'https://xcx.7192.com/index.php/Home/Agent/txLog',
      data: { 'sessionInfo': sessionInfo },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var success = res.data.success;
        console.log(success);
        console.log(res);
        if (success) {
          that.setData({
            hasData: true,
            logArr: res.data.logArr
          })
        }else{
          hasData: false
        }
      }
    })
  },
})