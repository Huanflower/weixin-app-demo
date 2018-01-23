// pages/userInfo/userInfo.js
var tcity = require("../../../util/citys.js");
var util = require("../../../util/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    focus: false,
    startDate: '1950-1-1',
    endDate: '',
    dates: '1990-1-1',
    loading: true,
  },

  // 三级联动开始
  bindChange: function (e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function (e) {
    console.info(e);
    this.setData({
      condition: !this.data.condition
    })
  },

  chooseDate: function (e) {
    var that = this;
    console.info(1111);
    that.setData({
      dates: e.detail.value
    })
  },
  // 三级联动结束
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sessionInfo = wx.getStorageSync('login_token');

    //省市三级联动开始
    console.log("onLoad");
    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');
    // 省市三级联动结束

    var endTime = util.formatTime(new Date());
    that.setData({ endDate: endTime })




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
      url: 'https://xcx.7192.com/index.php/Home/Index/saveInfo',
      data: { 'sessionInfo': sessionInfo },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.success) {
          console.info(res.data.info);
          that.setData({
            realName: res.data.info.realName,
            tel: res.data.info.tel,
            wxNum: res.data.info.wxNum,
            dates: res.data.info.dates,
            province: res.data.info.address[0],
            city: res.data.info.address[1],
            county: res.data.info.address[2],
            gender: res.data.info.gender,
          })
        }
      }
    })
  },

  formSubmit: function (e) {
    var data = e.detail.value;
    var that = this;
    var dates = that.data.dates;
    var address = that.data.province + '-' + that.data.city + '-' + that.data.county;
    var sessionInfo = wx.getStorageSync('login_token');
    data['dates'] = dates;
    data['address'] = address;

    wx.request({
      url: 'https://xcx.7192.com/index.php/Home/Index/saveInfo',
      data: {
        'data': data,
        'sessionInfo': sessionInfo,
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

          setTimeout(function(){
            wx.navigateTo({
              url: '../user/user',
            })
          }, 2000);
        } else {
          wx.showToast({
            title: res.data.content,
          })
        }
        that.setData({ loading: true })
      },
      fail: function (res) {

      }
    })
  }
})