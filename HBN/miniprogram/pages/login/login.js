Page({
  data: {
    phone: '',
    password: '',
    verifyCode: '',
    showPasswordLogin: true, // 默认显示密码登录
    countdown: 0, // 验证码倒计时
    agreeProtocol: false, // 同意用户协议
  },

  onLoad(options) {
    // 页面加载时执行
  },

  // 切换登录方式
  switchLoginType() {
    this.setData({
      showPasswordLogin: !this.data.showPasswordLogin
    });
  },

  // 输入手机号
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 输入密码
  inputPassword(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 输入验证码
  inputVerifyCode(e) {
    this.setData({
      verifyCode: e.detail.value
    });
  },

  // 获取验证码
  getVerifyCode() {
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    
    // 手机号验证
    if (!/^1[3-9]\d{9}$/.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    
    // 开始倒计时
    this.setData({
      countdown: 60
    });
    
    const countdownInterval = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(countdownInterval);
        this.setData({
          countdown: 0
        });
      } else {
        this.setData({
          countdown: this.data.countdown - 1
        });
      }
    }, 1000);
    
    // 模拟发送验证码
    wx.showToast({
      title: '验证码已发送',
      icon: 'success'
    });
  },

  // 同意协议切换
  toggleAgreement() {
    this.setData({
      agreeProtocol: !this.data.agreeProtocol
    });
  },

  // 查看用户协议
  viewProtocol() {
    wx.navigateTo({
      url: '/pages/protocol/user'
    });
  },

  // 查看隐私政策
  viewPrivacy() {
    wx.navigateTo({
      url: '/pages/protocol/privacy'
    });
  },

  // 登录
  login() {
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.showPasswordLogin && !this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.showPasswordLogin && !this.data.verifyCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.agreeProtocol) {
      wx.showToast({
        title: '请同意用户协议和隐私政策',
        icon: 'none'
      });
      return;
    }
    
    // 显示登录中
    wx.showLoading({
      title: '登录中...',
      mask: true
    });
    
    // 模拟登录成功
    setTimeout(() => {
      wx.hideLoading();
      
      // 存储登录状态
      wx.setStorageSync('isLogged', true);
      
      // 返回上一页或首页
      wx.navigateBack({
        delta: 1,
        fail: () => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }, 1500);
  }
}) 