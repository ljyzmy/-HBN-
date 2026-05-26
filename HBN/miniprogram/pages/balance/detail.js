Page({
  data: {
    transaction: null,
    loading: true,
    statusBarHeight: 20, // 默认值
    navBarHeight: 44 // 默认值
  },
  
  onLoad: function(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });

    const eventChannel = this.getOpenerEventChannel();
    
    // 监听acceptTransactionData事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptTransactionData', (data) => {
      this.setData({
        transaction: data.transaction,
        loading: false
      });
    });
    
    // 如果没有通过eventChannel传递数据，则通过id查询
    if (options.id && !this.data.transaction) {
      // 这里应该是从服务器获取数据
      // 目前使用模拟数据
      this.mockLoadTransaction(options.id);
    }
  },
  
  // 模拟加载交易数据
  mockLoadTransaction: function(id) {
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    
    // 模拟网络请求延迟
    setTimeout(() => {
      const transaction = {
        id: id,
        type: 1, // 默认值
        amount: 100.00,
        date: '2025-05-27 14:22:35',
        status: 1,
        desc: '余额充值',
        payMethod: '微信支付',
        orderNo: '',
        // 添加一些额外详情
        transactionNo: 'HBN' + id.substring(1),
        remark: '无',
        operator: '本人操作',
        payAccount: '微信支付(尾号1234)',
        receiveAccount: 'HBN账户余额'
      };
      
      this.setData({
        transaction: transaction,
        loading: false
      });
      
      wx.hideLoading();
    }, 500);
  },
  
  // 获取交易类型文本
  getTransactionTypeText(type) {
    switch (type) {
      case 1:
        return '充值';
      case 2:
        return '消费';
      case 3:
        return '退款';
      case 4:
        return '提现';
      default:
        return '交易';
    }
  },
  
  // 获取交易状态文本
  getTransactionStatusText(status) {
    switch (status) {
      case 1:
        return '交易成功';
      case 2:
        return '处理中';
      case 3:
        return '交易失败';
      default:
        return '未知状态';
    }
  },
  
  // 分享当前交易信息
  onShareAppMessage: function() {
    return {
      title: `HBN美妆-${this.getTransactionTypeText(this.data.transaction.type)}记录`,
      path: `/pages/balance/detail?id=${this.data.transaction.id}`
    };
  },
  
  // 复制交易号
  copyTransactionNo: function() {
    if (this.data.transaction) {
      wx.setClipboardData({
        data: this.data.transaction.id,
        success: function() {
          wx.showToast({
            title: '交易号已复制',
            icon: 'success'
          });
        }
      });
    }
  },
  
  // 查看关联订单
  viewRelatedOrder: function() {
    if (this.data.transaction && this.data.transaction.orderNo) {
      wx.navigateTo({
        url: `/pages/order/detail?orderNo=${this.data.transaction.orderNo}`
      });
    }
  },
  
  // 联系客服
  contactService: function() {
    wx.navigateTo({
      url: '/pages/service/service'
    });
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  }
}) 