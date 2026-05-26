// pages/coupons/coupons.js
Page({
  data: {
    activeTab: 'valid', // 当前选中的标签页：valid-可用，used-已使用，expired-已过期
    coupons: {
      valid: [], // 可用优惠券
      used: [],  // 已使用优惠券
      expired: [] // 已过期优惠券
    },
    totalCoupons: 0, // 优惠券总数
    loading: true, // 加载状态
    isSelectMode: false, // 是否是选择模式（从确认订单页面跳转而来）
    selectedCouponId: null, // 当前选中的优惠券ID
    selectEnabled: true, // 是否允许选择操作
    selectedCoupon: null, // 当前选中的优惠券对象
    tempCoupons: [], // 从后端获取的临时优惠券数据
    currentUserProfile: '' // 当前用户画像
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 初始化云环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-0gxff61z2804383c',
        traceUser: true,
      });
    }
    
    // 判断是否是选择模式
    if (options.select && options.select === 'true') {
      this.setData({
        isSelectMode: true,
        selectedCouponId: options.selectedId || null
      });
      
      // 从本地存储获取可用优惠券列表
      const usableCoupons = wx.getStorageSync('usableCoupons') || [];
      
      if (usableCoupons.length > 0) {
        // 直接使用传过来的可用优惠券
        this.setData({
          'coupons.valid': usableCoupons,
          totalCoupons: usableCoupons.length,
          loading: false
        });
      } else {
        // 如果没有从确认订单页获取到可用优惠券，则从云数据库获取
        this.loadCouponsFromCloud(true);
      }
    } else {
      // 不是选择模式，加载所有优惠券
      this.loadCouponsFromCloud(false);
      }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 检查是否需要刷新优惠券数据
    const couponsNeedRefresh = wx.getStorageSync('couponsNeedRefresh');
    if (couponsNeedRefresh) {
      console.log('检测到优惠券变更，刷新数据');
      // 清除刷新标志
      wx.removeStorageSync('couponsNeedRefresh');
      
      // 重新加载优惠券
      if (this.data.isSelectMode) {
        this.loadCouponsFromCloud(true);
      } else {
        this.loadCouponsFromCloud(false);
      }
      return;
    }
    
    // 每次页面显示时检查用户画像是否有变化
    const lastUserProfile = this.data.currentUserProfile || '';
    const userInfo = wx.getStorageSync('userInfo') || {};
    const currentUserProfile = userInfo.nickName || '';
    
    // 如果用户画像发生变化，重新加载优惠券数据
    if (lastUserProfile !== currentUserProfile) {
      this.setData({ currentUserProfile: currentUserProfile });
      
      if (this.data.isSelectMode) {
        this.loadCouponsFromCloud(true);
      } else {
        this.loadCouponsFromCloud(false);
      }
      
      console.log('用户画像已更新，重新加载优惠券数据:', currentUserProfile);
    }
  },
  
  /**
   * 从云数据库加载优惠券数据
   * @param {boolean} onlyUsable 是否只加载可用优惠券
   */
  loadCouponsFromCloud: function(onlyUsable = false) {
    this.setData({ loading: true });
    
    // 获取用户画像信息
    const userInfo = wx.getStorageSync('userInfo') || {};
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    // 保存当前用户画像，用于检测变化
    this.setData({ currentUserProfile: userInfo.nickName || '' });
    
    console.log('当前用户画像:', userInfo.nickName, '用户ID:', userId);
    
    // 从云数据库获取对应用户画像的优惠券
    const db = wx.cloud.database();
    const couponCollection = db.collection('coupons');
    
    couponCollection.where({
      userId: userId
    }).get().then(res => {
      if (res.data && res.data.length > 0) {
        // 对优惠券进行分类
        const now = new Date();
        const validCoupons = [];
        const usedCoupons = [];
        const expiredCoupons = [];
        
        res.data.forEach(coupon => {
          const expireDate = new Date(coupon.expireDate);
          
          if (coupon.used) {
            usedCoupons.push(coupon);
          } else if (expireDate < now) {
            expiredCoupons.push(coupon);
          } else {
            // 可用优惠券
            // 如果是选择模式，判断是否符合订单条件
            if (this.data.isSelectMode) {
              // 使用存储在本地的可用优惠券筛选条件
              const usableCoupons = wx.getStorageSync('usableCoupons') || [];
              const matchedCoupon = usableCoupons.find(item => item.id === coupon.id);
              
              if (matchedCoupon) {
                validCoupons.push(coupon);
              }
            } else {
              validCoupons.push(coupon);
            }
          }
        });
        
        // 更新页面数据
        if (onlyUsable) {
          this.setData({
            'coupons.valid': validCoupons,
            totalCoupons: validCoupons.length,
            loading: false
          });
        } else {
          this.setData({
            'coupons.valid': validCoupons,
            'coupons.used': usedCoupons,
            'coupons.expired': expiredCoupons,
            totalCoupons: validCoupons.length + usedCoupons.length + expiredCoupons.length,
            loading: false
          });
        }
        
        // 如果是选择模式，且有已选中的优惠券ID，设置选中状态
        if (this.data.isSelectMode && this.data.selectedCouponId) {
          const selectedCoupon = validCoupons.find(coupon => coupon.id == this.data.selectedCouponId);
          if (selectedCoupon) {
      this.setData({
              selectedCoupon: selectedCoupon
            });
          }
        }
      } else {
        // 没有找到优惠券数据，使用模拟数据
        this.loadMockCoupons(onlyUsable);
      }
    }).catch(err => {
      console.error('获取优惠券数据失败:', err);
      // 使用模拟数据
      this.loadMockCoupons(onlyUsable);
      });
  },
  
  /**
   * 加载模拟优惠券数据
   */
  loadMockCoupons: function(onlyUsable = false) {
    // 获取最新的用户画像
    const userInfo = wx.getStorageSync('userInfo') || {};
    const userProfile = userInfo.nickName || '';
    
    // 保存当前用户画像，用于检测变化
    this.setData({ currentUserProfile: userProfile });
    
    console.log('使用模拟数据 - 当前用户画像:', userProfile);
    
    // 模拟优惠券数据
    const mockCoupons = [
        {
        id: 1,
        name: '满200减30',
          type: 'discount',
        condition: 200,
          value: 30,
        expireDate: '2025-06-30',
        desc: '全场通用',
        instructions: '不可与其他优惠同时使用',
        used: false,
        usable: true
      },
      {
        id: 2,
        name: '满100减10',
        type: 'discount',
        condition: 100,
        value: 10,
        expireDate: '2025-06-15',
        desc: '护肤品类专用',
        instructions: '仅限护肤品类商品使用',
        used: false,
        usable: true
        },
        {
        id: 3,
        name: '无门槛立减5元',
        type: 'direct',
        condition: 0,
        value: 5,
        expireDate: '2025-05-31',
        desc: '新人专享',
        instructions: '新用户首单可用',
        used: false,
        usable: true
      },
      {
        id: 4,
        name: '满300减50',
        type: 'discount',
        condition: 300,
        value: 50,
        expireDate: '2025-04-30',
        desc: '已过期',
        instructions: '全场通用',
        used: false,
        usable: false
        },
        {
        id: 5,
        name: '满150减20',
          type: 'discount',
        condition: 150,
        value: 20,
        expireDate: '2025-06-20',
        desc: '已使用',
        instructions: '全场通用',
        used: true,
        usable: false
      }
    ];
    
    // 根据用户画像调整优惠券数据
    let tempCoupons = [...mockCoupons];
    
    // 针对不同用户画像提供不同的优惠券
    if (userProfile === '职场精英女性') {
      // 增加高端优惠券
      tempCoupons.push({
        id: 6,
        name: '满500减100',
        type: 'discount',
        condition: 500,
        value: 100,
        expireDate: '2025-07-15',
        desc: '高端系列专享',
        instructions: '限高端系列产品使用',
        used: false,
        usable: true
      });
      // 增加高端会员优惠券
      tempCoupons.push({
        id: 7,
        name: '会员专享8.8折',
        type: 'percent',
        condition: 300,
        value: 12, // 12% off
        expireDate: '2025-08-30',
        desc: '会员专享折扣',
        instructions: '限高端系列产品使用',
        used: false,
        usable: true
      });
    } else if (userProfile === '科研工作者') {
      // 增加功效型优惠券
      tempCoupons.push({
        id: 8,
        name: '功效型产品8折',
        type: 'percent',
        condition: 0,
        value: 20, // 20% off
        expireDate: '2025-07-30',
        desc: '功效型产品专享',
        instructions: '限功效型产品使用',
        used: false,
        usable: true
      });
      // 增加眼部护理优惠券
      tempCoupons.push({
        id: 9,
        name: '眼部护理套装减70',
        type: 'discount',
        condition: 300,
        value: 70,
        expireDate: '2025-08-15',
        desc: '眼部护理专享',
        instructions: '限眼部护理产品使用',
        used: false,
        usable: true
      });
    } else if (userProfile === '都市新锐青年') {
      // 增加新品体验优惠券
      tempCoupons.push({
        id: 10,
        name: '新品立减30',
          type: 'discount',
        condition: 150,
        value: 30,
        expireDate: '2025-07-20',
        desc: '新品专享',
        instructions: '限2025年新品使用',
        used: false,
        usable: true
      });
      // 增加社交美妆优惠券
      tempCoupons.push({
        id: 11,
        name: '美妆产品8.5折',
        type: 'percent',
        condition: 200,
        value: 15, // 15% off
        expireDate: '2025-08-10',
        desc: '美妆产品专享',
        instructions: '限美妆产品使用',
        used: false,
        usable: true
      });
    }
    
    this.setData({ tempCoupons });
    
    // 对优惠券进行分类
    const now = new Date();
    const validCoupons = [];
    const usedCoupons = [];
    const expiredCoupons = [];
    
    tempCoupons.forEach(coupon => {
      const expireDate = new Date(coupon.expireDate);
      
      if (coupon.used) {
        usedCoupons.push(coupon);
      } else if (expireDate < now) {
        expiredCoupons.push(coupon);
      } else {
        // 可用优惠券
        // 如果是选择模式，判断是否符合订单条件
        if (this.data.isSelectMode) {
          // 使用存储在本地的可用优惠券筛选条件
          const usableCoupons = wx.getStorageSync('usableCoupons') || [];
          
          // 如果没有可用优惠券列表或列表为空，直接添加所有有效优惠券
          if (!usableCoupons || usableCoupons.length === 0) {
            validCoupons.push(coupon);
          } else {
            // 否则根据订单金额过滤
            const matchedCoupon = usableCoupons.find(item => item.id === coupon.id);
            if (matchedCoupon) {
              validCoupons.push(coupon);
            }
          }
        } else {
          validCoupons.push(coupon);
        }
      }
    });
    
    // 更新页面数据
    if (onlyUsable) {
      this.setData({
        'coupons.valid': validCoupons,
        totalCoupons: validCoupons.length,
        loading: false
      });
    } else {
      this.setData({
        'coupons.valid': validCoupons,
        'coupons.used': usedCoupons,
        'coupons.expired': expiredCoupons,
        totalCoupons: validCoupons.length + usedCoupons.length + expiredCoupons.length,
        loading: false
      });
    }
    
    // 如果是选择模式，且有已选中的优惠券ID，设置选中状态
    if (this.data.isSelectMode && this.data.selectedCouponId) {
      const selectedCoupon = validCoupons.find(coupon => coupon.id == this.data.selectedCouponId);
      if (selectedCoupon) {
        this.setData({
          selectedCoupon: selectedCoupon
        });
      }
    }
  },

  /**
   * 切换标签页
   */
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  /**
   * 显示优惠券详情
   */
  showCouponDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const tab = this.data.activeTab;
    const coupon = this.data.coupons[tab][index];
    
    // 如果是选择模式且点击的是可用优惠券，直接选中
    if (this.data.isSelectMode && tab === 'valid') {
      this.selectCoupon(e);
      return;
    }
    
    wx.navigateTo({
      url: `/pages/coupon-detail/coupon-detail?id=${coupon.id}`,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptCouponData', { coupon: coupon });
      }
    });
  },

  /**
   * 选择优惠券
   */
  selectCoupon: function(e) {
    // 只有在选择模式下才可选择
    if (!this.data.isSelectMode) return;
    
    const index = e.currentTarget.dataset.index;
    const coupon = this.data.coupons.valid[index];
    
    // 更新选中状态
    this.setData({
      selectedCoupon: coupon,
      selectedCouponId: coupon.id
    });
  },

  /**
   * 使用优惠券 - 将选中的优惠券应用到确认订单页面
   */
  useCoupon: function(e) {
    // 如果没有选中优惠券，提示用户
    if (!this.data.selectedCoupon) {
      wx.showToast({
        title: '请选择优惠券',
        icon: 'none'
      });
      return;
    }
    
    // 将选中的优惠券保存到本地存储
    wx.setStorageSync('selectedCoupon', this.data.selectedCoupon);
    
    console.log('应用优惠券到订单：', this.data.selectedCoupon);
    
    // 返回上一页
    wx.navigateBack();
  },

  /**
   * 不使用优惠券
   */
  cancelCoupon: function() {
    // 清空已选优惠券
    wx.removeStorageSync('selectedCoupon');
    
    // 返回上一页
    wx.navigateBack();
  },
  
  /**
   * 获取新优惠券
   */
  getCoupon: function() {
    wx.navigateTo({
      url: '/pages/coupon-center/coupon-center'
    });
  },
  
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    // 重新加载优惠券数据
    if (this.data.isSelectMode) {
      this.loadCouponsFromCloud(true);
    } else {
      this.loadCouponsFromCloud(false);
    }
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '我的专属优惠券，一起来享受超值优惠吧！',
      path: '/pages/coupons/coupons'
    };
  },
  
  /**
   * 返回上一页
   */
  goBack: function() {
    // 如果是选择模式，但没有选择优惠券，清空本地选择记录
    if (this.data.isSelectMode && !this.data.selectedCoupon) {
      wx.removeStorageSync('selectedCoupon');
    }
    
    wx.navigateBack();
  }
}) 