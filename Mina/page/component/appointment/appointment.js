var app = getApp();
Page({
  data: {
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentDays: '',
    timeList: { 9: '9:00-10:00', 10: '10:00-11:00', 11: '11:00-12:00',
                12: '12:00-13:00', 13: '13:00-14:00', 14: '14:00-15:00',
                15: '15:00-16:00', 16: '16:00-17:00', 17: '17:00-18:00',
    },
    currentTime: '',
    toastHidden: true,
    goodsId: 0,
  },
  onShow: function (){
    var that = this;
    //加载颜色
    var color = getApp().globalData.color;
    that.setData({
      color: color
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color
    });
  },
  onLoad: function (options) {

    var id = options.id ? options.id : 0;
    var currentObj = this.getCurrentDayString();
    var now_day = currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate();
    var now_month = currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1);
    var currentDates = Date.parse(new Date(now_day));
    var currentMonth = Date.parse(new Date(now_month));

    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentObj.getDate() + '日',
      currentDateTime: currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate() + '/',
      currentDay: currentObj.getDate(),
      currentObj: currentObj,
      currentDates: currentDates,
      currentMonth: currentMonth,
      goodsId: id,
      currentDays: currentObj.getDate(),
    })
    this.setSchedule(currentObj)

    
  },
  doDay: function (e) {
    var that = this
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    var currentMonth = this.data.currentMonth;
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1
      if (m <= 0) {
        str = (Y - 1) + '/' + 12 + '/' + d
      } else {

        var month = Date.parse(new Date(Y + '/' + m));
        if (currentMonth > month) {
          return false;
        }

        str = Y + '/' + m + '/' + d
      }
    } else {
      m += 1
      if (m <= 12) {
        str = Y + '/' + m + '/' + d
      } else {
        str = (Y + 1) + '/' + 1 + '/' + d
      }
    }
    currentObj = new Date(str)
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' + currentObj.getDate() + '日',
      currentDateTime: currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate() + '/',
      currentObj: currentObj,
      currentTime: '',
      currentDay: -1,
      currentDays: -1,
    })
    this.setSchedule(currentObj);
  },
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  setSchedule: function (currentObj) {
    var that = this
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    var total = (firstKey - 1) + currentDayNum;
    total <= 35 ? total = 35 : total = 42;
    
    for (var i = 0; i < total; i++) {
      let data = {};
      if (i < firstKey - 1) {
        data['day'] = '';
        data['date'] = '';
        currentDayList[i] = data;
      } else {
        if (f < currentDayNum) {
          var stringTime = Y + '/' + m + '/' + (f + 1);
          data['day'] = f + 1;
          data['date'] = Date.parse(new Date(stringTime));
          currentDayList[i] = data;
          f = data['day'];
        } else if (f >= currentDayNum) {
          data['day'] = '';
          data['date'] = '';
          currentDayList[i] = data;
        }
      }
    }
    that.setData({
      currentDayList: currentDayList
    })
  },
  choseDay(e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var days = e.currentTarget.dataset.day;
    var currentDayList = self.data.currentDayList;
    var date = currentDayList[index].date;
    var currentDates = self.data.currentDates;
    var currentDateTime = new Date(parseInt(date)).toLocaleString().substr(0, 10);
    if (date < currentDates) {
      return false;
    } else {
      self.setData({
        currentDay: index,
        currentDateTime: currentDateTime,
        currentDays: days,
      })
    }
  },
  choseTime(e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var currentDates = self.data.currentDates;
    var time = self.data.currentDateTime + ' ' + index + ':59:59';
    var currentDate = Date.parse(new Date(time));
    var now = Date.parse(new Date());
    var currentDay = self.data.currentDay;

    if (currentDay < 0) {
      return false;
    }
    if (currentDate < now) {
      return false;
    } else {
      self.setData({
        currentTime: index,
      })
    }
  },
  toAppInfo() {
    var self = this;
    var currentDay = self.data.currentDay;
    var currentDayList = self.data.currentDayList;
    var date = currentDayList[currentDay].date;
    var currentTime = self.data.currentTime;
    var goodsId = self.data.goodsId;

    if (currentDay < 0 || !currentTime) {
      self.setData({ toastHidden: false })
      setTimeout(function () { self.setData({ toastHidden: true }) }, 1500)
      return false;
    } else {
      var appInfo = {};
      appInfo.date = date;
      appInfo.time = currentTime;
      appInfo.goodsId = goodsId;

      wx.setStorageSync('appInfo', appInfo);
      wx.navigateTo({
        url: '/page/component/appointmentInfo/appointmentInfo',
      })
    }
  }
})