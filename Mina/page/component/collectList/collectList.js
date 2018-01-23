// page/component/new-pages/cart/cart.js
Page({
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    server: '',
    toastHidden: true,
  },
  onShow() {
    var server = getApp().globalData.server;
    var token = wx.getStorageSync('login_token');
    var that = this;

    that.setData({ server: server })


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
      url: server + '/index.php/Home/Index/getCollectList',
      data: {
        token: token,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        var res = res;
        that.setData({
          carts: res.data.cartList,
          hasList: res.data.success
        })
      }
    })
    /*this.setData({
      
      carts:[
        {id:1,title:'新鲜芹菜 半斤',image:'/image/s5.png',num:4,price:0.01,selected:true},
      ]
    });*/
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var self = this;
    var token = wx.getStorageSync('login_token');
    var server = this.data.server;
    const index = e.currentTarget.dataset.index;

    changeCart(self, index, token, 'one', server);
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 清空购物车
   * 
  */
  clearCart(e) {
    var self = this;
    var token = wx.getStorageSync('login_token');
    var server = this.data.server;
    var cartsGoods = [];
    var carts = self.data.carts;
    var j = 0;

    for (var i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      console.info(carts[i].selected);
      if (carts[i].selected) {                     // 判断商品是否选中
        cartsGoods[j] = carts[i];
        j++;
      }
    }

    if (cartsGoods.length <= 0) {
      self.setData({ toastHidden: false })
      setTimeout(function () { self.setData({ toastHidden: true }) }, 1500)
      return false;
    }

    wx.showModal({
      title: '提示',
      content: '您确定要清空收藏？',
      success: function (res) {
        if (res.confirm) {
          changeCart(self, 0, token, 'all', server);
        }
      }
    })

  },
})

function changeCart(self, index, token, change_type, server) {
  let carts = self.data.carts;
  let id = carts[index].id;

  wx.request({
    url: server + '/index.php/Home/Index/saveCollect',
    data: {
      id: id,
      token: token,
      change_type: change_type                                                                                                                                                                                     
    },
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      if (res.data.success) {
        if (change_type == 'all') {
          self.setData({
            hasList: false
          });
          return false;
        } else if (change_type == 'one') {
          carts.splice(index, 1);
          self.setData({
            carts: carts
          });
          if (!carts.length) {
            self.setData({
              hasList: false
            });
            return false;
          }
        } else {
          carts[index].num = num;
          self.setData({
            carts: carts
          });
        }
      }
    }
  });
}