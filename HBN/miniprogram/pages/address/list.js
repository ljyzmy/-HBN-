Page({
  data: {
    addressList: [],
    statusBarHeight: 0,
    navHeight: 0,
    isSelectMode: false, // 是否是选择地址模式
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navHeight: systemInfo.statusBarHeight + 44,
      isSelectMode: options.select === 'true'
    });
    
    // 加载地址列表
    this.loadAddresses();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 每次页面显示时重新加载地址列表
    this.loadAddresses();
  },
  
  /**
   * 加载地址列表
   */
  loadAddresses: function() {
    // 显示加载中
    this.setData({
      loading: true
    });
    
    // 从本地存储获取地址列表
    let addressList = wx.getStorageSync('addresses') || [];
    
    // 如果地址为空，添加两个模拟地址
    if (addressList.length === 0) {
      addressList = this.initMockAddresses();
      wx.setStorageSync('addresses', addressList);
    }
    
    // 更新数据
    this.setData({
      addressList,
      loading: false
    });
  },
  
  /**
   * 初始化模拟地址数据
   */
  initMockAddresses: function() {
    return [
      {
        id: '1',
        name: '张三',
        phone: '13812345678',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区8栋501室',
        isDefault: true
      },
      {
        id: '2',
        name: '李四',
        phone: '13987654321',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '建国路88号中央公园12号楼303室',
        isDefault: false
      }
    ];
  },
  
  /**
   * 添加新地址
   */
  addAddress: function() {
    wx.navigateTo({
      url: '/pages/address/edit'
    });
  },
  
  /**
   * 编辑地址
   */
  editAddress: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/address/edit?id=${id}`
    });
  },
  
  /**
   * 删除地址
   */
  deleteAddress: function(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '删除确认',
      content: '确定要删除该收货地址吗？',
      confirmColor: '#A64036',
      success: (res) => {
        if (res.confirm) {
          // 获取当前地址列表
          let addressList = this.data.addressList;
          
          // 移除指定地址
          addressList.splice(index, 1);
          
          // 更新存储和数据
          wx.setStorageSync('addresses', addressList);
          
          this.setData({
            addressList
          });
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },
  
  /**
   * 设为默认地址
   */
  setDefault: function(e) {
    const id = e.currentTarget.dataset.id;
    
    // 获取当前地址列表
    let addressList = this.data.addressList;
    
    // 更新默认状态
    addressList = addressList.map(address => {
      return {
        ...address,
        isDefault: address.id === id
      };
    });
    
    // 更新存储和数据
    wx.setStorageSync('addresses', addressList);
    
    this.setData({
      addressList
    });
    
    wx.showToast({
      title: '已设为默认地址',
      icon: 'success'
    });
  },
  
  /**
   * 选择地址
   */
  selectAddress: function(e) {
    if (!this.data.isSelectMode) return;
    
    const id = e.currentTarget.dataset.id;
    const address = this.data.addressList.find(item => item.id === id);
    
    if (!address) return;
    
    // 将选中的地址保存到全局数据
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 获取上一个页面
    
    // 调用上一个页面的setData方法，将选中的地址传回去
    prevPage.setData({
      address: address
    });
    
    // 更新价格计算（如果上一页面有这个方法）
    if (prevPage.calculatePrice) {
      prevPage.calculatePrice();
    }
    
    // 返回上一页
    wx.navigateBack();
  },
  
  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  },
  
  /**
   * 阻止事件冒泡
   */
  stopPropagation: function(e) {
    // 阻止事件冒泡
    return;
  }
}) 