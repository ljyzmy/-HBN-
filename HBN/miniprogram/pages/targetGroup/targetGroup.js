const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    navHeight: wx.getSystemInfoSync().statusBarHeight + 44,
    loading: true,
    groupId: null,
    groupName: '',
    products: [],
    animationData: {},
    showShareBtn: false,
    targetGroups: {
      1: {
        id: 1,
        name: '初老肌肤',
        description: '针对25岁以上，开始出现初期老化迹象的肌肤，如细纹、松弛、暗沉等',
        icon: 'https://img.api.aa1.cn/2025/05/07/f431559d11286.png',
        recommendations: [
          {
            id: 102,
            name: '双A醇精华乳',
            price: '238.00',
            image: 'https://www.hbn.cn/assets/1-BZbFkdFc.png',
            description: '国内A醇抗老开山之作，蕴含双A醇科技'
          },
          {
            id: 201,
            name: '咖啡因紧致修护眼霜',
            price: '238.00',
            image: 'https://www.hbn.cn/assets/3-BxE2s-DI.png',
            description: '改善眼周细纹与松弛，提亮眼周暗沉'
          }
        ]
      },
      2: {
        id: 2,
        name: '疲惫暗沉',
        description: '针对熬夜、压力大、环境污染等因素导致的肌肤暗沉、无光泽、缺水现象',
        icon: 'https://img.api.aa1.cn/2025/05/07/b6932c481e24c.png',
        recommendations: [
          {
            id: 101,
            name: '明星发光水',
            price: '198.00',
            image: 'https://www.hbn.cn/assets/1-Bsqoo_S0.png',
            description: '熬夜提亮必备，改善暗沉无光问题'
          }
        ]
      },
      3: {
        id: 3,
        name: '眼周问题',
        description: '针对眼周出现的黑眼圈、眼袋、浮肿、细纹等多种眼部问题',
        icon: 'https://img.api.aa1.cn/2025/05/07/77c07a1020c84.png',
        recommendations: [
          {
            id: 201,
            name: '咖啡因紧致修护眼霜',
            price: '238.00',
            image: 'https://www.hbn.cn/assets/3-BxE2s-DI.png',
            description: '眼部加浓冰美式，快速改善眼周问题'
          }
        ]
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id && options.name) {
      const groupId = parseInt(options.id);
      this.setData({
        groupId: groupId,
        groupName: options.name,
        loading: true
      });
      
      this.loadProductsByGroup(groupId);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 创建动画实例
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    
    // 播放头像图标旋转动画
    setTimeout(() => {
      animation.scale(1.1).step();
      animation.scale(1.0).step();
      this.setData({
        animationData: animation.export()
      });
    }, 1000);
    
    // 显示分享按钮
    setTimeout(() => {
      this.setData({
        showShareBtn: true
      });
    }, 800);
  },

  /**
   * 加载对应人群的推荐产品
   */
  loadProductsByGroup(groupId) {
    // 模拟数据加载延迟
    setTimeout(() => {
      const group = this.data.targetGroups[groupId];
      if (group) {
        this.setData({
          products: group.recommendations,
          currentGroup: group,
          loading: false
        });
      } else {
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '未找到该分类',
          icon: 'none'
        });
      }
    }, 500);
  },

  /**
   * 跳转到产品详情页
   */
  goToProductDetail(e) {
    const productId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}`
    });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 显示分享海报
   */
  showSharePoster() {
    wx.showToast({
      title: '生成海报中...',
      icon: 'loading',
      duration: 1500
    });
    
    // 这里可以实现分享海报生成逻辑
    setTimeout(() => {
      wx.showToast({
        title: '海报生成功能即将上线',
        icon: 'none',
        duration: 2000
      });
    }, 1500);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `HBN - ${this.data.groupName}护肤推荐`,
      path: `/pages/targetGroup/targetGroup?id=${this.data.groupId}&name=${this.data.groupName}`,
      imageUrl: this.data.currentGroup ? this.data.currentGroup.icon : ''
    };
  },
  
  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: `HBN - ${this.data.groupName}专属护肤方案`,
      query: `id=${this.data.groupId}&name=${this.data.groupName}`,
      imageUrl: this.data.currentGroup ? this.data.currentGroup.icon : ''
    };
  }
}) 