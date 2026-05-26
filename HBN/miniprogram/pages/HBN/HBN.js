// pages/HBN/HBN.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 添加导航栏状态
    navTransparent: true,
    banner: {
      image: '/images/hbn_banner.jpg',
      video: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/video-index (1).mp4',
      title: '专业是一种底气',
      subtitle: '让"真功效"名副其实'
    },
    // 直播间数据
    liveRooms: [
      {
        id: 1,
        title: '早C晚A科学抗老直播间',
        coverImage: 'https://img.api.aa1.cn/2025/05/07/a762b5ddd463e.png',
        status: 'living', // living, upcoming, replay
        startTime: '2025-05-17 20:00',
        hostAvatar: 'https://img.api.aa1.cn/2025/05/07/5cd382940c903.png',
        hostName: '科研主播小美',
        viewCount: 12800,
        productId: 101
      },
      {
        id: 2,
        title: '眼霜实测挑战|淡纹消眼圈12小时真实记录',
        coverImage: 'https://img.api.aa1.cn/2025/05/07/5e822faa0f027.png',
        status: 'upcoming',
        startTime: '2025-05-18 19:30',
        hostAvatar: 'https://img.api.aa1.cn/2025/05/07/795016c3c45c8.png',
        hostName: '皮肤科医生张教授',
        viewCount: 0,
        productId: 201
      },
      {
        id: 3,
        title: 'HBN实验室探秘|A醇稳定技术独家揭秘',
        coverImage: 'https://img.api.aa1.cn/2025/05/07/7e692a1919802.png',
        status: 'replay',
        startTime: '2025-05-15 15:00',
        hostAvatar: 'https://img.api.aa1.cn/2025/05/07/0b3009fd6dfd1.png',
        hostName: 'HBN首席研发官',
        viewCount: 35600,
        productId: 102
      }
    ],
    // 热销产品
    featuredProducts: [
      {
        id: 101,
        name: '早C晚A2.0套组',
        image: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合.png',
        originalPrice: 599,
        price: 288,
        tag: '抗初老套装',
        desc: '日间御氧焕亮，夜间塑颜抚纹，28天显著抗初老',
        sold: 58920
      },
      {
        id: 201,
        name: '咖啡因紧致修护眼霜',
        image: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/咖啡因眼霜.png',
        originalPrice: 299,
        price: 259,
        tag: '眼部加浓冰美式',
        desc: '即时起效、淡圈更快、淡纹更猛',
        sold: 32145
      }
    ],
    // 科研实力展示
    scienceProof: [
      { icon: 'lab', text: '100%面护产品通过第三方人体功效检测' },
      { icon: 'certificate', text: '多项研究成果登入国际SCI' },
      { icon: 'people', text: '累计数千人次参与人体功效实测' }
    ],
    // 限时优惠
    promotions: {
      countdown: 0, // 倒计时秒数，将在onLoad中计算
      couponValue: 100, // 优惠券金额
      coupon: '¥100直播专享券',
      isCouponReceived: false, // 是否已领取优惠券
      isReceiving: false, // 是否正在领取优惠券
      endDate: '2025-06-11 20:00:00', // 活动结束时间
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    // 直播预约弹窗
    showReservation: false,
    selectedLiveId: null,
    // 当前用户ID
    currentUserId: 2, // 默认为都市新锐青年
    // 倒计时定时器ID
    countdownTimer: null
  },

  /**
   * 进入直播间
   */
  enterLiveRoom(e) {
    const liveId = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;
    
    if (status === 'living') {
      // 进入直播
      wx.navigateTo({
        url: `/pages/live/room?id=${liveId}`
      });
    } else if (status === 'upcoming') {
      // 显示预约弹窗
      this.setData({
        showReservation: true,
        selectedLiveId: liveId
      });
    } else {
      // 观看回放
      wx.navigateTo({
        url: `/pages/live/replay?id=${liveId}`
      });
    }
  },

  /**
   * 预约直播
   */
  reserveLive() {
    // 预约直播逻辑
    wx.showToast({
      title: '预约成功！开播前将通知您',
      icon: 'none'
    });
    this.setData({
      showReservation: false
    });
  },

  /**
   * 关闭预约弹窗
   */
  closeReservation() {
    this.setData({
      showReservation: false
    });
  },

  /**
   * 查看商品详情
   */
  goToProduct(e) {
    const id = e.currentTarget.dataset.id;
    
    // 如果是第一个商品(ID=101: HBN早C晚A套装)，跳转到 detail1 页面
    if (id === 101) {
      wx.navigateTo({
        url: '/pages/detail1/detail1'
      });
    } 
    // 如果是咖啡因紧致修护眼霜(ID=201)，跳转到 detail 页面的第三个商品
    else if (id === 201) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=3'
      });
    }
    // 如果是第二个商品(ID=102: 明星发光水)，跳转到 detail 页面的第二个商品
    else if (id === 102) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=2'
      });
    } 
    // 如果是第四个商品(ID=104: 咖啡因紧致眼霜)，跳转到 detail 页面的第三个商品
    else if (id === 104) {
      wx.navigateTo({
        url: '/pages/detail/detail?id=3'
      });
    }
    // 其他商品仍然跳转到原有的 detail 页面
    else {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    }
  },

  /**
   * 倒计时更新
   */
  updateCountdown() {
    // 清除之前的定时器
    if (this.data.countdownTimer) {
      clearTimeout(this.data.countdownTimer);
    }
    
    // 计算最新的倒计时
    const countdown = this.calculateCountdown();
    if (countdown <= 0) {
      this.setData({
        'promotions.countdown': 0,
        'promotions.days': 0,
        'promotions.hours': 0,
        'promotions.minutes': 0,
        'promotions.seconds': 0
      });
      return;
    }
    
    // 计算天、时、分、秒
    const days = Math.floor(countdown / 86400);
    const hours = Math.floor((countdown % 86400) / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    
    // 更新页面数据
    this.setData({
      'promotions.countdown': countdown,
      'promotions.days': days,
      'promotions.hours': hours,
      'promotions.minutes': minutes,
      'promotions.seconds': seconds
    });
    
    // 设置下一次更新的定时器
    const countdownTimer = setTimeout(() => {
      this.updateCountdown();
    }, 1000);
    
    this.setData({
      countdownTimer
    });
  },

  /**
   * 计算活动剩余时间（秒）
   */
  calculateCountdown() {
    const endTimeStr = this.data.promotions.endDate;
    console.log('结束时间字符串:', endTimeStr);
    
    // 解析结束时间
    const endTime = new Date(endTimeStr.replace(/-/g, '/'));
    console.log('解析后的结束时间:', endTime);
    
    // 获取当前时间
    const now = new Date();
    console.log('当前时间:', now);
    
    // 计算时间差（毫秒）
    const timeDiff = endTime - now;
    console.log('时间差(毫秒):', timeDiff);
    
    // 如果活动已结束，返回0
    if (timeDiff <= 0) {
      console.log('活动已结束');
      return 0;
    }
    
    // 转换为秒
    const seconds = Math.floor(timeDiff / 1000);
    console.log('剩余秒数:', seconds);
    return seconds;
  },

  /**
   * 添加跳转到搜索页面的方法
   */
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  /**
   * 领取直播专享优惠券
   */
  getLiveCoupon() {
    // 检查是否已领取
    if (this.data.promotions.isCouponReceived) {
      wx.showToast({
        title: '您已领取过该优惠券',
        icon: 'none'
      });
      return;
    }
    
    // 如果正在领取中，则不再重复请求
    if (this.data.promotions.isReceiving) {
      return;
    }
    
    // 设置正在领取状态
    this.setData({
      'promotions.isReceiving': true
    });
    
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    // 更新当前用户ID
    this.setData({
      currentUserId: userId
    });
    
    wx.showLoading({
      title: '领取中...',
      mask: true
    });
    
    // 调用云函数领取优惠券
    wx.cloud.callFunction({
      name: 'getLiveCoupon',
      data: {
        userId: this.data.currentUserId,
        liveId: 1, // 默认为第一个直播间
        couponType: 'live',
        couponValue: this.data.promotions.couponValue // 优惠券金额
      }
    }).then(res => {
      wx.hideLoading();
      
      console.log('领取优惠券结果:', res.result);
      
      // 重置领取状态
      this.setData({
        'promotions.isReceiving': false
      });
      
      const result = res.result;
      
      if (result && result.success) {
        // 领取成功，更新页面状态
        this.setData({
          'promotions.isCouponReceived': true
        });
        
        // 提示成功
        wx.showToast({
          title: '优惠券领取成功',
          icon: 'success',
          duration: 2000
        });
        
        // 设置优惠券页面需要刷新的标志
        wx.setStorageSync('couponsNeedRefresh', true);
        
      } else {
        // 领取失败
        wx.showToast({
          title: result && result.error ? result.error : '领取失败，请稍后再试',
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(err => {
      wx.hideLoading();
      
      console.error('领取优惠券出错:', err);
      
      // 重置领取状态
      this.setData({
        'promotions.isReceiving': false
      });
      
      wx.showToast({
        title: '网络错误，请稍后再试',
        icon: 'none',
        duration: 2000
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面加载，开始计算倒计时');
    this.updateCountdown();
    
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'YOUR_CLOUD_ENV_ID',
        traceUser: true
      });
    }
    
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    this.setData({
      currentUserId: userId
    });
    
    // 检查是否已领取优惠券
    this.checkCouponStatus();
  },

  /**
   * 检查优惠券领取状态
   */
  checkCouponStatus() {
    const db = wx.cloud.database();
    
    db.collection('coupons').where({
      userId: this.data.currentUserId,
      liveId: 1, // 默认为第一个直播间ID
      source: 'live'
    }).count().then(res => {
      if (res.total > 0) {
        // 已领取过
        this.setData({
          'promotions.isCouponReceived': true
        });
      } else {
        // 未领取过
        this.setData({
          'promotions.isCouponReceived': false
        });
      }
    }).catch(err => {
      console.error('检查优惠券状态失败:', err);
    });
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
    // 页面显示时更新倒计时
    this.updateCountdown();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 清除定时器
    if (this.data.countdownTimer) {
      clearTimeout(this.data.countdownTimer);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 清除定时器
    if (this.data.countdownTimer) {
      clearTimeout(this.data.countdownTimer);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

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
    return {
      title: 'HBN真功效直播间',
      path: '/pages/HBN/HBN',
      imageUrl: '/images/share_cover.jpg'
    };
  },

  // 修改页面滚动监听方法适配scroll-view
  onPageScroll(e) {
    const scrollTop = e.detail.scrollTop; // 使用detail.scrollTop获取滚动位置
    if (scrollTop > 50) {
      if (this.data.navTransparent) {
        this.setData({
          navTransparent: false
        });
      }
    } else {
      if (!this.data.navTransparent) {
        this.setData({
          navTransparent: true
        });
      }
    }
  },
})