// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTransparent: true,
    activeTab: 0,
    backgroundVideo: {
      videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/分类背景视频.mp4',
      posterUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/组合.png'
    },
    videoBgMuted: true,
    featuredVideo: {
      videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/双A醇精华乳.mp4',
      posterUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/组合.png',
      title: '大自然的馈赠',
      subtitle: '专注于将白桦树与雪松的自然精粹注入每一款产品'
    },
    categories: [
      { id: 1, name: '产品系列' },
      { id: 2, name: '功效分类' },
      { id: 3, name: '适用人群' }
    ],
    productSeries: [
      { 
        id: 1, 
        name: '早C晚A系列', 
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/下载 (4).mp4',
        isVideo: true,
        products: [
          { id: 101, name: '明星发光水', desc: '熬夜提亮必备', image: 'https://www.hbn.cn/assets/1-Bsqoo_S0.png' },
          { id: 102, name: '双A醇精华乳', desc: '国内A醇抗老开山之作', image: 'https://www.hbn.cn/assets/1-BZbFkdFc.png' }
        ] 
      },
      { 
        id: 2, 
        name: '眼部护理系列', 
        image: 'https://img.api.aa1.cn/2025/05/06/f1dc9d1c4dc81.png',
        isVideo: false,
        products: [
          { id: 201, name: '咖啡因紧致修护眼霜', desc: '眼部加浓冰美式', image: 'https://www.hbn.cn/assets/3-BxE2s-DI.png' }
        ] 
      }
    ],
    efficacyCategories: [
      { id: 1, name: '抗老紧致系列', image: 'https://www.hbn.cn/assets/3-BxWbGoFu.png' },
      { id: 2, name: '美白焕亮系列', image: 'https://www.hbn.cn/assets/3-D3f6spWk.png' },
      { id: 3, name: '维护保湿系列', image: 'https://www.hbn.cn/assets/3-CpWSdJ2a.png' },
      { id: 4, name: '基础护肤系列', image: 'https://www.hbn.cn/assets/3-BfeRQily.png' }
    ],
    targetGroups: [
      { id: 1, name: '初老肌肤', image: 'https://img.api.aa1.cn/2025/05/07/f431559d11286.png' },
      { id: 2, name: '疲惫暗沉', image: 'https://img.api.aa1.cn/2025/05/07/b6932c481e24c.png' },
      { id: 3, name: '眼周问题', image: 'https://img.api.aa1.cn/2025/05/07/77c07a1020c84.png' }
    ],
    brandIntro: {
      name: 'HBN',
      slogan: 'HBN功效护肤品牌创立于2019年,致力于让用户把每一分钱都花在有效成分上。作为国内首个以真功效为理念的护肤品牌，坚持自主研发，实现品牌100%面护产品均通过权威第三方人体功效检测。',
      description: '让"真功效"名副其实'
    }
  },

  /**
   * 切换分类标签
   */
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
  },

  /**
   * 跳转到产品详情
   */
  goToProductDetail(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}`
    });
  },

  /**
   * 跳转到分类产品列表
   */
  goToCategoryList(e) {
    const categoryId = e.currentTarget.dataset.id;
    const categoryName = e.currentTarget.dataset.name;
    
    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    
    // 检查当前活动的选项卡是否为"适用人群"(索引为2)
    if (this.data.activeTab === 2) {
      // 如果是适用人群选项卡，跳转到targetGroup页面
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/targetGroup/targetGroup?id=${categoryId}&name=${categoryName}`,
          success: () => {
            wx.hideLoading();
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      }, 100);
    } else {
      // 否则跳转到product页面(保持原有功能)
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/product/product?categoryId=${categoryId}&categoryName=${categoryName}`,
        success: () => {
          wx.hideLoading();
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }, 100);
    }
  },

  /**
   * 添加搜索方法
   */
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  /**
   * 添加返回方法
   */
  navigateBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 可以在这里添加页面加载时的逻辑
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面渲染完成后，延迟播放背景视频
    setTimeout(() => {
      this.playBackgroundVideo();
    }, 500);
  },

  playBackgroundVideo() {
    const bgVideoContext = wx.createVideoContext('bg-video');
    if (bgVideoContext) {
      bgVideoContext.play();
    }
  },

  // 处理背景视频错误
  bgVideoError(e) {
    console.error('背景视频错误:', e.detail.errMsg);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onPageScroll(e) {
    const scrollTop = e.detail.scrollTop; // 使用detail.scrollTop获取滚动位置
    if (scrollTop > 50) {
      if (this.data.navTransparent) {
        this.setData({
          navTransparent: false
        });
      }
    } else {
      if (!this.data.navTransparent) {
        this.setData({
          navTransparent: true
        });
      }
    }
  }
})