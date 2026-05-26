// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-0gxff61z2804383c',
        traceUser: true,
      });
    }
    
    // 初始化全局数据
    this.globalData = {
      userInfo: null,
      allProducts: [], // 所有商品数据
      productsByCategory: {}, // 按分类存储商品数据
      cartCount: 0, // 购物车商品数量
      cartItems: [], // 购物车商品列表
      originalProductList: [] // 原始排序的商品列表
    };

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 从本地存储加载购物车数据
    this.loadCartFromStorage();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  
  // 设置所有商品数据
  setAllProducts(products) {
    this.globalData.allProducts = products;
  },
  
  // 设置分类下的商品数据
  setProductsByCategory(categoryId, products) {
    if (!this.globalData.productsByCategory) {
      this.globalData.productsByCategory = {};
    }
    this.globalData.productsByCategory[categoryId] = products;
  },
  
  // 更新购物车数量
  updateCartCount(count) {
    this.globalData.cartCount = count;
  },
  
  // 添加商品到购物车
  addToCart(product, quantity, specs) {
    // 检查购物车中是否已有相同商品和规格
    const existingItemIndex = this.globalData.cartItems.findIndex(
      item => item.id === product.id && 
             JSON.stringify(item.selectedSpecs) === JSON.stringify(specs)
    );
    
    if (existingItemIndex >= 0) {
      // 更新现有商品数量
      this.globalData.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // 添加新商品
      this.globalData.cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.bannerImages ? product.bannerImages[0] : product.image,
        quantity: quantity,
        selectedSpecs: specs
      });
    }
    
    // 更新购物车总数量
    this.updateCartCount(this.getCartTotalQuantity());
    
    // 保存购物车数据到本地
    this.saveCartToStorage();
  },
  
  // 获取购物车商品总数量
  getCartTotalQuantity() {
    return this.globalData.cartItems.reduce((total, item) => total + item.quantity, 0);
  },
  
  // 保存购物车数据到本地存储
  saveCartToStorage() {
    try {
      wx.setStorageSync('cartItems', this.globalData.cartItems);
      wx.setStorageSync('cartCount', this.globalData.cartCount);
    } catch (e) {
      console.error('保存购物车数据失败:', e);
    }
  },
  
  // 从本地存储加载购物车数据
  loadCartFromStorage() {
    try {
      const cartItems = wx.getStorageSync('cartItems');
      const cartCount = wx.getStorageSync('cartCount');
      
      if (cartItems) {
        this.globalData.cartItems = cartItems;
      }
      
      if (cartCount) {
        this.globalData.cartCount = cartCount;
      }
    } catch (e) {
      console.error('加载购物车数据失败:', e);
    }
  }
})
