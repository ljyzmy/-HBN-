Page({
  data: {
    currentTab: 0, // 0: 通知, 1: 活动, 2: 系统
    tabs: ['通知', '活动', '系统'],
    messages: {
      notification: [
        {
          id: 'M001',
          title: '订单发货通知',
          content: '您的订单O202505260002已发货，预计3-5天内送达，请保持手机畅通。',
          time: '2025-05-27 10:15:30',
          isRead: false,
          type: 'order'
        },
        {
          id: 'M002',
          title: '会员等级提升',
          content: '恭喜您！您的会员等级已提升至银牌会员，可享受更多专属优惠。',
          time: '2025-05-25 15:42:18',
          isRead: true,
          type: 'member'
        },
        {
          id: 'M003',
          title: '积分到账通知',
          content: '您有300积分已到账，来自订单O202505230004的购物奖励。',
          time: '2025-05-23 09:30:45',
          isRead: true,
          type: 'points'
        }
      ],
      activity: [
        {
          id: 'M004',
          title: '618年中大促',
          content: '618年中大促即将开启，全场低至5折起，更有限时抢购好礼相送！',
          time: '2025-05-26 12:00:00',
          isRead: false,
          type: 'promotion'
        },
        {
          id: 'M005',
          title: '会员专享活动',
          content: '【银牌会员专享】本周末消费满300元额外赠送精美小礼品一份。',
          time: '2025-05-24 14:30:00',
          isRead: true,
          type: 'member'
        },
        {
          id: 'M006',
          title: '新品上市通知',
          content: 'HBN夏季新品系列已全新上市，前100名购买者还可获得限量版礼盒一份！',
          time: '2025-05-20 10:00:00',
          isRead: true,
          type: 'product'
        }
      ],
      system: [
        {
          id: 'M007',
          title: '系统维护通知',
          content: '系统将于2025年6月1日凌晨2:00-4:00进行例行维护，期间可能影响正常使用，请您谅解。',
          time: '2025-05-27 09:00:00',
          isRead: false,
          type: 'system'
        },
        {
          id: 'M008',
          title: '隐私政策更新',
          content: 'HBN隐私政策已更新，保护您的个人信息安全是我们的首要任务。',
          time: '2025-05-15 08:30:00',
          isRead: true,
          type: 'privacy'
        }
      ]
    },
    unreadCount: {
      notification: 1,
      activity: 1,
      system: 1
    }
  },

  onLoad: function(options) {
    // 如果有指定tab，则切换到对应tab
    if (options.tab) {
      const tab = parseInt(options.tab);
      if (tab >= 0 && tab <= 2) {
        this.setData({
          currentTab: tab
        });
      }
    }
    
    // 计算未读消息数量
    this.calculateUnreadCount();
  },

  // 切换Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: parseInt(tab)
    });
  },
  
  // 计算各分类未读消息数量
  calculateUnreadCount() {
    const messages = this.data.messages;
    const unreadCount = {
      notification: messages.notification.filter(item => !item.isRead).length,
      activity: messages.activity.filter(item => !item.isRead).length,
      system: messages.system.filter(item => !item.isRead).length
    };
    
    this.setData({
      unreadCount: unreadCount
    });
  },
  
  // 查看消息详情
  viewMessageDetail(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    let messageType = '';
    let messageIndex = -1;
    
    // 查找消息所在类别和索引
    switch (this.data.currentTab) {
      case 0:
        messageType = 'notification';
        messageIndex = this.data.messages.notification.findIndex(item => item.id === id);
        break;
      case 1:
        messageType = 'activity';
        messageIndex = this.data.messages.activity.findIndex(item => item.id === id);
        break;
      case 2:
        messageType = 'system';
        messageIndex = this.data.messages.system.findIndex(item => item.id === id);
        break;
    }
    
    if (messageIndex > -1) {
      // 标记消息为已读
      if (!this.data.messages[messageType][messageIndex].isRead) {
        const key = `messages.${messageType}[${messageIndex}].isRead`;
        this.setData({
          [key]: true
        });
        
        // 重新计算未读消息数量
        this.calculateUnreadCount();
      }
      
      // 根据消息类型跳转
      const message = this.data.messages[messageType][messageIndex];
      if (message.type === 'order') {
        wx.navigateTo({
          url: `/pages/order/list?status=0`
        });
      } else if (message.type === 'member') {
        wx.navigateTo({
          url: '/pages/member/level/level'
        });
      } else if (message.type === 'points') {
        wx.navigateTo({
          url: '/pages/points/points'
        });
      } else if (message.type === 'promotion' || message.type === 'product') {
        wx.switchTab({
          url: '/pages/home/home'
        });
      } else {
        // 弹窗显示系统和隐私相关消息
        wx.showModal({
          title: message.title,
          content: message.content,
          showCancel: false,
          confirmText: '我知道了'
        });
      }
    }
  },
  
  // 一键已读
  markAllAsRead() {
    let messageType = '';
    
    // 获取当前标签页对应的消息类型
    switch (this.data.currentTab) {
      case 0:
        messageType = 'notification';
        break;
      case 1:
        messageType = 'activity';
        break;
      case 2:
        messageType = 'system';
        break;
    }
    
    // 标记当前标签页所有消息为已读
    const messages = [...this.data.messages[messageType]];
    messages.forEach(item => {
      item.isRead = true;
    });
    
    const key = `messages.${messageType}`;
    this.setData({
      [key]: messages
    });
    
    // 重新计算未读消息数量
    this.calculateUnreadCount();
    
    wx.showToast({
      title: '已全部标为已读',
      icon: 'success'
    });
  },
  
  // 删除单个消息
  deleteMessage(e) {
    const id = e.currentTarget.dataset.id;
    let messageType = '';
    
    // 获取当前标签页对应的消息类型
    switch (this.data.currentTab) {
      case 0:
        messageType = 'notification';
        break;
      case 1:
        messageType = 'activity';
        break;
      case 2:
        messageType = 'system';
        break;
    }
    
    // 删除消息
    const messages = this.data.messages[messageType].filter(item => item.id !== id);
    const key = `messages.${messageType}`;
    
    this.setData({
      [key]: messages
    });
    
    // 重新计算未读消息数量
    this.calculateUnreadCount();
    
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },
  
  // 清空所有消息
  clearAllMessages() {
    let messageType = '';
    
    // 获取当前标签页对应的消息类型
    switch (this.data.currentTab) {
      case 0:
        messageType = 'notification';
        break;
      case 1:
        messageType = 'activity';
        break;
      case 2:
        messageType = 'system';
        break;
    }
    
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有消息吗？',
      success: res => {
        if (res.confirm) {
          const key = `messages.${messageType}`;
          this.setData({
            [key]: []
          });
          
          // 重新计算未读消息数量
          this.calculateUnreadCount();
          
          wx.showToast({
            title: '清空成功',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 下拉刷新
  onPullDownRefresh: function() {
    // 模拟刷新数据
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  }
}) 