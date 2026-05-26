Page({
  data: {
    order: null,
    logisticsInfo: null,
    statusBarHeight: 0,
    navHeight: 0
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
    if (orderId) {
      this.loadOrderData(orderId);
    } else {
      wx.showToast({
        title: '订单信息不存在',
        icon: 'error'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载订单数据
   */
  loadOrderData: function(orderId) {
    // 从本地存储获取订单数据
    const orderList = wx.getStorageSync('orderList') || [];
    const order = orderList.find(o => o.orderId === orderId);
    
    if (order && order.logistics) {
      this.setData({ 
        order: order
      });
      
      // 加载物流信息（模拟数据）
      this.loadLogisticsInfo(order.logistics);
    } else {
      wx.showToast({
        title: '物流信息不存在',
        icon: 'error'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载物流信息（模拟数据）
   */
  loadLogisticsInfo: function(logistics) {
    // 模拟加载中状态
    wx.showLoading({
      title: '加载物流信息...',
      mask: true
    });
    
    // 模拟网络请求延迟
    setTimeout(() => {
      wx.hideLoading();
      
      // 生成模拟物流数据
      const logisticsInfo = this.generateLogisticsInfo(logistics);
      
      this.setData({
        logisticsInfo: logisticsInfo
      });
    }, 1000);
  },

  /**
   * 生成模拟物流信息
   */
  generateLogisticsInfo: function(logistics) {
    const now = new Date();
    let date = new Date(now);
    
    // 模拟物流轨迹
    const tracks = [
      {
        time: this.formatDateTime(date),
        status: '已签收',
        desc: '您的快递已由前台代签收，如有疑问请联系配送员',
        address: '北京市朝阳区阜通东大街6号院3号楼'
      },
      {
        time: this.formatDateTime(new Date(date.setHours(date.getHours() - 2))),
        status: '派送中',
        desc: '快递员正在为您派送，请保持电话畅通',
        address: '北京市朝阳区公司前台（联系电话：17600000000）'
      },
      {
        time: this.formatDateTime(new Date(date.setHours(date.getHours() - 5))),
        status: '运输中',
        desc: '快件已到达【北京朝阳区分拣中心】',
        address: '北京市朝阳区分拣中心'
      },
      {
        time: this.formatDateTime(new Date(date.setHours(date.getHours() - 24))),
        status: '运输中',
        desc: '快件已从【广州分拨中心】发出',
        address: '广州市白云区分拨中心'
      },
      {
        time: this.formatDateTime(new Date(date.setHours(date.getHours() - 12))),
        status: '已揽收',
        desc: '快件已被揽收',
        address: '广州市天河区华南师范大学公共邮箱'
      }
    ];
    
    return {
      company: logistics.company,
      number: logistics.number,
      status: '已签收',
      phone: '95311',
      sendTime: this.formatDateTime(new Date(date.setHours(date.getHours() - 48))),
      tracks: tracks
    };
  },

  /**
   * 复制运单号
   */
  copyTrackingNumber: function() {
    wx.setClipboardData({
      data: this.data.logisticsInfo.number,
      success: () => {
        wx.showToast({
          title: '运单号已复制',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 联系快递公司
   */
  callLogistics: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.logisticsInfo.phone
    });
  },

  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  },

  /**
   * 格式化日期时间
   */
  formatDateTime: function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}) 