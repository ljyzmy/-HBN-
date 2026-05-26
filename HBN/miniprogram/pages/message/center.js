// pages/message/center.js
Page({
  data: {
    activeTab: 0, // 当前选中的标签页索引
    tabs: ['全部消息', '系统通知', '活动消息', '订单消息'],
    messages: [
      {
        id: 1,
        type: 1, // 1:系统通知 2:活动消息 3:订单消息
        title: '账户安全提醒',
        content: '您的账户已成功登录，如非本人操作，请及时修改密码。',
        date: '2025-05-27',
        isRead: true,
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/系统通知.png'
      },
      {
        id: 2,
        type: 2,
        title: '限时折扣活动',
        content: 'HBN护肤套装限时85折，错过再等一年！',
        date: '2025-05-26',
        isRead: false,
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/活动消息.png'
      },
      {
        id: 3,
        type: 3,
        title: '订单发货通知',
        content: '您的订单O2025052601已发货，预计3天内送达。',
        date: '2025-05-25',
        isRead: false,
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/订单消息.png'
      },
      {
        id: 4,
        type: 1,
        title: '会员等级升级',
        content: '恭喜您已升级为铂金会员，可享受更多专属优惠！',
        date: '2025-05-24',
        isRead: true,
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/系统通知.png'
      },
      {
        id: 5,
        type: 2,
        title: '新品上市通知',
        content: 'HBN明星产品【靓肤精华液】全新升级版本已上线。',
        date: '2025-05-23',
        isRead: true,
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/活动消息.png'
      }
    ]
  },
  
  onLoad: function(options) {
    // 页面加载时执行
  },
  
  // 切换标签页
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
  },
  
  // 查看消息详情
  viewMessage(e) {
    const id = e.currentTarget.dataset.id;
    // 标记消息为已读
    this.markAsRead(id);
    
    // 查看消息详情
    wx.navigateTo({
      url: `/pages/message/detail?id=${id}`
    });
  },
  
  // 标记为已读
  markAsRead(id) {
    const messages = this.data.messages;
    const index = messages.findIndex(item => item.id === id);
    
    if (index !== -1 && !messages[index].isRead) {
      messages[index].isRead = true;
      this.setData({
        messages
      });
    }
  },
  
  // 全部已读
  markAllAsRead() {
    const messages = this.data.messages.map(item => {
      return {
        ...item,
        isRead: true
      };
    });
    
    this.setData({
      messages
    });
    
    wx.showToast({
      title: '全部标为已读',
      icon: 'success'
    });
  },
  
  // 删除消息
  deleteMessage(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '删除消息',
      content: '确定删除这条消息吗？',
      success: (res) => {
        if (res.confirm) {
          const messages = this.data.messages.filter(item => item.id !== id);
          this.setData({
            messages
          });
        }
      }
    });
  },
  
  // 获取未读消息数量
  getUnreadCount() {
    return this.data.messages.filter(item => !item.isRead).length;
  }
}) 