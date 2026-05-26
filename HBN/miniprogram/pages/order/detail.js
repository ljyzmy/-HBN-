Page({
  data: {
    order: null,
    isLoading: true,
    statusBarHeight: 0,
    navHeight: 0,
    // 物流信息（如果展示）
    logisticsVisible: false,
    logistics: {
      status: '运输中', // 物流状态
      statusCode: 1, // 0:揽收中 1:运输中 2:派送中 3:已签收 4:异常
      traces: [] // 物流轨迹
    },
    // 倒计时（待付款订单）
    countdownTime: '',
    timer: null,
    // 售后状态（如果有）
    afterSale: null,
  },

  onLoad: function(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navHeight: systemInfo.statusBarHeight + 44
    });

    // 获取订单ID
    const orderId = options.id;
    if (!orderId) {
      wx.showToast({
        title: '订单信息不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    // 加载订单数据
    this.loadOrderDetail(orderId);
  },

  onShow: function() {
    // 如果有倒计时，重新启动
    if (this.data.order && this.data.order.status === 'unpaid') {
      this.startCountdown();
    }
  },

  onHide: function() {
    // 清除倒计时
    this.clearCountdown();
  },

  onUnload: function() {
    // 清除倒计时
    this.clearCountdown();
  },

  /**
   * 加载订单详情
   */
  loadOrderDetail: function(orderId) {
    this.setData({
      isLoading: true
    });

    // 从本地存储获取订单数据
    const orderList = wx.getStorageSync('orderList') || [];
    const order = orderList.find(item => item.orderId === orderId);

    if (order) {
      // 更新数据
      this.setData({
        order: order,
        isLoading: false
      });

      // 如果是待付款订单，启动倒计时
      if (order.status === 'unpaid') {
        this.startCountdown();
      }

      // 如果订单已发货，加载物流信息
      if (order.status === 'shipped' && order.logistics) {
        this.loadLogistics(order.logistics.company, order.logistics.number);
      }

      // 如果订单在售后中，加载售后信息
      if (order.status === 'afterSale') {
        this.loadAfterSaleInfo(orderId);
      }
    } else {
      wx.showToast({
        title: '订单不存在',
        icon: 'none'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载物流信息（模拟）
   */
  loadLogistics: function(company, number) {
    // 模拟物流信息
    const traces = [
      {
        time: this.formatDateWithoutSeconds(new Date(Date.now() - 1000 * 60 * 60 * 2)),
        content: '【广州市】您的快递已由【广州白云区域】配送员开始配送，请您准备签收',
        status: '派送中'
      },
      {
        time: this.formatDateWithoutSeconds(new Date(Date.now() - 1000 * 60 * 60 * 5)),
        content: '【广州市】快件已抵达【广州白云区域】',
        status: '运输中'
      },
      {
        time: this.formatDateWithoutSeconds(new Date(Date.now() - 1000 * 60 * 60 * 24)),
        content: '【杭州市】快件已从【杭州转运中心】发出',
        status: '运输中'
      },
      {
        time: this.formatDateWithoutSeconds(new Date(Date.now() - 1000 * 60 * 60 * 30)),
        content: '【杭州市】快件已抵达【杭州转运中心】',
        status: '运输中'
      },
      {
        time: this.formatDateWithoutSeconds(new Date(Date.now() - 1000 * 60 * 60 * 36)),
        content: '【上海市】快件已从【上海集散中心】发出',
        status: '运输中'
      },
      {
        time: this.formatDateWithoutSeconds(new Date(Date.now() - 1000 * 60 * 60 * 48)),
        content: '【上海市】快件已由【上海嘉定区】揽收',
        status: '揽收中'
      }
    ];

    this.setData({
      'logistics.traces': traces,
      'logistics.status': '运输中',
      'logistics.statusCode': 1
    });
  },

  /**
   * 加载售后信息（模拟）
   */
  loadAfterSaleInfo: function(orderId) {
    // 模拟售后信息
    const afterSale = {
      id: 'AS' + orderId.substring(5),
      type: '退款',
      reason: '不想要了',
      amount: this.data.order.totalAmount,
      status: '处理中',
      createTime: this.formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2))
    };

    this.setData({
      afterSale: afterSale
    });
  },

  /**
   * 显示物流信息
   */
  showLogistics: function() {
    this.setData({
      logisticsVisible: true
    });
  },

  /**
   * 隐藏物流信息
   */
  hideLogistics: function() {
    this.setData({
      logisticsVisible: false
    });
  },

  /**
   * 阻止滑动穿透
   */
  preventTouchMove: function() {
    return false;
  },
  
  /**
   * 启动倒计时
   */
  startCountdown: function() {
    // 先清除可能存在的倒计时
    this.clearCountdown();

    // 模拟倒计时，假设还剩24小时
    let remainingSeconds = 24 * 60 * 60;
    
    // 如果已有剩余时间，解析它
    if (this.data.order.remainPayTime) {
      const parts = this.data.order.remainPayTime.split(':');
      if (parts.length === 3) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const seconds = parseInt(parts[2]);
        remainingSeconds = hours * 3600 + minutes * 60 + seconds;
      }
    }

    const updateCountdown = () => {
      if (remainingSeconds <= 0) {
        // 倒计时结束，订单自动取消
        this.clearCountdown();
        this.updateOrderStatus('canceled');
        return;
      }

      remainingSeconds--;
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;
      
      this.setData({
        countdownTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      });
    };

    // 立即更新一次
    updateCountdown();
    
    // 设置定时器
    this.data.timer = setInterval(updateCountdown, 1000);
  },

  /**
   * 清除倒计时
   */
  clearCountdown: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({
        timer: null
      });
    }
  },

  /**
   * 更新订单状态
   */
  updateOrderStatus: function(status) {
    if (!this.data.order) return;

    // 获取当前所有订单
    const orderList = wx.getStorageSync('orderList') || [];
    const index = orderList.findIndex(item => item.orderId === this.data.order.orderId);

    if (index === -1) return;

    // 更新状态
    const statusText = this.getStatusText(status);
    orderList[index].status = status;
    orderList[index].statusText = statusText;

    // 根据状态设置相应的时间
    const now = new Date();
    if (status === 'canceled') {
      orderList[index].cancelTime = this.formatDate(now);
    } else if (status === 'completed') {
      orderList[index].completeTime = this.formatDate(now);
    } else if (status === 'unshipped') {
      orderList[index].payTime = this.formatDate(now);
      orderList[index].payMethod = '微信支付';
    } else if (status === 'afterSale') {
      // 创建售后记录
      const afterSale = {
        id: 'AS' + orderList[index].orderId.substring(5),
        type: '退款',
        reason: '不想要了',
        amount: orderList[index].totalAmount,
        status: '处理中',
        createTime: this.formatDate(now)
      };
      orderList[index].afterSale = afterSale;
    }

    // 保存到本地存储
    wx.setStorageSync('orderList', orderList);

    // 更新页面数据
    this.setData({
      'order.status': status,
      'order.statusText': statusText
    });

    if (status === 'canceled') {
      this.setData({
        'order.cancelTime': this.formatDate(now)
      });
    } else if (status === 'completed') {
      this.setData({
        'order.completeTime': this.formatDate(now)
      });
    } else if (status === 'unshipped') {
      this.setData({
        'order.payTime': this.formatDate(now),
        'order.payMethod': '微信支付'
      });
    } else if (status === 'afterSale') {
      this.setData({
        afterSale: {
          id: 'AS' + this.data.order.orderId.substring(5),
          type: '退款',
          reason: '不想要了',
          amount: this.data.order.totalAmount,
          status: '处理中',
          createTime: this.formatDate(now)
        }
      });
    }
  },

  /**
   * 获取状态文本
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
   * 取消订单
   */
  cancelOrder: function() {
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus('canceled');
          // 清除倒计时
          this.clearCountdown();
          
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
  goToPay: function() {
    wx.showModal({
      title: '确认付款',
      content: `您即将支付 ¥${this.data.order.totalAmount}，确认付款吗？`,
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
            this.updateOrderStatus('unshipped');
            
            // 清除倒计时
            this.clearCountdown();
            
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
  confirmReceive: function() {
    wx.showModal({
      title: '提示',
      content: '确认已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          this.updateOrderStatus('completed');
          
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
  applyAfterSale: function() {
    wx.navigateTo({
      url: `/pages/after-sale/apply?id=${this.data.order.orderId}`
    });
  },

  /**
   * 查看物流
   */
  viewLogistics: function() {
    wx.navigateTo({
      url: `/pages/logistics/detail?id=${this.data.order.orderId}`
    });
  },

  /**
   * 去评价
   */
  goToRate: function() {
    wx.navigateTo({
      url: `/pages/rate/index?id=${this.data.order.orderId}`
    });
  },

  /**
   * 复制订单号
   */
  copyOrderNumber: function() {
    wx.setClipboardData({
      data: this.data.order.orderNumber,
      success: () => {
        wx.showToast({
          title: '订单号已复制',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 复制物流单号
   */
  copyTrackingNumber: function() {
    if (this.data.order && this.data.order.logistics && this.data.order.logistics.number) {
      wx.setClipboardData({
        data: this.data.order.logistics.number,
        success: () => {
          wx.showToast({
            title: '物流单号已复制',
            icon: 'success'
          });
        }
      });
    }
  },

  /**
   * 联系客服
   */
  contactCustomerService: function() {
    wx.showToast({
      title: '即将连接客服',
      icon: 'success'
    });
    // 这里可以接入微信客服功能
  },

  /**
   * 格式化日期（含秒）
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
   * 格式化日期（不含秒）
   */
  formatDateWithoutSeconds: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  }
}) 