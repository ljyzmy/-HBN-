Page({
  data: {
    orderInfo: null,
    navTransparent: true, // 导航栏透明状态
    statusBarHeight: 0, // 状态栏高度
    // 添加推荐商品数据
    recommendList: [
      { 
        id: 102, 
        title: 'HBN发光水α-熊果苷精粹水提亮肤色保湿爽肤水', 
        price: 119.00, 
        originalPrice: 163.00, 
        discount: 7.3, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/经典版发光水.png' 
      },
      { 
        id: 103, 
        title: 'HBN视黄醇精华乳2.0双a醇乳液紧致抗皱', 
        price: 189.00, 
        originalPrice: 262.00, 
        discount: 7.2, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/双A醇精华乳.png' 
      },
      { 
        id: 104, 
        title: 'HBN咖啡因眼霜3.0淡细纹焕亮眼周保湿眼霜', 
        price: 279.00, 
        originalPrice: 422.00, 
        discount: 6.6, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/咖啡因眼霜.png' 
      },
      { 
        id: 101, 
        title: 'HBN早C晚A套装2.0水乳套装提亮去黄补水紧致', 
        price: 288.00, 
        originalPrice: 429.00, 
        discount: 6.7, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合.png' 
      }
    ]
  },
  
  onLoad: function(options) {
    // 获取系统信息设置状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navTransparent: true // 初始化为透明
    });
    
    // 获取订单信息，如果有的话
    if (options.orderNumber) {
      // 通过订单号从本地存储获取订单详情
      this.loadOrderByNumber(options.orderNumber);
    } else if (options.orderInfo) {
      try {
        const orderInfo = JSON.parse(decodeURIComponent(options.orderInfo));
        this.setData({ orderInfo });
      } catch (e) {
        console.error('解析订单信息失败:', e);
        this.setData({
          orderInfo: this.getDefaultOrderInfo()
        });
      }
    } else {
      // 没有订单信息时显示默认数据
      this.setData({
        orderInfo: this.getDefaultOrderInfo()
      });
    }
  },
  
  // 根据订单号从本地存储加载订单信息
  loadOrderByNumber: function(orderNumber) {
    // 从本地存储获取订单列表
    const orderList = wx.getStorageSync('orderList') || [];
    
    // 查找匹配的订单
    const order = orderList.find(item => item.orderNumber === orderNumber);
    
    if (order) {
      this.setData({ orderInfo: order });
    } else {
      console.error('未找到对应的订单:', orderNumber);
      this.setData({
        orderInfo: this.getDefaultOrderInfo()
      });
    }
  },
  
  // 生成默认订单信息（仅用于显示示例）
  getDefaultOrderInfo: function() {
    return {
      orderNumber: 'HBN8672889076',
      totalAmount: 368.00,
      payTime: '2025-05-31 14:28:09',
      payMethod: '微信支付',
      expressType: '快递',
      expressPrice: 0,
      message: '请尽快发货，谢谢！',
      address: {
        name: '张三',
        phone: '138****1234',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区8栋501室'
      }
    };
  },
  
  onReady: function() {
    // 获取视频上下文
    this.videoContext = wx.createVideoContext('bgVideo');
  },
  
  onShow: function() {
    // 确保视频播放
    if (this.videoContext) {
      this.videoContext.play();
    }
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1,
      fail: function() {
        // 如果返回失败，可能是从支付页面直接跳转过来的，没有上一页
        // 这时跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    });
  },
  
  // 页面滚动事件处理
  onPageScroll: function(e) {
    // 滚动超过100px时，导航栏变为不透明
    const isTransparent = e.scrollTop < 100;
    if (this.data.navTransparent !== isTransparent) {
      this.setData({
        navTransparent: isTransparent
      });
    }
  },
  
  // 查看订单详情
  viewOrderDetails: function() {
    // 如果有订单ID则跳转到对应订单详情
    if (this.data.orderInfo && this.data.orderInfo.orderId) {
      wx.navigateTo({
        url: '/pages/order/detail?id=' + this.data.orderInfo.orderId
      });
    } else {
      // 没有订单ID则跳转到订单列表
      wx.navigateTo({
        url: '/pages/order/list'
      });
    }
  },
  
  // 继续购物
  continueShopping: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  
  // 跳转到推荐商品详情
  goToProduct: function(e) {
    const id = e.currentTarget.dataset.id;
    
    // 根据不同商品ID跳转到对应页面
    if (id === 101) {
      wx.navigateTo({
        url: '/pages/detail1/detail1'
      });
    } else if (id === 102) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=2'
      });
    } else if (id === 104) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=3'
      });
    } else {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    }
  }
}) 