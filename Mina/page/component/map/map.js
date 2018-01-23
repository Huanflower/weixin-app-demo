// page/component/map/map.js
var QQMapWX = require('../../../util/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var demo = new QQMapWX({
  key: 'SC3BZ-B3FK4-L5HUJ-XJSSD-TSBHS-AXFCI' // 必填
});
Page({
  data: {

  },
  onLoad: function () {
    var token = wx.getStorageSync('login_token');
    var address = token.address ? token.address : '北京';
    demo.geocoder({
      address: address,
      success: function (res) {
        var location = res.result.location;
        var latitude = location.lat;
        var longitude = location.lng;
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: token.shopName,
          scale: 28,
          address: token.address,
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    }); 
  },
})