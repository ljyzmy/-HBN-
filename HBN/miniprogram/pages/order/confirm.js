Page({
  data: {
    product: null, // 商品信息
    address: null, // 收货地址
    quantity: 1, // 商品数量
    message: '', // 买家留言
    couponAmount: 0, // 优惠券金额
    selectedCoupon: null, // 选中的优惠券
    productTotal: 0, // 商品总价
    totalPrice: 0, // 实付金额
    expressPrice: 0, // 快递费
    statusBarHeight: 0, // 状态栏高度
    navHeight: 0, // 导航栏高度
    loading: false, // 加载状态
    paymentMethod: 'wxpay', // 支付方式，默认微信支付
    paymentMethods: [
      { id: 'wxpay', name: '微信支付', icon: 'https://img.api.aa1.cn/2025/05/15/e8ca1ef3c7b7f.png', selected: true },
      { id: 'balance', name: '余额支付', icon: 'https://img.api.aa1.cn/2025/05/15/6a9c5e7cfebed.png', selected: false }
    ],
    userBalance: 0, // 用户余额
    useBalance: false, // 是否使用余额支付
    balanceEnough: false, // 余额是否足够支付
    addresses: [], // 收货地址列表
    availableCoupons: [], // 可用优惠券列表
    db: null, // 云数据库实例
    currentUserId: 2, // 当前用户ID，默认为都市新锐青年
    userInfo: null, // 用户信息
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
  onLoad: function(options) {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-0gxff61z2804383c',
        traceUser: true
      });
      // 初始化数据库
      this.setData({
        db: wx.cloud.database()
      });
    }
    
    // 获取状态栏高度 - 使用新的API替代已弃用的getSystemInfoSync
    try {
      // 获取窗口信息
      const windowInfo = wx.getWindowInfo();
      // 获取系统信息
      const systemInfo = wx.getAppBaseInfo();
      
      this.setData({
        statusBarHeight: windowInfo.statusBarHeight || 0,
        navHeight: (windowInfo.statusBarHeight || 0) + 44
      });
    } catch (err) {
      console.error('获取系统信息失败', err);
      // 使用默认值
      this.setData({
        statusBarHeight: 20,
        navHeight: 64
      });
    }

    // 获取当前用户ID和信息
    const currentUserId = wx.getStorageSync('currentUserId') || 2; // 默认为都市新锐青年
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    this.setData({
      currentUserId: currentUserId,
      userInfo: userInfo,
      loading: true
    });
    
    // 获取用户余额
    this.loadUserBalance();
    
    // 从云数据库加载地址列表
    this.loadAddressesFromCloud();
    
    // 从云数据库加载优惠券列表
    this.loadCouponsFromCloud();

    try {
      // 尝试解析商品信息
      if (options.productInfo) {
        const productInfo = JSON.parse(decodeURIComponent(options.productInfo));
        
        // 设置商品信息和数量
        this.setData({
          product: productInfo,
          quantity: parseInt(options.quantity) || 1
        });
        
        // 计算价格
        this.calculatePrice();
      } else {
        wx.showToast({
          title: '商品信息获取失败',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error('解析商品信息失败', error);
      wx.showToast({
        title: '商品信息获取失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 检查是否从地址选择页面返回
    if (wx.getStorageSync('selectedAddress')) {
      const selectedAddress = wx.getStorageSync('selectedAddress');
      this.setData({
        address: selectedAddress
      });
      wx.removeStorageSync('selectedAddress');
    }
    
    // 检查是否从优惠券选择页面返回
    const selectedCoupon = wx.getStorageSync('selectedCoupon');
    if (selectedCoupon) {
      this.setData({
        selectedCoupon,
        couponAmount: selectedCoupon.value || 0
      });
      // 清除临时存储的选中优惠券
      wx.removeStorageSync('selectedCoupon');
      
      // 重新计算价格
      this.calculatePrice();
    } else {
      // 重新计算价格
      this.calculatePrice();
    }
    
    // 检查余额是否足够支付
    this.checkBalanceEnough();
  },
  
  /**
   * 从云数据库加载用户余额
   */
  loadUserBalance: function() {
    // 这里根据userID从数据库获取余额
    const db = wx.cloud.database();
    const userId = this.data.currentUserId;
    
    // 构建查询条件
    let docId;
    if (userId === 1) {
      docId = this.data.userProfileIds?.profile1 || '81fbbcd56843e1b201a3215777235ffb'; // 职场精英女性
    } else if (userId === 3) {
      docId = this.data.userProfileIds?.profile3 || '81fbbcd56843e1b201a321597f5fd078'; // 科研工作者
    } else {
      docId = this.data.userProfileIds?.profile2 || '81fbbcd56843e1b201a3215836053277'; // 都市新锐青年(默认)
    }
    
    db.collection('user').doc(docId).get().then(res => {
      if (res.data) {
        const balance = res.data.accountBalance || 0;
        this.setData({
          userBalance: parseFloat(balance)
        });
        
        // 同时缓存到本地
        wx.setStorageSync('accountBalance', balance);
        
        // 检查余额是否足够
        this.checkBalanceEnough();
      }
    }).catch(err => {
      console.error('获取用户余额失败', err);
      // 使用本地存储的余额作为备选
      const balance = wx.getStorageSync('accountBalance') || 0;
      this.setData({
        userBalance: parseFloat(balance)
      });
    });
  },

  /**
   * 从云数据库加载地址列表
   */
  loadAddressesFromCloud: function() {
    const db = wx.cloud.database();
    const userId = this.data.currentUserId;
    
    db.collection('addresses')
      .where({
        userId: userId
      })
      .get()
      .then(res => {
        if (res.data && res.data.length > 0) {
          const addressData = res.data[0];
          const addresses = addressData.addresses || [];
          
          this.setData({
            addresses: addresses,
            loading: false
          });
          
          // 设置默认地址
          if (addresses.length > 0) {
            const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
            this.setData({
              address: defaultAddress
            });
          }
          
          // 缓存地址列表
          wx.setStorageSync('addresses', addresses);
        } else {
          // 如果云数据库没有数据，使用本地存储的数据
          this.useLocalAddresses();
        }
      })
      .catch(err => {
        console.error('获取地址数据失败', err);
        this.useLocalAddresses();
      });
  },
  
  /**
   * 使用本地缓存的地址数据
   */
  useLocalAddresses: function() {
    const addresses = wx.getStorageSync('addresses') || [];
    this.setData({
      addresses: addresses,
      loading: false
    });
    
    // 设置默认地址
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      this.setData({
        address: defaultAddress
      });
    }
  },
  
  /**
   * 从云数据库加载优惠券列表
   */
  loadCouponsFromCloud: function() {
    const db = wx.cloud.database();
    const userId = this.data.currentUserId;
    
    db.collection('coupons')
      .where({
        userId: userId,
        used: false,
        usable: true,
        expireDate: db.command.gte(this.formatDate(new Date())) // 只获取未过期的
      })
      .get()
      .then(res => {
        if (res.data && res.data.length > 0) {
          const coupons = res.data;
          this.setData({
            availableCoupons: coupons
          });
          
          // 缓存优惠券列表
          wx.setStorageSync('availableCoupons', coupons);
        } else {
          console.log('没有可用优惠券或获取失败，使用默认优惠券数据');
          // 使用默认优惠券数据
        }
      })
      .catch(err => {
        console.error('获取优惠券数据失败', err);
        // 使用默认优惠券数据
      });
  },

  /**
   * 计算价格
   */
  calculatePrice: function() {
    if (!this.data.product) return;
    
    // 商品总价
    const productTotal = this.data.product.price * this.data.quantity;
    
    // 快递费用
    let expressPrice = 0;
    // 免邮条件：商品总价超过199元免邮
    if (productTotal < 199) {
      expressPrice = 10; // 不满足免邮条件，设置为10元运费
    }
    
    // 优惠券金额
    const couponAmount = this.data.couponAmount || 0;
    
    // 实付金额
    const totalPrice = productTotal + expressPrice - couponAmount;
    
    this.setData({
      productTotal,
      expressPrice,
      totalPrice
    });
    
    // 检查余额是否足够支付
    this.checkBalanceEnough();
  },

  /**
   * 检查余额是否足够支付
   */
  checkBalanceEnough: function() {
    const balanceEnough = this.data.userBalance >= this.data.totalPrice;
    this.setData({
      balanceEnough
    });
    
    // 如果余额不足且当前选择的是余额支付，则切换为微信支付
    if (!balanceEnough && this.data.paymentMethod === 'balance') {
      this.selectPayment({
        currentTarget: {
          dataset: {
            method: 'wxpay'
          }
        }
      });
    }
  },

  /**
   * 选择收货地址
   */
  selectAddress: function() {
    wx.navigateTo({
      url: '/pages/address/list?select=true'
    });
  },

  /**
   * 选择优惠券
   */
  selectCoupon: function() {
    // 获取产品总价
    const productTotal = this.data.productTotal;
    
    // 获取当前用户画像
    const userInfo = this.data.userInfo || {};
    const userProfile = userInfo.nickName || '默认用户';
    
    // 从数据中获取可用优惠券，根据订单金额筛选
    const allCoupons = this.data.availableCoupons;
    const usableCoupons = allCoupons.filter(coupon => {
      if (coupon.type === 'discount') {
        return productTotal >= coupon.condition;
      }
      return true; // 无门槛优惠券直接返回true
    });
    
    if (usableCoupons.length === 0) {
      wx.showToast({
        title: '暂无可用优惠券',
        icon: 'none'
      });
      return;
    }
    
    // 将可用优惠券保存到本地存储，以便优惠券选择页面使用
    wx.setStorageSync('usableCoupons', usableCoupons);
    
    // 传递当前选择的优惠券ID
    const selectedCouponId = this.data.selectedCoupon ? this.data.selectedCoupon.id : null;
    
    // 将当前用户画像信息临时保存，用于优惠券页面检测变化
    wx.setStorageSync('tempUserProfile', userProfile);
    
    wx.navigateTo({
      url: `/pages/coupons/coupons?select=true&selectedId=${selectedCouponId}`
    });
  },

  /**
   * 移除已选优惠券
   */
  removeCoupon: function() {
    this.setData({
      selectedCoupon: null,
      couponAmount: 0
    });
    
    // 清除本地存储中的选中优惠券
    wx.removeStorageSync('selectedCoupon');
    
    // 重新计算价格
    this.calculatePrice();
  },

  /**
   * 增加商品数量
   */
  increaseQuantity: function() {
    this.setData({
      quantity: this.data.quantity + 1
    });
    
    // 重新计算价格
    this.calculatePrice();
  },

  /**
   * 减少商品数量
   */
  decreaseQuantity: function() {
    if (this.data.quantity <= 1) return;
    
    this.setData({
      quantity: this.data.quantity - 1
    });
    
    // 重新计算价格
    this.calculatePrice();
  },

  /**
   * 输入留言
   */
  onMessageInput: function(e) {
    this.setData({
      message: e.detail.value
    });
  },

  /**
   * 选择支付方式
   */
  selectPayment: function(e) {
    const method = e.currentTarget.dataset.method;
    
    // 如果选择余额支付但余额不足，提示用户
    if (method === 'balance' && !this.data.balanceEnough) {
      wx.showToast({
        title: '余额不足，请选择其他支付方式',
        icon: 'none'
      });
      return;
    }
    
    // 更新选中的支付方式
    this.setData({
      paymentMethod: method
    });
  },

  /**
   * 提交订单
   */
  submitOrder: function() {
    // 检查是否选择了收货地址
    if (!this.data.address) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      });
      return;
    }
    
    // 显示加载中
    wx.showLoading({
      title: '正在提交订单...',
      mask: true
    });
    
    // 获取用户ID
    const userId = this.data.currentUserId;
    
    // 构建订单信息
    const orderInfo = {
      orderId: 'ORDER' + Date.now(),
      orderNumber: 'HBN' + Date.now().toString().substring(3),
      userId: 'user_' + userId, // 使用格式化的userId，与gift_cards集合保持一致
      createTime: this.formatDate(new Date()),
      status: 'unpaid',
      statusText: '待付款',
      totalAmount: this.data.totalPrice,
      product: {
        id: this.data.product.id,
        name: this.data.product.name,
        image: this.data.product.image || (this.data.product.bannerImages ? this.data.product.bannerImages[0] : ''),
        price: this.data.product.price,
        quantity: this.data.quantity,
        specs: this.data.product.specs || {}
      },
      address: {
        name: this.data.address.name,
        phone: this.data.address.phone,
        province: this.data.address.province,
        city: this.data.address.city,
        district: this.data.address.district,
        detailAddress: this.data.address.detail
      },
      message: this.data.message,
      expressPrice: this.data.expressPrice,
      couponInfo: this.data.selectedCoupon,
      couponAmount: this.data.couponAmount,
      paymentMethod: this.data.paymentMethod,
      // 待付款订单显示剩余支付时间（24小时）
      remainPayTime: '23:59:59',
      deleted: false,
      updateTime: this.formatDate(new Date())
    };
    
    // 处理选择的优惠券
    let couponPromise = Promise.resolve();
    if (this.data.selectedCoupon) {
      // 使用新的云函数处理优惠券
      couponPromise = this.updateCouponStatus(this.data.selectedCoupon._id)
        .catch(err => {
          console.error('处理优惠券失败，但继续提交订单:', err);
          // 即使优惠券处理失败，也继续提交订单
          return Promise.resolve();
        });
    }
    
    // 先处理优惠券，然后保存订单
    couponPromise
      .then(() => {
    // 保存订单数据到云数据库
        return this.saveOrderToCloud(orderInfo);
      })
      .catch(err => {
        // 订单保存失败的错误已经在saveOrderToCloud中处理过
        console.error('订单提交错误:', err);
        wx.hideLoading();
        
        wx.showToast({
          title: '订单提交失败，请重试',
          icon: 'none'
        });
      });
  },
  
  /**
   * 保存订单到云数据库
   */
  saveOrderToCloud: function(orderInfo) {
    return new Promise((resolve, reject) => {
      if (!this.data.db) {
        wx.showToast({
          title: '数据库初始化失败',
          icon: 'none'
        });
        wx.hideLoading();
        reject(new Error('数据库初始化失败'));
        return;
      }
      
      // 添加到orders集合
      this.data.db.collection('orders').add({
        data: orderInfo
      }).then(res => {
        console.log('订单添加成功', res);
        
        // 同时保存到本地，方便页面展示
        this.saveOrderToStorage(orderInfo);
        
        resolve(orderInfo);
        
        // 如果选择的是余额支付，则直接扣减余额并完成支付
        if (this.data.paymentMethod === 'balance') {
          this.handleBalancePayment(orderInfo);
        } else {
          // 显示支付确认对话框
          wx.hideLoading();
          wx.showModal({
            title: '确认付款',
            content: `您即将支付 ¥${this.data.totalPrice}，确认付款吗？`,
            confirmText: '确认支付',
            confirmColor: '#8eb98c',
            success: (res) => {
              if (res.confirm) {
                // 用户点击确认支付
                wx.showLoading({
                  title: '支付处理中...',
                  mask: true
                });
                
                // 模拟支付过程，1.5秒后更新订单状态并跳转
                setTimeout(() => {
                  wx.hideLoading();
                  
                  // 更新订单状态为待发货
                  this.updateOrderStatus(orderInfo.orderId, 'unshipped', '待发货');
                  
                  // 设置余额页面需要刷新的标志
                  wx.setStorageSync('balanceNeedRefresh', true);
                  
                  // 跳转到支付成功页面
                  wx.redirectTo({
                    url: `/pages/payment-success/payment-success?orderNumber=${orderInfo.orderNumber}`
                  });
                }, 1500);
              } else {
                // 用户取消支付，跳转到订单列表
                wx.redirectTo({
                  url: '/pages/order/list?status=unpaid'
                });
              }
            }
          });
        }
      }).catch(err => {
        console.error('订单添加失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '订单提交失败，请重试',
          icon: 'none'
        });
        reject(err);
      });
    });
  },
  
  /**
   * 更新优惠券状态为已使用
   */
  updateCouponStatus: function(couponId) {
    if (!couponId) {
      console.log('没有使用优惠券，跳过优惠券状态更新');
      return Promise.resolve();
    }
    
    // 显示加载提示
    wx.showLoading({
      title: '处理优惠券...',
      mask: true
    });
    
    // 调用云函数处理优惠券使用
    return wx.cloud.callFunction({
      name: 'syncCouponUsage',
      data: {
        userId: this.data.currentUserId,
        couponId: couponId,
        orderInfo: {
          orderNumber: 'HBN' + Date.now().toString().substring(3),
          product: {
            id: this.data.product.id,
            name: this.data.product.name,
            quantity: this.data.quantity
          }
        },
        couponAmount: this.data.couponAmount
      }
    }).then(res => {
      console.log('优惠券使用同步结果:', res.result);
      
      if (res.result && res.result.success) {
        // 设置优惠券页面需要刷新的标志
        wx.setStorageSync('couponsNeedRefresh', true);
        
        // 隐藏加载提示
        wx.hideLoading();
        return Promise.resolve(res.result);
      } else {
        console.error('云函数执行失败，回退到本地处理');
        // 隐藏加载提示
        wx.hideLoading();
        
        // 回退到本地处理
        return this.updateCouponStatusLocally(couponId);
      }
    }).catch(err => {
      console.error('调用云函数处理优惠券失败:', err);
      // 隐藏加载提示
      wx.hideLoading();
      
      // 回退到本地处理
      return this.updateCouponStatusLocally(couponId);
    });
  },
  
  /**
   * 本地方法更新优惠券状态（云函数失败时的备选方案）
   */
  updateCouponStatusLocally: function(couponId) {
    if (!this.data.db) {
      console.error('数据库未初始化');
      return Promise.reject(new Error('数据库未初始化'));
    }
    
    return this.data.db.collection('coupons').doc(couponId).update({
      data: {
        used: true,
        useTime: this.formatDate(new Date()),
        orderNumber: 'HBN' + Date.now().toString().substring(3) // 生成新的订单编号
      }
    }).then(res => {
      console.log('优惠券状态本地更新成功', res);
      
      // 更新本地优惠券列表
      const coupons = wx.getStorageSync('availableCoupons') || [];
      const updatedCoupons = coupons.filter(coupon => coupon._id !== couponId);
      wx.setStorageSync('availableCoupons', updatedCoupons);
      
      // 设置优惠券页面需要刷新的标志
      wx.setStorageSync('couponsNeedRefresh', true);
      
      // 更新用户的优惠券数量
      return this.updateUserCouponCount();
    }).catch(err => {
      console.error('优惠券状态本地更新失败', err);
      // 错误处理 - 记录失败的操作以便后续可能的重试
      const failedOperations = wx.getStorageSync('failedOperations') || [];
      failedOperations.push({
        type: 'updateCoupon',
        couponId: couponId,
        time: this.formatDate(new Date())
      });
      wx.setStorageSync('failedOperations', failedOperations);
      
      return Promise.reject(err);
    });
  },
  
  /**
   * 更新用户的优惠券数量
   */
  updateUserCouponCount: function() {
    const userId = this.data.currentUserId;
    let docId = '';
    
    console.log('准备更新用户优惠券数量，用户ID:', userId);
    
    if (userId === 1) {
      docId = this.data.userProfileIds.profile1; // 职场精英女性
    } else if (userId === 3) {
      docId = this.data.userProfileIds.profile3; // 科研工作者
    } else {
      docId = this.data.userProfileIds.profile2; // 都市新锐青年(默认)
    }
    
    console.log('用户文档ID:', docId);
    
    // 获取可用优惠券数量
    this.data.db.collection('coupons')
      .where({
        userId: userId,
        used: false,
        usable: true,
        expireDate: this.data.db.command.gte(this.formatDate(new Date())) // 只获取未过期的
      })
      .count()
      .then(res => {
        const couponCount = res.total;
        console.log('查询到可用优惠券数量:', couponCount);
        
        // 先获取用户文档数据
        return this.data.db.collection('user').doc(docId).get();
      })
      .then(res => {
        if (res.data) {
          // 确保assets字段存在
          const userData = res.data;
          const assets = userData.assets || {};
          const currentCouponCount = assets.coupons || 0;
          
          console.log('当前记录的优惠券数量:', currentCouponCount, '准备更新为新数量');
          
          // 更新user集合中的优惠券数量
          return this.data.db.collection('user').doc(docId).update({
            data: {
              'assets.coupons': this.data.db.command.inc(-1), // 减少1张优惠券
              updateTime: this.formatDate(new Date())
            }
          });
        }
        return Promise.reject(new Error('用户数据不存在'));
      })
      .then(res => {
        console.log('用户优惠券数量已更新:', res);
      })
      .catch(err => {
        console.error('更新优惠券数量失败:', err);
        
        // 记录失败的操作，以便将来可能的重试
        const failedOperations = wx.getStorageSync('failedOperations') || [];
        failedOperations.push({
          type: 'updateCouponCount',
          userId: docId,
          time: this.formatDate(new Date()),
          error: err.message || '未知错误'
        });
        wx.setStorageSync('failedOperations', failedOperations);
      });
  },
  
  /**
   * 处理余额支付
   */
  handleBalancePayment: function(orderInfo) {
    wx.showLoading({
      title: '余额支付中...',
      mask: true
    });
    
    // 扣减用户余额
    const newBalance = parseFloat((this.data.userBalance - this.data.totalPrice).toFixed(2));
    
    // 计算可获得的积分（假设消费1元可获得1积分）
    const earnedPoints = Math.floor(this.data.totalPrice);
    
    // 调用云函数同步数据
    wx.cloud.callFunction({
      name: 'syncOrderPayment',
      data: {
        userId: this.data.currentUserId,
        orderInfo: orderInfo,
        newBalance: newBalance,
        deductAmount: this.data.totalPrice,
        earnedPoints: earnedPoints,
        couponId: this.data.selectedCoupon ? this.data.selectedCoupon._id : null
      }
    }).then(res => {
      console.log('支付数据同步结果:', res.result);
      
      if (res.result && res.result.success) {
        // 更新本地存储中的余额
        wx.setStorageSync('accountBalance', newBalance);
        
        // 更新页面数据
        this.setData({
          userBalance: newBalance
        });
        
        // 设置余额页面和积分页面需要刷新的标志
        wx.setStorageSync('balanceNeedRefresh', true);
        wx.setStorageSync('pointsNeedRefresh', true);
        
        // 创建物流记录
        return this.createLogisticsRecord(orderInfo);
      } else {
        // 云函数执行失败，回退到本地处理
        console.error('云函数执行失败，回退到本地处理');
        
        // 尝试通过本地方法更新余额
        return this.updateUserBalanceLocally(newBalance, orderInfo)
          .then(() => this.addBalanceTransaction(orderInfo))
          .then(() => {
      // 如果有积分奖励，更新用户积分
      if (earnedPoints > 0) {
        return this.updateUserPoints(earnedPoints, orderInfo);
      }
      return Promise.resolve();
          })
          .then(() => {
      // 更新订单状态为待发货
        this.updateOrderStatus(orderInfo.orderId, 'unshipped', '待发货');
            return this.createLogisticsRecord(orderInfo);
      });
      }
    }).then(() => {
      wx.hideLoading();
      
      // 显示支付成功提示
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 1500
      });
      
      // 设置余额页面需要刷新的标志
      wx.setStorageSync('balanceNeedRefresh', true);
      
      // 等待提示显示完毕后跳转
      setTimeout(() => {
        // 跳转到支付成功页面
        wx.redirectTo({
          url: `/pages/payment-success/payment-success?orderNumber=${orderInfo.orderNumber}&payMethod=balance`
        });
      }, 1600);
    }).catch(err => {
      console.error('余额支付处理失败', err);
      wx.hideLoading();
      
      wx.showModal({
        title: '支付提示',
        content: '支付处理过程中发生错误，但您的余额已被扣除。请联系客服处理。',
        showCancel: false,
        confirmText: '我知道了'
      });
    });
  },
  
  /**
   * 本地方法更新用户余额（云函数失败时的备选方案）
   */
  updateUserBalanceLocally: function(newBalance, orderInfo) {
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
        docId = this.data.userProfileIds.profile1; // 职场精英女性
      } else if (userId === 3) {
        docId = this.data.userProfileIds.profile3; // 科研工作者
      } else {
        docId = this.data.userProfileIds.profile2; // 都市新锐青年(默认)
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
      }).get().then(res => {
        if (res.data && res.data.length > 0) {
          const balanceDocId = res.data[0]._id;
          // 更新已存在的记录
          return this.data.db.collection('user_balance').doc(balanceDocId).update({
            data: {
              balance: newBalance,
              availableBalance: newBalance,
              updateTime: this.formatDate(new Date())
            }
          });
        } else {
          // 创建新记录
          return this.data.db.collection('user_balance').add({
            data: {
              userId: userId,
              balance: newBalance,
              availableBalance: newBalance,
              frozenBalance: 0,
              totalIncome: 0,
              totalExpense: this.data.totalPrice,
              updateTime: this.formatDate(new Date()),
              createTime: this.formatDate(new Date())
            }
          });
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
          userBalance: newBalance
        });
        
        resolve();
        })
        .catch(err => {
        console.error('余额更新过程中发生错误:', err);
        
        // 记录失败操作
        const failedOperations = wx.getStorageSync('failedOperations') || [];
        failedOperations.push({
          type: 'updateBalance',
          userId: docId,
          oldBalance: this.data.userBalance,
          newBalance: newBalance,
          orderNumber: orderInfo ? orderInfo.orderNumber : '',
          time: this.formatDate(new Date()),
          error: err.message || '未知错误'
        });
        wx.setStorageSync('failedOperations', failedOperations);
        
        // 尽管云端更新失败，为确保用户体验，本地仍记录新的余额
        wx.setStorageSync('accountBalance', newBalance);
        this.setData({ userBalance: newBalance });
          
          // 添加失败时的备用处理
          this.handleBalanceUpdateFallback(newBalance, orderInfo);
        
        // 错误不影响流程继续，但记录到日志
        resolve();
      });
    });
  },
  
  /**
   * 当云数据库更新失败时的备选方案
   */
  handleBalanceUpdateFallback: function(newBalance, orderInfo) {
    console.log('使用本地存储备选方案更新余额');
    
    // 至少更新本地存储中的余额
    wx.setStorageSync('accountBalance', newBalance);
    
    // 记录失败的更新，以便将来可以重试
    const failedUpdates = wx.getStorageSync('failedBalanceUpdates') || [];
    failedUpdates.push({
      userId: this.data.currentUserId,
      newBalance: newBalance,
      timestamp: new Date().getTime(),
      orderNumber: orderInfo ? orderInfo.orderNumber : '',
      time: this.formatDate(new Date())
    });
    wx.setStorageSync('failedBalanceUpdates', failedUpdates);
    
    // 设置一个标志，提示余额页面需要刷新数据
    wx.setStorageSync('balanceNeedRefresh', true);
  },
  
  /**
   * 添加余额交易记录
   */
  addBalanceTransaction: function(orderInfo) {
    return new Promise((resolve, reject) => {
      if (!this.data.db) {
        console.error('数据库未初始化');
        reject(new Error('数据库未初始化'));
        return;
      }
      
      // 创建新的交易记录
      const transaction = {
        id: 'T' + Date.now(),
        userId: 'user_' + this.data.currentUserId,
        type: 2, // 2表示消费
        amount: -orderInfo.totalAmount,
        date: this.formatDate(new Date()),
        status: 1, // 1表示成功
        desc: orderInfo.product.name,
        orderNo: orderInfo.orderNumber,
        createTime: this.formatDate(new Date())
      };
      
      // 检查balance集合是否存在，如果不存在就使用balance_transactions
      const balanceCollection = 'balance';
      
      // 添加到balance集合
      this.data.db.collection(balanceCollection).add({
        data: transaction
      }).then(res => {
        console.log('余额交易记录已保存到云数据库', res);
        
        // 同时保存到本地存储
        const transactions = wx.getStorageSync('balanceTransactions') || [];
        transactions.unshift(transaction);
        wx.setStorageSync('balanceTransactions', transactions);
        
        resolve();
      }).catch(err => {
        console.error('余额交易记录保存失败', err);
        
        // 记录失败操作
        const failedOperations = wx.getStorageSync('failedOperations') || [];
        failedOperations.push({
          type: 'addTransaction',
          transaction: transaction,
          time: this.formatDate(new Date())
        });
        wx.setStorageSync('failedOperations', failedOperations);
        
        // 同样保存到本地，确保用户体验
        const transactions = wx.getStorageSync('balanceTransactions') || [];
        transactions.unshift(transaction);
        wx.setStorageSync('balanceTransactions', transactions);
        
        // 不让异常中断流程
        resolve();
      });
    });
  },
  
  /**
   * 保存订单到本地存储
   */
  saveOrderToStorage: function(orderInfo) {
    // 从本地存储获取现有订单列表
    let orderList = wx.getStorageSync('orderList') || [];
    
    // 添加新订单到列表开头
    orderList.unshift(orderInfo);
    
    // 保存更新后的订单列表到本地存储
    wx.setStorageSync('orderList', orderList);
    
    console.log('订单已保存到本地存储', orderInfo);
  },
  
  /**
   * 更新订单状态
   */
  updateOrderStatus: function(orderId, status, statusText) {
    // 更新云数据库中的订单状态
    if (!this.data.db) {
      console.error('数据库初始化失败');
      return;
    }
    
    const payTime = status === 'unshipped' ? this.formatDate(new Date()) : '';
    const payMethod = status === 'unshipped' ? (this.data.paymentMethod === 'wxpay' ? '微信支付' : '余额支付') : '';
    
    this.data.db.collection('orders').where({
      orderId: orderId
    }).update({
      data: {
        status: status,
        statusText: statusText,
        payTime: payTime,
        payMethod: payMethod,
        updateTime: this.formatDate(new Date())
      }
    }).then(res => {
      console.log('订单状态更新成功', res);
      
      // 同时更新本地存储中的订单状态
      let orderList = wx.getStorageSync('orderList') || [];
      orderList = orderList.map(order => {
        if (order.orderId === orderId) {
          order.status = status;
          order.statusText = statusText;
          if (status === 'unshipped') {
            order.payTime = payTime;
            order.payMethod = payMethod;
          }
        }
        return order;
      });
      wx.setStorageSync('orderList', orderList);
      
      // 如果订单状态更新为待发货，创建售后和评价的占位记录
      if (status === 'unshipped') {
        this.createPlaceholderDocuments(orderId);
      }
    }).catch(err => {
      console.error('订单状态更新失败', err);
    });
  },
  
  /**
   * 创建售后和评价占位记录
   */
  createPlaceholderDocuments: function(orderId) {
    // 获取订单信息
    this.data.db.collection('orders').where({
      orderId: orderId
    }).get().then(res => {
      if (res.data && res.data.length > 0) {
        const orderData = res.data[0];
        
        // 创建评价占位记录
        this.createReviewPlaceholder(orderData);
        
        // 创建售后占位记录
        this.createAfterSalePlaceholder(orderData);
      }
    }).catch(err => {
      console.error('获取订单信息失败', err);
    });
  },
  
  /**
   * 创建售后占位记录
   */
  createAfterSalePlaceholder: function(orderData) {
    // 售后申请占位记录
    const afterSaleData = {
      aftersaleId: 'AS' + Date.now(),
      orderId: orderData.orderId,
      userId: orderData.userId,
      status: 'inactive', // 未激活状态，表示还未申请售后
      statusText: '未申请',
      orderInfo: {
        orderNumber: orderData.orderNumber,
        productName: orderData.product.name,
        productImage: orderData.product.image,
        specs: orderData.product.specs,
        price: orderData.product.price,
        quantity: orderData.product.quantity,
        totalAmount: orderData.totalAmount
      },
      deleted: false,
      createTime: this.formatDate(new Date()),
      updateTime: this.formatDate(new Date())
    };
    
    // 添加到aftersales集合
    this.data.db.collection('aftersales').add({
      data: afterSaleData
    }).then(res => {
      console.log('售后占位记录创建成功', res);
    }).catch(err => {
      console.error('售后占位记录创建失败', err);
    });
  },
  
  /**
   * 创建评价占位记录
   */
  createReviewPlaceholder: function(orderData) {
    // 评价占位记录
    const reviewData = {
      reviewId: 'REV' + Date.now(),
      orderId: orderData.orderId,
      productId: orderData.product.id,
      userId: orderData.userId,
      hasReviewed: false, // 标记未评价
      orderInfo: {
        orderNumber: orderData.orderNumber,
        productName: orderData.product.name,
        productImage: orderData.product.image,
        specs: orderData.product.specs,
        purchaseTime: orderData.payTime || orderData.createTime
      },
      userInfo: {
        nickname: this.getUserNicknameById(orderData.userId),
        avatar: '',
        level: 1,
        isVip: false
      },
      deleted: false,
      createTime: this.formatDate(new Date()),
      updateTime: this.formatDate(new Date())
    };
    
    // 添加到reviews集合
    this.data.db.collection('reviews').add({
      data: reviewData
    }).then(res => {
      console.log('评价占位记录创建成功', res);
    }).catch(err => {
      console.error('评价占位记录创建失败', err);
    });
  },
  
  /**
   * 根据用户ID获取用户昵称
   */
  getUserNicknameById: function(userId) {
    // 从userId中提取数字部分
    const numId = parseInt(userId.replace('user_', '')) || 2;
    
    if (numId === 1) {
      return '职场精英女性';
    } else if (numId === 3) {
      return '科研工作者';
    } else {
      return '都市新锐青年';
    }
  },
  
  /**
   * 创建物流记录
   */
  createLogisticsRecord: function(orderInfo) {
    // 创建初始物流记录
    const logisticsData = {
      trackingId: 'TK' + Date.now(),
      orderId: orderInfo.orderId,
      userId: orderInfo.userId,
      expressCompany: '顺丰速运', // 默认快递公司
      expressCode: 'SF',
      expressLogo: 'https://www.example.com/logistics/sf_logo.png',
      trackingNumber: 'SF' + Math.floor(Math.random() * 10000000000), // 模拟快递单号
      status: 'pending',
      statusText: '待发货',
      senderInfo: {
        name: 'HBN官方商城',
        phone: '4008008000',
        address: {
          province: '广东省',
          city: '广州市',
          district: '白云区',
          detailAddress: '机场路1588号物流中心',
          postalCode: '510000'
        }
      },
      receiverInfo: {
        name: orderInfo.address.name,
        phone: orderInfo.address.phone,
        address: {
          province: orderInfo.address.province,
          city: orderInfo.address.city,
          district: orderInfo.address.district,
          detailAddress: orderInfo.address.detailAddress || orderInfo.address.detail,
          postalCode: ''
        }
      },
      packageInfo: {
        weight: '0.5kg',
        items: [
          {
            productId: orderInfo.product.id,
            productName: orderInfo.product.name,
            productImage: orderInfo.product.image,
            specifications: orderInfo.product.specs,
            quantity: orderInfo.product.quantity
          }
        ],
        itemCount: orderInfo.product.quantity
      },
      trackingInfo: [
        {
          time: this.formatDate(new Date()),
          status: '订单已创建',
          location: '系统',
          operator: '',
          remark: '您的订单已创建，等待商家发货'
        }
      ],
      createTime: this.formatDate(new Date()),
      updateTime: this.formatDate(new Date()),
      estimatedDeliveryTime: '',
      actualDeliveryTime: '',
      signedBy: ''
    };
    
    // 添加到物流集合
    this.data.db.collection('logistics').add({
      data: logisticsData
    }).then(res => {
      console.log('物流记录创建成功', res);
    }).catch(err => {
      console.error('物流记录创建失败', err);
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
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  },

  /**
   * 更新用户积分（云函数失败时的备选方案）
   */
  updateUserPoints: function(earnedPoints, orderInfo) {
    return new Promise((resolve, reject) => {
      const userId = this.data.currentUserId;
      let docId = '';
      
      console.log('本地方法更新用户积分，用户ID:', userId, '增加积分:', earnedPoints);
      
      if (userId === 1) {
        docId = this.data.userProfileIds.profile1; // 职场精英女性
      } else if (userId === 3) {
        docId = this.data.userProfileIds.profile3; // 科研工作者
      } else {
        docId = this.data.userProfileIds.profile2; // 都市新锐青年(默认)
      }
      
      // 从用户文档获取当前积分
      this.data.db.collection('user').doc(docId).get().then(res => {
        if (res.data) {
          // 确保assets字段存在
          const assets = res.data.assets || {};
          const currentPoints = assets.points || 0;
          const newPoints = currentPoints + earnedPoints;
          
          console.log('当前积分:', currentPoints, '新积分:', newPoints);
          
          // 更新用户积分
          return this.data.db.collection('user').doc(docId).update({
            data: {
              'assets.points': newPoints,
              experience: newPoints, // 同时更新experience字段
              updateTime: this.formatDate(new Date())
            }
          });
        }
        return Promise.reject(new Error('用户数据不存在'));
      }).then(res => {
        console.log('用户积分更新成功:', res);
        
        // 尝试添加积分记录到已有的积分相关集合
        try {
          // 使用points集合记录积分变动
          return this.data.db.collection('points').add({
            data: {
              userId: userId,
              points: earnedPoints,
              type: 'earn',
              description: `购买商品获得${earnedPoints}积分`,
              date: this.formatDate(new Date()),
              createTime: this.formatDate(new Date()),
              orderNumber: orderInfo.orderNumber
            }
          });
        } catch (err) {
          console.log('积分记录添加失败，跳过此步骤:', err);
          return Promise.resolve();
        }
      }).then(() => {
        console.log(`用户积分已增加${earnedPoints}点`);
        
        // 更新本地存储中的积分
        this.updateLocalPoints(this.data.userBalance + earnedPoints);
        
        resolve();
      }).catch(err => {
        console.error('更新用户积分失败:', err);
        
        // 记录失败的操作，以便将来可能的重试
        const failedOperations = wx.getStorageSync('failedOperations') || [];
        failedOperations.push({
          type: 'updatePoints',
          userId: docId,
          earnedPoints: earnedPoints,
          orderNumber: orderInfo.orderNumber,
          time: this.formatDate(new Date()),
          error: err.message || '未知错误'
        });
        wx.setStorageSync('failedOperations', failedOperations);
        
        // 不中断支付流程，继续执行
        resolve();
      });
    });
  },
  
  /**
   * 更新本地存储中的积分
   */
  updateLocalPoints: function(points) {
    // 更新用户信息中的积分
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo.experience = points;
    wx.setStorageSync('userInfo', userInfo);
    
    // 更新资产信息中的积分
    const assets = wx.getStorageSync('assets') || {
      points: 0,
      coupons: 0,
      giftCards: 0,
      favorites: 0
    };
    assets.points = points;
    wx.setStorageSync('assets', assets);
    
    // 设置一个标志，提示积分页面需要刷新数据
    wx.setStorageSync('pointsNeedRefresh', true);
  }
}) 