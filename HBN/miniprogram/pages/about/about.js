// pages/about/about.js
Page({
  data: {
    // 公司信息
    companyInfo: {
      name: 'HBN护肤品集团',
      logo: '/assets/images/logo.png',
      slogan: '让每个人都拥有健康美丽的肌肤',
      version: 'v1.0.0',
      description: 'HBN护肤品集团成立于2010年，是一家专注于高品质护肤品研发与销售的企业。我们秉承"科技创新，匠心品质"的理念，致力于为消费者提供安全有效的护肤解决方案。\n\n我们拥有专业的研发团队和先进的生产设备，产品覆盖基础护肤、功能性护肤、特殊护理等多个系列，满足不同肌肤需求。\n\n未来，我们将继续深耕护肤领域，不断创新，为用户带来更优质的产品和服务体验。'
    },
    
    // 联系信息
    contactInfo: {
      address: '广州市天河区冼村路11号保利中辰广场A座12楼',
      phone: '400-123-4567',
      email: 'service@hbn.com',
      website: 'www.hbn.com'
    },
    
    // 功能列表
    featureList: [
      {
        id: 'agreement',
        title: '用户协议',
        url: '/pages/about/agreement/agreement'
      },
      {
        id: 'privacy',
        title: '隐私政策',
        url: '/pages/about/privacy/privacy'
      },
      {
        id: 'join',
        title: '加入我们',
        url: '/pages/about/join/join'
      }
    ]
  },
  
  onLoad: function(options) {
    // 页面加载时执行
  },
  
  // 复制文本
  copyText: function(e) {
    const type = e.currentTarget.dataset.type;
    let content = '';
    
    switch(type) {
      case 'address':
        content = this.data.contactInfo.address;
        break;
      case 'phone':
        content = this.data.contactInfo.phone;
        break;
      case 'email':
        content = this.data.contactInfo.email;
        break;
      case 'website':
        content = this.data.contactInfo.website;
        break;
    }
    
    if (content) {
      wx.setClipboardData({
        data: content,
        success: () => {
          wx.showToast({
            title: '复制成功',
            icon: 'success'
          });
        }
      });
    }
  },
  
  // 拨打电话
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.contactInfo.phone,
      success: () => {
        console.log('拨打电话成功');
      },
      fail: (err) => {
        console.error('拨打电话失败', err);
      }
    });
  },
  
  // 查看详情
  viewDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const feature = this.data.featureList.find(item => item.id === id);
    
    if (feature && feature.url) {
      wx.navigateTo({
        url: feature.url
      });
    }
  },
  
  // 查看位置
  viewLocation: function() {
    wx.showToast({
      title: '位置功能暂未开放',
      icon: 'none'
    });
  }
}) 