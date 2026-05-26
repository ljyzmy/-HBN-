Page({
  data: {
    currentTab: 'all', // 当前选中的标签
    orderList: [], // 订单列表
    filteredOrders: [], // 筛选后的订单
    isLoading: true, // 加载状态
    tabs: [
      { id: 'all', name: '全部' },
      { id: 'unpaid', name: '待付款' },
      { id: 'unshipped', name: '待发货' },
      { id: 'shipped', name: '待收货' },
      { id: 'completed', name: '已完成' },
      { id: 'afterSale', name: '售后' }
    ],
    // 自定义导航栏相关
    statusBarHeight: 0,
    navHeight: 0,
    navBottom: 0,
    noOrder: false, // 是否没有订单
    screenWidth: 375, // 默认屏幕宽度
    isRefreshing: false, // 是否正在刷新
  },

  onLoad: function(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navHeight: systemInfo.statusBarHeight + 44,
      screenWidth: systemInfo.windowWidth,
    });

    // 设置默认选中的标签
    if (options.status && options.status !== 'all') {
      this.setData({
        currentTab: options.status
      });
    }

    // 加载订单数据
    this.loadOrderData();
  },

  onShow: function() {
    // 每次页面显示时重新加载订单数据，确保显示最新订单
    this.loadOrderData();
  },

  onPullDownRefresh: function() {
    // 下拉刷新
    this.setData({
      isRefreshing: true
    });
    this.loadOrderData(() => {
      wx.stopPullDownRefresh();
      this.setData({
        isRefreshing: false
      });
    });
  },

  /**
   * 加载订单数据
   */
  loadOrderData: function(callback) {
    // 显示加载中
    this.setData({
      isLoading: true
    });

    // 从本地存储获取订单数据
    let orderList = wx.getStorageSync('orderList') || [];

    // 如果没有订单数据，创建一些示例订单数据
    if (orderList.length === 0) {
      orderList = this.generateSampleOrders();
      wx.setStorageSync('orderList', orderList);
    }

    // 添加创建时间和状态显示文本
    orderList.forEach(order => {
      // 确保订单状态显示文本
      if (!order.statusText) {
        order.statusText = this.getStatusText(order.status);
      }
      
      // 确保有创建时间
      if (!order.createTime) {
        order.createTime = order.payTime || this.formatDate(new Date(parseInt(order.orderId.replace('ORDER', ''))));
      }
    });

    // 对订单按时间倒序排序（最新订单在前）
    orderList.sort((a, b) => {
      return new Date(b.createTime) - new Date(a.createTime);
    });

    // 更新数据
    this.setData({
      orderList: orderList,
      isLoading: false,
      noOrder: orderList.length === 0
    });

    // 根据当前选中的标签筛选订单
    this.filterOrders();

    // 执行回调函数
    if (callback && typeof callback === 'function') {
      callback();
    }
  },

  /**
   * 根据标签筛选订单
   */
  filterOrders: function() {
    const { orderList, currentTab } = this.data;
    let filteredOrders = [];

    if (currentTab === 'all') {
      filteredOrders = orderList;
    } else {
      filteredOrders = orderList.filter(order => order.status === currentTab);
    }

    this.setData({
      filteredOrders: filteredOrders,
      noOrder: filteredOrders.length === 0
    });
  },

  /**
   * 切换标签
   */
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.id;
    this.setData({
      currentTab: tab
    });
    this.filterOrders();
  },

  /**
   * 查看订单详情
   */
  viewOrderDetail: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/detail?id=${orderId}`
    });
  },

  /**
   * 取消订单
   */
  cancelOrder: function(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 更新本地订单状态
          const orderList = this.data.orderList.map(order => {
            if (order.orderId === orderId) {
              order.status = 'canceled';
              order.statusText = '已取消';
              order.cancelTime = this.formatDate(new Date());
            }
            return order;
          });
          
          // 更新存储和页面数据
          wx.setStorageSync('orderList', orderList);
          this.setData({
            orderList: orderList
          });
          
          // 重新筛选显示订单
          this.filterOrders();
          
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 去支付
   */
  goToPay: function(e) {
    const orderId = e.currentTarget.dataset.id;
    const order = this.data.orderList.find(o => o.orderId === orderId);
    
    if (!order) return;
    
    wx.showModal({
      title: '确认付款',
      content: `您即将支付 ¥${order.totalAmount}，确认付款吗？`,
      confirmText: '确认支付',
      confirmColor: '#A64036',
      success: (res) => {
        if (res.confirm) {
          // 显示支付中的加载动画
          wx.showLoading({
            title: '支付处理中...',
            mask: true
          });
          
          // 模拟支付过程，1.5秒后更新订单状态
          setTimeout(() => {
            wx.hideLoading();
            
            // 更新订单状态
            const orderList = this.data.orderList.map(o => {
              if (o.orderId === orderId) {
                o.status = 'unshipped';
                o.statusText = '待发货';
                o.payTime = this.formatDate(new Date());
              }
              return o;
            });
            
            // 更新存储和页面数据
            wx.setStorageSync('orderList', orderList);
            this.setData({
              orderList: orderList
            });
            
            // 重新筛选显示订单
            this.filterOrders();
            
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  /**
   * 确认收货
   */
  confirmReceive: function(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确认已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          // 更新订单状态
          const orderList = this.data.orderList.map(order => {
            if (order.orderId === orderId) {
              order.status = 'completed';
              order.statusText = '已完成';
              order.completeTime = this.formatDate(new Date());
            }
            return order;
          });
          
          // 更新存储和页面数据
          wx.setStorageSync('orderList', orderList);
          this.setData({
            orderList: orderList
          });
          
          // 重新筛选显示订单
          this.filterOrders();
          
          wx.showToast({
            title: '已确认收货',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 申请售后
   */
  applyAfterSale: function(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/after-sale/apply?id=${orderId}`
    });
  },

  /**
   * 查看物流
   */
  viewLogistics: function(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/logistics/detail?id=${orderId}`
    });
  },

  /**
   * 去评价
   */
  goToRate: function(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/rate/index?id=${orderId}`
    });
  },

  /**
   * 根据订单状态获取状态文本
   */
  getStatusText: function(status) {
    switch (status) {
      case 'unpaid':
        return '待付款';
      case 'unshipped':
        return '待发货';
      case 'shipped':
        return '待收货';
      case 'completed':
        return '已完成';
      case 'canceled':
        return '已取消';
      case 'afterSale':
        return '售后中';
      default:
        return '未知状态';
    }
  },

  /**
   * 格式化日期
   */
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  /**
   * 生成示例订单数据
   */
  generateSampleOrders: function() {
    const now = new Date();
    
    return [
      {
        orderId: 'ORDER' + (Date.now() - 3600000 * 24 * 2),
        orderNumber: 'HBN' + (Date.now() - 3600000 * 24 * 2).toString().substring(3),
        totalAmount: 119.00,
        createTime: this.formatDate(new Date(now - 3600000 * 24 * 2)),
        payTime: this.formatDate(new Date(now - 3600000 * 24 * 2)),
        payMethod: '微信支付',
        status: 'shipped',
        statusText: '待收货',
        estimateDeliveryTime: this.formatDate(new Date(now.getTime() + 24 * 60 * 60 * 1000)),
        logistics: {
          company: '顺丰速运',
          number: 'SF' + Math.floor(Math.random() * 10000000000)
        },
        product: {
          id: 2,
          name: 'HBN发光水α-熊果苷精粹水2.0提亮保湿爽肤水湿敷水',
          image: 'https://www.hbn.cn/assets/1-Bsqoo_S0.png',
          price: 119.00,
          quantity: 1,
          specs: {
            '规格': '经典版',
            '净含量': '150ml赠水乳体验礼'
          }
        }
      },
      {
        orderId: 'ORDER' + (Date.now() - 3600000 * 24 * 5),
        orderNumber: 'HBN' + (Date.now() - 3600000 * 24 * 5).toString().substring(3),
        totalAmount: 189.00,
        createTime: this.formatDate(new Date(now - 3600000 * 24 * 5)),
        payTime: this.formatDate(new Date(now - 3600000 * 24 * 5)),
        payMethod: '微信支付',
        status: 'completed',
        statusText: '已完成',
        logistics: {
          company: '中通快递',
          number: 'ZT' + Math.floor(Math.random() * 10000000000)
        },
        completeTime: this.formatDate(new Date(now - 3600000 * 24 * 2)),
        product: {
          id: 1,
          name: 'HBN视黄醇精华乳2.0双a醇乳液紧致抗皱焕亮',
          image: 'https://www.hbn.cn/assets/1-BZbFkdFc.png',
          price: 189.00,
          quantity: 1,
          specs: {
            '规格': '标准装',
            '净含量': '120ml双A乳'
          }
        }
      },
      {
        orderId: 'ORDER' + (Date.now() - 3600000 * 24 * 0.5),
        orderNumber: 'HBN' + (Date.now() - 3600000 * 24 * 0.5).toString().substring(3),
        totalAmount: 279.00,
        createTime: this.formatDate(new Date(now - 3600000 * 24 * 0.5)),
        status: 'unpaid',
        statusText: '待付款',
        product: {
          id: 3,
          name: 'HBN视黄醇精华乳2.0',
          image: 'https://www.hbn.cn/assets/3-BxE2s-DI.png',
          price: 279.00,
          quantity: 1,
          specs: {
            '规格': '突破性升级【咖啡因眼霜3.0】',
            '净含量': '15g一瓶罐'
          }
        },
        // 待付款订单显示剩余支付时间
        remainPayTime: '23:45:30'
      },
      {
        orderId: 'ORDER' + (Date.now() - 3600000 * 24 * 3),
        orderNumber: 'HBN' + (Date.now() - 3600000 * 24 * 3).toString().substring(3),
        totalAmount: 408.00,
        createTime: this.formatDate(new Date(now - 3600000 * 24 * 3)),
        payTime: this.formatDate(new Date(now - 3600000 * 24 * 3)),
        payMethod: '微信支付',
        status: 'unshipped',
        statusText: '待发货',
        product: {
          id: 1,
          name: 'HBN视黄醇精华乳2.0双a醇乳液紧致抗皱焕亮',
          image: 'https://www.hbn.cn/assets/1-BZbFkdFc.png',
          price: 408.00,
          quantity: 1,
          specs: {
            '规格': '标准装',
            '净含量': '210ml双A乳120ml+原白乳90ml'
          }
        }
      }
    ];
  },

  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  },
  
  /**
   * 阻止滑动穿透
   */
  preventTouchMove: function() {
    return false;
  },
  
  /**
   * 空白处理
   */
  goToShop: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}) 