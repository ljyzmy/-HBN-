Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/请选择.png',
      nickName: '请选择',
    },
    
    // 设置项列表
    settingsList: [
      {
        id: 'account',
        name: '账号与安全',
        items: [
          { id: 'profile', name: '个人资料', url: '/pages/profile/profile', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/个人资料.png' },
          { id: 'password', name: '修改密码', url: '/pages/password/reset', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/icon_修改密码.png' },
          { id: 'bindPhone', name: '绑定手机', url: '/pages/bindPhone/bindPhone', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/绑定手机.png' }
        ]
      },
      {
        id: 'preference',
        name: '偏好设置',
        items: [
          { id: 'notification', name: '通知设置', url: '/pages/notification/settings', icon: '	cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/通知设置.png', isSwitch: true, switchValue: true },
          { id: 'privacy', name: '隐私设置', url: '/pages/privacy/settings', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/隐私设置.png' },
          { id: 'language', name: '语言', value: '简体中文', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/语言.png' }
        ]
      },
      {
        id: 'about',
        name: '关于',
        items: [
          { id: 'aboutUs', name: '关于我们', url: '/pages/about/about', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/关于我们.png' },
          { id: 'feedback', name: '意见反馈', url: '/pages/feedback/feedback', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/_意见反馈.png' },
          { id: 'version', name: '版本信息', value: 'v1.0.0', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/版本信息提示.png' }
        ]
      }
    ],
    cacheSize: '0MB',
    isLogged: true
  },
  
  onLoad: function (options) {
    // 设置为已登录状态
    this.setData({
      isLogged: true
    });
    
    // 保存登录状态
    wx.setStorageSync('isLogged', true);
    
    // 检查是否已有用户信息，如果没有则设置默认用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || Object.keys(userInfo).length === 0) {
      // 设置默认用户数据（可以选择任一角色作为默认）
      const defaultUserInfo = {
        avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/头像/都市新锐青年.webp',
        nickName: '都市新锐青年',
        memberLevel: '黄金会员',
        experience: 860,
        nextLevel: 1500
      };
      
      // 保存到本地存储
      wx.setStorageSync('userInfo', defaultUserInfo);
      
      this.setData({
        userInfo: defaultUserInfo
      });
    } else {
      this.setData({
        userInfo: userInfo
      });
    }
    
    this.getStorageInfo();
    this.loadCloudImages();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 页面显示时重新获取用户信息，确保数据是最新的
      this.getUserInfo();
  },
  
  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
    }
  },
  
  // 获取缓存大小
  getStorageInfo() {
    wx.getStorageInfo({
      success: res => {
        // 将字节转换为MB
        const sizeInMB = (res.currentSize / 1024 / 1024).toFixed(2);
        this.setData({
          cacheSize: sizeInMB + 'MB'
      });
      }
    });
  },
  
  // 加载云存储图片
  loadCloudImages() {
    // 加载设置项图标
    this.data.settingsList.forEach((group, groupIndex) => {
      group.items.forEach((item, itemIndex) => {
        if (item.icon && item.icon.includes('cloud://')) {
          wx.cloud.getTempFileURL({
            fileList: [item.icon],
            success: res => {
              if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
                const tempPath = `settingsList[${groupIndex}].items[${itemIndex}].icon`;
                this.setData({
                  [tempPath]: res.fileList[0].tempFileURL
      });
    }
            }
          });
        }
      });
    });
  },
  
  // 处理设置项点击
  handleSettingClick(e) {
    const { id, url } = e.currentTarget.dataset;
    
    // 特殊处理某些设置项
    if (id === 'clearCache') {
      this.clearCache();
      return;
    }
    
    if (url) {
      wx.navigateTo({
        url: url,
        fail: (err) => {
          console.error('跳转失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  },
  
  // 处理开关切换
  handleSwitchChange(e) {
    const { groupIndex, itemIndex } = e.currentTarget.dataset;
    const value = e.detail.value;
    const item = this.data.settingsList[groupIndex].items[itemIndex];
    
    // 更新开关状态
    const switchPath = `settingsList[${groupIndex}].items[${itemIndex}].switchValue`;
    this.setData({
      [switchPath]: value
    });
    
    // 根据不同设置项执行不同操作
    if (item.id === 'notification') {
      console.log('通知设置已' + (value ? '开启' : '关闭'));
      wx.showToast({
        title: '通知设置已' + (value ? '开启' : '关闭'),
        icon: 'none'
      });
    }
  },
  
  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存吗？',
      success: res => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              this.setData({
                cacheSize: '0MB'
              });
            wx.showToast({
                title: '缓存已清除',
                icon: 'success'
              });
              
              // 保留登录状态信息
              if (this.data.isLogged) {
                wx.setStorageSync('isLogged', true);
              }
              if (this.data.userInfo.nickName !== '请选择') {
                wx.setStorageSync('userInfo', this.data.userInfo);
              }
            }
          });
        }
      }
    });
  },
  
  // 退出登录
  logout() {
    wx.showModal({
      title: '切换角色',
      content: '确定要切换到其他角色吗？',
      success: res => {
        if (res.confirm) {
          // 清除当前用户信息
          wx.removeStorageSync('userInfo');
          
          // 返回个人中心页面，让用户重新选择角色
          wx.showToast({
            title: '请重新选择角色',
            icon: 'success',
            success: () => {
              // 返回上一页
              setTimeout(() => {
                wx.navigateBack();
              }, 1000);
            }
          });
        }
      }
    });
  },
  
  // 跳转到个人资料页面
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  }
}) 