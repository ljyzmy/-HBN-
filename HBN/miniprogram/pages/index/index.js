Page({
  data: {
    currentMainSwiper: 0,
    // 横向轮播图数据 - 改为视频
    bannerList: [
      { 
        id: 1, // 对应第一个商品 - 早C晚A套装
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载 (3).mp4',
        coverUrl: 'https://img.api.aa1.cn/2025/05/09/88192acbd964c.png',
        // title: '敦煌飞天 · 早C晚A套装'
      },
      { 
        id: 2, // 对应第二个商品
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载.mp4',
        coverUrl: 'https://img.api.aa1.cn/2025/05/09/88192acbd964c.png',
        // title: '敦煌咖啡因 · 眼部修护'
      },
      { 
        id: 3, // 对应第三个商品 - 视黄醇精华乳
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载 (2).mp4', 
        coverUrl: 'https://img.api.aa1.cn/2025/05/09/88192acbd964c.png',
        // title: '敦煌凌凤 · 视黄醇精华'
      }
    ],
    // 限时活动数据
    flashSaleProducts: [
      { id: 101, title: 'HBN早C晚A套装', price: 288.00, originalPrice: 429.00, discount: 6.7, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合.png' },
      { id: 102, title: '明星发光水', price: 119.00, originalPrice: 163.00, discount: 7.3, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/经典版发光水.png' },
      { id: 103, title: '双A醇精华乳', price: 189.00, originalPrice: 262.00, discount: 7.2, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/双A醇精华乳.png' },
      { id: 104, title: '咖啡因紧致眼霜', price: 279.00, originalPrice: 422.00, discount: 6.6, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/咖啡因眼霜.png' }
    ],
    // 限时活动倒计时
    flashHours: '05',
    flashMinutes: '36',
    flashSeconds: '45',
    // 会员福利数据
    benefitList: [
      { 
        id: 1, 
        // title: '新会员专享礼包', 
        description: '新注册用户送70元优惠券享5大权益', 
        imageUrl: 'https://img.api.aa1.cn/2025/05/11/12c7af2b9f9c8.jpg',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/1.0.mp4'
      },
      { 
        id: 2, 
        // title: '每月会员专享优惠券', 
        description: '每月定期上线优惠券，月月不同惊喜', 
        imageUrl: 'https://img.api.aa1.cn/2025/05/11/fe3842d126fb8.jpg',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/2.mp4'
      },
      { 
        id: 3, 
        // title: '生日惊喜礼遇', 
        description: '生日当月送30积分+送3张优惠券', 
        imageUrl: 'https://img.api.aa1.cn/2025/05/11/bb842b4c7c95d.jpg',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/3.mp4'
      }
    ],
    // 美妆攻略数据
    strategyList: [
      { id: 1, title: '春夏底妆选择指南', readCount: 1542, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/春夏底妆展示图制作 .png' },
      { id: 2, title: '敏感肌护肤全攻略', readCount: 2103, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/温和护肤产品展示.png' },
      { id: 3, title: '十分钟职场妆容教程', readCount: 891, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/职场女性妆容图片制作.png' },
      { id: 4, title: '如何选择适合的精华乳', readCount: 1276, imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/护肤品摆拍.png' }
    ],
    // 热售商品数据
    productList: [
      { 
        id: 1, 
        title: 'HBN早C晚A水乳套装2.0发光水提亮去黄补水紧致抗皱', 
        price: 288.00, 
        originalPrice: 388.00, 
        salesCount: 2156, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合.png',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合（无文字）.mp4'
      },
      { 
        id: 2, 
        title: 'HBN咖啡因眼霜3.0 淡细纹焕亮眼周 抗皱紧致保湿眼霜', 
        price: 289.00, 
        originalPrice: 389.00, 
        salesCount: 1892, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/咖啡因眼霜.png',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/3.mp4'
      },
      { 
        id: 3, 
        title: 'HBN视黄醇精华乳2.0双a醇乳液紧致抗皱焕亮淡化细纹护肤品男女', 
        price: 199.00, 
        originalPrice: 289.00, 
        salesCount: 3214, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/双A醇精华乳.png',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4'
      },
      { 
        id: 4, 
        title: 'HBN发光水α-熊果苷精粹水2.0提亮肤色保湿爽肤水湿敷护肤精华水', 
        price: 129.00, 
        originalPrice: 199.00, 
        salesCount: 1675, 
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/经典版发光水.png',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.mp4'
      }
    ],
    navTransparent: true,
    // 添加屏幕高度数据
    windowHeight: 0,
    // 添加底部安全距离
    safeAreaBottom: 0,
    flashScrollLeft: 0,
    scrollDistance: 240, // 每次滚动的距离
    userInfo: {
      avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/请选择.png',
      nickName: '请选择',
      memberLevel: '黄金会员',
      experience:0,
      nextLevel: 0
    },
    // 用户资产信息
    assets: {
      points: 0,
      coupons: 0,
      giftCards: 0,
      favorites: 0
    },
    // 账户余额
    accountBalance: '0',
    benefitScrollLeft: 0, // 会员福利滚动位置
    benefitScrollDistance: 320, // 福利滚动距离，一次滚动一个项目的宽度+边距
    memberCardBgImage: 'https://img.api.aa1.cn/2025/05/09/24817c7281585.png',
    // 添加背景图片URL
    scrollContainerBgImage: 'https://img.api.aa1.cn/2025/05/09/2b59632f2062b.png',
    // 添加限时专享背景图片URL
    // flashSaleBgImage: 'https://img.api.aa1.cn/2025/05/09/ff06cf8e6c851.png',
    currentVideoIndex: 0, // 当前播放的视频索引
    videoCtrls: false, // 不显示视频控制条
    // 背景视频URL
    scrollContainerBgVideo: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载 (4).mp4',
    scrollContainerBgPoster: 'https://img.api.aa1.cn/2025/05/09/2b59632f2062b.png', // 用原背景图作为封面
    videoBgMuted: true,  // 视频静音
    // 添加会员卡片视频
    memberCardVideo: {
      videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载 (4).mp4',
      posterUrl: 'https://img.api.aa1.cn/2025/05/09/24817c7281585.png' // 使用原背景图作为封面
    },
    activeBenefitVideoIndex: -1, // 记录当前活跃的视频索引
    // 添加明星产品系列视频数据
    productSeries: [
      {
        id: 1,
        name: "早C晚A系列",
        desc: "日间御氧焕亮，夜间塑颜抚纹",
        imageUrl: "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/系列图片/早C晚A系列.png",
        videoUrl: "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/系列图片/早C晚A系列.mp4"
      },
      {
        id: 2,
        name: "眼部护理系列",
        desc: "即时起效，淡圈更快，淡纹更猛",
        imageUrl: "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/系列图片/眼部护理系列.png",
        videoUrl: "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/系列图片/眼部护理系列.mp4"
      }
    ],
    // 推荐产品弹窗数据
    recommendPopup: {
      show: false,
      product: {
        id: 1,
        name: 'HBN早C晚A水乳套装2.0',
        desc: '日间御氧焕亮，夜间塑颜抚纹，解决初老带来的皱纹和暗沉',
        price: 288.00,
        originalPrice: 388.00,
        image: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合.png',
        imageTemp: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/分类背景.png', // 临时图片URL
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合（无文字）.mp4' // 添加视频URL
      }
    },
    // 添加视频控制相关状态
    activeVideos: {},        // 记录当前活跃的视频
    maxActiveVideos: 2,      // 同时播放视频的最大数量
    lastScrollPosition: 0,   // 上次滚动位置
    isScrolling: false,      // 是否正在滚动
    videosVisibility: {},    // 记录视频元素的可见性
    // 添加用户画像弹窗相关数据
    userProfiles: [],
    // 存储云数据库中用户画像的记录ID
    userProfileIds: {
      profile1: '81fbbcd56843e1b201a3215777235ffb', // 职场精英女性
      profile2: '81fbbcd56843e1b201a3215836053277', // 都市新锐青年
      profile3: '81fbbcd56843e1b201a321597f5fd078'  // 科研工作者
    }
  },

  onLoad() {
    // 确保初始状态下导航条是透明的
    this.setData({
      navTransparent: true
    });
    
    // 初始化云环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'YOUR_CLOUD_ENV_ID',
        traceUser: true,
      });
      console.log('云环境初始化成功');
      
      // 从云数据库加载用户画像数据
      this.loadUserProfilesFromCloud();
    }
    
    // 加载数据，实际使用时可从服务器获取
    this.loadData();
    
    // 获取系统信息，调整导航栏高度和滚动区域
    this.getSystemInfo();
    
    // 启动限时专享倒计时
    this.startFlashSaleCountdown();
    
    // 获取用户信息，从本地存储中读取
    this.getUserInfoFromStorage();
    
    // 初始化视频管理器
    this.initVideoManager();
    
    // 在页面加载完成后延迟播放第一个视频
    setTimeout(() => {
      this.playCurrentBannerVideo();
    }, 1000);
    
    // 添加延迟显示推荐弹窗
    setTimeout(() => {
      // 先获取临时图片URL
      this.getRecommendImageUrl();
      
      // 再显示弹窗
      setTimeout(() => {
        this.showRecommendPopup();
      }, 1000);
    }, 5000);
  },

  onShow() {
    // 当页面显示时，确保自定义tabbar的选中状态正确
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0  // 首页索引为0
      });
    }
    
    // 重新获取用户信息，确保显示最新数据
    this.getUserInfoFromStorage();
    
    // 加载用户余额
    this.loadUserBalanceFromCloud();
    
    // 加载礼品卡数量
    this.loadGiftCardsCount();
    
    // 加载优惠券数量
    this.loadCouponsCount();
    
    // 加载用户积分
    this.loadUserPointsFromCloud();
    
    // 使用延迟避免一次性加载太多视频
    setTimeout(() => {
      // 根据当前的轮播图位置决定是否播放背景视频
      if (this.data.currentMainSwiper === 1) {
        this.playBackgroundVideo();
      }
    }, 500);
  },
  
  // 页面隐藏时暂停所有视频
  onHide() {
    this.pauseAllVideos();
  },
  
  // 页面卸载时清理所有视频资源
  onUnload() {
    this.pauseAllVideos();
  },

  // 初始化视频管理器
  initVideoManager() {
    // 创建一个IntersectionObserver来观察视频元素
    this.videoObserver = wx.createIntersectionObserver(this);
    
    // 设置触发阈值，当视频有50%进入视口时触发
    this.videoObserver.relativeToViewport({bottom: 0, top: -0.5})
      .observe('.product-video-container', (res) => {
        // res.id 是视频容器的ID
        // res.intersectionRatio 是相交比例
        if (res.intersectionRatio > 0) {
          // 视频进入视口
          this.handleVideoVisible(res.dataset.index, 'product');
        } else {
          // 视频离开视口
          this.handleVideoInvisible(res.dataset.index, 'product');
        }
      });
      
    // 为系列视频创建观察器
    let seriesObserver = wx.createIntersectionObserver(this);
    seriesObserver.relativeToViewport({bottom: 0, top: -0.5})
      .observe('.series-video-container', (res) => {
        if (res.intersectionRatio > 0) {
          this.handleVideoVisible(res.dataset.index, 'series');
        } else {
          this.handleVideoInvisible(res.dataset.index, 'series');
        }
      });
      
    // 为福利视频创建观察器
    let benefitObserver = wx.createIntersectionObserver(this);
    benefitObserver.relativeToViewport({bottom: 0, top: -0.5})
      .observe('.benefit-video-container', (res) => {
        if (res.intersectionRatio > 0) {
          this.handleVideoVisible(res.dataset.index, 'benefit');
        } else {
          this.handleVideoInvisible(res.dataset.index, 'benefit');
        }
      });
  },
  
  // 处理视频变为可见
  handleVideoVisible(index, type) {
    let key = `${type}-${index}`;
    let videosVisibility = { ...this.data.videosVisibility };
    videosVisibility[key] = true;
    
    this.setData({ videosVisibility });
    
    // 检查当前活跃视频数量，决定是否播放
    this.checkAndPlayVideo(key, type, index);
  },
  
  // 处理视频变为不可见
  handleVideoInvisible(index, type) {
    let key = `${type}-${index}`;
    let videosVisibility = { ...this.data.videosVisibility };
    videosVisibility[key] = false;
    
    this.setData({ videosVisibility });
    
    // 暂停不可见的视频
    this.pauseVideo(type, index);
  },
  
  // 检查并播放视频
  checkAndPlayVideo(key, type, index) {
    let activeVideos = { ...this.data.activeVideos };
    let currentActiveCount = Object.values(activeVideos).filter(v => v).length;
    
    // 如果当前活跃视频数量小于最大值，且该视频可见，则播放它
    if (currentActiveCount < this.data.maxActiveVideos && this.data.videosVisibility[key]) {
      activeVideos[key] = true;
      this.setData({ activeVideos });
      
      // 根据不同类型播放视频
      switch(type) {
        case 'product':
          this.playProductVideo(index);
          break;
        case 'series':
          this.playSeriesVideo(index);
          break;
        case 'benefit':
          this.playBenefitVideo(index);
          break;
      }
    }
  },
  
  // 暂停指定视频
  pauseVideo(type, index) {
    let key = `${type}-${index}`;
    let activeVideos = { ...this.data.activeVideos };
    activeVideos[key] = false;
    this.setData({ activeVideos });
    
    let videoId;
    switch(type) {
      case 'product':
        videoId = `product-video-${index}`;
        break;
      case 'series':
        videoId = `series-video-${index}`;
        break;
      case 'benefit':
        videoId = `benefit-video-${index}`;
        break;
    }
    
    try {
      const videoContext = wx.createVideoContext(videoId, this);
      if (videoContext) {
        videoContext.pause();
      }
    } catch (e) {
      console.error(`暂停视频时出错:`, e);
    }
  },
  
  // 暂停所有视频
  pauseAllVideos() {
    // 暂停轮播图视频
    try {
      for (let i = 0; i < this.data.bannerList.length; i++) {
        const videoContext = wx.createVideoContext(`banner-video-${i}`, this);
        if (videoContext) {
          videoContext.pause();
        }
      }
    } catch(e) {
      console.error('暂停轮播图视频出错:', e);
    }
    
    // 暂停背景视频
    try {
      const bgVideoContext = wx.createVideoContext('background-video', this);
      if (bgVideoContext) {
        bgVideoContext.pause();
      }
    } catch(e) {
      console.error('暂停背景视频出错:', e);
    }
    
    // 暂停会员卡视频
    try {
      const memberCardVideoContext = wx.createVideoContext('member-card-video', this);
      if (memberCardVideoContext) {
        memberCardVideoContext.pause();
      }
    } catch(e) {
      console.error('暂停会员卡视频出错:', e);
    }
    
    // 暂停推荐弹窗视频
    try {
      const recommendVideoContext = wx.createVideoContext('recommend-video', this);
      if (recommendVideoContext) {
        recommendVideoContext.pause();
      }
    } catch(e) {
      console.error('暂停推荐弹窗视频出错:', e);
    }
    
    // 重置活跃视频状态
    this.setData({
      activeVideos: {}
    });
  },
  
  // 播放当前轮播图视频
  playCurrentBannerVideo() {
    const current = this.data.currentVideoIndex;
    try {
      // 先暂停其他视频，避免资源竞争
      this.stopAllVideosExcept(current);
      
      // 延迟播放当前视频，确保暂停操作完成
      setTimeout(() => {
        const videoContext = wx.createVideoContext(`banner-video-${current}`, this);
        if (videoContext) {
          videoContext.play();
        }
      }, 100);
    } catch(e) {
      console.error('播放轮播图视频出错:', e);
    }
  },

  // 从本地存储获取用户信息
  getUserInfoFromStorage() {
    // 获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && Object.keys(userInfo).length > 0) {
      this.setData({
        userInfo: userInfo
      });
      
      // 直接从userInfo所在的页面获取资产信息
      const accountBalance = wx.getStorageSync('accountBalance') || userInfo.accountBalance || '0';
      
      // 收集最新的资产数据
      let assets = {
        points: userInfo.experience || 0,
        coupons: 0,
        giftCards: 0,
        favorites: 0
      };

      // 检查是否有资产数据
      const storedAssets = wx.getStorageSync('assets');
      if (storedAssets) {
        assets = storedAssets;
      }

      // 同步Personal页面中的用户画像选择后的资产数据
      // 根据用户名称匹配对应的资产设置
      if (userInfo.nickName === '职场精英女性') {
        this.setData({
          accountBalance: '1289.50',
          assets: {
            points: 1580,
            coupons: 7,
            giftCards: 3,
            favorites: 26
          }
        });
      } 
      else if (userInfo.nickName === '都市新锐青年') {
        this.setData({
          accountBalance: '563.00',
          assets: {
            points: 860,
            coupons: 12,
            giftCards: 1,
            favorites: 38
          }
        });
      } 
      else if (userInfo.nickName === '科研工作者') {
        this.setData({
          accountBalance: '2376.20',
          assets: {
            points: 2260,
            coupons: 4,
            giftCards: 5,
            favorites: 15
          }
        });
      }
      else {
        // 默认数据
        this.setData({
          accountBalance: accountBalance,
          assets: assets
        });
      }

      // 保存现有的资产数据到本地存储，供其他页面使用
      wx.setStorageSync('accountBalance', this.data.accountBalance);
      wx.setStorageSync('assets', this.data.assets);
    }
  },

  // 加载数据的方法
  loadData() {
    // 这里可以从服务器获取数据
    // wx.request({
    //   url: 'your_api_url',
    //   success: (res) => {
    //     this.setData({
    //       bannerList: res.data.bannerList,
    //       benefitList: res.data.benefitList,
    //       strategyList: res.data.strategyList,
    //       productList: res.data.productList,
    //       flashSaleProducts: res.data.flashSaleProducts
    //     });
    //   }
    // });
  },

  // 获取系统信息
  getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const statusBarHeight = systemInfo.statusBarHeight;
    const navHeight = statusBarHeight + 44; // 44是微信导航栏的默认高度
    const windowHeight = systemInfo.windowHeight;
    const safeAreaBottom = systemInfo.safeArea ? (systemInfo.screenHeight - systemInfo.safeArea.bottom) : 0;
    
    this.setData({
      statusBarHeight,
      navHeight: navHeight + 'px',
      windowHeight,
      safeAreaBottom
    });
  },

  // 主轮播图切换事件
  swiperChange(e) {
    const current = e.detail.current;
    this.setData({
      currentMainSwiper: current,
      // 切换页面时更新导航栏样式
      navTransparent: current === 0 // 第一页透明，第二页不透明
    });
    
    // 根据当前页面决定要播放的视频
    if (current === 0) {
      // 如果是轮播图页面，播放当前轮播图视频
      setTimeout(() => {
        this.playCurrentBannerVideo();
      }, 300);
      
      // 暂停背景视频以节省资源
      const bgVideoContext = wx.createVideoContext('background-video', this);
      if (bgVideoContext) {
        bgVideoContext.pause();
      }
    } else {
      // 如果是滚动内容页面，播放背景视频
      setTimeout(() => {
        this.playBackgroundVideo();
      }, 300);
      
      // 暂停轮播图视频以节省资源
      this.stopAllVideosExcept(-1); // -1表示不保留任何视频
    }
  },

  // 导航到详情页
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    console.log('跳转到商品详情，ID:', id);
    
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 导航到指定页面
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url
    });
  },

  // 查看更多会员福利
  goToMoreBenefits() {
    wx.navigateTo({
      url: '/pages/benefits/benefits'
    });
  },

  // 查看会员福利详情
  goToBenefit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/benefitDetail/benefitDetail?id=${id}`
    });
  },

  // 查看更多美妆攻略
  goToMoreStrategies() {
    wx.navigateTo({
      url: '/pages/strategies/strategies'
    });
  },

  // 查看美妆攻略详情
  goToStrategy(e) {
    const id = e.currentTarget.dataset.id;
    console.log('点击美妆攻略，ID:', id); // 添加日志调试
    
    if (id === 1) {
      wx.showToast({
        title: '正在加载...',
        icon: 'loading',
        duration: 500
      });
      
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/strategyDetail/springMakeup/springMakeup'
        });
      }, 300);
    } 
    else if (id === 2) {
      wx.showToast({
        title: '正在加载...',
        icon: 'loading',
        duration: 500
      });
      
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/strategyDetail/sensitiveSkin/sensitiveSkin'
        });
      }, 300);
    } 
    else if (id === 3) {  // 十分钟职场妆容教程
      wx.showToast({
        title: '正在加载...',
        icon: 'loading',
        duration: 500
      });
      
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/strategyDetail/officeMakeup/officeMakeup'
        });
      }, 300);
    }
    else if (id === 4) {  // 如何选择适合的精华乳
      wx.showToast({
        title: '正在加载...',
        icon: 'loading',
        duration: 500
      });
      
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/strategyDetail/serumGuide/serumGuide'
        });
      }, 300);
    }
    else {
      // 其他项目跳转到通用详情页
    wx.navigateTo({
      url: `/pages/strategyDetail/strategyDetail?id=${id}`
    });
    }
  },

  // 查看更多商品
  goToMoreProducts() {
    wx.navigateTo({
      url: '/pages/products/products'
    });
  },

  // 查看商品详情
  goToProduct(e) {
    const id = e.currentTarget.dataset.id;
    
    // 如果是第一个商品(ID=101: HBN早C晚A套装)，跳转到 detail1 页面
    if (id === 101) {
      wx.navigateTo({
        url: '/pages/detail1/detail1'
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

  // 添加跳转到搜索页面的方法
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  // 跳转到产品系列页面
  goToSeries(e) {
    const id = e.currentTarget.dataset.id;
    console.log('跳转请求，ID:', id, '类型:', typeof id);
    
    // 早C晚A系列id为1时跳转到新页面
    if (id == 1) { // 使用弱等于，避免类型问题
      console.log('准备跳转到早C晚A系列');
      wx.navigateTo({
        url: '/pages/series/zaocwana/zaocwana',
        success: function() {
          console.log('跳转成功');
        },
        fail: function(err) {
          console.error('跳转失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    } 
    // 眼部护理系列id为2时跳转到眼部护理系列页面
    else if (id == 2) {
      console.log('准备跳转到眼部护理系列');
      wx.navigateTo({
        url: '/pages/series/eyecare/eyecare',
        success: function() {
          console.log('跳转成功');
        },
        fail: function(err) {
          console.error('跳转失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
    else {
      wx.navigateTo({
        url: `/pages/series/series?id=${id}`
      });
    }
  },

  // 启动限时活动倒计时
  startFlashSaleCountdown() {
    // 假设初始倒计时为5小时30分钟
    let totalSeconds = 5 * 3600 + 45 * 60;
    
    const updateCountdown = () => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      this.setData({
        flashHours: hours.toString().padStart(2, '0'),
        flashMinutes: minutes.toString().padStart(2, '0'),
        flashSeconds: seconds.toString().padStart(2, '0')
      });
      
      if (totalSeconds > 0) {
        totalSeconds--;
        setTimeout(updateCountdown, 1000);
      } else {
        // 倒计时结束，可以在这里添加相应的处理逻辑
        wx.showToast({
          title: '限时活动已结束',
          icon: 'none'
        });
        
        // 重新加载新的限时活动数据
        this.loadNewFlashSale();
      }
    };
    
    updateCountdown();
  },
  
  // 加载新的限时活动
  loadNewFlashSale() {
    // 这里可以请求新的限时活动数据
    // wx.request({
    //   url: 'your_flash_sale_api',
    //   success: (res) => {
    //     this.setData({
    //       flashSaleProducts: res.data.products
    //     });
    //     // 重新开始倒计时
    //     this.startFlashSaleCountdown();
    //   }
    // });
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 重新加载数据
    this.loadData();
    
    // 重新获取用户信息
    this.getUserInfoFromStorage();
    
    // 从云数据库重新加载用户资产数据
    this.loadUserBalanceFromCloud();
    this.loadGiftCardsCount();
    this.loadCouponsCount();
    this.loadUserPointsFromCloud();
    
    // 刷新视频状态
    this.pauseAllVideos();
    
    setTimeout(() => {
      // 根据当前页面重新播放视频
      if (this.data.currentMainSwiper === 0) {
        this.playCurrentBannerVideo();
      } else {
        this.playBackgroundVideo();
      }
      wx.stopPullDownRefresh();
    }, 1500);
  },

  // 触底加载更多
  onReachBottom() {
    // 可以在这里实现加载更多商品的逻辑
    // wx.showLoading({
    //   title: '加载中...'
    // });
    
    // 模拟数据加载
    // setTimeout(() => {
    //   wx.hideLoading();
    // }, 1000);
  },

  // 滚动容器滚动事件处理
  onScrollContainerScroll(e) {
    // 获取滚动位置
    const scrollTop = e.detail.scrollTop;
    
    // 记录滚动状态
    if (!this.data.isScrolling) {
      this.setData({ isScrolling: true });
      
      // 暂停所有视频，避免滚动时播放造成卡顿
      this.pauseAllVideosExceptBackground();
    }
    
    // 使用节流函数避免频繁触发
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    
    this.scrollTimer = setTimeout(() => {
      // 滚动停止后重置状态
      this.setData({ 
        isScrolling: false,
        lastScrollPosition: scrollTop
      });
      
      // 页面停止滚动后，重新检测可见视频
      this.checkVisibleVideos();
    }, 200);  // 滚动停止200ms后执行
  },
  
  // 检测当前可见的视频并播放
  checkVisibleVideos() {
    // 不在滚动的内容页时不检测
    if (this.data.currentMainSwiper !== 1) return;
    
    // 遍历所有记录为可见的视频
    Object.keys(this.data.videosVisibility).forEach(key => {
      if (this.data.videosVisibility[key]) {
        const [type, indexStr] = key.split('-');
        const index = parseInt(indexStr);
        
        // 检查并尝试播放视频
        this.checkAndPlayVideo(key, type, index);
      }
    });
  },
  
  // 暂停除背景视频外的所有视频
  pauseAllVideosExceptBackground() {
    // 创建一个新的活跃视频状态对象
    let activeVideos = {};
    
    // 设置背景视频为活跃
    activeVideos['background'] = true;
    
    // 更新状态
    this.setData({ activeVideos });
    
    try {
      // 暂停产品视频
      this.data.productList.forEach((_, index) => {
        const videoContext = wx.createVideoContext(`product-video-${index}`, this);
        if (videoContext) {
          videoContext.pause();
        }
      });
      
      // 暂停系列视频
      this.data.productSeries.forEach((_, index) => {
        const videoContext = wx.createVideoContext(`series-video-${index}`, this);
        if (videoContext) {
          videoContext.pause();
        }
      });
      
      // 暂停福利视频
      this.data.benefitList.forEach((_, index) => {
        const videoContext = wx.createVideoContext(`benefit-video-${index}`, this);
        if (videoContext) {
          videoContext.pause();
        }
      });
      
      // 暂停会员卡视频
      const memberCardVideoContext = wx.createVideoContext('member-card-video', this);
      if (memberCardVideoContext) {
        memberCardVideoContext.pause();
      }
    } catch(e) {
      console.error('暂停视频时出错:', e);
    }
  },

  // 添加滚动控制方法
  scrollLeft() {
    const currentScroll = this.data.flashScrollLeft;
    const scrollDistance = this.data.scrollDistance;
    
    // 计算新的滚动位置，确保不小于0
    const newScroll = Math.max(0, currentScroll - scrollDistance);
    
    this.setData({
      flashScrollLeft: newScroll
    });
  },

  scrollRight() {
    const currentScroll = this.data.flashScrollLeft;
    const scrollDistance = this.data.scrollDistance;
    
    // 滚动到右侧
    // 注意：这里没有设置最大滚动范围，微信小程序会自动处理
    this.setData({
      flashScrollLeft: currentScroll + scrollDistance
    });
    
    // 可选：如果需要控制最大滚动范围，需要获取 scroll-view 的宽度和内容总宽度
    // 这需要使用 SelectorQuery API
  },

  goToMemberCenter() {
    wx.navigateTo({
      url: '/pages/member/center'
    });
  },

  // 添加会员福利滚动控制方法
  scrollBenefitLeft() {
    const currentScroll = this.data.benefitScrollLeft;
    const scrollDistance = this.data.benefitScrollDistance;
    
    // 计算新的滚动位置，确保不小于0
    const newScroll = Math.max(0, currentScroll - scrollDistance);
    
    this.setData({
      benefitScrollLeft: newScroll
    });
  },

  scrollBenefitRight() {
    const currentScroll = this.data.benefitScrollLeft;
    const scrollDistance = this.data.benefitScrollDistance;
    
    // 向右滚动
    this.setData({
      benefitScrollLeft: currentScroll + scrollDistance
    });
  },

  // 添加视频相关方法
  bannerSwiperChange(e) {
    const current = e.detail.current;
    // 更新当前视频索引
    this.setData({
      currentVideoIndex: current
    });
    
    // 延迟播放当前视频，避免频繁切换
    setTimeout(() => {
      this.playCurrentBannerVideo();
    }, 300);
  },
  
  stopAllVideosExcept(exceptIndex) {
    try {
      for (let i = 0; i < this.data.bannerList.length; i++) {
        if (i !== exceptIndex) {
          const videoContext = wx.createVideoContext(`banner-video-${i}`, this);
          if (videoContext) {
            videoContext.pause();
          }
        }
      }
    } catch(e) {
      console.error('停止视频时出错:', e);
    }
  },
  
  // 视频结束后，滑动到下一个视频
  videoEnded(e) {
    const currentIndex = this.data.currentVideoIndex;
    const nextIndex = (currentIndex + 1) % this.data.bannerList.length;
    
    // 延迟更新索引并播放下一个视频
    setTimeout(() => {
      this.setData({
        currentVideoIndex: nextIndex
      });
      this.playCurrentBannerVideo();
    }, 500);
  },
  
  // 视频错误处理
  videoError(e) {
    console.error('视频播放错误:', e.detail.errMsg);
  },

  // 播放背景视频方法
  playBackgroundVideo() {
    try {
      const bgVideoContext = wx.createVideoContext('background-video', this);
      if (bgVideoContext) {
        bgVideoContext.play();
      }
    } catch(e) {
      console.error('播放背景视频出错:', e);
    }
  },
  
  // 处理背景视频错误
  bgVideoError(e) {
    console.error('背景视频错误:', e.detail.errMsg);
    // 如果视频加载失败，回退到使用图片背景
    this.setData({
      useVideoBg: false
    });
  },

  // 添加会员卡视频播放方法
  playMemberCardVideo() {
    try {
      // 判断是否已有过多活跃视频
      if (Object.values(this.data.activeVideos).filter(v => v).length >= this.data.maxActiveVideos) {
        return;
      }
      
      const videoContext = wx.createVideoContext('member-card-video', this);
      if (videoContext) {
        videoContext.play();
      }
      
      // 更新活跃视频
      let activeVideos = { ...this.data.activeVideos };
      activeVideos['member-card'] = true;
      this.setData({ activeVideos });
    } catch(e) {
      console.error('播放会员卡视频出错:', e);
    }
  },
  
  // 处理会员卡视频错误
  memberCardVideoError(e) {
    console.error('会员卡视频错误:', e.detail.errMsg);
  },

  // 播放福利视频
  playBenefitVideo(index) {
    try {
      const videoContext = wx.createVideoContext(`benefit-video-${index}`, this);
      if (videoContext) {
        videoContext.play();
      }
    } catch(e) {
      console.error(`播放福利视频(${index})出错:`, e);
    }
  },
  
  // 播放福利视频的回调处理
  onBenefitVideoPlay(e) {
    const index = e.currentTarget.dataset.index;
    const key = `benefit-${index}`;
    
    // 记录当前活跃的视频
    let activeVideos = { ...this.data.activeVideos };
    activeVideos[key] = true;
    this.setData({ activeVideos });
    
    // 如果活跃视频超过最大数量，暂停最早的一个视频
    this.manageActiveVideos(key);
  },
  
  // 处理视频错误
  benefitVideoError(e) {
    console.error('福利视频加载错误:', e.detail.errMsg);
  },
  
  // 视频加载完成
  benefitVideoLoaded(e) {
    const index = e.currentTarget.dataset.index;
    console.log(`福利视频 ${index} 加载完成`);
  },

  // 添加测试方法
  testZaocwana() {
    wx.navigateTo({
      url: '/pages/series/zaocwana/zaocwana',
      success: function() {
        console.log('测试跳转成功');
      },
      fail: function(err) {
        console.error('测试跳转失败:', err);
        wx.showToast({
          title: '测试跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 播放产品系列视频
  playSeriesVideo(index) {
    try {
      const videoContext = wx.createVideoContext(`series-video-${index}`, this);
      if (videoContext) {
        videoContext.play();
      }
    } catch(e) {
      console.error(`播放产品系列视频(${index})出错:`, e);
    }
  },
  
  // 处理产品系列视频播放回调
  onSeriesVideoPlay(e) {
    const index = e.currentTarget.dataset.index;
    const key = `series-${index}`;
    
    // 记录当前活跃的视频
    let activeVideos = { ...this.data.activeVideos };
    activeVideos[key] = true;
    this.setData({ activeVideos });
    
    // 如果活跃视频超过最大数量，暂停最早的一个视频
    this.manageActiveVideos(key);
  },

  // 处理产品系列视频错误
  seriesVideoError(e) {
    console.error('产品系列视频加载错误:', e.detail.errMsg);
  },

  // 播放热卖商品视频
  playProductVideo(index) {
    try {
      const videoContext = wx.createVideoContext(`product-video-${index}`, this);
      if (videoContext) {
        videoContext.play();
      }
    } catch(e) {
      console.error(`播放热卖商品视频(${index})出错:`, e);
    }
  },
  
  // 处理商品视频播放回调
  onProductVideoPlay(e) {
    const index = e.currentTarget.dataset.index;
    const key = `product-${index}`;
    
    // 记录当前活跃的视频
    let activeVideos = { ...this.data.activeVideos };
    activeVideos[key] = true;
    this.setData({ activeVideos });
    
    // 如果活跃视频超过最大数量，暂停最早的一个视频
    this.manageActiveVideos(key);
  },

  // 处理商品视频错误
  productVideoError(e) {
    console.error('商品视频加载错误:', e.detail.errMsg);
  },
  
  // 管理活跃视频数量，如果超过最大值，暂停最早的一个
  manageActiveVideos(currentKey) {
    let activeVideos = { ...this.data.activeVideos };
    const activeKeys = Object.keys(activeVideos).filter(key => activeVideos[key]);
    
    if (activeKeys.length > this.data.maxActiveVideos) {
      // 找到当前 key 之外最早的活跃视频
      const keyToPause = activeKeys.find(key => key !== currentKey);
      if (keyToPause) {
        // 将该视频标记为非活跃
        activeVideos[keyToPause] = false;
        this.setData({ activeVideos });
        
        // 暂停该视频
        const [type, indexStr] = keyToPause.split('-');
        const index = parseInt(indexStr);
        this.pauseVideo(type, index);
      }
    }
  },
  
  // 跳转到个人中心
  goToProfile() {
    wx.switchTab({
      url: '/pages/Personal/Personal'
    });
  },

  // 添加福利页面导航功能
  goToBenefitPage(e) {
    const index = e.currentTarget.dataset.index;
    // 根据索引计算滚动位置
    let scrollPosition = 0;
    switch (index) {
      case 0:
        scrollPosition = 0;
        break;
      case 1:
        scrollPosition = 320;
        break;
      case 2:
        scrollPosition = 640;
        break;
    }
    
    this.setData({
      benefitScrollLeft: scrollPosition
    });
  },
  
  /**
   * 跳转到资产页面
   */
  goToAsset(e) {
    const index = e.currentTarget.dataset.index;
    
    // 根据索引决定跳转到哪个页面
    if (index === 0) {
      wx.navigateTo({
        url: '/pages/points/points'
      });
    } 
    else if (index === 1) {
      wx.navigateTo({
        url: '/pages/coupons/coupons'
      });
    } 
    else if (index === 2) {
      wx.navigateTo({
        url: '/pages/giftCards/giftCards'
      });
    }
  },
  
  /**
   * 跳转到余额页面
   */
  goToBalance() {
    wx.navigateTo({
      url: '/pages/balance/balance'
    });
  },

  /**
   * 获取推荐产品图片的临时URL
   */
  getRecommendImageUrl() {
    const imageUrl = this.data.recommendPopup.product.image;
    
    // 检查是否是云存储路径
    if (imageUrl && imageUrl.includes('cloud://')) {
      wx.cloud.getTempFileURL({
        fileList: [imageUrl],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            this.setData({
              'recommendPopup.product.imageTemp': res.fileList[0].tempFileURL
            });
            console.log('获取临时URL成功:', res.fileList[0].tempFileURL);
          }
        },
        fail: err => {
          console.error('获取临时URL失败:', err);
        }
      });
    }
  },

  /**
   * 显示推荐产品弹窗
   */
  showRecommendPopup() {
    this.setData({
      'recommendPopup.show': true
    });
    
    // 延迟播放视频，等待弹窗显示完成
    setTimeout(() => {
      this.playRecommendVideo();
    }, 500);
  },

  /**
   * 关闭推荐产品弹窗
   */
  closeRecommendPopup() {
    this.setData({
      'recommendPopup.show': false
    });
    
    // 停止视频播放
    const videoContext = wx.createVideoContext('recommend-video', this);
    if (videoContext) {
      videoContext.stop();
    }
  },
  
  /**
   * 播放推荐视频
   */
  playRecommendVideo() {
    try {
      const videoContext = wx.createVideoContext('recommend-video', this);
      if (videoContext) {
        videoContext.play();
        console.log('开始播放推荐视频');
      }
    } catch(e) {
      console.error('播放推荐视频出错:', e);
    }
  },
  
  /**
   * 查看推荐产品详情
   */
  goToRecommendProduct() {
    this.closeRecommendPopup();
    wx.navigateTo({
      url: '/pages/detail1/detail1'
    });
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
          
        // 账户资产
        'accountBalance': userData.accountBalance,
        'assets.points': userData.assets.points,
        'assets.coupons': userData.assets.coupons,
        'assets.favorites': userData.assets.favorites,
      });
        
      // 将更新后的用户信息保存到本地存储
      wx.setStorageSync('userInfo', this.data.userInfo);
      
      // 更新账户余额到本地存储
      wx.setStorageSync('accountBalance', userData.accountBalance);
      
      // 更新用户ID信息到缓存，便于其他页面获取
      wx.setStorageSync('currentUserId', profileId);
      
      // 获取礼品卡真实数量
      this.loadGiftCardsCount();
      
      // 获取优惠券真实数量
      this.loadCouponsCount();
      
      wx.hideLoading();
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
          'assets.giftCards': cardCount
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
          'assets.coupons': couponCount
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
      'assets.coupons': couponCount
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

  /**
   * 加载用户余额
   */
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
  },

  /**
   * 加载用户积分
   */
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
            'assets.points': points
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
  },
})