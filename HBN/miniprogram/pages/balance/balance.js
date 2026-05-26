Page({
  data: {
    balance: 0, // 账户余额
    balanceInfo: {
      availableBalance: 0, // 可用余额
      frozenBalance: 0 // 冻结余额
    },
    // 交易记录
    transactions: [],
    // 交易类型过滤
    typeFilter: 0, // 0:全部 1:充值 2:消费 3:退款 4:提现
    typeOptions: [
      { value: 0, text: '全部' },
      { value: 1, text: '充值' },
      { value: 2, text: '消费' },
      { value: 3, text: '退款' },
      { value: 4, text: '提现' }
    ],
    // 时间过滤
    dateFilter: 0, // 0:全部 1:最近一周 2:最近一个月 3:最近三个月
    dateOptions: [
      { value: 0, text: '全部' },
      { value: 1, text: '最近一周' },
      { value: 2, text: '最近一个月' },
      { value: 3, text: '最近三个月' }
    ],
    loadingMore: false,
    hasMore: true,
    pageNum: 1,
    pageSize: 10,
    totalIncome: 0,   // 总收入
    totalExpense: 0,  // 总支出
    showFilterPopup: false, // 是否显示筛选弹窗
    activeTab: 'all',  // 当前活动的标签：all-全部, income-收入, expense-支出
    db: null,
    currentUserId: 2
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
    
    this.data.db = wx.cloud.database();
    this.loadAccountBalance();
    this.loadTransactions();
  },
  
  onShow: function() {
    // 页面显示时检查是否需要刷新数据
    if (this.data.needRefresh) {
      this.loadAccountBalance();
      this.loadTransactions();
      this.setData({ needRefresh: false });
    }
    
    // 检查由订单页面设置的刷新标志
    const balanceNeedRefresh = wx.getStorageSync('balanceNeedRefresh');
    if (balanceNeedRefresh) {
      console.log('检测到余额变更，刷新数据');
      this.loadAccountBalance();
      this.loadTransactions();
      // 清除刷新标志
      wx.removeStorageSync('balanceNeedRefresh');
    }
  },
  
  // 从本地存储或云数据库加载账户余额
  loadAccountBalance: function() {
    wx.showLoading({
      title: '加载中...',
    });
    
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};
    let userId = 2; // 默认都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    // 从云数据库获取余额信息
    const db = wx.cloud.database();
    const userBalanceCollection = db.collection('user_balance');
    
    userBalanceCollection.where({
      userId: userId
    }).get().then(res => {
      if (res.data && res.data.length > 0) {
        const balanceData = res.data[0];
        
        // 设置余额信息
        this.setData({
          balance: parseFloat(balanceData.balance),
          balanceInfo: {
            availableBalance: parseFloat(balanceData.availableBalance),
            frozenBalance: parseFloat(balanceData.frozenBalance)
          },
          totalIncome: balanceData.totalIncome.toFixed(2),
          totalExpense: balanceData.totalExpense.toFixed(2)
        });
        
        // 更新本地存储的余额
        wx.setStorageSync('accountBalance', balanceData.balance);
      } else {
        // 如果没有找到数据，使用默认值或从本地存储获取
        const accountBalance = wx.getStorageSync('accountBalance') || '0';
    
    // 设置余额信息
    this.setData({
      balance: parseFloat(accountBalance),
      balanceInfo: {
        availableBalance: parseFloat(accountBalance),
            frozenBalance: 0
      }
    });
      }
      
      wx.hideLoading();
    }).catch(err => {
      console.error('获取余额信息失败:', err);
      
      // 如果获取失败，使用本地存储的数据
      const accountBalance = wx.getStorageSync('accountBalance') || '0';
      
      // 设置余额信息
      this.setData({
        balance: parseFloat(accountBalance),
        balanceInfo: {
          availableBalance: parseFloat(accountBalance),
          frozenBalance: 0
        }
      });
      
      wx.hideLoading();
      
      wx.showToast({
        title: '获取余额失败',
        icon: 'none',
        duration: 2000
      });
    });
  },
  
  // 加载交易记录
  loadTransactions: function() {
    wx.showLoading({
      title: '加载中...',
    });
    
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo') || {};
    let userId = 2; // 默认都市新锐青年
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    // 从云数据库获取交易记录
    const db = wx.cloud.database();
    const balanceCollection = db.collection('balance');
    
    // 构建查询条件
    let query = balanceCollection.where({
      userId: userId
    });
    
    // 应用类型过滤
    if (this.data.typeFilter !== 0) {
      query = query.where({
        type: this.data.typeFilter
      });
    }
    
    // 应用标签过滤
    if (this.data.activeTab === 'income') {
      query = query.where({
        amount: db.command.gt(0)
      });
    } else if (this.data.activeTab === 'expense') {
      query = query.where({
        amount: db.command.lt(0)
      });
    }
    
    // 应用日期过滤器
    if (this.data.dateFilter !== 0) {
      const now = new Date();
      let startDate = new Date();
      
      if (this.data.dateFilter === 1) {
        // 最近一周
        startDate.setDate(now.getDate() - 7);
      } else if (this.data.dateFilter === 2) {
        // 最近一个月
        startDate.setMonth(now.getMonth() - 1);
      } else if (this.data.dateFilter === 3) {
        // 最近三个月
        startDate.setMonth(now.getMonth() - 3);
      }
      
      query = query.where({
        date: db.command.gte(startDate.toISOString())
      });
    }
    
    // 查询总数以判断是否有更多数据
    query.count().then(res => {
      const total = res.total;
      const hasMore = total > (this.data.pageNum * this.data.pageSize);
      this.setData({ hasMore });
    });
    
    // 执行查询
    query.orderBy('date', 'desc')
      .skip((this.data.pageNum - 1) * this.data.pageSize)
      .limit(this.data.pageSize)
      .get()
      .then(res => {
        const transactions = res.data;
        
        if (this.data.pageNum === 1) {
          // 第一页，直接设置数据
          this.setData({
            transactions: transactions
          });
        } else {
          // 加载更多，追加数据
          this.setData({
            transactions: [...this.data.transactions, ...transactions]
          });
        }
        
        // 计算总收入和支出
        this.calculateTotals();
        
        wx.hideLoading();
      })
      .catch(err => {
        console.error('获取交易记录失败:', err);
        wx.hideLoading();
        
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        });
        
        // 如果获取失败，使用模拟数据
        this.loadMockTransactions();
      });
  },
  
  // 加载模拟交易记录数据（备用方法，数据库访问失败时使用）
  loadMockTransactions: function() {
    // 这里使用模拟数据
    const mockTransactions = [
      {
        id: 'T20250527001',
        type: 1, // 1:充值 2:消费 3:退款 4:提现
        amount: 100.00,
        date: '2025-05-27 14:22:35',
        status: 1, // 1:成功 2:处理中 3:失败
        desc: '余额充值',
        payMethod: '微信支付'
      },
      {
        id: 'T20250526002',
        type: 2,
        amount: -68.00,
        date: '2025-05-26 10:15:48',
        status: 1,
        desc: '早C晚A水乳套装',
        orderNo: 'HBN2505260001'
      },
      {
        id: 'T20250525003',
        type: 3,
        amount: 35.80,
        date: '2025-05-25 16:42:10',
        status: 1,
        desc: '眼霜退款',
        orderNo: 'HBN2505220003'
      },
      {
        id: 'T20250524004',
        type: 2,
        amount: -128.00,
        date: '2025-05-24 09:30:25',
        status: 1,
        desc: '发光水+精华乳',
        orderNo: 'HBN2505240002'
      },
      {
        id: 'T20250523005',
        type: 1,
        amount: 200.00,
        date: '2025-05-23 18:05:12',
        status: 1,
        desc: '余额充值',
        payMethod: '支付宝'
      }
    ];
    
    // 根据用户信息调整交易数据
    const userInfo = wx.getStorageSync('userInfo') || {};
    let transactions = [...mockTransactions];
    
    // 应用过滤器
    if (this.data.typeFilter !== 0) {
      transactions = transactions.filter(t => t.type === this.data.typeFilter);
    }
    
    // 应用标签过滤
    if (this.data.activeTab === 'income') {
      transactions = transactions.filter(t => t.amount > 0);
    } else if (this.data.activeTab === 'expense') {
      transactions = transactions.filter(t => t.amount < 0);
    }
    
    this.setData({
      transactions: transactions,
      hasMore: false // 示例数据没有更多了
    });
    
    // 计算总收入和支出
    this.calculateTotals();
  },
  
  // 计算总收入和支出
  calculateTotals: function() {
    let totalIncome = 0;
    let totalExpense = 0;
    
    this.data.transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpense += Math.abs(transaction.amount);
      }
    });
    
    this.setData({
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2)
    });
  },
  
  // 充值余额
  recharge() {
    wx.navigateTo({
      url: '/pages/balance/recharge'
    });
  },
  
  // 提现余额
  withdraw() {
    wx.navigateTo({
      url: '/pages/balance/withdraw'
    });
  },
  
  // 查看交易详情
  viewTransactionDetail(e) {
    const id = e.currentTarget.dataset.id;
    const transaction = this.data.transactions.find(t => t.id === id);
    
    if (transaction) {
      // 传递交易数据到详情页面
      wx.navigateTo({
        url: `/pages/balance/detail?id=${id}`,
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptTransactionData', { transaction: transaction });
        }
      });
    }
  },
  
  // 切换筛选弹窗
  toggleFilterPopup() {
    this.setData({
      showFilterPopup: !this.data.showFilterPopup
    });
  },
  
  // 应用筛选条件
  applyFilter() {
    this.setData({
      pageNum: 1,
      showFilterPopup: false
    });
    this.loadTransactions();
  },
  
  // 重置筛选条件
  resetFilter() {
    this.setData({
      typeFilter: 0,
      dateFilter: 0,
      pageNum: 1,
      showFilterPopup: false
    });
    this.loadTransactions();
  },
  
  // 切换交易类型标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (this.data.activeTab !== tab) {
      this.setData({
        activeTab: tab,
        pageNum: 1
      });
      this.loadTransactions();
    }
  },
  
  // 选择交易类型过滤器
  selectTypeFilter(e) {
    const value = parseInt(e.currentTarget.dataset.value);
    this.setData({
      typeFilter: value
    });
  },
  
  // 选择日期过滤器
  selectDateFilter(e) {
    const value = parseInt(e.currentTarget.dataset.value);
    this.setData({
      dateFilter: value
    });
  },
  
  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.setData({
        loadingMore: true,
        pageNum: this.data.pageNum + 1
      });
      
      // 加载更多数据
      this.loadTransactions();
      
        this.setData({
        loadingMore: false
        });
    }
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      pageNum: 1
    });
    
    this.loadAccountBalance();
    this.loadTransactions();
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  
  // 获取交易类型文本
  getTransactionTypeText(type) {
    switch (type) {
      case 1:
        return '充值';
      case 2:
        return '消费';
      case 3:
        return '退款';
      case 4:
        return '提现';
      default:
        return '交易';
    }
  },
  
  // 获取交易状态文本
  getTransactionStatusText(status) {
    switch (status) {
      case 1:
        return '成功';
      case 2:
        return '处理中';
      case 3:
        return '失败';
      default:
        return '未知';
    }
  },
  
  updateUserBalance: function(newBalance, orderInfo) {
    return new Promise((resolve, reject) => {
      if (!this.data.db) {
        console.error('数据库未初始化');
        reject(new Error('数据库未初始化'));
        return;
      }
      
      // 获取用户ID对应的文档ID
      const userId = this.data.currentUserId;
      let docId = '';
      
      if (userId === 1) {
        docId = '81fbbcd56843e1b201a3215777235ffb'; // 职场精英女性
      } else if (userId === 3) {
        docId = '81fbbcd56843e1b201a321597f5fd078'; // 科研工作者
      } else {
        docId = '81fbbcd56843e1b201a3215836053277'; // 都市新锐青年(默认)
      }
      
      // 准备两个更新操作的Promise
      const updateUserPromise = this.data.db.collection('user').doc(docId).update({
        data: {
          accountBalance: newBalance,
          updateTime: this.formatDate(new Date())
        }
      });
      
      // 更新user_balance集合
      const updateUserBalancePromise = this.data.db.collection('user_balance').where({
        userId: userId
      }).update({
        data: {
          balance: newBalance,
          availableBalance: newBalance, // 假设全部余额可用
          updateTime: this.data.db.serverDate()
        }
      });
      
      // 并行执行两个更新操作
      Promise.all([updateUserPromise, updateUserBalancePromise])
        .then(results => {
          console.log('用户余额更新成功', results);
          
          // 保存新余额到本地存储
          wx.setStorageSync('accountBalance', newBalance);
          
          // 更新页面数据
          this.setData({
            userBalance: newBalance,
            balance: newBalance,
            balanceInfo: {
              availableBalance: newBalance,
              frozenBalance: this.data.balanceInfo.frozenBalance
            }
          });
          
          resolve();
        })
        .catch(err => {
          console.error('更新用户余额失败:', err);
          
          // 向用户显示错误信息
          wx.showToast({
            title: '更新余额失败',
            icon: 'none',
            duration: 2000
          });
          
          // 尝试使用本地备份方法
          this.handleBalanceUpdateFallback(newBalance);
          
          reject(err);
        });
    });
  },
  
  // 当云数据库更新失败时的备选方案
  handleBalanceUpdateFallback: function(newBalance) {
    console.log('使用本地存储备选方案更新余额');
    
    // 至少更新本地存储中的余额
    wx.setStorageSync('accountBalance', newBalance);
    
    // 更新页面数据
    this.setData({
      userBalance: newBalance,
      balance: newBalance,
      balanceInfo: {
        availableBalance: newBalance,
        frozenBalance: this.data.balanceInfo.frozenBalance
      },
      failedUpdates: [...(this.data.failedUpdates || []), {
        type: 'balance',
        value: newBalance,
        timestamp: new Date().getTime()
      }]
    });
    
    // 记录失败的更新，以便将来可以重试
    const failedUpdates = wx.getStorageSync('failedBalanceUpdates') || [];
    failedUpdates.push({
      userId: this.data.currentUserId,
      newBalance: newBalance,
      timestamp: new Date().getTime(),
      orderInfo: orderInfo || null
    });
    wx.setStorageSync('failedBalanceUpdates', failedUpdates);
  },
  
  // 添加格式化日期的辅助方法
  formatDate: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  
  handleBalancePayment: function(orderInfo) {
    // 扣减用户余额
    const newBalance = parseFloat((this.data.userBalance - this.data.totalPrice).toFixed(2));
    
    // 更新云数据库中的用户余额
    this.updateUserBalance(newBalance, orderInfo).then(() => {
      // 添加余额交易记录
      return this.addBalanceTransaction(orderInfo);
    }).then(() => {
      // 更新订单状态为待发货
      // ... 后续流程
    });
  }
}) 