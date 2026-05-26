Page({
  data: {
    order: null,
    afterSaleTypes: [
      { id: 'refund', name: '仅退款（未收到货）' },
      { id: 'return_refund', name: '退货退款' },
      { id: 'exchange', name: '换货' }
    ],
    reasonTypes: [
      '商品质量问题',
      '商品与描述不符',
      '收到商品破损',
      '商品错发/漏发',
      '商品性能/功能不良',
      '不喜欢/不想要了',
      '其他原因'
    ],
    formData: {
      type: 'refund',
      reason: '',
      description: '',
      images: []
    },
    maxUpload: 5,
    imageUrls: [],
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
    
    if (order) {
      this.setData({ order });
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
   * 选择售后类型
   */
  selectType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      'formData.type': type
    });
  },

  /**
   * 选择原因
   */
  selectReason: function(e) {
    const reason = e.detail.value;
    this.setData({
      'formData.reason': this.data.reasonTypes[reason]
    });
  },

  /**
   * 输入描述
   */
  inputDescription: function(e) {
    this.setData({
      'formData.description': e.detail.value
    });
  },

  /**
   * 上传图片
   */
  uploadImage: function() {
    const { imageUrls, maxUpload } = this.data;
    
    if (imageUrls.length >= maxUpload) {
      wx.showToast({
        title: `最多上传${maxUpload}张图片`,
        icon: 'none'
      });
      return;
    }
    
    wx.chooseImage({
      count: maxUpload - imageUrls.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 模拟上传，实际项目中应该调用云函数上传
        const tempFilePaths = res.tempFilePaths;
        
        this.setData({
          imageUrls: [...imageUrls, ...tempFilePaths]
        });
      }
    });
  },

  /**
   * 删除图片
   */
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const imageUrls = this.data.imageUrls;
    imageUrls.splice(index, 1);
    this.setData({ imageUrls });
  },

  /**
   * 预览图片
   */
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const imageUrls = this.data.imageUrls;
    
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    });
  },

  /**
   * 提交售后申请
   */
  submitAfterSale: function() {
    const { formData, order, imageUrls } = this.data;
    
    // 表单验证
    if (!formData.reason) {
      wx.showToast({
        title: '请选择退款原因',
        icon: 'none'
      });
      return;
    }
    
    if (!formData.description.trim()) {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none'
      });
      return;
    }
    
    // 显示加载中
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    
    // 模拟提交过程，实际项目中应调用云函数
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新订单状态
      const orderList = wx.getStorageSync('orderList') || [];
      const updatedOrders = orderList.map(o => {
        if (o.orderId === order.orderId) {
          o.status = 'afterSale';
          o.statusText = '售后中';
          o.afterSale = {
            type: formData.type,
            reason: formData.reason,
            description: formData.description,
            images: imageUrls,
            applyTime: this.formatDate(new Date()),
            status: 'pending',
            statusText: '处理中'
          };
        }
        return o;
      });
      
      // 更新存储
      wx.setStorageSync('orderList', updatedOrders);
      
      // 显示成功提示
      wx.showToast({
        title: '申请提交成功',
        icon: 'success'
      });
      
      // 返回订单列表
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1500);
    }, 1000);
  },

  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
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
  }
}) 