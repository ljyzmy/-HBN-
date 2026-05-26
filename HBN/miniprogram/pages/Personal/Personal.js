// pages/Personal/Personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/请选择.png',
      nickName: '请选择',
      memberLevel: '黄金会员',
      experience: 0,
      nextLevel: 0
    },
    accountBalance: '0',
    orderInfo: {
      unpaid: 2,     // 保留数据，但不在页面上显示为红点
      unshipped: 3,   // 保留数据，但不在页面上显示为红点
      shipped: 1,     // 保留数据，但不在页面上显示为红点
      completed: 8
    },
    // 订单状态图标
    orderStatusIcons: [
      {
        status: 'unpaid',
        name: '待付款',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/待付款.png'
      },
      {
        status: 'unshipped',
        name: '待发货',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/待发货.png'
      },
      {
        status: 'shipped',
        name: '待收货',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/待收货.png'
      },
      {
        status: 'completed',
        name: '已完成',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/已完成.png'
      },
      {
        status: 'afterSale',
        name: '售后',
        icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/售后.png'
      }
    ],
    assets: {
      points: 0,
      coupons: 0,
      giftCards: 0,
      favorites: 12
    },
    messageCount: 3,
    orderCount: 14,
    serviceList: [
      { id: 1, name: '我的优惠券', icon: 'coupon', url: '/pages/coupons/coupons', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/优惠券.png' },
      { id: 2, name: '收货地址', icon: 'address', url: '/pages/address/address', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/收货地址.png' },
      { id: 3, name: '收藏商品', icon: 'collect', url: '/pages/favorites/favorites', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/收藏.png' },
      { id: 4, name: '浏览历史', icon: 'history', url: '/pages/history/history', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/浏览历史.png' },
      { id: 11, name: '专属护肤方案', icon: 'skincare', url: '/pages/skincare/plan', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/专属服务.png' },
      { id: 10, name: '成分查询', icon: 'ingredient', url: '/pages/ingredients/search', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/人体成分.png' },
      { id: 5, name: '客户服务', icon: 'customer', url: '/pages/service/service', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/客户服务.png' },
      { id: 6, name: '意见反馈', icon: 'feedback', url: '/pages/feedback/feedback', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/_意见反馈.png' },
      { id: 7, name: '邀请好友', icon: 'invite', url: '/pages/invite/invite', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/邀请好友.png' },
      { id: 8, name: '关于我们', icon: 'about', url: '/pages/brand/story', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/关于我们.png' },
      { id: 9, name: '帮助中心', icon: 'help', url: '/pages/help/help', iconUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/帮助中心.png' }
    ],
    accountList: [
      { id: 1, name: 'HBN积分', value: '580', icon: 'points', url: '/pages/points/points' },
      { id: 2, name: '优惠券', value: '5张', icon: 'coupon-color', url: '/pages/coupons/coupons' },
      { id: 3, name: '礼品卡', value: '2张', icon: 'gift-card', url: '/pages/giftCards/giftCards' }
    ],
    isLogged: true,
    showLoginModal: false,
    // 添加用户画像弹窗相关数据
    showAvatarModal: false,
    userProfiles: [],
    // 存储云数据库中用户画像的记录ID
    userProfileIds: {
      profile1: '81fbbcd56843e1b201a3215777235ffb', // 职场精英女性
      profile2: '81fbbcd56843e1b201a3215836053277', // 都市新锐青年
      profile3: '81fbbcd56843e1b201a321597f5fd078'  // 科研工作者
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkLoginStatus();
    
    // 初始化云环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'YOUR_CLOUD_ENV_ID',
        traceUser: true,
      });
      
      // 从云数据库加载用户画像数据
      this.loadUserProfilesFromCloud();
    }
    
    // 检查是否已有用户信息，如果没有则设置默认用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || Object.keys(userInfo).length === 0) {
      // 默认会在loadUserProfilesFromCloud完成后设置默认用户
      console.log('等待从云数据库加载用户画像...');
    } else {
      // 如果已有用户信息，直接使用
      this.setData({
        userInfo: userInfo
      });
      
      // 加载礼品卡数量
      this.loadGiftCardsCount();
      
      // 加载优惠券数量
      this.loadCouponsCount();
    }
    
    this.loadCloudImages();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 创建视频上下文
    this.videoContext = wx.createVideoContext('bgVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3  // 个人中心页面的索引
      });
    }
    
    // 检查登录状态，但不会强制要求登录
    this.checkLoginStatus();
    
    // 获取本地存储的用户信息，如果有的话
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && Object.keys(userInfo).length > 0) {
      this.setData({
        userInfo: userInfo
      });
      
      // 强制每次显示页面时重新获取最新的余额信息
      this.loadUserBalanceFromCloud();
      
      // 加载礼品卡数量
      this.loadGiftCardsCount();
      
      // 加载优惠券数量
      this.loadCouponsCount();
      
      // 加载用户积分信息
      this.loadUserPointsFromCloud();
    }
    
    // 如果视频上下文存在，播放视频
    if (this.videoContext) {
      this.videoContext.play();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新时重新加载优惠券和礼品卡数量
    this.loadGiftCardsCount();
    this.loadCouponsCount();

    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    // 不再检查实际登录状态，直接设置为已登录状态
    this.setData({
      isLogged: true
    });
    
    // 保存登录状态到本地存储，确保其他页面可以获取
    wx.setStorageSync('isLogged', true);
  },
  
  /**
   * 跳转到登录页
   */
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
    this.setData({
      showLoginModal: false
    });
  },
  
  /**
   * 关闭登录模态框
   */
  closeLoginModal() {
    this.setData({
      showLoginModal: false
    });
  },
  
  /**
   * 跳转到会员中心
   */
  goToMemberCenter() {
    wx.navigateTo({
      url: '/pages/member/center'
    });
  },
  
  /**
   * 跳转到个人资料
   */
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },
  
  /**
   * 跳转到我的订单列表
   */
  goToOrderList(e) {
    const status = e.currentTarget.dataset.status || 'all';
    wx.navigateTo({
      url: `/pages/order/list?status=${status}`
    });
  },
  
  /**
   * 跳转到服务页面
   */
  goToService(e) {
    const index = e.currentTarget.dataset.index;
    const service = this.data.serviceList[index];
    
    wx.navigateTo({
      url: service.url
    });
  },
  
  /**
   * 跳转到资产页面
   */
  goToAsset(e) {
    const index = e.currentTarget.dataset.index;
    const asset = this.data.accountList[index];
    
    wx.navigateTo({
      url: asset.url
    });
  },
  
  /**
   * 跳转到消息中心
   */
  goToMessageCenter() {
    wx.navigateTo({
      url: '/pages/message/center'
    });
  },
  
  /**
   * 跳转到设置页面
   */
  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  goToBalance() {
    wx.navigateTo({
      url: '/pages/balance/balance'
    });
  },

  /**
   * 跳转到品牌故事页面
   */
  goToBrandStory() {
    wx.navigateTo({
      url: '/pages/brand/story'
    });
  },
  
  /**
   * 处理视频错误
   */
  handleVideoError(e) {
    console.error('背景视频加载错误:', e.detail.errMsg);
  },

  /**
   * 处理品牌故事视频错误
   */
  handleBrandVideoError(e) {
    console.error('品牌故事背景视频加载错误:', e.detail.errMsg);
  },

  /**
   * 加载云存储图片
   */
  loadCloudImages() {
    // 订单状态图标
    const orderIcons = this.data.orderStatusIcons;
    orderIcons.forEach((item, index) => {
      wx.cloud.getTempFileURL({
        fileList: [item.icon],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `orderStatusIcons[${index}].icon`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });

    // 服务图标
    const serviceList = this.data.serviceList;
    serviceList.forEach((item, index) => {
      wx.cloud.getTempFileURL({
        fileList: [item.iconUrl],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `serviceList[${index}].iconUrl`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });
  },

  // 显示用户画像选择弹窗
  showAvatarSelector() {
    this.setData({
      showAvatarModal: true
    });
  },

  // 关闭用户画像选择弹窗
  closeAvatarModal() {
    this.setData({
      showAvatarModal: false
    });
  },

  // 选择用户画像
  selectUserProfile(e) {
    const profileId = e.currentTarget.dataset.id;
    this.selectUserProfileFromCloud(profileId);
  },

  /**
   * 从云数据库加载用户画像数据
   */
  loadUserProfilesFromCloud() {
    wx.showLoading({
      title: '加载中...',
    });
    
    const db = wx.cloud.database();
    const userCollection = db.collection('user');
    
    // 查询所有用户画像数据
    Promise.all([
      userCollection.doc(this.data.userProfileIds.profile1).get(),
      userCollection.doc(this.data.userProfileIds.profile2).get(),
      userCollection.doc(this.data.userProfileIds.profile3).get()
    ]).then(results => {
      const profiles = results.map(res => {
        const data = res.data;
        // 提取需要显示在选择器中的基础信息
        return {
          id: data.id,
          name: data.name,
          age: data.age,
          occupation: data.occupation,
          lifestyle: data.lifestyle,
          avatarUrl: data.avatarUrl,
          needAnalysis: data.needAnalysis
        };
      });
      
      this.setData({
        userProfiles: profiles
      });
      
      console.log('从云数据库加载的用户画像:', profiles);
      
      // 设置默认用户 - 都市新锐青年
      const userInfo = wx.getStorageSync('userInfo');
      if (!userInfo || Object.keys(userInfo).length === 0) {
        const defaultProfile = profiles.find(profile => profile.id === 2);
        if (defaultProfile) {
          // 获取完整的用户画像数据
          this.selectUserProfileFromCloud(2);
        }
      }
      
      wx.hideLoading();
    }).catch(err => {
      console.error('获取用户画像数据失败:', err);
      wx.hideLoading();
      
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 2000
      });
    });
  },
          
  /**
   * 从云数据库获取并设置用户画像数据
   */
  selectUserProfileFromCloud(profileId) {
    wx.showLoading({
      title: '加载中...',
    });
    
    const db = wx.cloud.database();
    const userCollection = db.collection('user');
    
    // 根据profileId获取对应的记录ID
    let docId = '';
    if (profileId === 1) {
      docId = this.data.userProfileIds.profile1;
    } else if (profileId === 2) {
      docId = this.data.userProfileIds.profile2;
    } else if (profileId === 3) {
      docId = this.data.userProfileIds.profile3;
    }
    
    if (!docId) {
      wx.hideLoading();
      wx.showToast({
        title: '用户数据错误',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    userCollection.doc(docId).get().then(res => {
      const userData = res.data;
      console.log('获取到的用户数据:', userData);
      
      // 设置用户基本信息
        this.setData({
        'userInfo.avatarUrl': userData.avatarUrl,
        'userInfo.nickName': userData.name,
        'userInfo.memberLevel': userData.memberLevel,
        'userInfo.experience': userData.experience,
        'userInfo.nextLevel': userData.nextLevel,
        showAvatarModal: false,
          
          // 账户资产
        'accountBalance': userData.accountBalance,
        'assets.points': userData.assets.points,
        'assets.coupons': userData.assets.coupons,
        'assets.favorites': userData.assets.favorites,
          
          // 订单信息
        'orderInfo.unpaid': userData.orderInfo.unpaid,
        'orderInfo.unshipped': userData.orderInfo.unshipped,
        'orderInfo.shipped': userData.orderInfo.shipped,
        'orderInfo.completed': userData.orderInfo.completed,
          
          // 消息通知
        'messageCount': userData.messageCount
        });
        
      // 更新服务列表，添加用户特定服务
      let updatedServiceList = [...this.data.serviceList.filter(item => item.id < 100)]; // 移除之前可能添加的特殊服务
      
      // 如果有特殊服务，则添加到服务列表前面
      if (userData.specialServices && userData.specialServices.length > 0) {
        updatedServiceList = [...userData.specialServices, ...updatedServiceList];
      }
        
        this.setData({
          serviceList: updatedServiceList
        });
        
      // 更新账户列表信息
        this.setData({
        'accountList[0].value': userData.assets.points.toString(),
        'accountList[1].value': userData.assets.coupons + '张'
      });
      
      // 将更新后的用户信息保存到本地存储
      wx.setStorageSync('userInfo', this.data.userInfo);
      
      // 清除之前可能存在的选择优惠券相关数据
      wx.removeStorageSync('selectedCoupon');
      wx.removeStorageSync('usableCoupons');
      
      // 更新账户余额到本地存储
      wx.setStorageSync('accountBalance', userData.accountBalance);
      
      // 更新用户ID信息到缓存，便于其他页面获取
      wx.setStorageSync('currentUserId', profileId);
      
      // 获取礼品卡真实数量
      this.loadGiftCardsCount();
      
      // 获取优惠券真实数量
      this.loadCouponsCount();
      
      // 清除旧的地址缓存，确保地址页面重新从数据库获取
      wx.removeStorageSync('addresses');
      
      wx.hideLoading();
      
      if (profileId !== 2) { // 如果不是初始加载默认用户，则显示提示
        wx.showToast({
          title: '画像切换成功',
          icon: 'success',
          duration: 1500
        });
      }
    }).catch(err => {
      console.error('获取用户数据失败:', err);
      wx.hideLoading();
      
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 2000
      });
    });
  },

  /**
   * 从云数据库中获取并更新礼品卡数量
   */
  loadGiftCardsCount() {
    // 检查云环境是否已初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }
    
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.nickName) {
      console.log('未找到用户信息，无法获取礼品卡数量');
      return;
    }
    
    // 根据用户昵称匹配用户ID
    let userId = 'user_004'; // 默认ID
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 'user_001';
    } else if (userInfo.nickName === '都市新锐青年') {
      userId = 'user_002';
    } else if (userInfo.nickName === '科研工作者') {
      userId = 'user_003';
    }
    
    // 从云数据库获取礼品卡数量
    const db = wx.cloud.database();
    db.collection('gift_cards')
      .where({ userId: userId })
      .get()
      .then(res => {
        const cardCount = res.data.length;
        
        // 更新页面数据
        this.setData({
          'assets.giftCards': cardCount,
          'accountList[2].value': cardCount + '张'
        });
        
        console.log('已更新礼品卡数量:', cardCount);
      })
      .catch(err => {
        console.error('获取礼品卡数量失败:', err);
      });
  },

  /**
   * 从云数据库中获取并更新优惠券数量
   */
  loadCouponsCount() {
    // 检查云环境是否已初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }
    
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.nickName) {
      console.log('未找到用户信息，无法获取优惠券数量');
      return;
    }
    
    // 根据用户昵称匹配用户ID
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    console.log('获取优惠券数量 - 用户ID:', userId);
    
    // 从云数据库获取优惠券数量
    const db = wx.cloud.database();
    
    // 只获取可用优惠券数量
    db.collection('coupons')
      .where({
        userId: userId,
        used: false,
        usable: true,
        expireDate: db.command.gte(this.formatDate(new Date())) // 只获取未过期的
      })
      .count()
      .then(res => {
        const couponCount = res.total;
        
        // 更新页面数据
        this.setData({
          'assets.coupons': couponCount,
          'accountList[1].value': couponCount + '张'
        });
        
        console.log('已更新可用优惠券数量:', couponCount);
      })
      .catch(err => {
        console.error('获取优惠券数量失败:', err);
        
        // 如果获取失败，尝试备用方案
        this.loadCouponsCountBackup(userId);
      });
  },
  
  /**
   * 获取优惠券数量的备用方案
   */
  loadCouponsCountBackup(userId) {
    console.log('使用备用方案获取优惠券数量');
    
    // 使用模拟数据
    let couponCount = 5; // 默认值
    
    if (userId === 1) { // 职场精英女性
      couponCount = 7;
    } else if (userId === 3) { // 科研工作者
      couponCount = 6;
    }
    
    // 更新页面数据
    this.setData({
      'assets.coupons': couponCount,
      'accountList[1].value': couponCount + '张'
    });
    
    console.log('已更新可用优惠券数量(备用方案):', couponCount);
  },
  
  /**
   * 格式化日期为字符串
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  },

  // 加载用户余额
  loadUserBalanceFromCloud() {
    // 检查云环境是否已初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }
    
    // 获取用户ID
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.nickName) {
      console.log('未找到用户信息，无法获取用户余额');
      return;
    }
    
    // 根据用户昵称匹配用户ID
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    // 获取对应的文档ID
    let docId = '';
    
    if (userId === 1) {
      docId = this.data.userProfileIds.profile1;
    } else if (userId === 3) {
      docId = this.data.userProfileIds.profile3;
    } else {
      docId = this.data.userProfileIds.profile2;
    }
    
    console.log('加载用户余额 - 用户ID:', userId, '文档ID:', docId);
    
    // 从云数据库获取余额信息
    const db = wx.cloud.database();
    
    // 强制不使用缓存，获取最新的数据
    db.collection('user').doc(docId).get({
      success: res => {
        if (res.data) {
          const balance = res.data.accountBalance || 0;
          
          // 更新页面数据
          this.setData({
            accountBalance: balance.toString()
          });
          
          // 同时更新到本地存储
          wx.setStorageSync('accountBalance', balance);
          
          console.log('已更新用户余额:', balance);
        } else {
          console.error('获取余额失败: 文档不存在');
        }
      },
      fail: err => {
        console.error('获取用户余额失败:', err);
        
        // 如果获取失败，尝试从本地存储获取
        const balance = wx.getStorageSync('accountBalance') || '0';
        this.setData({
          accountBalance: balance.toString()
        });
      }
    });
    
    // 同时获取user_balance集合中的详细余额信息
    db.collection('user_balance').where({
      userId: userId
    }).get({
      success: res => {
        console.log('获取user_balance结果:', res);
        if (res.data && res.data.length > 0) {
          const balanceData = res.data[0];
          
          this.setData({
            'balanceInfo.availableBalance': balanceData.availableBalance || 0,
            'balanceInfo.frozenBalance': balanceData.frozenBalance || 0
          });
          
          console.log('已更新余额详情 - 可用余额:', balanceData.availableBalance, '冻结余额:', balanceData.frozenBalance);
        } else {
          console.log('未找到user_balance记录');
        }
      },
      fail: err => {
        console.error('获取余额详细信息失败:', err);
      }
    });
  },

  // 加载用户积分
  loadUserPointsFromCloud() {
    // 检查云环境是否已初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }
    
    // 获取用户ID
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.nickName) {
      console.log('未找到用户信息，无法获取用户积分');
      return;
    }
    
    // 根据用户昵称匹配用户ID
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    // 获取对应的文档ID
    let docId = '';
    
    if (userId === 1) {
      docId = this.data.userProfileIds.profile1;
    } else if (userId === 3) {
      docId = this.data.userProfileIds.profile3;
    } else {
      docId = this.data.userProfileIds.profile2;
    }
    
    console.log('加载用户积分 - 用户ID:', userId, '文档ID:', docId);
    
    // 从云数据库获取积分信息
    const db = wx.cloud.database();
    
    // 使用回调方式获取，避免缓存问题
    db.collection('user').doc(docId).get({
      success: res => {
        if (res.data) {
          // 确保assets字段存在
          const assets = res.data.assets || {};
          const points = assets.points || 0;
          
          // 更新页面数据
          this.setData({
            'assets.points': points,
            'accountList[0].value': points.toString()
          });
          
          console.log('已更新用户积分:', points);
        } else {
          console.error('获取用户积分失败: 文档不存在');
        }
      },
      fail: err => {
        console.error('获取用户积分失败:', err);
      }
    });
    
    // 尝试获取积分交易记录 (使用points集合)
    try {
      db.collection('points').where({
        userId: userId
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get({
        success: res => {
          if (res.data && res.data.length > 0) {
            const latestTransaction = res.data[0];
            console.log('最新积分交易:', latestTransaction);
            // 可以根据最新交易记录更新一些展示信息
          }
        },
        fail: err => {
          console.log('获取积分交易记录失败 (这是正常的，如果集合不存在):', err);
        }
      });
    } catch (e) {
      console.log('积分交易记录查询异常:', e);
    }
  }
})