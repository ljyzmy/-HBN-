Page({
  data: {
    memberInfo: {
      avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/请选择.png',
      nickName: '用户昵称',
      memberLevel: '黄金会员',
      memberNo: 'HBN10086',
      joinDate: '2023-01-15',
      experience: 880,
      nextLevel: 1500
    },
    benefits: [
      {
        id: 1,
        name: '专属折扣',
        description: '享受商品85折优惠',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/折扣.png',
        isActive: true
      },
      {
        id: 2,
        name: '生日礼包',
        description: '生日当月获赠精美礼包',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/生日.png',
        isActive: true
      },
      {
        id: 3,
        name: '积分加速',
        description: '购物积分1.5倍加速',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/积分.png',
        isActive: true
      },
      {
        id: 4,
        name: '专属客服',
        description: '享受一对一专属客服服务',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/客服.png',
        isActive: false
      },
      {
        id: 5,
        name: '免费试用',
        description: '新品免费试用机会',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/试用.png',
        isActive: false
      }
    ],
    memberLevels: [
      { level: '普通会员', threshold: 0, icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/会员图标/普通会员.png' },
      { level: '黄金会员', threshold: 500, icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/会员图标/黄金会员.png' },
      { level: '铂金会员', threshold: 1500, icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/会员图标/铂金会员.png' },
      { level: '钻石会员', threshold: 3000, icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/会员图标/钻石会员.png' }
    ],
    currentLevelIndex: 1 // 默认为黄金会员（索引1）
  },

  onLoad: function(options) {
    // 获取会员信息
    this.fetchMemberInfo();
    
    // 加载云存储图片
    this.loadCloudImages();
  },

  onShow: function() {
    // 页面显示时执行
    // 如果已登录，获取最新用户信息
    if (this.isLoggedIn()) {
      this.getUserInfo();
    }
  },
  
  // 检查是否已登录
  isLoggedIn() {
    const token = wx.getStorageSync('token');
    return !!token;
  },
  
  // 获取用户信息
  getUserInfo() {
    // 这里应该是从服务器获取用户信息，目前使用模拟数据
    // 实际项目中应该通过API请求获取
    console.log('获取用户信息');
  },
  
  // 跳转到个人资料页
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },
  
  // 跳转到登录页
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  
  // 菜单项点击处理
  handleMenuItemClick(e) {
    const item = e.currentTarget.dataset.item;
    if (item.url) {
      if (item.type === 'navigateTo') {
        wx.navigateTo({
          url: item.url
        });
      } else if (item.type === 'switchTab') {
        wx.switchTab({
          url: item.url
        });
      } else {
        wx.navigateTo({
          url: item.url
        });
      }
    }
  },
  
  // 客服按钮事件
  handleContact() {
    console.log('联系客服');
  },
  
  // 会员等级说明
  showLevelInfo() {
    wx.navigateTo({
      url: '/pages/member/level/level'
    });
  },

  /**
   * 获取会员信息
   */
  fetchMemberInfo() {
    // 这里应该是从服务器获取用户会员信息的代码
    // 目前只是模拟数据
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    if (userInfo.nickName) {
      this.setData({
        'memberInfo.nickName': userInfo.nickName,
        'memberInfo.avatarUrl': userInfo.avatarUrl || this.data.memberInfo.avatarUrl
      });
    }
    
    // 根据当前等级更新currentLevelIndex
    const level = this.data.memberInfo.memberLevel;
    const levelIndex = this.data.memberLevels.findIndex(item => item.level === level);
    if (levelIndex !== -1) {
      this.setData({
        currentLevelIndex: levelIndex
      });
    }
  },

  /**
   * 加载云存储图片
   */
  loadCloudImages() {
    // 会员等级图标
    const memberLevels = this.data.memberLevels;
    memberLevels.forEach((item, index) => {
      wx.cloud.getTempFileURL({
        fileList: [item.icon],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `memberLevels[${index}].icon`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });

    // 会员权益图标
    const benefits = this.data.benefits;
    benefits.forEach((item, index) => {
      wx.cloud.getTempFileURL({
        fileList: [item.icon],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `benefits[${index}].icon`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });
  },

  /**
   * 查看会员权益详情
   */
  viewBenefitDetail(e) {
    const id = e.currentTarget.dataset.id;
    const benefit = this.data.benefits.find(item => item.id === id);
    
    if (benefit) {
      wx.showModal({
        title: benefit.name,
        content: benefit.description,
        showCancel: false
      });
    }
  },

  /**
   * 跳转到成长值历史页面
   */
  goToExperienceHistory() {
    wx.navigateTo({
      url: '/pages/member/experience/experience',
      fail: (err) => {
        console.error('跳转成长值历史页面失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到会员规则页面
   */
  goToMemberRules() {
    wx.navigateTo({
      url: '/pages/member/rules/rules',
      fail: (err) => {
        console.error('跳转会员规则页面失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  }
}) 