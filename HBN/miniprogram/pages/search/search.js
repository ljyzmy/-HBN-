Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTransparent: true,
    searchText: '',
    searchHistory: [],
    hotKeywords: ['早C晚A套装', '咖啡因眼霜', '视黄醇精华', '美白面膜', '敦煌套装'],
    searchResults: [],
    hasSearched: false, // 是否已执行过搜索
    allProducts: [], // 存储所有产品数据
    recommendations: [], // 猜你喜欢的商品
    usedRecommendations: new Set(), // 记录已经推荐过的商品ID，避免重复
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载搜索历史
    this.loadSearchHistory();
    
    // 加载所有产品数据
    this.loadAllProducts();
    
    // 初始化推荐商品
    this.initRecommendations();
  },

  /**
   * 加载搜索历史
   */
  loadSearchHistory: function () {
    const history = wx.getStorageSync('searchHistory') || [];
    this.setData({
      searchHistory: history
    });
  },

  /**
   * 加载所有产品数据
   */
  loadAllProducts: function () {
    // 这里综合了来自多个页面的产品数据
    let allProducts = [];
    
    // 从index页面的热售商品
    const productList = [
      { 
        id: 1, 
        title: 'HBN早C晚A水乳套装2.0发光水提亮去黄补水紧致抗皱', 
        price: 288.00, 
        originalPrice: 388.00, 
        salesCount: 2156, 
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/组合.png',
        tag: '热销套装'
      },
      { 
        id: 2, 
        title: 'HBN咖啡因眼霜3.0 淡细纹焕亮眼周 抗皱紧致保湿眼霜', 
        price: 289.00, 
        originalPrice: 389.00, 
        salesCount: 1892, 
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/咖啡因眼霜.png',
        tag: '眼部精品'
      },
      { 
        id: 3, 
        title: 'HBN视黄醇精华乳2.0双a醇乳液紧致抗皱焕亮淡化细纹护肤品男女', 
        price: 199.00, 
        originalPrice: 289.00, 
        salesCount: 3214, 
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/双A醇精华乳.png',
        tag: '抗老明星'
      },
      { 
        id: 4, 
        title: 'HBN发光水α-熊果苷精粹水2.0提亮肤色保湿爽肤水湿敷护肤精华水', 
        price: 129.00, 
        originalPrice: 199.00, 
        salesCount: 1675, 
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/经典版发光水.png',
        tag: '爆款单品'
      }
    ];
    
    // 从flash sale部分获取商品
    const flashSaleProducts = [
      { id: 101, title: 'HBN早C晚A套装', price: 288.00, originalPrice: 429.00, salesCount: 8976, image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/组合.png', tag: '限时折扣' },
      { id: 102, title: '明星发光水', price: 119.00, originalPrice: 163.00, salesCount: 6543, image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/经典版发光水.png', tag: '限时折扣' },
      { id: 103, title: '双A醇精华乳', price: 189.00, originalPrice: 262.00, salesCount: 5421, image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/双A醇精华乳.png', tag: '限时折扣' },
      { id: 104, title: '咖啡因紧致眼霜', price: 279.00, originalPrice: 422.00, salesCount: 7123, image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/咖啡因眼霜.png', tag: '限时折扣' }
    ];

    // 从HBN页面的直播热卖获取商品
    const featuredProducts = [
      {
        id: 201,
        name: '早C晚A2.0套组',
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/组合.png',
        originalPrice: 599,
        price: 288,
        tag: '抗初老套装',
        desc: '日间御氧焕亮，夜间塑颜抚纹，28天显著抗初老',
        sold: 58920
      },
      {
        id: 202,
        name: '咖啡因紧致修护眼霜',
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/咖啡因眼霜.png',
        originalPrice: 299,
        price: 259,
        tag: '眼部加浓冰美式',
        desc: '即时起效、淡圈更快、淡纹更猛',
        sold: 32145
      }
    ];
    
    // 从推荐商品获取
    const recommendProducts = [
      {
        id: 301,
        name: '【王牌早C晚A】紧致·焕亮·抗初老',
        price: 288.00,
        originalPrice: 599.00,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/组合.png',
        tag: '早C晚A 2.0套组',
        sold: 12543
      },
      {
        id: 302,
        name: '【经典版】御氧提亮  熬夜党必备',
        price: 129.00,
        originalPrice: 259.00,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/经典版发光水.png',
        tag: '明星发光水熊果苷精粹水2.0',
        sold: 9876
      },
      {
        id: 303,
        name: '视黄醇精华乳2.0：初老救星，焕亮抚纹',
        price: 259.00,
        originalPrice: 299.00,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/双A醇精华乳.png',
        tag: '视黄醇精华乳',
        sold: 8765
      }
    ];

    const additionalProducts = [
    ];

    // 合并所有商品数据，并确保ID唯一
    allProducts = [...productList, ...flashSaleProducts, ...featuredProducts, ...recommendProducts, ...additionalProducts];
    
    // 去重，基于ID
    const uniqueProductsMap = {};
    allProducts.forEach(product => {
      const id = product.id;
      if (!uniqueProductsMap[id]) {
        uniqueProductsMap[id] = product;
      }
    });
    
    // 转换回数组
    allProducts = Object.values(uniqueProductsMap);
    
    this.setData({
      allProducts: allProducts
    });
  },

  /**
   * 初始化推荐商品
   */
  initRecommendations: function() {
    this.setData({
      usedRecommendations: new Set()
    }, () => {
      this.getRecommendations();
    });
  },

  /**
   * 获取猜你喜欢的商品
   * 策略：综合考虑销量、是否特价、与搜索历史的相关性
   */
  getRecommendations: function() {
    const allProducts = this.data.allProducts;
    
    if (allProducts.length === 0) return;
    
    const history = this.data.searchHistory;
    const usedIds = Array.from(this.data.usedRecommendations);
    
    // 过滤掉已经推荐过的商品
    let availableProducts = allProducts.filter(product => 
      !usedIds.includes(product.id)
    );
    
    // 如果可用商品不足，重置已使用的推荐
    if (availableProducts.length < 5) {
      availableProducts = allProducts;
      this.setData({
        usedRecommendations: new Set()
      });
    }
    
    // 给每个产品计算一个推荐分数
    const scoredProducts = availableProducts.map(product => {
      let score = 0;
      
      // 基于销量加分
      const sales = product.salesCount || product.sold || 0;
      score += Math.min(sales / 1000, 5); // 最高5分
      
      // 如果是特价商品加分
      if (product.originalPrice && product.price < product.originalPrice) {
        const discountRate = (product.originalPrice - product.price) / product.originalPrice;
        score += discountRate * 3; // 折扣率越高分越高，最高3分
      }
      
      // 与搜索历史的相关性
      if (history && history.length > 0) {
        history.forEach((keyword, index) => {
          const weight = 1 / (index + 1); // 越近的历史权重越高
          const title = (product.title || product.name || '').toLowerCase();
          const tag = (product.tag || '').toLowerCase();
          const desc = (product.desc || product.description || '').toLowerCase();
          
          if (title.includes(keyword.toLowerCase()) || 
              tag.includes(keyword.toLowerCase()) ||
              desc.includes(keyword.toLowerCase())) {
            score += 2 * weight;
          }
        });
      }
      
      // 添加一点随机性，避免每次推荐都一样
      score += Math.random() * 2;
      
      return {
        ...product,
        score
      };
    });
    
    // 按分数排序并选取前5个
    scoredProducts.sort((a, b) => b.score - a.score);
    
    const recommendations = scoredProducts.slice(0, 5);
    
    // 记录已使用的推荐ID
    const newUsedIds = new Set(this.data.usedRecommendations);
    recommendations.forEach(item => {
      newUsedIds.add(item.id);
    });
    
    // 渲染到界面
    this.setData({
      recommendations: recommendations,
      usedRecommendations: newUsedIds
    });
  },

  /**
   * 刷新推荐
   */
  refreshRecommendations: function() {
    // 显示加载动画
    wx.showLoading({
      title: '换一批...',
      mask: true
    });
    
    setTimeout(() => {
      this.getRecommendations();
      wx.hideLoading();
      
      // 显示换一批成功的提示
      wx.showToast({
        title: '为您推荐新品',
        icon: 'none',
        duration: 1500
      });
    }, 500);
  },

  /**
   * 输入搜索文本
   */
  onSearchInput: function (e) {
    this.setData({
      searchText: e.detail.value
    });

    // 如果清空了搜索框，重置搜索结果
    if (!e.detail.value) {
      this.setData({
        searchResults: [],
        hasSearched: false
      });
    }
  },

  /**
   * 执行搜索
   */
  doSearch: function () {
    const keyword = this.data.searchText.trim();
    if (!keyword) return;
    
    // 保存到搜索历史
    this.saveToHistory(keyword);
    
    // 执行搜索
    const results = this.searchProducts(keyword);
    
    this.setData({
      searchResults: results,
      hasSearched: true
    });

    // 如果搜索结果为空，刷新推荐
    if (results.length === 0) {
      this.refreshRecommendations();
    }
  },

  /**
   * 搜索产品
   */
  searchProducts: function (keyword) {
    if (!keyword) return [];
    
    keyword = keyword.toLowerCase();
    
    return this.data.allProducts.filter(product => {
      const name = (product.name || product.title || '').toLowerCase();
      const desc = (product.desc || product.description || '').toLowerCase();
      const tag = (product.tag || '').toLowerCase();
      
      return name.includes(keyword) || desc.includes(keyword) || tag.includes(keyword);
    });
  },

  /**
   * 保存关键词到历史记录
   */
  saveToHistory: function (keyword) {
    if (!keyword) return;
    
    // 获取现有历史
    let history = wx.getStorageSync('searchHistory') || [];
    
    // 如果已存在，先移除旧的再添加到顶部
    const index = history.indexOf(keyword);
    if (index > -1) {
      history.splice(index, 1);
    }
    
    // 添加到顶部
    history.unshift(keyword);
    
    // 限制历史记录最多10条
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    // 保存到本地存储
    wx.setStorageSync('searchHistory', history);
    
    // 更新数据
    this.setData({
      searchHistory: history
    });
  },

  /**
   * 清空搜索框
   */
  clearSearch: function () {
    this.setData({
      searchText: '',
      searchResults: [],
      hasSearched: false
    });
  },

  /**
   * 清空搜索历史
   */
  clearHistory: function () {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory');
          this.setData({
            searchHistory: []
          });
          
          wx.showToast({
            title: '已清空历史',
            icon: 'success',
            duration: 1500
          });

          // 刷新推荐
          this.refreshRecommendations();
        }
      }
    });
  },

  /**
   * 使用历史关键词
   */
  useHistoryKeyword: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchText: keyword
    }, () => {
      this.doSearch();
    });
  },

  /**
   * 取消搜索，返回上一页
   */
  cancelSearch: function () {
    wx.navigateBack();
  },

  /**
   * 跳转到商品详情
   */
  goToProductDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    
    // 根据ID判断跳转到哪个详情页
    if (id === 1 || id === 101 || id === 201 || id === 301) {
      // 早C晚A套装相关ID都跳转到detail1页面
      wx.navigateTo({
        url: '/pages/detail1/detail1'
      });
    } else if (id === 2 || id === 104 || id === 202) {
      // 咖啡因眼霜相关ID都跳转到detail页面id=3
      wx.navigateTo({
        url: '/pages/detail/detail?id=3'
      });
    } else if (id === 4 || id === 102 || id === 302) {
      // 发光水相关ID都跳转到detail页面id=2
      wx.navigateTo({
        url: '/pages/detail/detail?id=2'
      });
    } else {
      // 其他ID跳转到通用detail页面
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    }
  },

  /**
   * 监听页面滚动
   */
  onPageScroll: function (e) {
    const scrollTop = e.detail.scrollTop;
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
  }
}) 