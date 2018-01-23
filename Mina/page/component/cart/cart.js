// page/component/new-pages/cart/cart.js
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    server: '',
    toastHidden: true,
  },
  onShow() {
    var server = getApp().globalData.server;
    var token = wx.getStorageSync('login_token');
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
    
    that.setData({ server: server })
    
    // 获取页面初始数据
    wx.request({
      url: server + '/index.php/Home/Index/getCartList',
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

        that.getTotalPrice();
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
    this.getTotalPrice();
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
   * 绑定加数量事件
   */
  addCount(e) {
    var self = this;
    var token = wx.getStorageSync('login_token');
    var server = this.data.server;
    const index = e.currentTarget.dataset.index;

    changeCart(self, index, token, 'add', server);
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    var self = this;
    var token = wx.getStorageSync('login_token');
    var server = this.data.server;
    const index = e.currentTarget.dataset.index;
    
    changeCart(self, index, token, 'del', server);
  },

  /**
   * 清空购物车
   * 
  */
  clearCart(e) {
    var self = this;
    var token = wx.getStorageSync('login_token');
    var server = this.data.server;

    wx.showModal({
      title: '提示',
      content: '您确定要清空购物车？',
      success: function(res) {
        if (res.confirm) {
          changeCart(self, 0, token, 'all', server);
        }
      }
    })
    
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += parseInt(carts[i].num) * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                           // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  /**
   * 保存已选择购物车产品，跳转到订单页儿 
   * 
   */
  toOrder(e) {
    var that = this;
    var carts = that.data.carts;
    var cartsGoods = [];
    var j = 0;

    for (var i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      console.info(carts[i].selected);
      if (carts[i].selected) {                     // 判断商品是否选中
        console.info(carts[i]);
        cartsGoods[j] = carts[i];
        j ++;
      }
    }

    if (cartsGoods.length <= 0) {
      that.setData({toastHidden: false})
      setTimeout(function() {that.setData({toastHidden:true})}, 1500)
      return false;
    }

    wx.setStorageSync('carts', cartsGoods);
    wx.navigateTo({
      url: '../orders/orders',
    })
  }
})

function changeCart(self, index, token, change_type, server) {
  let carts = self.data.carts;
  let num = carts[index].num;
  let id = carts[index].cart_id;
  if (change_type == 'add') {
    num = parseInt(num) + 1;
  } else if (change_type == 'del') {
    if (num <= 1) {
      return false;
    }
    num = num - 1;
  }

  wx.request({
    url: server + '/index.php/Home/Index/changeCart',
    data: {
      id: id,
      token: token,
      num: num,
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
        self.getTotalPrice();
      }
    }
  });
}