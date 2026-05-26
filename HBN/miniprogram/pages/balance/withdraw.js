Page({
  data: {
    balance: 0, // 当前余额
    withdrawAmount: '', // 提现金额
    customAmount: '', // 自定义提现金额
    selectedIndex: -1, // 选中的预设金额索引
    quickAmounts: [100, 200, 500, 1000], // 快速提现金额选项
    withdrawMethod: 'wechat', // 默认提现方式：wechat-微信, alipay-支付宝, bank-银行卡
    accountInfo: {
      wechat: '微信账号',
      alipay: '支付宝账号',
      bank: '建设银行(尾号3721)'
    },
    fee: 0, // 手续费
    actualAmount: 0, // 实际到账金额
    isSubmitting: false, // 是否正在提交
    showSuccess: false, // 是否显示成功提示
    newBalance: 0, // 提现后的余额
    userId: 2, // 默认用户ID（都市新锐青年）
    userName: '都市新锐青年', // 默认用户名称
    userProfileIds: {
      profile1: '81fbbcd56843e1b201a3215777235ffb', // 职场精英女性
      profile2: '81fbbcd56843e1b201a3215836053277', // 都市新锐青年
      profile3: '81fbbcd56843e1b201a321597f5fd078'  // 科研工作者
    },
    userBalanceIds: {} // 存储user_balance集合中记录的_id
  },

  onLoad: function(options) {
    // 初始化云环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'YOUR_CLOUD_ENV_ID',
        traceUser: true,
      });
    }
    
    // 获取用户信息
    this.getUserInfo();
    
    // 获取余额信息
    this.loadAccountBalance();
  },
  
  // 获取当前用户信息
  getUserInfo: function() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    let userId = 2; // 默认都市新锐青年
    let userName = '都市新锐青年';
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
      userName = '职场精英女性';
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
      userName = '科研工作者';
    }
    
    this.setData({
      userId: userId,
      userName: userName
    });
    
    console.log('当前用户画像:', userName, '(ID:', userId, ')');
  },
  
  // 从云数据库加载账户余额
  loadAccountBalance: function() {
    wx.showLoading({
      title: '加载中...',
    });
    
    // 从云数据库获取余额信息
    this.loadBalanceFromCloud();
  },

  // 从云数据库获取余额信息
  loadBalanceFromCloud: function() {
    const db = wx.cloud.database();
    const userBalanceCollection = db.collection('user_balance');
    
    userBalanceCollection.where({
      userId: this.data.userId
    }).get().then(res => {
      wx.hideLoading();
      
      if (res.data && res.data.length > 0) {
        const balanceData = res.data[0];
        
        // 存储记录ID，方便后续更新
        const userBalanceIds = {...this.data.userBalanceIds};
        userBalanceIds[this.data.userId] = balanceData._id;
        
        // 设置余额信息和记录ID
        this.setData({
          balance: parseFloat(balanceData.balance),
          userBalanceIds: userBalanceIds
        });
        
        console.log('获取到用户余额记录ID:', balanceData._id);
        
        // 更新本地存储的余额
        wx.setStorageSync('accountBalance', balanceData.balance);
      } else {
        // 如果没有找到数据，使用默认值或从本地存储获取
        const accountBalance = wx.getStorageSync('accountBalance') || '0';
        
        // 设置余额信息
        this.setData({
          balance: parseFloat(accountBalance)
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('获取余额信息失败:', err);
      
      // 如果获取失败，使用本地存储的数据
      const accountBalance = wx.getStorageSync('accountBalance') || '0';
      
      // 设置余额信息
    this.setData({
      balance: parseFloat(accountBalance)
      });
    });
  },

  // 选择预设金额
  selectAmount: function(e) {
    const index = e.currentTarget.dataset.index;
    const amount = this.data.quickAmounts[index];
    
    if (amount > this.data.balance) {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      selectedIndex: index,
      withdrawAmount: amount,
      customAmount: '',
      fee: this.calculateFee(amount),
      actualAmount: this.calculateActualAmount(amount)
    });
  },

  // 输入自定义金额
  inputCustomAmount: function(e) {
    const value = e.detail.value;
    const amount = parseFloat(value) || 0;
    
    this.setData({
      customAmount: value,
      withdrawAmount: amount,
      selectedIndex: -1,
      fee: this.calculateFee(amount),
      actualAmount: this.calculateActualAmount(amount)
    });
  },

  // 选择提现方式
  selectWithdrawMethod: function(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({
      withdrawMethod: method
    });
  },
  
  // 计算手续费
  calculateFee: function(amount) {
    // 提现手续费率为0.5%，最低1元
    const feeRate = 0.005;
    const minFee = 1;
    
    const calculatedFee = amount * feeRate;
    return calculatedFee < minFee ? minFee : calculatedFee;
  },
  
  // 计算实际到账金额
  calculateActualAmount: function(amount) {
    const fee = this.calculateFee(amount);
    return amount - fee;
  },

  // 提交提现
  submitWithdraw: function() {
    const amount = this.data.withdrawAmount;
    
    // 验证金额
    if (!amount || amount <= 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }
    
    // 验证余额
    if (amount > this.data.balance) {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      });
      return;
    }
    
    // 防止重复提交
    if (this.data.isSubmitting) {
      return;
    }
    
    this.setData({
      isSubmitting: true
    });
    
    // 显示加载提示
    wx.showLoading({
      title: '申请提现中...',
      mask: true
    });
    
      // 计算新余额
      const newBalance = this.data.balance - amount;
      
    // 更新云数据库中的余额
    this.updateBalanceInCloud(newBalance, amount);
  },
  
  // 更新云数据库中的余额
  updateBalanceInCloud: function(newBalance, amount) {
    const db = wx.cloud.database();
    const _ = db.command;
    const userBalanceCollection = db.collection('user_balance');
    
    // 检查用户余额记录是否存在
    userBalanceCollection.where({
      userId: this.data.userId
    }).get().then(res => {
      if (res.data && res.data.length > 0) {
        // 用户记录已存在，更新余额
        const balanceRecord = res.data[0];
        const docId = balanceRecord._id;
        
        console.log('更新余额记录, 记录ID:', docId, '新余额:', newBalance);
        
        // 更新余额记录
        wx.cloud.callFunction({
          name: 'updateBalance',
          data: {
            collection: 'user_balance',
            docId: docId,
            updateData: {
              balance: newBalance.toString(),
              availableBalance: newBalance.toString(),
              updateTime: this.getCurrentTime(),
              totalExpense: _.inc(amount)
            }
          }
        }).then(result => {
          console.log('云函数更新结果:', result);
          
          // 添加交易记录
          this.addTransactionRecord(amount, newBalance);
          
          // 更新用户画像数据中的余额
          this.updateUserProfileBalance(newBalance);
        }).catch(err => {
          console.error('更新余额失败(云函数):', err);
          
          // 尝试直接更新
          this.directUpdateBalance(docId, newBalance, amount);
        });
      } else {
        // 用户记录不存在，这是一个异常情况，因为提现前应该有余额记录
        console.error('未找到用户余额记录');
        this.handleWithdrawError();
      }
    }).catch(err => {
      console.error('查询余额记录失败:', err);
      this.handleWithdrawError();
    });
  },
  
  // 直接更新余额（备选方案）
  directUpdateBalance: function(docId, newBalance, amount) {
    const db = wx.cloud.database();
    const userBalanceCollection = db.collection('user_balance');
    
    console.log('尝试直接更新余额, 记录ID:', docId);
    
    // 直接更新余额记录
    userBalanceCollection.doc(docId).update({
      data: {
        balance: newBalance.toString(),
        availableBalance: newBalance.toString(),
        updateTime: this.getCurrentTime()
      }
    }).then(() => {
      console.log('直接更新余额成功');
      
      // 添加交易记录
      this.addTransactionRecord(amount, newBalance);
      
      // 更新用户画像数据中的余额
      this.updateUserProfileBalance(newBalance);
    }).catch(err => {
      console.error('直接更新余额失败:', err);
      this.handleWithdrawError();
    });
  },
  
  // 更新用户画像数据中的余额
  updateUserProfileBalance: function(newBalance) {
    const db = wx.cloud.database();
    const userCollection = db.collection('user');
    
    // 根据userId获取对应的用户画像记录ID
    let docId = '';
    if (this.data.userId === 1) {
      docId = this.data.userProfileIds.profile1; // 职场精英女性
    } else if (this.data.userId === 2) {
      docId = this.data.userProfileIds.profile2; // 都市新锐青年
    } else if (this.data.userId === 3) {
      docId = this.data.userProfileIds.profile3; // 科研工作者
    }
    
    if (!docId) {
      console.error('未找到用户画像记录ID');
      return;
    }
    
    console.log('更新用户画像余额, 记录ID:', docId, '新余额:', newBalance);
    
    // 更新用户画像记录中的余额
    wx.cloud.callFunction({
      name: 'updateBalance',
      data: {
        collection: 'user',
        docId: docId,
        updateData: {
          accountBalance: newBalance.toString()
        }
      }
    }).then(result => {
      console.log('用户画像余额更新成功(云函数):', result);
    }).catch(err => {
      console.error('更新用户画像余额失败(云函数):', err);
      
      // 尝试直接更新
      userCollection.doc(docId).update({
        data: {
          accountBalance: newBalance.toString()
        }
      }).then(() => {
        console.log('用户画像余额直接更新成功');
      }).catch(err => {
        console.error('用户画像余额直接更新失败:', err);
      });
    });
  },
  
  // 添加交易记录
  addTransactionRecord: function(amount, newBalance) {
    const db = wx.cloud.database();
    const balanceCollection = db.collection('balance');
    
    // 生成交易ID
    const transactionId = 'T' + this.generateTransactionId();
    
    console.log('添加交易记录, ID:', transactionId, '金额:', amount);
    
    // 计算实际到账金额
    const actualAmount = this.calculateActualAmount(amount);
    
    // 添加交易记录
    balanceCollection.add({
      data: {
        id: transactionId,
        userId: this.data.userId,
        userName: this.data.userName,
        type: 4, // 4:提现
        amount: -amount, // 提现为负数
        actualAmount: actualAmount, // 实际到账金额
        fee: this.calculateFee(amount), // 手续费
        date: this.getCurrentTime(),
        status: 1, // 1:成功
        desc: '余额提现',
        withdrawMethod: this.getWithdrawMethodText(),
        accountInfo: this.data.accountInfo[this.data.withdrawMethod],
        createTime: this.getCurrentTime(),
        updateTime: this.getCurrentTime()
      }
    }).then(res => {
      console.log('添加交易记录成功, ID:', res._id);
      
      // 隐藏加载提示
      wx.hideLoading();
      
      // 更新本地存储的余额
      wx.setStorageSync('accountBalance', newBalance.toString());
      
      // 设置新余额并显示成功提示
      this.setData({
        isSubmitting: false,
        showSuccess: true,
        newBalance: newBalance
      });
      
      // 3秒后返回余额页面
      setTimeout(() => {
        // 设置余额页面需要刷新的标志
        const pages = getCurrentPages();
        const balancePage = pages.find(page => page.route === 'pages/balance/balance');
        if (balancePage) {
          balancePage.setData({
            needRefresh: true
          });
        }
        
        wx.navigateBack();
      }, 2000);
    }).catch(err => {
      console.error('添加交易记录失败:', err);
      this.handleWithdrawError();
    });
  },
  
  // 处理提现错误
  handleWithdrawError: function() {
    wx.hideLoading();
    
    this.setData({
      isSubmitting: false
    });
    
    wx.showToast({
      title: '提现失败，请重试',
      icon: 'none',
      duration: 2000
    });
  },
  
  // 获取提现方式文本
  getWithdrawMethodText: function() {
    switch (this.data.withdrawMethod) {
      case 'wechat':
        return '微信';
      case 'alipay':
        return '支付宝';
      case 'bank':
        return '银行卡';
      default:
        return '微信';
    }
  },
  
  // 生成交易ID
  generateTransactionId: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
  },
  
  // 获取当前时间字符串
  getCurrentTime: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  }
}) 