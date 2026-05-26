Page({
  data: {
    order: null,
    formData: {
      rating: 5,  // 默认5星
      content: '',
      images: [],
      anonymity: false, // 是否匿名评价
      tags: []
    },
    maxUpload: 5,
    imageUrls: [],
    statusBarHeight: 0,
    navHeight: 0,
    tagOptions: [
      '商品质量好',
      '物流很快',
      '包装完好',
      '服务态度好',
      '商品很好用',
      '效果明显',
      '性价比高',
      '成分温和'
    ],
    selectedTags: []
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
   * 设置评分
   */
  setRating: function(e) {
    const rating = parseInt(e.currentTarget.dataset.rating);
    this.setData({
      'formData.rating': rating
    });
  },

  /**
   * 输入评价内容
   */
  inputContent: function(e) {
    this.setData({
      'formData.content': e.detail.value
    });
  },

  /**
   * 切换匿名评价
   */
  toggleAnonymity: function() {
    this.setData({
      'formData.anonymity': !this.data.formData.anonymity
    });
  },

  /**
   * 选择/取消选择标签
   */
  toggleTag: function(e) {
    const tag = e.currentTarget.dataset.tag;
    const selectedTags = [...this.data.selectedTags];
    const index = selectedTags.indexOf(tag);
    
    if (index > -1) {
      // 如果已选中，则取消选择
      selectedTags.splice(index, 1);
    } else {
      // 如果未选中，则添加到已选标签中
      selectedTags.push(tag);
    }
    
    this.setData({
      selectedTags: selectedTags,
      'formData.tags': selectedTags
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
   * 提交评价
   */
  submitRating: function() {
    const { formData, order, imageUrls } = this.data;
    
    // 表单验证
    if (!formData.content.trim()) {
      wx.showToast({
        title: '请填写评价内容',
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
      
      // 更新订单状态 - 添加评价信息
      const orderList = wx.getStorageSync('orderList') || [];
      const updatedOrders = orderList.map(o => {
        if (o.orderId === order.orderId) {
          o.review = {
            rating: formData.rating,
            content: formData.content,
            images: imageUrls,
            anonymity: formData.anonymity,
            tags: formData.tags,
            time: this.formatDate(new Date())
          };
          o.hasReviewed = true;
        }
        return o;
      });
      
      // 更新存储
      wx.setStorageSync('orderList', updatedOrders);
      
      // 显示成功提示
      wx.showToast({
        title: '评价提交成功',
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