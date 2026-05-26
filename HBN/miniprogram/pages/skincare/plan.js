// pages/skincare/plan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    skinAnalysis: {
      skinType: '',
      concerns: [],
      recommendation: ''
    },
    skinProducts: [],
    skincareSteps: [
      {
        name: '清洁',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/清洁.png',
        products: []
      },
      {
        name: '爽肤水',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/爽肤水.png',
        products: []
      },
      {
        name: '精华',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/精华液.png',
        products: []
      },
      {
        name: '乳霜',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/乳霜.png',
        products: []
      },
      {
        name: '防晒',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/防嗮霜.png',
        products: []
      }
    ],
    activeTab: 0,
    userSkinData: {},
    loading: true,
    // 添加产品模拟数据
    mockProductsData: {
      // 抗老紧致系列的产品
      1: { 
        id: 1, 
        name: '视黄醇精华乳2.0',
        description: '多效靶向抗初老，卓效紧致焕亮肌肤',
        price: 189.00,
        originalPrice: 299.00,
        sales: 3399,
        stock: 850,
        tags: ['多效靶向抗初老', '焕亮肌肤'],
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/3.png'
        ],
        category: '精华液'
      },
      
      2: { 
        id: 2, 
        name: '双A醇晚霜2.0',
        description: '卓效激活胶原，显著抗皱紧致',
        price: 279.00,
        originalPrice: 399.00,
        sales: 4217,
        stock: 620,
        tags: ['卓效激活胶原'],
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/4.png'
        ],
        category: '晚霜'
      },
      
      3: {
        id: 3,
        name: '玻尿酸原液',
        description: '深层补水，长效保湿锁水',
        price: 169.00,
        originalPrice: 229.00,
        sales: 5628,
        stock: 546,
        tags: ['补水保湿', '舒缓修护'],
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/5.png'
        ],
        category: '精华液'
      },
      
      4: {
        id: 4,
        name: 'HBN双A醇眼部精华小咖管抗皱眼霜精华液黑眼圈',
        description: '温和清洁，不紧绷',
        price: 119.00,
        originalPrice: 159.00,
        sales: 8730,
        stock: 905,
        tags: ['温和清洁', '不紧绷'],
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/6.png'
        ],
        category: '洁面'
      },
      
      5: {
        id: 5,
        name: 'HBN多效修护爽肤水',
        description: '舒缓敏感，均衡水油',
        price: 189.00,
        originalPrice: 239.00,
        sales: 6289,
        stock: 723,
        tags: ['舒缓敏感', '均衡水油'],
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/检测.png'
        ],
        category: '爽肤水'
      },
      
      6: {
        id: 6,
        name: 'HBN水润保湿面霜',
        description: '长效锁水保湿',
        price: 259.00,
        originalPrice: 329.00,
        sales: 5124,
        stock: 486,
        tags: ['锁水保湿', '提亮肤色'],
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/8.png'
        ],
        category: '面霜'
      },
      
      7: {
        id: 7,
        name: 'HBN清透防晒乳SPF50',
        description: '轻薄不泛白，控油防护',
        price: 219.00,
        originalPrice: 279.00,
        sales: 7430,
        stock: 635,
        tags: ['清爽控油', '广谱防护'],
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/空状态.png'
        ],
        category: '防晒'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从缓存中获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
    }
    
    // 加载用户的皮肤数据
    this.loadUserSkinData();
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
    this.loadUserSkinData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
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
      title: '我的专属护肤方案 - HBN',
      path: '/pages/skincare/plan'
    };
  },

  /**
   * 加载用户皮肤数据
   */
  loadUserSkinData() {
    this.setData({
      loading: true
    });
    
    // 获取用户ID，用于确定获取哪个用户的皮肤数据
    const userInfo = wx.getStorageSync('userInfo');
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo && userInfo.nickName) {
      if (userInfo.nickName === '职场精英女性') {
        userId = 1;
      } else if (userInfo.nickName === '科研工作者') {
        userId = 3;
      }
    }
    
    // 直接使用模拟数据，不再尝试访问云数据库
    this.setMockData(userId);
  },
  
  /**
   * 设置模拟数据
   */
  setMockData(userId) {
    // 根据用户ID设置不同的模拟数据
    let mockSkinAnalysis = {};
    
    if (userId === 1) { // 职场精英女性
      mockSkinAnalysis = {
        skinType: '混合偏油',
        concerns: ['油光', '毛孔粗大', '敏感'],
        recommendation: '针对混合偏油肌肤，重点控油同时保湿，使用温和配方，避免过度清洁带来的刺激。'
      };
    } else if (userId === 3) { // 科研工作者
      mockSkinAnalysis = {
        skinType: '干性',
        concerns: ['干燥', '细纹', '暗沉'],
        recommendation: '针对干性肌肤，重点补水保湿，提供充足养分，建议使用质地滋润的产品。'
      };
    } else { // 都市新锐青年
      mockSkinAnalysis = {
        skinType: '中性偏干',
        concerns: ['缺水', '暗沉', '疲惫'],
        recommendation: '针对中性偏干肤质，重点补水保湿，提亮肤色，使用温和不刺激的产品。'
      };
    }
    
    this.setData({
      skinAnalysis: mockSkinAnalysis,
      loading: false
    });
    
    // 加载模拟推荐产品
    this.loadMockRecommendedProducts(userId);
  },
  
  /**
   * 加载推荐产品 - 此方法不再使用，改为直接调用模拟数据
   */
  loadRecommendedProducts(productIds) {
    // 已被模拟数据替代，保留此方法仅为向后兼容
    this.loadMockRecommendedProducts(2);
  },
  
  /**
   * 加载模拟推荐产品
   */
  loadMockRecommendedProducts(userId) {
    // 直接从本地模拟数据获取产品
    const productsData = this.data.mockProductsData;
    
    // 根据用户ID选择不同的产品组合
    let recommendedProducts = [];
    
    if (userId === 1) { // 职场精英女性
      // 偏好抗老紧致类产品
      recommendedProducts = [
        productsData[1], // 视黄醇精华乳2.0
        productsData[2], // 双A醇晚霜2.0
        productsData[5], // 多效修护爽肤水
        productsData[4], // 清洁
        productsData[7] || productsData[6] // 防晒或面霜
      ].filter(item => item); // 过滤掉未定义的产品
    } else if (userId === 3) { // 科研工作者
      // 偏好功效性产品
      recommendedProducts = [
        productsData[3] || productsData[1], // 玻尿酸原液或视黄醇精华乳
        productsData[2], // 双A醇晚霜2.0
        productsData[5], // 多效修护爽肤水
        productsData[4], // 清洁
        productsData[7] // 防晒
      ].filter(item => item);
    } else { // 都市新锐青年
      // 基础护肤
      recommendedProducts = [
        productsData[1], // 视黄醇精华乳2.0
        productsData[4], // 清洁
        productsData[5], // 多效修护爽肤水
        productsData[6], // 水润保湿面霜
        productsData[7] // 防晒
      ].filter(item => item);
    }
    
    // 映射产品类别到护肤步骤
    const categoryMapping = {
      '精华液': '精华',
      '精华': '精华',
      '面霜': '乳霜',
      '乳液': '乳霜',
      '晚霜': '乳霜',
      '洗面奶': '清洁',
      '洁面': '清洁',
      '化妆水': '爽肤水',
      '爽肤水': '爽肤水',
      '防晒': '防晒',
      '防晒霜': '防晒',
      '面膜': '乳霜'
    };
    
    // 分配产品到对应的护肤步骤
    const processedProducts = [];
    
    for (const productId in recommendedProducts) {
      if (recommendedProducts[productId]) {
        const product = recommendedProducts[productId];
        
        // 根据产品名称推断分类
        let category = '其他';
        const productName = product.name.toLowerCase();
        
        if (productName.includes('洁面') || productName.includes('洗面')) {
          category = '清洁';
        } else if (productName.includes('水') || productName.includes('爽肤')) {
          category = '爽肤水';
        } else if (productName.includes('精华') || productName.includes('原液')) {
          category = '精华';
        } else if (productName.includes('霜') || productName.includes('乳液') || productName.includes('面霜')) {
          category = '乳霜';
        } else if (productName.includes('防晒')) {
          category = '防晒';
        }
        
        // 如果有产品自身的分类，优先使用
        if (product.category && categoryMapping[product.category]) {
          category = categoryMapping[product.category];
        }
        
        processedProducts.push({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.bannerImages ? product.bannerImages[0] : 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/护肤.png',
          category: category,
          description: product.description || product.tags?.join('，') || '优质护肤产品',
          tags: product.tags || []
        });
      }
    }
    
    this.processCategoryProducts(processedProducts);
  },
  
  /**
   * 从detail页面获取产品数据 - 不再使用该方法，直接使用内置模拟数据
   */
  getProductsFromDetailPage() {
    return this.data.mockProductsData;
  },
  
  /**
   * 处理分类产品数据
   */
  processCategoryProducts(products) {
    // 按照护肤步骤分类产品
    const skincareSteps = this.data.skincareSteps;
    
    products.forEach(product => {
      // 根据产品类别添加到对应的步骤中
      for (let i = 0; i < skincareSteps.length; i++) {
        if (product.category === skincareSteps[i].name) {
          skincareSteps[i].products.push(product);
          break;
        }
      }
    });
    
    this.setData({
      skincareSteps: skincareSteps,
      skinProducts: products
    });
  },
  
  /**
   * 切换tab
   */
  changeTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
  },
  
  /**
   * 查看产品详情
   */
  viewProduct(e) {
    const productId = e.currentTarget.dataset.id;
    // 跳转到产品详情页，传递productId参数
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}`,
      success: () => {
        console.log(`跳转到商品ID: ${productId} 的详情页`);
      },
      fail: (err) => {
        console.error('跳转详情页失败:', err);
        wx.showToast({
          title: '商品信息获取失败',
          icon: 'none'
        });
      }
    });
  },
  
  /**
   * 随机生成皮肤测试
   */
  generateRandomTest() {
    wx.showToast({
      title: '测试中...',
      icon: 'loading',
      duration: 1500
    });
    
    setTimeout(() => {
      // 随机生成皮肤问题
      const skinTypes = ['干性', '油性', '混合型', '中性', '敏感性'];
      const concerns = [
        '缺水', '出油', '暗沉', '痘痘', '毛孔粗大', 
        '细纹', '色斑', '敏感', '泛红', '黑眼圈'
      ];
      
      // 随机选择
      const randomType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
      const randomConcerns = [];
      const concernCount = Math.floor(Math.random() * 3) + 1; // 1-3个问题
      
      // 确保不重复
      while (randomConcerns.length < concernCount) {
        const concern = concerns[Math.floor(Math.random() * concerns.length)];
        if (!randomConcerns.includes(concern)) {
          randomConcerns.push(concern);
        }
      }
      
      // 更新皮肤分析数据
      this.setData({
        'skinAnalysis.skinType': randomType,
        'skinAnalysis.concerns': randomConcerns,
        'skinAnalysis.recommendation': `针对${randomType}肌肤，建议重点解决${randomConcerns.join('、')}等问题，选择温和有效的护肤产品。`
      });
      
      // 重新加载推荐产品
      this.loadMockRecommendedProducts(2);
      
      wx.showToast({
        title: '测试完成',
        icon: 'success'
      });
    }, 1500);
  },
  
  /**
   * 进入皮肤测试
   */
  goToSkinTest() {
    wx.navigateTo({
      url: '/pages/skincare/test',
      success: (res) => {
        // 监听测试页面返回的分析结果
        res.eventChannel.on('updateSkinAnalysis', (data) => {
          if (data) {
            this.setData({
              skinAnalysis: data,
              loading: false
            });
            
            // 重新加载推荐产品
            this.loadMockRecommendedProducts(2);
            
            wx.showToast({
              title: '方案已更新',
              icon: 'success'
            });
          }
        });
      }
    });
  },
  
  /**
   * 一键加入购物车
   */
  addAllToCart() {
    const products = this.data.skinProducts;
    if (products.length === 0) {
      wx.showToast({
        title: '暂无推荐产品',
        icon: 'none'
      });
      return;
    }
    
    // 获取当前购物车
    let cartItems = wx.getStorageSync('cartItems') || [];
    
    // 将所有推荐产品添加到购物车
    products.forEach(product => {
      // 检查购物车中是否已有该商品
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // 已存在，数量+1
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // 不存在，添加到购物车
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity: 1,
          selected: true
        });
      }
    });
    
    // 更新购物车存储
    wx.setStorageSync('cartItems', cartItems);
    
    wx.showToast({
      title: '已全部加入购物车',
      icon: 'success'
    });
  },

  /**
   * 处理图片加载错误
   */
  handleImageError(e) {
    const index = e.currentTarget.dataset.index;
    const activeTab = this.data.activeTab;
    const productPath = `skincareSteps[${activeTab}].products[${index}].image`;
    
    // 设置默认图片
    this.setData({
      [productPath]: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/护肤.png'
    });
  },
})