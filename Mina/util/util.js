function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  // 这里秒钟也取整
  var second = parseInt(time)

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function getData(page, params, server, key) {

  var page = page;
  // 获取页面初始数据
  wx.request({
    url: server + '/index.php/Home/Index/index',
    data: {
      params
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success: function (res) {
      var res = res;
      console.info(res);
      page.setData({
        key: res.data.imgUrls,
      })
    }
  })
}

module.exports = {
  formatTime: formatTime
}

function login() {
  return new Promise(function() {
    wx.login({
      success: function (data) {
        var code = data.code;
        wx.getUserInfo({
          success: function (data) {
            console.info(data);
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
  });
  
}
