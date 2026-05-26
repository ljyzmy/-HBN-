Page({
  data: {
    favorites: [],
    isEditMode: false, // 是否处于编辑模式
    selectedItems: [], // 选中的商品ID列表
    emptyIconPath: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/空状态.png', // 空状态图标
    userId: '', // 当前用户ID
    userPortrait: null, // 用户画像数据
    cloudSync: true, // 是否启用云同步
    loading: true, // 加载状态
    cartCount: 0, // 购物车商品数量
  },

  onLoad: function(options) {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      this.setData({ 
        cloudSync: false 
      });
    } else {
      wx.cloud.init({
        env: 'YOUR_CLOUD_ENV_ID',
        traceUser: true,
      });
    }
    
    // 获取用户ID（实际应用中应通过登录获取）
    // 这里模拟一个固定ID
    this.setData({
      userId: 'user_001'
    });
    
    // 加载云存储图标
    this.loadCloudImages();
  },
  
  onShow: function() {
    // 每次进入页面时重新加载收藏数据
    this.loadFavorites();
    
    // 获取用户画像数据
    this.getUserPortrait();
    
    // 获取购物车商品数量
    this.getCartCount();
    
    // 设置页面更新时间戳，以便在返回收藏页时重新加载数据
    this.setData({
      lastUpdateTime: new Date().getTime()
    });
  },
  
  // 添加下拉刷新处理函数
  onPullDownRefresh: function() {
    // 重新加载收藏数据
    this.syncCloudFavorites();
  },
  
  // 从云端同步所有收藏记录
  syncCloudFavorites: function() {
    if (!this.data.cloudSync || !this.data.userId) {
      wx.stopPullDownRefresh();
      return;
    }
    
    wx.showLoading({
      title: '同步中...',
      mask: true
    });
    
    // 调用云函数获取所有收藏记录
    wx.cloud.callFunction({
      name: 'syncFavorites',
      data: {
        action: 'getFromCloud',
        userId: this.data.userId
      }
    })
    .then(res => {
      if (res.result && res.result.code === 0 && res.result.data) {
        // 转换云端数据格式为本地格式
        const favorites = res.result.data.map(item => ({
          id: item.product_id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          sales: 0, // 云端可能没有销量数据
          category: item.category || '商品',
          date: item.create_time,
          portrait_tags: item.portrait_tags || []
        }));
        
        this.setData({
          favorites: favorites,
          loading: false
        });
        
        // 同步到本地存储
        wx.setStorageSync('favorites', favorites);
        
        wx.hideLoading();
        wx.showToast({
          title: '同步成功',
          icon: 'success'
        });
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '暂无收藏数据',
          icon: 'none'
        });
        
        this.setData({
          favorites: [],
          loading: false
        });
        
        // 清空本地存储
        wx.setStorageSync('favorites', []);
      }
      
      // 停止下拉刷新动画
      wx.stopPullDownRefresh();
      
      // 重新获取用户画像
      this.getUserPortrait();
    })
    .catch(err => {
      console.error('同步收藏失败', err);
      wx.hideLoading();
      wx.showToast({
        title: '同步失败',
        icon: 'none'
      });
      
      // 停止下拉刷新动画
      wx.stopPullDownRefresh();
    });
  },
  
  // 获取用户画像数据
  getUserPortrait: function() {
    if (!this.data.cloudSync || !this.data.userId) return;
    
    const db = wx.cloud.database();
    db.collection('favorites_portrait')
      .where({
        user_id: this.data.userId
      })
      .get()
      .then(res => {
        if (res.data && res.data.length > 0) {
          this.setData({
            userPortrait: res.data[0]
          });
        }
      })
      .catch(err => {
        console.error('获取用户画像失败', err);
      });
  },
  
  // 加载收藏数据
  loadFavorites: function() {
    this.setData({ loading: true });
    
    // 判断是否启用云同步
    if (this.data.cloudSync && this.data.userId) {
      // 从云数据库加载收藏
      this.loadCloudFavorites();
    } else {
      // 从本地缓存加载收藏
      this.loadLocalFavorites();
    }
  },
  
  // 从本地缓存加载收藏列表
  loadLocalFavorites: function() {
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({
      favorites: favorites,
      loading: false
    });
  },
  
  // 从云数据库加载收藏列表
  loadCloudFavorites: function() {
    // 调用云函数获取收藏数据
    wx.cloud.callFunction({
      name: 'syncFavorites',
      data: {
        action: 'getFromCloud',
        userId: this.data.userId
      }
    })
    .then(res => {
      if (res.result && res.result.code === 0 && res.result.data) {
        // 转换云端数据格式为本地格式
        const favorites = res.result.data.map(item => ({
          id: item.product_id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          sales: 0, // 云端可能没有销量数据
          category: item.category || '商品',
          date: item.create_time,
          portrait_tags: item.portrait_tags || []
        }));
        
        this.setData({
          favorites: favorites,
          loading: false
        });
        
        // 同步到本地存储
        wx.setStorageSync('favorites', favorites);
      } else {
        this.loadLocalFavorites(); // 若云端没有数据，尝试加载本地数据
      }
    })
    .catch(err => {
      console.error('获取云端收藏失败', err);
      this.loadLocalFavorites(); // 获取云端数据失败时加载本地数据
    });
  },
  
  // 加载云存储图片
  loadCloudImages: function() {
    // 加载空状态图标
    wx.cloud.getTempFileURL({
      fileList: [this.data.emptyIconPath],
      success: res => {
        if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
          this.setData({
            emptyIconPath: res.fileList[0].tempFileURL
          });
        }
      }
    });
    
    // 加载收藏中的商品图片
    this.data.favorites.forEach((item, index) => {
      wx.cloud.getTempFileURL({
        fileList: [item.image],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `favorites[${index}].image`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });
  },
  
  // 切换编辑模式
  toggleEditMode() {
    this.setData({
      isEditMode: !this.data.isEditMode,
      selectedItems: [] // 切换模式时清空选中列表
    });
  },
  
  // 选择/取消选择商品
  toggleSelectItem(e) {
    if (!this.data.isEditMode) return; // 非编辑模式不处理
    
    const itemId = e.currentTarget.dataset.id;
    const selectedItems = [...this.data.selectedItems];
    const index = selectedItems.indexOf(itemId);
    
    if (index > -1) {
      // 已选中，取消选择
      selectedItems.splice(index, 1);
    } else {
      // 未选中，添加到选中列表
      selectedItems.push(itemId);
    }
    
    this.setData({
      selectedItems: selectedItems
    });
  },
  
  // 全选/取消全选
  toggleSelectAll() {
    if (!this.data.isEditMode) return;
    
    if (this.data.selectedItems.length === this.data.favorites.length) {
      // 已全选，取消全选
      this.setData({
        selectedItems: []
      });
    } else {
      // 未全选，全选
      this.setData({
        selectedItems: this.data.favorites.map(item => item.id)
      });
    }
  },
  
  // 批量删除选中商品
  batchRemoveFavorites() {
    if (this.data.selectedItems.length === 0) {
      wx.showToast({
        title: '请选择要删除的商品',
        icon: 'none'
      });
      return;
    }
    
    const that = this;
    wx.showModal({
      title: '提示',
      content: `确定要删除选中的${that.data.selectedItems.length}个商品吗？`,
      success(res) {
        if (res.confirm) {
          // 显示加载中
          wx.showLoading({
            title: '正在删除...',
            mask: true
          });
          
          // 执行删除操作
          const newFavorites = that.data.favorites.filter(item => !that.data.selectedItems.includes(item.id));
          
          // 如果使用云同步，则调用云函数删除云端数据
          if (that.data.cloudSync && that.data.userId) {
            wx.cloud.callFunction({
              name: 'syncFavorites',
              data: {
                action: 'batchRemove',
                userId: that.data.userId,
                data: {
                  productIds: that.data.selectedItems
                }
              }
            })
            .then(() => {
              that.updateFavoritesAfterRemove(newFavorites);
            })
            .catch(err => {
              console.error('删除云端收藏失败', err);
              that.updateFavoritesAfterRemove(newFavorites);
            });
          } else {
            that.updateFavoritesAfterRemove(newFavorites);
          }
        }
      }
    });
  },
  
  // 删除收藏后更新数据
  updateFavoritesAfterRemove(newFavorites) {
    this.setData({
            favorites: newFavorites,
            selectedItems: [],
            isEditMode: false
          });
          
    // 更新本地存储
    wx.setStorageSync('favorites', newFavorites);
    
    // 隐藏加载提示
    wx.hideLoading();
    
    // 提示成功
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
    
    // 更新用户画像数据
    this.getUserPortrait();
  },
  
  // 移除单个收藏商品
  removeFavorite(e) {
    const itemId = e.currentTarget.dataset.id;
    const that = this;
    
    wx.showModal({
      title: '提示',
      content: '确定要移除该收藏商品吗？',
      success(res) {
        if (res.confirm) {
          // 显示加载中
          wx.showLoading({
            title: '正在移除...',
            mask: true
          });
          
          const newFavorites = that.data.favorites.filter(item => item.id !== itemId);
          
          // 如果使用云同步，则调用云函数删除云端数据
          if (that.data.cloudSync && that.data.userId) {
            wx.cloud.callFunction({
              name: 'syncFavorites',
              data: {
                action: 'removeFavorite',
                userId: that.data.userId,
                data: {
                  productId: itemId
                }
              }
            })
            .then(() => {
              that.updateFavoritesAfterRemove(newFavorites);
            })
            .catch(err => {
              console.error('删除云端收藏失败', err);
              that.updateFavoritesAfterRemove(newFavorites);
            });
          } else {
            that.updateFavoritesAfterRemove(newFavorites);
          }
        }
      }
    });
  },
  
  // 查看商品详情
  viewProductDetail(e) {
    if (this.data.isEditMode) {
      // 编辑模式下点击商品为选择操作
      this.toggleSelectItem(e);
      return;
    }
    
    const itemId = e.currentTarget.dataset.id;
    // 跳转到商品详情页，使用数字ID
    const numericId = typeof itemId === 'string' && itemId.startsWith('P') ? 
      itemId.substring(1) : 
      itemId;
      
    wx.navigateTo({
      url: `/pages/detail/detail?id=${numericId}`
    });
  },
  
  // 加入购物车
  addToCart(e) {
    const itemId = e.currentTarget.dataset.id;
    // 获取当前商品信息
    const product = this.data.favorites.find(item => item.id === itemId);
    
    if (product) {
      wx.showLoading({
        title: '添加中...',
        mask: true
      });
      
      // 构建购物车项目数据
      const cartItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1, // 默认数量为1
        selected: true, // 默认选中
        specs: {
          规格: '标准装',
          净含量: product.category || '默认规格'
        }
      };
      
      // 获取购物车已有数据
      const cartItems = wx.getStorageSync('cartItems') || [];
      
      // 检查购物车中是否已有该商品
      const existingItemIndex = cartItems.findIndex(item => 
        item.id === cartItem.id && 
        JSON.stringify(item.specs) === JSON.stringify(cartItem.specs)
      );
      
      if (existingItemIndex > -1) {
        // 已存在该商品，数量+1
        cartItems[existingItemIndex].quantity += 1;
        wx.setStorageSync('cartItems', cartItems);
        wx.hideLoading();
        wx.showToast({
          title: '已添加到购物车',
          icon: 'success'
        });
      } else {
        // 不存在，添加到购物车
        cartItems.push(cartItem);
        wx.setStorageSync('cartItems', cartItems);
        wx.hideLoading();
        wx.showToast({
          title: '已加入购物车',
          icon: 'success'
        });
      }
      
      // 更新购物车数量
      this.getCartCount();
      
      // 显示购物车图标动画
      this.showCartAnimation();
    } else {
      wx.showToast({
        title: '商品信息不存在',
        icon: 'none'
        });
      }
  },
  
  // 显示加入购物车的动画效果
  showCartAnimation() {
    // 创建动画实例
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    
    // 设置动画
    animation.scale(1.2).step();
    animation.scale(1.0).step();
    
    // 更新数据，触发动画
    this.setData({
      cartAnimation: animation.export()
    });
  },
  
  // 去逛逛
  goShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  
  // 打开用户画像分析
  showPortraitAnalysis() {
    if (!this.data.userPortrait) return;
    
    wx.showModal({
      title: '收藏画像分析',
      content: this.data.userPortrait.analysis_result,
      showCancel: false
    });
  },
  
  // 获取购物车商品数量
  getCartCount: function() {
    const cartItems = wx.getStorageSync('cartItems') || [];
    let count = 0;
    
    cartItems.forEach(item => {
      count += item.quantity;
    });
    
    this.setData({
      cartCount: count
    });
  },
  
  // 跳转到购物车页面
  goToCart: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  }
}) 