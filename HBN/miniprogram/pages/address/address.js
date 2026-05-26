// pages/address/address.js
Page({
  data: {
    addressList: [],
    isSelectMode: false, // 是否是选择地址模式
    loading: false,
    emptyIconPath: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/空状态-地址.png', // 空状态图标
    submitting: false, // 提交中状态
    currentDocId: '' // 当前用户对应的文档ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 判断是否是从订单页选择地址
    this.setData({
      isSelectMode: options.select === 'true'
    });
    
    // 初始化云环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'YOUR_CLOUD_ENV_ID',
        traceUser: true,
      });
    }
    
    // 加载云存储图片
    this.loadCloudImages();
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 每次页面显示时重新加载地址列表
    this.loadAddresses();
  },
  
  /**
   * 加载云存储图片
   */
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
  },
  
  /**
   * 加载地址列表
   */
  loadAddresses: function() {
    // 显示加载中
    this.setData({
      loading: true
    });
    
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo || !userInfo.nickName) {
      // 如果没有用户信息，使用本地存储的地址
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
      return;
    }
    
    // 根据用户昵称匹配用户ID
    let userId = 2; // 默认为都市新锐青年
    let docId = 'address_002';
    
    if (userInfo.nickName === '职场精英女性') {
      userId = 1;
      docId = 'address_001';
    } else if (userInfo.nickName === '科研工作者') {
      userId = 3;
      docId = 'address_003';
    }
    
    // 保存当前文档ID
    this.setData({
      currentDocId: docId
    });
    
    // 从云数据库加载地址
    const db = wx.cloud.database();
    db.collection('addresses')
      .doc(docId)
      .get()
      .then(res => {
        console.log('获取到的地址数据:', res.data);
        
        if (res.data && res.data.addresses) {
          // 获取地址列表
          const addressList = res.data.addresses || [];
          
          // 更新数据
          this.setData({
            addressList,
            loading: false
          });
          
          // 同时更新本地存储，以便离线使用
          wx.setStorageSync('addresses', addressList);
        } else {
          // 如果云数据库中没有数据，使用本地存储
          let addressList = wx.getStorageSync('addresses') || [];
          
          // 如果本地也没有数据，添加模拟地址
          if (addressList.length === 0) {
            addressList = this.initMockAddresses();
            wx.setStorageSync('addresses', addressList);
          }
          
          this.setData({
            addressList,
            loading: false
          });
        }
      })
      .catch(err => {
        console.error('获取地址数据失败:', err);
        
        // 发生错误时，尝试使用本地数据
        let addressList = wx.getStorageSync('addresses') || [];
        
        if (addressList.length === 0) {
          addressList = this.initMockAddresses();
          wx.setStorageSync('addresses', addressList);
        }
        
        this.setData({
          addressList,
          loading: false
        });
        
        wx.showToast({
          title: '加载失败，使用本地数据',
          icon: 'none',
          duration: 2000
        });
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
      confirmColor: '#618a49',
      success: (res) => {
        if (res.confirm) {
          // 防止重复操作
          if (this.data.submitting) {
            return;
          }
          
          this.setData({
            submitting: true
          });
          
          // 获取当前用户信息
          const userInfo = wx.getStorageSync('userInfo');
          
          // 根据用户昵称匹配用户ID
          let userId = 2; // 默认为都市新锐青年
          
          if (userInfo && userInfo.nickName === '职场精英女性') {
            userId = 1;
          } else if (userInfo && userInfo.nickName === '科研工作者') {
            userId = 3;
          }
          
          // 调用云函数删除地址
          wx.cloud.callFunction({
            name: 'updateAddress',
            data: {
              action: 'delete',
              userId: userId,
              docId: this.data.currentDocId,
              addressId: id
            }
          }).then(res => {
            console.log('删除地址云函数结果:', res);
            
            if (res.result && res.result.success) {
              // 更新本地数据
              const addressList = this.data.addressList.filter(addr => addr.id !== id);
              
              // 更新页面数据
              this.setData({
                addressList: addressList,
                submitting: false
              });
              
              // 更新本地存储
              wx.setStorageSync('addresses', addressList);
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
              });
            } else {
              wx.showToast({
                title: res.result ? res.result.message : '删除失败',
                icon: 'none'
              });
              this.setData({ submitting: false });
            }
          }).catch(err => {
            console.error('删除地址失败:', err);
            
            wx.showToast({
              title: '操作失败，请重试',
              icon: 'none'
            });
            
            this.setData({ submitting: false });
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
    
    // 防止重复操作
    if (this.data.submitting) {
      return;
    }
    
    this.setData({
      submitting: true
    });
    
    // 获取当前用户信息
    const userInfo = wx.getStorageSync('userInfo');
    
    // 根据用户昵称匹配用户ID
    let userId = 2; // 默认为都市新锐青年
    
    if (userInfo && userInfo.nickName === '职场精英女性') {
      userId = 1;
    } else if (userInfo && userInfo.nickName === '科研工作者') {
      userId = 3;
    }
    
    // 调用云函数设置默认地址
    wx.cloud.callFunction({
      name: 'updateAddress',
      data: {
        action: 'setDefault',
        userId: userId,
        docId: this.data.currentDocId,
        addressId: id
      }
    }).then(res => {
      console.log('设置默认地址云函数结果:', res);
      
      if (res.result && res.result.success) {
        // 更新本地数据
        const addressList = this.data.addressList.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }));
    
        // 更新页面数据
    this.setData({
          addressList: addressList,
          submitting: false
    });
        
        // 更新本地存储
        wx.setStorageSync('addresses', addressList);
    
    wx.showToast({
      title: '已设为默认地址',
      icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.result ? res.result.message : '设置失败',
          icon: 'none'
        });
        this.setData({ submitting: false });
      }
    }).catch(err => {
      console.error('设置默认地址失败:', err);
      
      wx.showToast({
        title: '操作失败，请重试',
        icon: 'none'
      });
      
      this.setData({ submitting: false });
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
   * 阻止事件冒泡
   */
  stopPropagation: function(e) {
    // 阻止事件冒泡
    return;
  }
}) 