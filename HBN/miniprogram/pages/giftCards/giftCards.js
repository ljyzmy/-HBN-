Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCards: 0,
    totalValue: 0,
    giftCards: [],
    showCardDetail: false,
    currentCard: null,
    cardCode: '',
    isUsePopupOpen: false,
    isTransferPopupOpen: false,
    transferPhone: '',
    transferError: '',
    userProfiles: [
      {
        id: 1,
        name: '职场精英女性',
        avatar: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/头像/职场精英女性.jpg',
        description: '追求高品质生活，注重个人形象'
      },
      {
        id: 2,
        name: '都市新锐青年',
        avatar: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/头像/都市新锐青年.webp',
        description: '热爱潮流，追求个性表达'
      },
      {
        id: 3,
        name: '科研工作者',
        avatar: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/头像/科研工作者.jpeg',
        description: '注重功效，关注产品成分'
      }
    ],
    selectedUserProfile: null,
    isCardActivating: false,
    isEmptyState: true,
    animateSuccess: false,
    animateError: false,
    qrCodeVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 初始化云环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-0gxff61z2804383c',
        traceUser: true,
      });
    }
    this.loadGiftCards();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadGiftCards(); // 重新加载礼品卡数据，确保数据最新
  },

  /**
   * 加载礼品卡列表
   */
  loadGiftCards: function() {
    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
    });
    
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    
    // 根据用户昵称匹配用户ID
    let userId = 'user_004'; // 默认ID

    if (userInfo) {
      if (userInfo.nickName === '职场精英女性') {
        userId = 'user_001';
      } else if (userInfo.nickName === '都市新锐青年') {
        userId = 'user_002';
      } else if (userInfo.nickName === '科研工作者') {
        userId = 'user_003';
      }
    }

    // 从云数据库获取礼品卡数据
    const db = wx.cloud.database();
    db.collection('gift_cards')
      .where({
        userId: userId
      })
      .get()
      .then(res => {
        // 隐藏加载提示
        wx.hideLoading();
        
        const cards = res.data;
        const cardCount = cards.length;
        
        // 计算礼品卡总价值
        let totalVal = 0;
        cards.forEach(card => {
          totalVal += card.value - card.usedAmount;
        });
        
        // 更新页面数据
        this.setData({
          giftCards: cards,
          totalCards: cardCount,
          totalValue: totalVal,
          isEmptyState: cards.length === 0
        });
      })
      .catch(err => {
        // 处理错误
        wx.hideLoading();
        console.error('获取礼品卡数据失败：', err);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
        
        this.setData({
          giftCards: [],
          totalCards: 0,
          totalValue: 0,
          isEmptyState: true
        });
      });
  },

  /**
   * 显示礼品卡详情
   */
  showCardDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    const card = this.data.giftCards.find(item => item._id === id);
    
    if (card) {
      this.setData({
        currentCard: card,
        showCardDetail: true
      });
    }
  },

  /**
   * 关闭礼品卡详情
   */
  closeCardDetail: function() {
    this.setData({
      showCardDetail: false,
      currentCard: null
    });
  },

  /**
   * 打开使用礼品卡弹窗
   */
  openUsePopup: function() {
    this.setData({
      isUsePopupOpen: true,
      cardCode: this.data.currentCard.code
    });
  },

  /**
   * 关闭使用礼品卡弹窗
   */
  closeUsePopup: function() {
    this.setData({
      isUsePopupOpen: false
    });
  },

  /**
   * 复制礼品卡码
   */
  copyCardCode: function() {
    wx.setClipboardData({
      data: this.data.cardCode,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  /**
   * 打开转赠礼品卡弹窗
   */
  openTransferPopup: function() {
    if (this.data.currentCard && !this.data.currentCard.canTransfer) {
      wx.showToast({
        title: '此卡不可转赠',
        icon: 'none'
      });
      return;
    }
    
    // 获取当前用户画像，排除自己
    const userInfo = wx.getStorageSync('userInfo');
    let currentUserName = '';
    if (userInfo && userInfo.nickName) {
      currentUserName = userInfo.nickName;
    }
    
    // 过滤用户画像列表，排除当前用户
    const filteredProfiles = this.data.userProfiles.filter(profile => 
      profile.name !== currentUserName
    );
    
    this.setData({
      isTransferPopupOpen: true,
      userProfiles: filteredProfiles,
      selectedUserProfile: null,
      transferError: ''
    });
  },

  /**
   * 关闭转赠礼品卡弹窗
   */
  closeTransferPopup: function() {
    this.setData({
      isTransferPopupOpen: false
    });
  },

  /**
   * 选择用户画像
   */
  selectUserProfile: function(e) {
    const profileId = e.currentTarget.dataset.id;
    const profile = this.data.userProfiles.find(item => item.id === profileId);
    
    if (profile) {
      this.setData({
        selectedUserProfile: profile,
        transferError: ''
      });
    }
  },

  /**
   * 转赠礼品卡
   */
  transferCard: function() {
    // 验证是否选择了用户画像
    if (!this.data.selectedUserProfile) {
      this.setData({
        transferError: '请选择转赠对象'
      });
      return;
    }
    
    // 显示加载提示
    wx.showLoading({
      title: '转赠中...',
      mask: true
    });
    
    // 获取目标用户ID
    let targetUserId = '';
    let targetUserName = this.data.selectedUserProfile.name;
    
    if (targetUserName === '职场精英女性') {
      targetUserId = 'user_001';
    } else if (targetUserName === '都市新锐青年') {
      targetUserId = 'user_002';
    } else if (targetUserName === '科研工作者') {
      targetUserId = 'user_003';
    } else {
      targetUserId = 'user_004';
    }
    
    const currentCard = this.data.currentCard;
    
    // 调用云函数进行转赠操作
    wx.cloud.callFunction({
      name: 'transferGiftCard',
      data: {
        cardId: currentCard._id,
        fromUserId: currentCard.userId,
        fromUserName: currentCard.userName,
        toUserId: targetUserId,
        toUserName: targetUserName
      }
    }).then(res => {
      wx.hideLoading();
      
      const result = res.result;
      if (result.success) {
        // 更新本地礼品卡列表
        const updatedCards = this.data.giftCards.filter(card => card._id !== this.data.currentCard._id);
        
        this.setData({
          giftCards: updatedCards,
          totalCards: updatedCards.length,
          isTransferPopupOpen: false,
          showCardDetail: false,
          currentCard: null
        });
        
        // 重新计算总价值
        let totalVal = 0;
        updatedCards.forEach(card => {
          totalVal += card.value - card.usedAmount;
        });
        
        this.setData({
          totalValue: totalVal,
          isEmptyState: updatedCards.length === 0
        });
        
        // 提示成功
        wx.showToast({
          title: '转赠成功',
          icon: 'success'
        });
      } else {
        // 转赠失败，显示错误信息
        wx.showToast({
          title: result.message || '转赠失败',
          icon: 'none'
        });
        console.error('转赠失败：', result);
      }
    }).catch(err => {
      wx.hideLoading();
      console.error('调用云函数失败：', err);
      
      wx.showToast({
        title: '转赠失败，请稍后重试',
        icon: 'none'
      });
    });
  },

  /**
   * 激活礼品卡
   */
  activateCard: function() {
    this.setData({
      isCardActivating: true
    });
    
    const currentCard = this.data.currentCard;
    
    // 调用云函数激活礼品卡
    wx.cloud.callFunction({
      name: 'activateGiftCard',
      data: {
        cardId: currentCard._id,
        userId: currentCard.userId,
        userName: currentCard.userName
      }
    }).then(res => {
      const result = res.result;
      
      if (result.success) {
        // 更新UI显示
        this.setData({
          isCardActivating: false,
          animateSuccess: true
        });
        
        // 重置动画状态
        setTimeout(() => {
          this.setData({
            animateSuccess: false
          });
          
          // 重新加载数据
          this.loadGiftCards();
        }, 2000);
      } else {
        // 激活失败
        this.setData({
          isCardActivating: false,
          animateError: true
        });
        
        // 重置动画状态
        setTimeout(() => {
          this.setData({
            animateError: false
          });
        }, 2000);
        
        wx.showToast({
          title: result.message || '激活失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败：', err);
      
      this.setData({
        isCardActivating: false,
        animateError: true
      });
      
      // 重置动画状态
      setTimeout(() => {
        this.setData({
          animateError: false
        });
      }, 2000);
      
      wx.showToast({
        title: '激活失败，请稍后重试',
        icon: 'none'
      });
    });
  },

  /**
   * 显示二维码
   */
  showQrCode: function() {
    this.setData({
      qrCodeVisible: true
    });
  },

  /**
   * 隐藏二维码
   */
  hideQrCode: function() {
    this.setData({
      qrCodeVisible: false
    });
  },

  /**
   * 导航返回
   */
  goBack: function() {
    wx.navigateBack();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this.loadGiftCards();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 分享
   */
  onShareAppMessage: function() {
    return {
      title: 'HBN礼品卡',
      path: '/pages/giftCards/giftCards',
      imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/礼品卡.png'
    }
  }
}) 