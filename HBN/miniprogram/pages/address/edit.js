Page({
  data: {
    id: '', // 地址ID，用于编辑模式
    name: '', // 收货人姓名
    phone: '', // 联系电话
    province: '', // 省份
    city: '', // 城市
    district: '', // 区县
    detail: '', // 详细地址
    isDefault: false, // 是否默认地址
    tag: '', // 地址标签
    tagOptions: ['家', '公司', '学校', '其他'], // 标签选项
    selectedTagIndex: -1, // 选中的标签索引
    region: ['请选择', '请选择', '请选择'], // 地区选择器数据
    loading: false, // 加载状态
    statusBarHeight: 0, // 状态栏高度
    navHeight: 0, // 导航栏高度
    submitting: false // 提交中状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navHeight: systemInfo.statusBarHeight + 44
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
    
    // 如果有ID参数，表示是编辑模式
    if (options.id) {
      this.setData({
        id: options.id,
        loading: true
      });
      
      // 加载地址详情
      this.loadAddressDetail(options.id);
    }
  },

  /**
   * 加载地址详情
   */
  loadAddressDetail: function(id) {
    // 从本地存储获取地址列表
    const addressList = wx.getStorageSync('addresses') || [];
    
    // 查找指定ID的地址
    const address = addressList.find(item => item.id === id);
    
    if (address) {
      // 查找标签在选项中的索引
      let tagIndex = -1;
      if (address.tag) {
        tagIndex = this.data.tagOptions.findIndex(tag => tag === address.tag);
      }
      
      // 设置表单数据
      this.setData({
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail,
        isDefault: address.isDefault,
        tag: address.tag || '',
        selectedTagIndex: tagIndex,
        region: [address.province, address.city, address.district],
        loading: false
      });
    } else {
      this.setData({
        loading: false
      });
      
      wx.showToast({
        title: '地址不存在',
        icon: 'none'
      });
    }
  },

  /**
   * 输入姓名
   */
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },

  /**
   * 输入电话
   */
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  /**
   * 选择地区
   */
  regionChange: function(e) {
    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      district: e.detail.value[2]
    });
  },

  /**
   * 输入详细地址
   */
  inputDetail: function(e) {
    this.setData({
      detail: e.detail.value
    });
  },

  /**
   * 切换默认地址
   */
  switchDefault: function(e) {
    this.setData({
      isDefault: e.detail.value
    });
  },
  
  /**
   * 选择标签
   */
  selectTag: function(e) {
    const index = e.currentTarget.dataset.index;
    
    // 如果是选中了当前已选的标签，则取消选择
    if (index === this.data.selectedTagIndex) {
      this.setData({
        selectedTagIndex: -1,
        tag: ''
      });
    } else {
      this.setData({
        selectedTagIndex: index,
        tag: this.data.tagOptions[index]
      });
    }
  },
  
  /**
   * 自定义标签
   */
  customTag: function(e) {
    this.setData({
      tag: e.detail.value,
      selectedTagIndex: -1 // 清除选中的标签索引
    });
  },

  /**
   * 保存地址
   */
  saveAddress: function() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }

    // 防止重复提交
    if (this.data.submitting) {
      return;
    }

    this.setData({
      submitting: true
    });
    
    // 准备地址数据
    const addressData = {
      name: this.data.name,
      phone: this.data.phone,
      province: this.data.province,
      city: this.data.city,
      district: this.data.district,
      detail: this.data.detail,
      isDefault: this.data.isDefault,
      tag: this.data.tag
    };
    
    // 获取用户信息和用户ID
    const userInfo = wx.getStorageSync('userInfo');
    
    // 根据用户昵称匹配用户ID和文档ID
    let userId = 2; // 默认为都市新锐青年
    let docId = 'address_002';
    
    if (userInfo && userInfo.nickName === '职场精英女性') {
      userId = 1;
      docId = 'address_001';
    } else if (userInfo && userInfo.nickName === '科研工作者') {
      userId = 3;
      docId = 'address_003';
    }
    
    // 调用云函数保存地址
    wx.cloud.callFunction({
      name: 'updateAddress',
      data: {
        action: this.data.id ? 'update' : 'add',
        userId: userId,
        docId: docId,
        addressData: addressData,
        addressId: this.data.id
      }
    }).then(res => {
      console.log('调用云函数成功:', res);
      
      if (res.result && res.result.success) {
        // 操作成功后，需要更新本地存储的地址列表
        this.updateLocalAddressList(addressData, res.result.addressId);
        
        // 提示保存成功
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            // 延迟返回上一页
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }
        });
      } else {
        wx.showToast({
          title: res.result ? res.result.message : '保存失败',
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none',
        duration: 2000
      });
    }).finally(() => {
      this.setData({
        submitting: false
      });
    });
  },
  
  /**
   * 更新本地存储的地址列表
   */
  updateLocalAddressList: function(addressData, newAddressId) {
    // 获取当前地址列表
    let addressList = wx.getStorageSync('addresses') || [];
    
    if (this.data.id) {
      // 编辑模式
      const index = addressList.findIndex(item => item.id === this.data.id);
      
      if (index !== -1) {
        // 更新现有地址
        addressData.id = this.data.id;
        addressList[index] = addressData;
      } else {
        // ID不存在，作为新地址添加
        addressData.id = this.data.id;
        addressList.push(addressData);
      }
    } else {
      // 新增模式，使用云函数返回的ID
      addressData.id = newAddressId || this.generateId();
      addressList.push(addressData);
    }
    
    // 如果设为默认地址，需要将其他地址设为非默认
    if (addressData.isDefault) {
      addressList = addressList.map(item => {
        if (item.id !== addressData.id) {
          return { ...item, isDefault: false };
        }
        return item;
      });
    }
    
    // 保存到本地存储
    wx.setStorageSync('addresses', addressList);
  },

  /**
   * 表单验证
   */
  validateForm: function() {
    // 验证姓名
    if (!this.data.name) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      });
      return false;
    }
    
    // 验证手机号
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      });
      return false;
    }
    
    // 简单的手机号格式验证
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return false;
    }
    
    // 验证地区
    if (!this.data.province || this.data.province === '请选择') {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      });
      return false;
    }
    
    // 验证详细地址
    if (!this.data.detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  /**
   * 生成唯一ID
   */
  generateId: function() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
  },

  /**
   * 返回上一页
   */
  goBack: function() {
    wx.navigateBack();
  }
}) 