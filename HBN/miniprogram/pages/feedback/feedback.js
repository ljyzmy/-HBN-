// pages/feedback/feedback.js
Page({
  data: {
    // 问题类型列表
    problemTypes: [
      { id: 1, name: '商品相关' },
      { id: 2, name: '订单相关' },
      { id: 3, name: '物流相关' },
      { id: 4, name: '售后相关' },
      { id: 5, name: '功能异常' },
      { id: 6, name: '优化建议' },
      { id: 7, name: '其他问题' }
    ],
    
    // 表单数据
    formData: {
      typeId: 0,
      typeName: '',
      content: '',
      contactWay: '',
      images: []
    },
    
    // 图片上传相关
    imageList: [],
    maxImageCount: 4,
    uploadIcon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/上传.png',
    
    // 提交按钮状态
    submitDisabled: true,
    
    // 是否正在提交中
    isSubmitting: false,
    
    // 历史反馈记录
    historyFeedbacks: [],
    showHistory: false
  },
  
  onLoad: function(options) {
    // 页面加载时执行
    this.loadCloudImages();
    
    // 获取用户历史反馈
    this.loadUserFeedbacks();
  },
  
  // 加载云存储图片
  loadCloudImages: function() {
    wx.cloud.getTempFileURL({
      fileList: [this.data.uploadIcon],
      success: res => {
        if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
          this.setData({
            uploadIcon: res.fileList[0].tempFileURL
          });
        }
      }
    });
  },
  
  // 加载用户历史反馈
  loadUserFeedbacks: function() {
    wx.showLoading({
      title: '加载历史记录...'
    });
    
    wx.cloud.callFunction({
      name: 'manageFeedback',
      data: {
        action: 'getFeedbackByUser'
      }
    }).then(res => {
      wx.hideLoading();
      console.log('获取历史反馈成功:', res);
      
      if (res.result && res.result.code === 0 && res.result.data) {
        this.setData({
          historyFeedbacks: res.result.data
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('获取历史反馈失败:', err);
    });
  },
  
  // 选择问题类型
  selectProblemType: function(e) {
    const typeId = parseInt(e.currentTarget.dataset.id);
    const typeName = this.data.problemTypes.find(item => item.id === typeId).name;
    
    this.setData({
      'formData.typeId': typeId,
      'formData.typeName': typeName
    });
    
    this.checkFormValid();
  },
  
  // 输入问题内容
  inputContent: function(e) {
    this.setData({
      'formData.content': e.detail.value
    });
    
    this.checkFormValid();
  },
  
  // 输入联系方式
  inputContactWay: function(e) {
    this.setData({
      'formData.contactWay': e.detail.value
    });
    
    this.checkFormValid();
  },
  
  // 检查表单是否有效
  checkFormValid: function() {
    const { typeId, content } = this.data.formData;
    const isValid = typeId > 0 && content.trim().length >= 5;
    
    this.setData({
      submitDisabled: !isValid
    });
  },
  
  // 选择图片
  chooseImage: function() {
    const { imageList, maxImageCount } = this.data;
    const remainCount = maxImageCount - imageList.length;
    
    if (remainCount <= 0) {
      wx.showToast({
        title: `最多上传${maxImageCount}张图片`,
        icon: 'none'
      });
      return;
    }
    
    wx.chooseImage({
      count: remainCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // 设置图片列表
        const newImageList = [...imageList, ...res.tempFilePaths];
        this.setData({
          imageList: newImageList,
          'formData.images': newImageList
        });
      }
    });
  },
  
  // 预览图片
  previewImage: function(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    });
  },
  
  // 删除图片
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const { imageList } = this.data;
    imageList.splice(index, 1);
    
    this.setData({
      imageList: imageList,
      'formData.images': imageList
    });
  },
  
  // 上传图片到云存储
  uploadImagesToCloud: function(callback) {
    const { imageList } = this.data;
    if (imageList.length === 0) {
      callback([]);
      return;
    }
    
    wx.showLoading({
      title: '上传图片中...',
      mask: true
    });
    
    const uploadTasks = imageList.map((filePath, index) => {
      return new Promise((resolve, reject) => {
        const cloudPath = `feedback/${Date.now()}_${index}.jpg`;
        
        // 上传图片到云存储
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success: res => {
            resolve(res.fileID);
          },
          fail: err => {
            console.error('上传图片失败:', err);
            reject(err);
          }
        });
      });
    });
    
    Promise.all(uploadTasks).then(fileIDs => {
      wx.hideLoading();
      callback(fileIDs);
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '图片上传失败',
        icon: 'none'
      });
      callback([]);
    });
  },
  
  // 提交反馈
  submitFeedback: function() {
    if (this.data.submitDisabled || this.data.isSubmitting) return;
    
    // 设置提交中状态
    this.setData({ isSubmitting: true });
    
    const { typeId, typeName, content, contactWay } = this.data.formData;
    
    // 显示提交中的loading
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    
    // 先上传图片，然后再提交反馈信息
    this.uploadImagesToCloud(fileIDs => {
      // 准备反馈数据
      const feedbackData = {
        typeId,
        typeName,
        content,
        contactWay,
        imageFileIDs: fileIDs
      };
      
      // 调用云函数保存反馈数据
      wx.cloud.callFunction({
        name: 'manageFeedback',
        data: {
          action: 'add',
          data: feedbackData
        }
      }).then(res => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        
        console.log('提交反馈结果:', res);
        
        if (res.result && res.result.code === 0) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
          success: () => {
              // 更新历史记录
              this.loadUserFeedbacks();
              
              // 重置表单
              this.resetForm();
              
              // 延迟返回上一页或保持在当前页
              // setTimeout(() => {
              //   wx.navigateBack();
              // }, 2000);
          }
        });
        } else {
          wx.showModal({
            title: '提交失败',
            content: res.result ? res.result.message : '保存反馈信息失败，请重试',
            showCancel: false
          });
        }
      }).catch(err => {
        wx.hideLoading();
        this.setData({ isSubmitting: false });
        console.error('提交反馈失败:', err);
        
        wx.showModal({
          title: '提交失败',
          content: '网络错误，请重试',
          showCancel: false
        });
      });
    });
  },
  
  // 重置表单
  resetForm: function() {
    this.setData({
      formData: {
        typeId: 0,
        typeName: '',
        content: '',
        contactWay: '',
        images: []
      },
      imageList: [],
      submitDisabled: true
    });
  },
  
  // 查看历史反馈
  toggleHistory: function() {
    this.setData({
      showHistory: !this.data.showHistory
        });
  },
  
  // 查看反馈详情
  viewFeedbackDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const feedback = this.data.historyFeedbacks.find(item => item._id === id);
    
    if (!feedback) return;
    
    wx.showModal({
      title: `${feedback.typeName} - ${this.getStatusText(feedback.status)}`,
      content: `提交时间: ${feedback.createTime}\n\n内容: ${feedback.content}\n\n${feedback.dealResult ? '处理结果: ' + feedback.dealResult : ''}`,
      showCancel: false
    });
  },
  
  // 获取状态文本
  getStatusText: function(status) {
    const statusMap = {
      'pending': '待处理',
      'processing': '处理中',
      'completed': '已完成'
    };
    return statusMap[status] || '未知状态';
  }
}) 