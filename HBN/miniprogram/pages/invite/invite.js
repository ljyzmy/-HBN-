// pages/invite/invite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 邀请信息
    inviteInfo: {
      title: 'HBN护肤品邀请您加入',
      desc: '让"真功效"名副其实，专研成分，对抗肌肤老化',
      code: 'HBN123456', // 邀请码
      qrCodeUrl: '', // 二维码图片，将动态生成
      shareImage: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/分享底图.jpg'
    },
    
    // 邀请奖励信息
    rewards: [
      { id: 1, name: '邀请1位好友', reward: '50积分 + 5%优惠券', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/优惠券.png' },
      { id: 2, name: '邀请5位好友', reward: '300积分 + 10%优惠券', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/优惠券.png' },
      { id: 3, name: '邀请10位好友', reward: '800积分 + 礼品卡', icon: '	cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/礼品卡.png' }
    ],
    
    // 邀请记录
    inviteRecords: [
      { id: 1, avatar: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/头像/职场精英女性.jpg', name: '李小姐', time: '2023-05-15', reward: '50积分' },
      { id: 2, avatar: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/头像/都市新锐青年.webp', name: '王先生', time: '2023-05-10', reward: '50积分' },
      { id: 3, avatar: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/头像/科研工作者.jpeg', name: '张教授', time: '2023-05-05', reward: '50积分' }
    ],
    
    // 统计数据
    statistics: {
      totalInvites: 3,
      totalPoints: 150,
      totalCoupons: 3
    },
    
    // 是否显示邀请规则
    showRules: false,
    
    // 邀请规则
    rules: [
      '1. 每成功邀请1位好友注册，您将获得50积分奖励',
      '2. 好友必须是首次注册HBN小程序',
      '3. 好友需在注册时输入您的邀请码',
      '4. 好友完成首次购物后，您将额外获得5%优惠券',
      '5. 邀请奖励将在好友注册成功后24小时内发放',
      '6. 如发现恶意刷取奖励行为，HBN有权取消相关奖励',
      '7. 活动最终解释权归HBN所有'
    ],
    
    // 是否正在生成二维码
    isGeneratingQrCode: false,
    
    // 模拟二维码图片
    mockQrCodeList: [
      'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/二维码/燃尽了吗.........哈吉米！！！.png',
      'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/二维码/燃尽了吗.........哈吉米！！！ (1).png',
      'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/二维码/燃尽了吗.........哈吉米！！！ (2).png',
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 生成邀请码
    this.generateInviteCode();
    
    // 加载云存储图片（除二维码外）
    this.loadCloudImages();
    
    // 生成二维码
    this.generateQrCode();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 加载云存储图片
   */
  loadCloudImages() {
    // 加载分享背景图
    wx.cloud.getTempFileURL({
      fileList: [this.data.inviteInfo.shareImage],
      success: res => {
        if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
          this.setData({
            'inviteInfo.shareImage': res.fileList[0].tempFileURL
          });
        }
      }
    });
    
    // 加载奖励图标
    this.data.rewards.forEach((reward, index) => {
      wx.cloud.getTempFileURL({
        fileList: [reward.icon],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `rewards[${index}].icon`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });
    
    // 加载邀请记录头像
    this.data.inviteRecords.forEach((record, index) => {
      wx.cloud.getTempFileURL({
        fileList: [record.avatar],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `inviteRecords[${index}].avatar`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });
  },
  
  /**
   * 生成邀请码
   */
  generateInviteCode() {
    // 实际项目中，应该从服务器获取唯一的邀请码
    // 这里仅作示例，生成一个随机码
    const userInfo = wx.getStorageSync('userInfo') || {};
    const timestamp = Date.now().toString().slice(-6);
    const randomCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const inviteCode = `HBN${timestamp}${randomCode}`;
    
    this.setData({
      'inviteInfo.code': inviteCode
    });
  },
  
  /**
   * 生成小程序码
   */
  generateQrCode() {
    this.setData({
      isGeneratingQrCode: true
    });
    
    wx.showLoading({
      title: '生成二维码...',
      mask: true
    });
    
    // 调用云函数生成带参数的小程序码
    // 将邀请码作为参数传递
    const pagePath = `pages/index/index?inviter=${this.data.inviteInfo.code}`;
    
    wx.cloud.callFunction({
      name: 'genMpQrcode',
      data: {
        pagePath: pagePath
      }
    }).then(res => {
      console.log('云函数完整返回结果:', JSON.stringify(res.result));
      const result = res.result;
      
      if (!result || result.code !== 0) {
        throw new Error(result && result.message ? result.message : '生成二维码失败');
      }
      
      // 获取临时访问URL
      return wx.cloud.getTempFileURL({
        fileList: [result.fileID]
      });
    }).then(res => {
      if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
        this.setData({
          'inviteInfo.qrCodeUrl': res.fileList[0].tempFileURL,
          isGeneratingQrCode: false
        });
      }
      wx.hideLoading();
    }).catch(err => {
      console.error('生成二维码失败:', err);
      console.error('错误详情:', JSON.stringify(err));
      this.setData({
        isGeneratingQrCode: false
      });
      wx.hideLoading();
      wx.showToast({
        title: '二维码生成失败',
        icon: 'none'
      });
    });
  },
  
  /**
   * 复制邀请码
   */
  copyInviteCode() {
    wx.setClipboardData({
      data: this.data.inviteInfo.code,
      success: () => {
        wx.showToast({
          title: '邀请码已复制',
          icon: 'success'
        });
      }
    });
  },
  
  /**
   * 保存二维码到相册
   */
  saveQrCode() {
    if (!this.data.inviteInfo.qrCodeUrl) {
      wx.showToast({
        title: '二维码未生成',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '保存中...',
    });
    
    wx.downloadFile({
      url: this.data.inviteInfo.qrCodeUrl,
      success: res => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: err => {
              wx.hideLoading();
              console.error('保存图片失败:', err);
              // 如果是因为用户拒绝授权导致的失败，引导用户开启授权
              if (err.errMsg.indexOf('auth deny') >= 0) {
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存图片到相册',
                  confirmText: '去授权',
                  success: modalRes => {
                    if (modalRes.confirm) {
                      wx.openSetting();
                    }
                  }
                });
              } else {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                });
              }
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '下载图片失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载图片失败',
          icon: 'none'
        });
      }
    });
  },
  
  /**
   * 显示/隐藏邀请规则
   */
  toggleRules() {
    this.setData({
      showRules: !this.data.showRules
    });
  },
  
  /**
   * 分享给好友
   */
  onShareAppMessage() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const nickName = userInfo.nickName || 'HBN用户';
    
    return {
      title: `${nickName}邀请您加入HBN，领取新人礼包！`,
      path: `/pages/index/index?inviter=${this.data.inviteInfo.code}`,
      imageUrl: this.data.inviteInfo.shareImage
    };
  },
  
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '邀请好友加入HBN，双方都可获得豪华奖励！',
      query: `inviter=${this.data.inviteInfo.code}`
    };
  }
}) 