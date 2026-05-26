// pages/service/service.js
Page({
  data: {
    // 常见问题列表
    faqList: [
      {
        id: 'faq1',
        question: '如何修改收货地址？',
        answer: '您可以在"我的"-"收货地址"中添加、编辑或删除收货地址。'
      },
      {
        id: 'faq2',
        question: '订单什么时候发货？',
        answer: '一般情况下，我们会在付款成功后24小时内发货，节假日可能会有所延迟。'
      },
      {
        id: 'faq3',
        question: '如何取消订单？',
        answer: '待付款状态下可直接取消；已付款未发货状态可申请取消，由客服人员处理；已发货状态不支持取消。'
      },
      {
        id: 'faq4',
        question: '如何申请退款/退货？',
        answer: '在"我的订单"中找到对应订单，点击"退款/退货"按钮，填写相关信息并提交申请。'
      },
      {
        id: 'faq5',
        question: '积分如何获取和使用？',
        answer: '购物可获得积分，积分可在购物时抵扣部分金额，具体规则可查看"我的"-"我的积分"页面。'
      }
    ],
    
    // 客服信息
    serviceInfo: {
      phoneNumber: '400-123-4567',
      workTime: '09:00 - 21:00',
      email: 'support@hbn.com',
      wechat: 'HBN-Service'
    },
    
    // 是否显示问题答案
    expandedFaqId: '',
    
    // 服务选项
    serviceOptions: [
      {
        id: 'online',
        title: '在线客服',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/客户服务.png',
        desc: '9:00-21:00 实时解答'
      },
      {
        id: 'phone',
        title: '电话客服',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/绑定手机.png',
        desc: '400-123-4567'
      },
      {
        id: 'feedback',
        title: '意见反馈',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/_意见反馈.png',
        desc: '帮助我们改进服务'
      }
    ]
  },
  
  onLoad: function(options) {
    // 页面加载时执行
    this.loadCloudImages();
  },
  
  // 加载云存储图片
  loadCloudImages: function() {
    // 加载服务选项图标
    this.data.serviceOptions.forEach((option, index) => {
      wx.cloud.getTempFileURL({
        fileList: [option.icon],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `serviceOptions[${index}].icon`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });
  },
  
  // 切换问题展开/收起
  toggleFaq: function(e) {
    const faqId = e.currentTarget.dataset.id;
    if (this.data.expandedFaqId === faqId) {
      // 如果点击的是当前展开的问题，则收起
      this.setData({
        expandedFaqId: ''
      });
    } else {
      // 否则展开点击的问题
      this.setData({
        expandedFaqId: faqId
      });
    }
  },
  
  // 联系客服
  contactService: function(e) {
    const serviceType = e.currentTarget.dataset.type;
    
    switch(serviceType) {
      case 'online':
        // 打开在线客服会话
        wx.showToast({
          title: '正在连接客服...',
          icon: 'loading',
          duration: 1000
        });
        
        // 使用微信客服接口
        wx.openCustomerServiceChat({
          extInfo: {url: 'https://work.weixin.qq.com/kf/kfxxxxxxxxxxxxxxx'},
          corpId: 'ww1234567890abcdef',
          success(res) {
            console.log('打开客服成功', res);
          },
          fail(err) {
            console.error('打开客服失败', err);
            // 如果接口调用失败，使用备用方案
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/service/chat/chat'
              });
            }, 500);
          }
        });
        break;
        
      case 'phone':
        // 拨打电话
        wx.makePhoneCall({
          phoneNumber: this.data.serviceInfo.phoneNumber,
          success: () => {
            console.log('拨打电话成功');
          },
          fail: (err) => {
            console.error('拨打电话失败', err);
            wx.showToast({
              title: '拨打电话失败',
              icon: 'none'
            });
          }
        });
        break;
        
      case 'feedback':
        // 跳转到意见反馈页面
        wx.navigateTo({
          url: '/pages/feedback/feedback'
        });
        break;
    }
  },
  
  // 复制客服信息
  copyServiceInfo: function(e) {
    const type = e.currentTarget.dataset.type;
    let content = '';
    
    switch(type) {
      case 'email':
        content = this.data.serviceInfo.email;
        break;
      case 'wechat':
        content = this.data.serviceInfo.wechat;
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
  }
}) 