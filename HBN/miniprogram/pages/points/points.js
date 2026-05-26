// pages/points/points.js
Page({
  data: {
    // 用户积分信息
    pointsInfo: {
      total: 2580,
      expiring: 500,
      expiringDate: '2025-06-30'
    },
    
    // 当前选中的Tab
    currentTab: 0,
    
    // Tab项
    tabs: ['积分明细', '积分规则', '积分兑换'],
    
    // 积分明细列表
    pointsDetails: [
      {
        id: 'P001',
        type: 'gain',
        amount: 300,
        desc: '购买商品奖励',
        date: '2025-05-25',
        orderNo: 'O202505250001'
      },
      {
        id: 'P002',
        type: 'gain',
        amount: 100,
        desc: '评价商品奖励',
        date: '2025-05-23',
        orderNo: 'O202505200003'
      },
      {
        id: 'P003',
        type: 'consume',
        amount: 200,
        desc: '积分兑换优惠券',
        date: '2025-05-20'
      },
      {
        id: 'P004',
        type: 'gain',
        amount: 500,
        desc: '邀请好友注册',
        date: '2025-05-15'
      },
      {
        id: 'P005',
        type: 'consume',
        amount: 300,
        desc: '积分抵扣订单',
        date: '2025-05-10',
        orderNo: 'O202505100005'
      },
      {
        id: 'P006',
        type: 'gain',
        amount: 200,
        desc: '生日特别奖励',
        date: '2025-05-05'
      }
    ],
    
    // 积分规则
    pointsRules: [
      {
        title: '积分获取规则',
        content: [
          '1. 商品购买：消费1元获得1积分',
          '2. 商品评价：每条评价获得10积分，带图评价获得20积分',
          '3. 签到奖励：每日签到获得5积分，连续签到额外奖励',
          '4. 邀请好友：每成功邀请一位好友注册可获得100积分',
          '5. 会员升级：升级银牌会员奖励500积分，升级金牌会员奖励1000积分',
          '6. 参与活动：参与指定活动可获得相应积分奖励'
        ]
      },
      {
        title: '积分使用规则',
        content: [
          '1. 积分抵扣：100积分可抵扣1元，每单最高可抵扣订单金额的30%',
          '2. 积分兑换：可兑换优惠券、礼品、会员权益等',
          '3. 积分有效期：积分自获得之日起有效期为12个月',
          '4. 积分结算：按照先进先出原则进行结算',
          '5. 退款退货：退款退货将扣除相应消费获取的积分'
        ]
      },
      {
        title: '积分特别说明',
        content: [
          '1. 积分不可转让、不可提现',
          '2. 积分规则如有变更，将提前公告通知',
          '3. 如发现任何积分作弊行为，将取消积分资格并清零积分',
          '4. 本规则最终解释权归HBN护肤品商城所有'
        ]
      }
    ],
    
    // 积分兑换商品
    exchangeItems: [
      {
        id: 'E001',
        title: '5元优惠券',
        points: 500,
        image: '/assets/images/coupon.png',
        stock: 999,
        limit: 5
      },
      {
        id: 'E002',
        title: '10元优惠券',
        points: 1000,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/礼品卡.png',
        stock: 800,
        limit: 3
      },
      {
        id: 'E003',
        title: '面膜体验装',
        points: 1500,
        image: '/assets/images/mask.png',
        stock: 100,
        limit: 1
      },
      {
        id: 'E004',
        title: '护手霜',
        points: 2000,
        image: '/assets/images/cream.png',
        stock: 50,
        limit: 1
      },
      {
        id: 'E005',
        title: '精美洗漱包',
        points: 3000,
        image: '/assets/images/bag.png',
        stock: 20,
        limit: 1
      },
      {
        id: 'E006',
        title: '银牌会员月卡',
        points: 5000,
        image: '/assets/images/vip.png',
        stock: 10,
        limit: 1
      }
    ],
    
    // 分页加载
    isLoading: false,
    isEnded: false,
    totalPoints: 0, // 当前积分
    pointsRecords: [], // 积分记录
    showExchangePopup: false, // 是否显示兑换弹窗
    selectedGiftCard: null, // 选中的礼品卡
    exchangeLoading: false, // 兑换加载状态
    exchangeSuccess: false, // 兑换成功
    // 可兑换的礼品卡列表
    giftCards: [
      {
        id: 1,
        name: '¥10 礼品卡',
        value: 10,
        points: 800,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/礼品卡.png',
        desc: '可用于HBN商城购物'
      },
      {
        id: 2,
        name: '¥20 礼品卡',
        value: 20,
        points: 1500,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/礼品卡.png',
        desc: '可用于HBN商城购物'
      },
      {
        id: 3,
        name: '¥50 礼品卡',
        value: 50,
        points: 3500,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/礼品卡.png',
        desc: '可用于HBN商城购物'
      },
      {
        id: 4,
        name: '¥100 礼品卡',
        value: 100,
        points: 6500,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/礼品卡.png',
        desc: '可用于HBN商城购物'
      }
    ],
    showSignInPopup: false, // 是否显示签到弹窗
    hasSignedIn: false, // 今日是否已签到
    signInPoints: 10, // 签到可获得的积分
    pageSize: 10,   // 每页记录数量
    currentPage: 1,  // 当前页码
    totalRecords: 0  // 总记录数
  },
  
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
    
    // 如果有指定tab，则切换到对应tab
    if (options.tab) {
      const tab = parseInt(options.tab);
      if (tab >= 0 && tab <= 2) {
        this.setData({
          currentTab: tab
        });
      }
    }
    
    // 页面加载时执行，可以在这里获取用户积分信息
    this.loadUserPoints();
    this.loadPointsRecords();
    
    // 检查今日是否已签到
    this.checkSignInStatus();
  },
  
  onShow: function() {
    // 检查是否需要刷新积分数据
    const pointsNeedRefresh = wx.getStorageSync('pointsNeedRefresh');
    if (pointsNeedRefresh) {
      console.log('检测到积分变更，刷新数据');
      this.loadUserPoints();
      this.loadPointsRecords();
      // 清除刷新标志
      wx.removeStorageSync('pointsNeedRefresh');
    }
    
    // 检查今日是否已签到
    this.checkSignInStatus();
  },
  
  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: parseInt(tab)
    });
  },
  
  // 获取更多积分明细
  loadMore: function() {
    if (this.data.isLoading || this.data.isEnded) return;
    
    this.setData({
      isLoading: true,
      currentPage: this.data.currentPage + 1
    });
    
    this.loadPointsRecordsFromCloud(this.data.currentPage);
  },
  
  // 查看积分明细
  viewDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const detail = this.data.pointsRecords.find(item => item.id === id);
    
    if (detail) {
      let content = `积分变动：${detail.type === 'earn' ? '+' : ''}${detail.points}\n`;
      content += `变动原因：${detail.desc}\n`;
      content += `变动时间：${detail.date}`;
      
      if (detail.relatedOrder) {
        content += `\n关联订单：${detail.relatedOrder}`;
      }
      
      wx.showModal({
        title: '积分明细',
        content: content,
        showCancel: false,
        confirmText: '我知道了'
      });
    }
  },
  
  // 查看积分兑换详情
  viewExchangeItem: function(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.exchangeItems.find(item => item.id === id);
    
    if (item) {
      wx.navigateTo({
        url: `/pages/points/exchange/detail?id=${id}`
      });
    }
  },
  
  // 兑换商品
  exchangeItem: function(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.exchangeItems.find(item => item.id === id);
    
    if (item) {
      if (this.data.pointsInfo.total < item.points) {
        wx.showToast({
          title: '积分不足',
          icon: 'none'
        });
        return;
      }
      
      wx.showModal({
        title: '确认兑换',
        content: `确定使用 ${item.points} 积分兑换 ${item.title}？`,
        success: res => {
          if (res.confirm) {
            // 模拟兑换过程
            wx.showLoading({
              title: '兑换中...',
              mask: true
            });
            
            setTimeout(() => {
              wx.hideLoading();
              
              wx.showToast({
                title: '兑换成功',
                icon: 'success'
              });
              
              // 更新积分余额
              this.setData({
                'pointsInfo.total': this.data.pointsInfo.total - item.points
              });
              
              // 实际项目中这里应该发起兑换请求，并根据返回结果更新界面
            }, 1500);
          }
        }
      });
    }
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    // 刷新积分数据
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  },
  
  // 触底加载更多
  onReachBottom: function() {
    if (this.data.currentTab === 0) {
      this.loadMore();
    }
  },
  
  /**
   * 加载用户积分信息
   */
  loadUserPoints: function() {
    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
    });
    
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    // 获取用户ID
    let userId = 2; // 默认都市新锐青年
    
    if (userInfo) {
      if (userInfo.nickName === '职场精英女性') {
        userId = 1;
      } else if (userInfo.nickName === '科研工作者') {
        userId = 3;
      }
    }
    
    // 从云数据库获取用户信息
    const db = wx.cloud.database();
    db.collection('user').where({
      id: userId
    }).get().then(res => {
      if (res.data && res.data.length > 0) {
        const userData = res.data[0];
        const points = userData.experience || userData.assets.points || 0;
        
        this.setData({
          totalPoints: points
        });
        
        // 隐藏加载提示
        wx.hideLoading();
      } else {
        // 使用本地存储的积分
        this.loadPointsFromLocalStorage();
      }
    }).catch(err => {
      console.error('获取用户积分信息失败:', err);
      // 使用本地存储的积分
      this.loadPointsFromLocalStorage();
    });
  },
  
  /**
   * 从本地存储加载积分信息
   */
  loadPointsFromLocalStorage: function() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    // 获取积分信息
    let points = 0;
    
    if (userInfo) {
      if (userInfo.nickName === '职场精英女性') {
        points = 1580;
      } 
      else if (userInfo.nickName === '都市新锐青年') {
        points = 860;
      } 
      else if (userInfo.nickName === '科研工作者') {
        points = 2260;
      } 
      else {
        // 默认使用experience作为积分
        points = userInfo.experience || 0;
      }
    }
    
    this.setData({
      totalPoints: points
    });
    
    // 隐藏加载提示
    wx.hideLoading();
  },
  
  /**
   * 加载积分记录
   */
  loadPointsRecords: function() {
    // 重置分页信息
    this.setData({
      currentPage: 1,
      isEnded: false,
      pointsRecords: []
    });
    
    // 从云数据库加载积分记录
    this.loadPointsRecordsFromCloud(1);
  },
  
  /**
   * 从云数据库加载积分记录
   */
  loadPointsRecordsFromCloud: function(page) {
    // 显示加载提示
    if (page === 1) {
      wx.showLoading({
        title: '加载中...',
      });
    }
    
    this.setData({
      isLoading: true
    });
    
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    // 获取用户ID
    let userId = 2; // 默认都市新锐青年
    
    if (userInfo) {
      if (userInfo.nickName === '职场精英女性') {
        userId = 1;
      } else if (userInfo.nickName === '科研工作者') {
        userId = 3;
      }
    }
    
    // 计算分页参数
    const pageSize = this.data.pageSize;
    const skip = (page - 1) * pageSize;
    
    // 从云数据库获取积分记录
    const db = wx.cloud.database();
    db.collection('points')
      .where({
        userId: userId
      })
      .orderBy('date', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
      .then(res => {
        // 隐藏加载提示
        wx.hideLoading();
        
        if (res.data && res.data.length > 0) {
          // 处理积分记录
          const records = res.data;
          
          // 添加到现有记录中
          const newRecords = page === 1 ? records : [...this.data.pointsRecords, ...records];
          
          // 更新页面数据
          this.setData({
            pointsRecords: newRecords,
            isLoading: false,
            isEnded: records.length < pageSize
          });
        } else {
          // 没有更多记录
          this.setData({
            isLoading: false,
            isEnded: true
          });
          
          // 如果是第一页且没有记录，则使用模拟数据
          if (page === 1) {
            this.useSimulatedPointsRecords();
          }
        }
      })
      .catch(err => {
        console.error('获取积分记录失败:', err);
        
        // 隐藏加载提示
        wx.hideLoading();
        
        this.setData({
          isLoading: false
        });
        
        // 使用模拟数据
        this.useSimulatedPointsRecords();
      });
  },
  
  /**
   * 使用模拟的积分记录数据
   */
  useSimulatedPointsRecords: function() {
    // 根据用户角色生成不同的积分记录
    const userInfo = wx.getStorageSync('userInfo');
    let records = [];
    
    if (userInfo) {
      if (userInfo.nickName === '职场精英女性') {
        records = [
          { id: 'P1001', type: 'earn', points: 300, desc: '购买套装赠送', date: '2025-05-25 14:22:35', balance: 1580 },
          { id: 'P1002', type: 'earn', points: 150, desc: '五星好评', date: '2025-05-20 09:15:20', balance: 1280 },
          { id: 'P1003', type: 'earn', points: 580, desc: '推荐好友', date: '2025-05-15 18:30:42', balance: 1130 },
          { id: 'P1004', type: 'spend', points: -500, desc: '兑换礼品卡', date: '2025-05-10 10:05:18', balance: 550 },
          { id: 'P1005', type: 'earn', points: 50, desc: '每日签到', date: '2025-05-09 08:12:36', balance: 1050 },
          { id: 'P1006', type: 'earn', points: 500, desc: '生日礼遇', date: '2025-05-05 00:00:00', balance: 1000 }
        ];
      } 
      else if (userInfo.nickName === '都市新锐青年') {
        records = [
          { id: 'P2001', type: 'earn', points: 100, desc: '购买产品赠送', date: '2025-05-26 16:45:23', balance: 860 },
          { id: 'P2002', type: 'earn', points: 60, desc: '分享朋友圈', date: '2025-05-23 12:20:15', balance: 760 },
          { id: 'P2003', type: 'earn', points: 200, desc: '参与活动', date: '2025-05-18 19:42:36', balance: 700 },
          { id: 'P2004', type: 'spend', points: -300, desc: '兑换新品试用', date: '2025-05-16 14:30:28', balance: 500 },
          { id: 'P2005', type: 'earn', points: 300, desc: '完成问卷调查', date: '2025-05-10 09:22:15', balance: 800 },
          { id: 'P2006', type: 'earn', points: 500, desc: '首单奖励', date: '2025-05-02 15:18:42', balance: 500 }
        ];
      } 
      else if (userInfo.nickName === '科研工作者') {
        records = [
          { id: 'P3001', type: 'earn', points: 500, desc: '累计消费达标奖励', date: '2025-05-27 10:30:15', balance: 2260 },
          { id: 'P3002', type: 'earn', points: 260, desc: '撰写产品评测', date: '2025-05-22 16:45:30', balance: 1760 },
          { id: 'P3003', type: 'spend', points: -800, desc: '兑换礼品卡', date: '2025-05-18 11:25:42', balance: 1500 },
          { id: 'P3004', type: 'earn', points: 800, desc: '推荐好友', date: '2025-05-15 08:40:18', balance: 2300 },
          { id: 'P3005', type: 'earn', points: 500, desc: '连续签到30天', date: '2025-05-10 09:15:36', balance: 1500 },
          { id: 'P3006', type: 'earn', points: 1000, desc: '会员升级礼包', date: '2025-05-01 00:00:00', balance: 1000 }
        ];
      } 
      else {
        // 默认积分记录
        records = [
          { id: 'P0001', type: 'earn', points: 100, desc: '新用户注册', date: '2025-05-25 14:22:35', balance: 100 }
        ];
      }
    }
    
    this.setData({
      pointsRecords: records,
      isEnded: true
    });
  },
  
  /**
   * 处理签到
   */
  handleSignIn: function() {
    // 检查今日是否已签到
    if (this.data.hasSignedIn) {
      wx.showToast({
        title: '今日已签到',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '签到中...',
      mask: true
    });
    
    // 获取用户ID
    const userInfo = wx.getStorageSync('userInfo');
    let userId = 2; // 默认都市新锐青年
    
    if (userInfo) {
      if (userInfo.nickName === '职场精英女性') {
        userId = 1;
      } else if (userInfo.nickName === '科研工作者') {
        userId = 3;
      }
    }
    
    // 调用云函数添加积分
    wx.cloud.callFunction({
      name: 'updatePoints',
      data: {
        action: 'addPoints',
        userId: userId,
        points: this.data.signInPoints,
        reason: '每日签到'
      }
    }).then(res => {
      wx.hideLoading();
      
      if (res.result && res.result.success) {
        console.log('签到成功:', res.result);
        
        // 更新本地积分
        const newPoints = res.result.newPoints;
        
        // 更新页面数据
        this.setData({
          totalPoints: newPoints,
          hasSignedIn: true,
          showSignInPopup: true
        });
        
        // 更新用户信息中的积分
        if (userInfo) {
          userInfo.experience = newPoints;
          wx.setStorageSync('userInfo', userInfo);
        }
        
        // 更新资产信息
        const assets = wx.getStorageSync('assets') || {
          points: 0,
          coupons: 0,
          giftCards: 0,
          favorites: 0
        };
        
        assets.points = newPoints;
        wx.setStorageSync('assets', assets);
        
        // 刷新积分记录
        this.loadPointsRecords();
        
        // 记录签到状态到本地存储
        this.saveSignInStatus();
      } else {
        console.error('签到失败:', res);
        wx.showToast({
          title: '签到失败，请重试',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.hideLoading();
      
      // 使用本地处理方式
      this.handleSignInLocally(this.data.totalPoints + this.data.signInPoints);
    });
  },
  
  /**
   * 本地处理签到
   */
  handleSignInLocally: function(newPoints) {
    // 更新积分
    this.setData({
      totalPoints: newPoints,
      hasSignedIn: true,
      showSignInPopup: true
    });
    
    // 更新用户信息中的积分
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      userInfo.experience = newPoints;
      wx.setStorageSync('userInfo', userInfo);
    }
    
    // 更新资产信息
    const assets = wx.getStorageSync('assets') || {
      points: this.data.totalPoints,
      coupons: 0,
      giftCards: 0,
      favorites: 0
    };
    
    assets.points = newPoints;
    wx.setStorageSync('assets', assets);
    
    // 添加新的积分记录
    const now = new Date();
    const dateStr = this.formatDate(now);
    
    const newRecord = {
      id: `P${Math.floor(Math.random() * 9000) + 1000}`,
      type: 'earn',
      points: this.data.signInPoints,
      desc: '每日签到',
      date: dateStr,
      balance: newPoints
    };
    
    const records = [newRecord, ...this.data.pointsRecords];
    
    this.setData({
      pointsRecords: records
    });
    
    // 记录签到状态到本地存储
    this.saveSignInStatus();
  },
  
  /**
   * 更新用户积分
   */
  updateUserPoints: function(newPoints) {
    // 获取用户ID
    const userInfo = wx.getStorageSync('userInfo');
    let userId = 2; // 默认都市新锐青年
    
    if (userInfo) {
      if (userInfo.nickName === '职场精英女性') {
        userId = 1;
      } else if (userInfo.nickName === '科研工作者') {
        userId = 3;
      }
    }
    
    // 更新云数据库中的用户积分
    const db = wx.cloud.database();
    db.collection('user')
      .where({
        id: userId
      })
      .update({
        data: {
          experience: newPoints,
          'assets.points': newPoints
        }
      })
      .then(() => {
        console.log('用户积分更新成功');
        
        // 更新本地存储
        if (userInfo) {
          userInfo.experience = newPoints;
          wx.setStorageSync('userInfo', userInfo);
        }
        
        // 更新资产信息
        const assets = wx.getStorageSync('assets') || {
          points: 0,
          coupons: 0,
          giftCards: 0,
          favorites: 0
        };
        
        assets.points = newPoints;
        wx.setStorageSync('assets', assets);
      })
      .catch(err => {
        console.error('用户积分更新失败:', err);
      });
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
  },
  
  /**
   * 保存签到状态到本地存储
   */
  saveSignInStatus: function() {
    const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
    const signInRecord = wx.getStorageSync('signInRecord') || {};
    
    // 记录今日签到
    signInRecord[today] = true;
    
    wx.setStorageSync('signInRecord', signInRecord);
  },
  
  /**
   * 检查今日是否已签到
   */
  checkSignInStatus: function() {
    const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
    const signInRecord = wx.getStorageSync('signInRecord') || {};
    
    const hasSignedIn = !!signInRecord[today];
    
    this.setData({
      hasSignedIn: hasSignedIn
    });
  },
  
  /**
   * 关闭签到弹窗
   */
  closeSignInPopup: function() {
    this.setData({
      showSignInPopup: false
    });
  },
  
  /**
   * 显示兑换弹窗
   */
  showExchangePopup: function() {
    this.setData({
      showExchangePopup: true
    });
  },
  
  /**
   * 关闭兑换弹窗
   */
  closeExchangePopup: function() {
    this.setData({
      showExchangePopup: false,
      selectedGiftCard: null,
      exchangeSuccess: false
    });
  },
  
  /**
   * 选择礼品卡
   */
  selectGiftCard: function(e) {
    const index = e.currentTarget.dataset.index;
    const giftCard = this.data.giftCards[index];
    
    this.setData({
      selectedGiftCard: giftCard
    });
  },
  
  /**
   * 兑换礼品卡
   */
  exchangeGiftCard: function() {
    if (!this.data.selectedGiftCard) {
      wx.showToast({
        title: '请先选择礼品卡',
        icon: 'none'
      });
      return;
    }
    
    const points = this.data.selectedGiftCard.points;
    
    // 验证积分是否足够
    if (this.data.totalPoints < points) {
      wx.showToast({
        title: '积分不足',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      exchangeLoading: true
    });
    
    // 模拟兑换过程
    setTimeout(() => {
      // 更新积分
      const newPoints = this.data.totalPoints - points;
      
      // 更新用户信息中的积分
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        userInfo.experience = newPoints;
        wx.setStorageSync('userInfo', userInfo);
      }
      
      // 更新礼品卡数量
      const assets = wx.getStorageSync('assets') || {
        points: this.data.totalPoints,
        coupons: 0,
        giftCards: 0,
        favorites: 0
      };
      
      assets.points = newPoints;
      assets.giftCards += 1;
      
      wx.setStorageSync('assets', assets);
      
      // 添加新的积分记录
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newRecord = {
        id: `P${Math.floor(Math.random() * 9000) + 1000}`,
        type: 'spend',
        points: -points,
        desc: `兑换${this.data.selectedGiftCard.name}`,
        date: dateStr,
        balance: newPoints
      };
      
      const records = [newRecord, ...this.data.pointsRecords];
      
      this.setData({
        totalPoints: newPoints,
        pointsRecords: records,
        exchangeLoading: false,
        exchangeSuccess: true
      });
    }, 1500);
  },
  
  /**
   * 导航返回
   */
  goBack: function() {
    wx.navigateBack();
  },
  
  /**
   * 分享
   */
  onShareAppMessage: function() {
    return {
      title: '邀请好友得积分',
      path: '/pages/index/index',
      imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/分享.png'
    }
  }
}) 