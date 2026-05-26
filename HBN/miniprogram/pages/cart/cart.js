// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    allSelected: false,
    totalPrice: 0,
    totalCount: 0,
    isEmpty: true,
    isEditing: false,
    slideButtons: [
      {
        text: '删除',
        type: 'warn'
      }
    ],
    // 推荐商品
    recommendProducts: [
      {
        id: 1,
        name: '【王牌早C晚A】紧致·焕亮·抗初老',
        price: 288.00,
        originalPrice: 599.00,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/组合.png',
        tag: '早C晚A 2.0套组'
      },
      {
        id: 2,
        name: '【经典版】御氧提亮  熬夜党必备',
        price: 129.00,
        originalPrice: 259.00,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/1.png',
        tag: '明星发光水熊果苷精粹水2.0'
      },
      {
        id: 3,
        name: '视黄醇精华乳2.0：初老救星，焕亮抚纹',
        price: 259.00,
        originalPrice: 299.00,
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/3.png',
        tag: '咖啡因紧致眼霜'
      }
    ],
    navTransparent: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initCartData();
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
    this.initCartData();
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

  },

  /**
   * 初始化购物车数据
   */
  initCartData() {
    // 从本地存储获取购物车数据
    const cartItems = wx.getStorageSync('cartItems') || [];
    
    // 转换属性名以匹配页面使用习惯
    const cartList = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      count: item.quantity,  // 注意：这里将quantity转换为count
      selected: item.selected,
      image: item.image,
      specs: Object.values(item.specs).join('，'), // 将规格对象转换为字符串
      stock: 99 // 默认库存，可根据需求从商品数据中获取
    }));

    // 设置购物车数据
    this.setData({
      cartList: cartList,
      isEmpty: cartList.length === 0
    });

    // 计算总价和总数
    this.calculateTotal();
    
    // 检查全选状态
    this.checkAllSelected();
  },

  /**
   * 保存购物车数据到本地存储
   */
  saveCartData() {
    // 将购物车数据转换回存储格式
    const cartItems = this.data.cartList.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.count,  // 将count转换回quantity
      selected: item.selected,
      image: item.image,
      specs: {规格: '标准装', 净含量: item.specs} // 简化处理，实际应保留原始规格结构
    }));
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', cartItems);
  },

  /**
   * 切换商品选中状态
   */
  toggleSelect(e) {
    const index = e.currentTarget.dataset.index;
    let cartList = this.data.cartList;
    cartList[index].selected = !cartList[index].selected;
    
    this.setData({
      cartList: cartList
    });
    
    this.calculateTotal();
    this.checkAllSelected();
    this.saveCartData(); // 保存更改
  },

  /**
   * 切换全选状态
   */
  toggleSelectAll() {
    const allSelected = !this.data.allSelected;
    let cartList = this.data.cartList;
    
    cartList.forEach(item => {
      item.selected = allSelected;
    });
    
    this.setData({
      cartList: cartList,
      allSelected: allSelected
    });
    
    this.calculateTotal();
    this.saveCartData(); // 保存更改
  },

  /**
   * 检查是否全选
   */
  checkAllSelected() {
    const allSelected = this.data.cartList.length > 0 && this.data.cartList.every(item => item.selected);
    this.setData({
      allSelected: allSelected
    });
  },

  /**
   * 计算总价和总数
   */
  calculateTotal() {
    let totalPrice = 0;
    let totalCount = 0;
    
    this.data.cartList.forEach(item => {
      if (item.selected) {
        totalPrice += item.price * item.count;
        totalCount += item.count;
      }
    });
    
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      totalCount: totalCount
    });
  },

  /**
   * 增加商品数量
   */
  increaseCount(e) {
    const index = e.currentTarget.dataset.index;
    let cartList = this.data.cartList;
    
    if (cartList[index].count < cartList[index].stock) {
      cartList[index].count++;
      
      this.setData({
        cartList: cartList
      });
      
      this.calculateTotal();
      this.saveCartData(); // 保存更改
    } else {
      wx.showToast({
        title: '已达到最大库存',
        icon: 'none'
      });
    }
  },

  /**
   * 减少商品数量
   */
  decreaseCount(e) {
    const index = e.currentTarget.dataset.index;
    let cartList = this.data.cartList;
    
    if (cartList[index].count > 1) {
      cartList[index].count--;
      
      this.setData({
        cartList: cartList
      });
      
      this.calculateTotal();
      this.saveCartData(); // 保存更改
    }
  },

  /**
   * 切换编辑模式
   */
  toggleEditMode() {
    this.setData({
      isEditing: !this.data.isEditing
    });
  },

  /**
   * 删除选中商品
   */
  deleteSelected() {
    // 检查是否有选中的商品
    const hasSelected = this.data.cartList.some(item => item.selected);
    
    if (!hasSelected) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除选中的商品吗？',
      success: (res) => {
        if (res.confirm) {
          let cartList = this.data.cartList.filter(item => !item.selected);
          
          this.setData({
            cartList: cartList,
            isEmpty: cartList.length === 0,
            isEditing: cartList.length === 0 ? false : this.data.isEditing
          });
          
          this.calculateTotal();
          this.checkAllSelected();
          this.saveCartData(); // 保存更改
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 删除单个商品
   */
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    let cartList = this.data.cartList;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          cartList.splice(index, 1);
          
          this.setData({
            cartList: cartList,
            isEmpty: cartList.length === 0,
            isEditing: cartList.length === 0 ? false : this.data.isEditing
          });
          
          this.calculateTotal();
          this.checkAllSelected();
          this.saveCartData(); // 保存更改
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 滑动删除回调
   */
  slideButtonTap(e) {
    const index = e.currentTarget.dataset.index;
    let cartList = this.data.cartList;
    cartList.splice(index, 1);
    
    this.setData({
      cartList: cartList,
      isEmpty: cartList.length === 0
    });
    
    this.calculateTotal();
    this.checkAllSelected();
    this.saveCartData(); // 保存更改
  },

  /**
   * 结算
   */
  checkout() {
    const selectedItems = this.data.cartList.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
      return;
    }
    
    // 跳转到结算页面
    wx.navigateTo({
      url: '/pages/checkout/checkout'
    });
  },

  /**
   * 立即支付（直接跳转到确认订单页面）
   */
  payNow() {
    const selectedItems = this.data.cartList.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
      return;
    }
    
    // 如果只选择了一个商品，直接跳转到确认订单页面
    if (selectedItems.length === 1) {
      const product = selectedItems[0];
      // 准备商品信息
      const productInfo = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        specs: { 规格: product.specs }
      };
      
      // 跳转到确认订单页面并传递商品信息
      wx.navigateTo({
        url: `/pages/order/confirm?productInfo=${encodeURIComponent(JSON.stringify(productInfo))}&quantity=${product.count}`
      });
    } else {
      // 如果选择了多个商品，提示用户只能一次购买一个商品
      wx.showToast({
        title: '暂时只支持购买单个商品',
        icon: 'none'
      });
    }
  },

  /**
   * 跳转到商品详情
   */
  goToProductDetail(e) {
    const id = e.currentTarget.dataset.id;
    
    if (id === 1) {
      // 第一个商品跳转到detail1页面
      wx.navigateTo({
        url: '/pages/detail1/detail1'
      });
    } else if (id === 2) {
      // 第二个商品跳转到detail页面的第二个商品
      wx.navigateTo({
        url: '/pages/detail/detail?id=2'
      });
    } else if (id === 3) {
      // 第三个商品跳转到detail页面的第三个商品
      wx.navigateTo({
        url: '/pages/detail/detail?id=3'
      });
    } else {
      // 其他商品默认跳转
    wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
    });
    }
  },

  /**
   * 添加推荐商品到购物车
   */
  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.recommendProducts.find(item => item.id === id);
    
    if (product) {
      // 创建购物车项
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
        selected: true,
        image: product.image,
        specs: {规格: '标准装', 净含量: product.tag || '默认规格'}
      };
      
      // 从本地存储获取购物车数据
      let cartItems = wx.getStorageSync('cartItems') || [];
      
      // 检查购物车中是否已有相同商品
      const existingItemIndex = cartItems.findIndex(item => 
        item.id === cartItem.id && 
        JSON.stringify(item.specs) === JSON.stringify(cartItem.specs)
      );
      
      if (existingItemIndex > -1) {
        // 如果已经存在，增加数量
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // 如果不存在，添加新项
        cartItems.push(cartItem);
      }
      
      // 保存到本地存储
      wx.setStorageSync('cartItems', cartItems);
      
      // 刷新购物车数据
      this.initCartData();
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
    }
  },

  /**
   * 继续购物
   */
  continueShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  /**
   * 跳转到搜索页面
   */
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  /**
   * 添加页面滚动监听方法
   */
  onPageScroll(e) {
    const scrollTop = e.detail.scrollTop; // 使用detail.scrollTop获取滚动位置
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