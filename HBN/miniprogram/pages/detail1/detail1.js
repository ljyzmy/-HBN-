Page({
  data: {
    navTransparent: true,
    currentMainSwiper: 0,
    product: null,
    selectedSpecs: {
      '规格': '标准装'
    },
    currentPrice: 288.00,
    currentOriginalPrice: 388.00,
    showSpecSelector: false,
    floatExpanded: true,
    swiperConfig: {
      indicatorDots: true,
      indicatorColor: "rgba(0, 0, 0, .3)",
      indicatorActiveColor: "#618a49",
      autoplay: false,
      interval: 3000,
      duration: 500,
      circular: true,
      previousMargin: '0px',
      nextMargin: '0px',
      displayMultipleItems: 1
    },
    quantity: 1,     // 默认数量为1
    minQuantity: 1,  // 最小数量限制
    maxQuantity: 99,  // 最大数量限制
    isFavorite: false, // 是否已收藏
    actionType: 'cart', // 弹窗类型，cart=购物车，buy=立即购买
    loadedDetailImages: [], // 已加载的详情图片
    visibleDetailImageCount: 5, // 初始可见详情图片数量
    detailImageLoadStep: 10, // 每次新加载图片数量
    isDetailImagesFullyLoaded: false, // 是否已全部加载完成
    isVideosLoaded: false,
    videoLoading: false,
  },

  onLoad: function(options) {
    // 根据options.id加载商品数据，默认为1
    const id = parseInt(options.id) || 1;
    console.log('加载商品ID:', id);
    
    // 加载商品数据
    this.loadProductData(id);
  },

  onShow: function() {
    // 检查商品是否已收藏
    if (this.data.product) {
      this.checkFavoriteStatus();
      
      // 添加浏览记录
      this.addToHistory();
      
      // 确保价格计算正确
      this.updatePrice();
    }
  },

  loadProductData(id) {
    // 只保留第一个商品数据
    const productData = {
      id: 1,
      name: 'HBN早C晚A水乳套装2.0',
      description: '日间御氧焕亮，夜间塑颜抚纹，解决初老带来的皱纹和暗沉',
      price: 288.00,
      originalPrice: 388.00,
      sales: 2156,
      stock: 999,
      productVideo: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/组合视频.mp4',
      productVideo2: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/商品视频/1.mp4',
      bannerImages: [
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01tzrFov1OEk4F5DdNn_!!4611686018427384634-0-item_pic.jpg_.webp',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01YqErYI1OEk2SvfbzZ_!!2204177871674.jpg_.webp',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01YqErYI1OEk2SvfbzZ_!!2204177871674.jpg_.webp',
        'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01Rh8Xxc1OEk4NTKnAl-2204177871674.jpg_.webp'
      ],
      detailImages: [
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01A3iVmU1OEk4DrJA0O_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01Yo4iWa1OEk4GHmIiI_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01V1Ih771OEjx7QbRXC_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01Gc35wh1OEjxABOm4J_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Sty5qE1OEk4GnsfUt_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN013Kjp3o1OEk4He55u9_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bHzfV51OEjx6khnnf_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01TMGanQ1OEk4FYA59b_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01xNELRf1OEk4GrMuYR_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01fHgUWv1OEk4EPlqjP_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01Zk4S6n1OEk4EPla56_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01mNB53V1OEk4DrJhGP_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01SjPFho1OEk4GVdJLq_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01v1TEy21OEjxu8fAyo_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN018O5W381OEk4DrHcN7_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dvVkA41OEk4EVTvGV_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZRKjHi1OEjx4s9zR2_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01afzthr1OEjzuSXauM_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01skfelJ1OEjzvtk0C5_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN015ehnsl1OEjzvtkCfC_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UQaW4q1OEjzvDNxpK_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01aTo5BO1OEjx8miaSn_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01wWbxnY1OEjxABQS6N_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01df8DsP1OEk4FjnuD9_!!2204177871674.jpg',

        'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01zZIyvA1OEk4GrMdw0_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01eAl6FE1OEk4Gtmp0I_!!2204177871674.jpg',
        '//img.alicdn.com/imgextra/i4/2204177871674/O1CN01vbNYmB1OEk4G6R5SV_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN014IApjr1OEk4FYDq22_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ueoT4Q1OEjx8mhFF9_!!2204177871674.jpg',
        'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',
      ],
      specsPrices: {
        '1': {
          price: 288.00,
          originalPrice: 388.00
        }
      },
      specs: [
        {
          name: '规格',
          options: ['标准装', '限量礼盒']
        }
      ]
    };

    // 更新商品数据和默认价格到页面
    this.setData({
      product: productData,
      currentPrice: productData.price,
      currentOriginalPrice: productData.originalPrice
    });

    wx.setNavigationBarTitle({
      title: productData.name
    });
    
    // 初始化详情图片懒加载
    this.initDetailImagesLazyLoad(productData.detailImages);
    
    // 检查商品是否已收藏
    this.checkFavoriteStatus();
    
    // 初始化价格计算
    this.updatePrice();
  },
  
  // 初始化详情图片懒加载
  initDetailImagesLazyLoad(detailImages) {
    if (!detailImages || !detailImages.length) return;
    
    // 计算初始加载图片
    const initialImages = detailImages.slice(0, this.data.visibleDetailImageCount);
    
    this.setData({
      loadedDetailImages: initialImages,
      isDetailImagesFullyLoaded: initialImages.length >= detailImages.length
    });
  },
  
  // 加载更多详情图片
  loadMoreDetailImages() {
    if (this.data.isDetailImagesFullyLoaded) return;
    
    const allImages = this.data.product.detailImages;
    const loadedCount = this.data.loadedDetailImages.length;
    const nextLoadCount = Math.min(loadedCount + this.data.detailImageLoadStep, allImages.length);
    
    // 加载下一批图片
    const newLoadedImages = allImages.slice(0, nextLoadCount);
    
    this.setData({
      loadedDetailImages: newLoadedImages,
      isDetailImagesFullyLoaded: nextLoadCount >= allImages.length
    });
    
    console.log(`已加载 ${nextLoadCount}/${allImages.length} 张详情图片`);
  },

  // 详情滚动触底事件
  onDetailScrollToLower() {
    this.loadMoreDetailImages();
  },

  // 检查商品是否已收藏
  checkFavoriteStatus() {
    const productId = this.data.product.id;
    
    // 首先检查本地存储
    const favorites = wx.getStorageSync('favorites') || [];
    const isLocalFavorite = favorites.some(item => item.id === productId);
    
    // 确保云环境已初始化
    wx.cloud.init({
      env: 'YOUR_CLOUD_ENV_ID',
      traceUser: true
    });
    
    // 检查云数据库中是否已收藏
    wx.cloud.callFunction({
      name: 'syncFavorites',
      data: {
        action: 'getFromCloud',
        userId: 'user_001' // 固定用户ID，实际应该从登录状态获取
      }
    })
    .then(res => {
      if (res.result && res.result.code === 0 && res.result.data) {
        const cloudFavorites = res.result.data;
        const isCloudFavorite = cloudFavorites.some(item => item.product_id === productId);
        
        // 如果云端和本地状态不一致，以云端为准
        if (isCloudFavorite !== isLocalFavorite) {
          // 更新本地收藏状态
          if (isCloudFavorite) {
            // 云端有但本地没有，添加到本地
            if (!isLocalFavorite) {
              const cloudItem = cloudFavorites.find(item => item.product_id === productId);
              if (cloudItem) {
                favorites.push({
                  id: cloudItem.product_id,
                  name: cloudItem.name,
                  image: cloudItem.image,
                  price: cloudItem.price,
                  originalPrice: cloudItem.originalPrice,
                  category: cloudItem.category || '商品',
                  date: cloudItem.create_time.split(' ')[0],
                  portrait_tags: cloudItem.portrait_tags || []
                });
                wx.setStorageSync('favorites', favorites);
              }
            }
          } else {
            // 云端没有但本地有，从本地移除
            const index = favorites.findIndex(item => item.id === productId);
            if (index > -1) {
              favorites.splice(index, 1);
              wx.setStorageSync('favorites', favorites);
            }
          }
        }
        
        // 更新UI显示
        this.setData({
          isFavorite: isCloudFavorite
        });
      } else {
        // 如果云端获取失败，使用本地状态
        this.setData({
          isFavorite: isLocalFavorite
        });
      }
    })
    .catch(err => {
      console.error('检查收藏状态失败:', err);
      // 如果检查失败，使用本地状态
      this.setData({
        isFavorite: isLocalFavorite
      });
    });
  },

  // 收藏/取消收藏商品
  toggleFavorite() {
    const product = this.data.product;
    if (!product) return;
    
    // 显示加载中提示
    wx.showLoading({
      title: this.data.isFavorite ? '取消收藏中...' : '收藏中...',
      mask: true
    });
    
    let favorites = wx.getStorageSync('favorites') || [];
    const productId = product.id;
    
    // 判断是否已收藏
    const favoriteIndex = favorites.findIndex(item => item.id === productId);
    
    // 创建收藏对象
    const favoriteItem = {
      id: productId,
      name: product.name,
      image: product.bannerImages[0],
      price: this.data.currentPrice,
      originalPrice: this.data.currentOriginalPrice,
      sales: product.sales || 0,
      category: product.category || '商品',
      date: new Date().toISOString().split('T')[0], // 当前日期，格式：YYYY-MM-DD
      portrait_tags: product.portrait_tags || []
    };
    
    // 调用云函数处理收藏
    wx.cloud.init({
      env: 'YOUR_CLOUD_ENV_ID',
      traceUser: true
    });
    
    if (favoriteIndex > -1) {
      // 已收藏，取消收藏
      favorites.splice(favoriteIndex, 1);
      
      // 调用云函数取消收藏
      wx.cloud.callFunction({
        name: 'syncFavorites',
        data: {
          action: 'removeFavorite',
          userId: 'user_001', // 用固定用户ID，实际应该从登录状态获取
          data: {
            productId: productId
          }
        }
      })
      .then(() => {
        this.setData({ isFavorite: false });
        wx.hideLoading();
        wx.showToast({
          title: '已取消收藏',
          icon: 'success'
        });
        
        // 保存收藏列表到本地存储
        wx.setStorageSync('favorites', favorites);
      })
      .catch(err => {
        console.error('取消收藏失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      });
    } else {
      // 未收藏，添加收藏
      favorites.push(favoriteItem);
      
      // 调用云函数添加收藏
      wx.cloud.callFunction({
        name: 'syncFavorites',
        data: {
          action: 'addFavorite',
          userId: 'user_001', // 用固定用户ID，实际应该从登录状态获取
          data: favoriteItem
        }
      })
      .then(() => {
        this.setData({ isFavorite: true });
        wx.hideLoading();
        wx.showToast({
          title: '收藏成功',
          icon: 'success'
        });
        
        // 保存收藏列表到本地存储
        wx.setStorageSync('favorites', favorites);
      })
      .catch(err => {
        console.error('添加收藏失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      });
    }
  },

  // 主轮播图切换事件
  swiperChange(e) {
    const current = e.detail.current;
    this.setData({
      currentMainSwiper: current
    });
    
    // 当切换到第一屏时，懒加载视频
    if (current === 0 && !this.data.isVideosLoaded) {
      this.lazyLoadVideo();
    }
  },
  
  // 视频资源懒加载
  lazyLoadVideo() {
    if (this.data.isVideosLoaded || this.data.videoLoading) return;
    
    this.setData({ videoLoading: true });
    
    // 延迟创建视频上下文，避免一次性加载太多资源
    setTimeout(() => {
      this.videoContext1 = wx.createVideoContext('product-video-1');
      setTimeout(() => {
        if (this.videoContext1) this.videoContext1.play();
      }, 300);
      
      this.setData({ 
        isVideosLoaded: true,
        videoLoading: false
      });
    }, 500);
  },

  // 显示规格选择器 - 加入购物车
  showCartSelector() {
    this.setData({ 
      showSpecSelector: true,
      actionType: 'cart'
    });
  },
  
  // 显示规格选择器 - 立即购买
  showBuySelector() {
    this.setData({ 
      showSpecSelector: true,
      actionType: 'buy'
    });
  },

  // 隐藏规格选择器
  hideSpecSelector() {
    this.setData({ showSpecSelector: false });
  },

  // 防止弹窗背景滚动
  preventTouchMove() {
    return false;
  },

  // 选择规格
  selectSpec(e) {
    const { type, value } = e.currentTarget.dataset;
    const selectedSpecs = {...this.data.selectedSpecs};
    selectedSpecs[type] = value;
    
    this.setData({ selectedSpecs });
    
    // 更新价格展示（单价）
    this.updatePrice();
  },

  // 更新价格展示
  updatePrice() {
    // 基础价格
    const basePrice = this.data.product.price;
    const baseOriginalPrice = this.data.product.originalPrice;
    
    // 根据数量计算总价
    const totalPrice = basePrice * this.data.quantity;
    const totalOriginalPrice = baseOriginalPrice * this.data.quantity;
    
    this.setData({
      currentPrice: totalPrice.toFixed(2),
      currentOriginalPrice: totalOriginalPrice.toFixed(2)
    });
  },

  // 导航到首页
  goToHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  // 导航到购物车
  goToCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  },

  // 添加到购物车
  addToCart() {
    // 获取选中的商品信息
    const product = this.data.product;
    // 获取商品数量
    const quantity = parseInt(this.data.quantity) || 1;
    
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.bannerImages[0],
      price: this.data.currentPrice,
      originalPrice: this.data.currentOriginalPrice,
      quantity: quantity,
      specs: this.data.selectedSpecs,
      selected: true // 默认选中
    };
    
    // 从本地存储获取购物车数据
    let cartItems = wx.getStorageSync('cartItems') || [];
    
    // 检查购物车中是否已有相同规格的商品
    const existingItemIndex = cartItems.findIndex(item => 
      item.id === cartItem.id && 
      JSON.stringify(item.specs) === JSON.stringify(cartItem.specs)
    );
    
    if (existingItemIndex > -1) {
      // 如果已经存在，增加数量
      cartItems[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // 如果不存在，添加新项
      cartItems.push(cartItem);
    }
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', cartItems);
    
    wx.showToast({ 
      title: `已加入购物车 ${quantity} 件`, 
      icon: 'success' 
    });
    this.hideSpecSelector();
  },

  // 立即购买
  buyNow() {
    // 获取商品信息
    const product = this.data.product;
    
    // 创建要传递的商品信息对象
    const productInfo = {
      id: product.id,
      name: product.name,
      image: product.bannerImages[0],
      price: this.data.currentPrice,
      originalPrice: this.data.currentOriginalPrice,
      specs: this.data.selectedSpecs,
      bannerImages: product.bannerImages
    };
    
    // 将商品信息编码，以便传递到订单确认页面
    const encodedProductInfo = encodeURIComponent(JSON.stringify(productInfo));
    
    // 隐藏规格选择器
    this.hideSpecSelector();
    
    // 跳转到订单确认页面
    wx.navigateTo({
      url: `/pages/order/confirm?productInfo=${encodedProductInfo}&quantity=${this.data.quantity}`
    });
  },

  // 页面滚动处理
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    if (scrollTop > 50) {
      if (this.data.navTransparent) {
        this.setData({ navTransparent: false });
      }
    } else {
      if (!this.data.navTransparent) {
        this.setData({ navTransparent: true });
      }
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  // 视频处理
  onReady() {
    // 如果页面初始停留在第一屏，初始化第一个视频
    if (this.data.currentMainSwiper === 0) {
      this.lazyLoadVideo();
    }
    
    // 第二个视频在轮播切换时才加载
    this.videoContext2 = null; // 初始化为null，后续按需创建
  },

  // 处理视频错误
  videoError(e) {
    console.error('视频播放错误:', e.detail.errMsg);
  },

  // 切换浮窗展开/收起
  toggleFloatExpand() {
    this.setData({ floatExpanded: !this.data.floatExpanded });
  },

  // 轮播图切换处理
  bannerSwiperChange(e) {
    const current = e.detail.current;
    
    // 处理视频播放
    if (current === 0 && this.videoContext1) {
      this.videoContext1.play();
    } else if (current === 1) {
      if (!this.videoContext2) {
        // 懒加载第二个视频
        setTimeout(() => {
          this.videoContext2 = wx.createVideoContext('product-video-2');
          if (this.videoContext2) this.videoContext2.play();
        }, 300);
      } else {
        this.videoContext2.play();
      }
    }
  },
  
  // 数量减少
  decreaseQuantity() {
    if (this.data.quantity > this.data.minQuantity) {
      const newQuantity = this.data.quantity - 1;
      this.setData({
        quantity: newQuantity
      });
      // 更新价格
      this.updatePrice();
    } else {
      wx.showToast({
        title: '不能再减少了',
        icon: 'none'
      });
    }
  },
  
  // 数量增加
  increaseQuantity() {
    if (this.data.quantity < this.data.maxQuantity) {
      const newQuantity = this.data.quantity + 1;
      this.setData({
        quantity: newQuantity
      });
      // 更新价格
      this.updatePrice();
    } else {
      wx.showToast({
        title: '已达到最大购买数量',
        icon: 'none'
      });
    }
  },
  
  // 输入数量
  inputQuantity(e) {
    const value = parseInt(e.detail.value);
    if (!isNaN(value)) {
      let newQuantity = value;
      if (value < this.data.minQuantity) {
        newQuantity = this.data.minQuantity;
      } else if (value > this.data.maxQuantity) {
        newQuantity = this.data.maxQuantity;
      }
      
      this.setData({ quantity: newQuantity });
      // 更新价格
      this.updatePrice();
    } else {
      this.setData({ quantity: this.data.minQuantity });
      // 更新价格
      this.updatePrice();
    }
  },
  
  // 查看图片
  viewImage(e) {
    const url = e.currentTarget.dataset.url;
    const urls = this.data.product.bannerImages;
    
    wx.previewImage({
      current: url,
      urls: urls
    });
  },
  
  // 处理详情视频错误
  detailVideoError(e) {
    console.error('详情视频播放错误:', e.detail.errMsg);
    wx.showToast({
      title: '视频加载失败，请检查网络后重试',
      icon: 'none',
      duration: 2000
    });
  },
  
  // 处理详情视频点击事件
  detailVideoTap() {
    // 懒加载详情视频
    if (!this.detailVideoContext && this.data.product && 
        this.data.product.detailVideoIndex !== undefined) {
      
      console.log('初始化详情视频上下文');
      this.detailVideoContext = wx.createVideoContext('detail-video');
    }
  },
  
  // 处理详情视频播放状态变化
  detailVideoPlay() {
    console.log('详情视频开始播放');
  },
  
  // 处理详情视频暂停
  detailVideoPause() {
    console.log('详情视频暂停');
  },
  
  // 添加到浏览历史
  addToHistory() {
    const product = this.data.product;
    
    // 确保商品数据已加载
    if (!product || !product.id) {
      return;
    }
    
    // 初始化云开发环境
    wx.cloud.init({
      env: 'YOUR_CLOUD_ENV_ID',
      traceUser: true
    });
    
    // 调用云函数记录浏览历史
    wx.cloud.callFunction({
      name: 'manageHistory',
      data: {
        action: 'add',
        data: {
          productId: product.id.toString(),
          name: product.name,
          image: product.bannerImages[0],
          price: this.data.currentPrice,
          originalPrice: this.data.currentOriginalPrice,
          category: product.category || '未分类'
        }
      }
    }).then(res => {
      console.log('浏览历史记录成功', res);
    }).catch(err => {
      console.error('记录浏览历史失败', err);
    });
  }
}); 