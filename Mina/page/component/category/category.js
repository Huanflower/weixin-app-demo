// 实例化app.js
var app = getApp();
Page({
    data: {
        category: [
            {name:'果味',id:'guowei'},
            {name:'蔬菜',id:'shucai'},
            {name:'炒货',id:'chaohuo'},
            {name:'点心',id:'dianxin'},
            {name:'粗茶',id:'cucha'},
            {name:'淡饭',id:'danfan'}
        ],
        detail:[],
        curIndex: 0,
        isScroll: true,
        toView: 'guowei',
        server: '',
        tabbarHidden: true,
    },
    onLoad: function() {
      var that = this
      // 获取当前页面链接
      var _curPageArr = getCurrentPages();
      // 获取经过处理的底部导航数据
      var tabBar = app.getTabbarData(_curPageArr);

      // 数据赋值
      this.setData({tabbarList: tabBar })
      
      //加载颜色
      var color = getApp().globalData.color;     
      that.setData({
        color: color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: color
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
    onReady(){
        var self = this;
        var server = getApp().globalData.server;
        self.setData({ server: server })
        getCate(self, 0, 0);
        
    },

    switchTab(e){
      var id = e.target.dataset.id;
      var index = e.target.dataset.index;
      var self = this;
      getCate(self, index, id);
    }
    
})

function getCate(self, index, id) {

  var server = getApp().globalData.server;
  var token = wx.getStorageSync('login_token');
  wx.request({
    url: server + '/index.php/Home/Index/getCate',
    data: {
      cate_id: id,
      token: token
    },
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      console.log(res.data)
      self.setData({
        category: res.data.cateList,
        detail: res.data.result,
        curIndex: index
      })
      console.info(self.data.category);
    }
  });
}