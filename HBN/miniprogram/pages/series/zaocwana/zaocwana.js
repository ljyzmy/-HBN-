Page({
  data: {
    navTransparent: true,
    // 商品数据
    products: [
      {
        id: 2,
        name: 'HBN发光水α-熊果苷精粹水2.0提亮保湿爽肤水湿敷水',
        desc: '高纯度α-熊果苷，提亮肤色，补水保湿，温和修护。',
        image: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.mp4',
        detailId: 2
      },
      {
        id: 1,
        name: 'HBN视黄醇精华乳2.0双a醇乳液紧致抗皱焕亮',
        desc: '双A醇协同，紧致抗皱，淡化细纹，焕亮肤色。',
        image: 'https://www.hbn.cn/assets/1-BZbFkdFc.png',
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4',
        detailId: 1
      }
    ]
  },
  
  onLoad() {
    // 确保初始状态下导航条是透明的
    this.setData({
      navTransparent: true
    });
    
    // 页面加载后播放背景视频
    setTimeout(() => {
      this.playBackgroundVideo();
    }, 300);
  },
  
  // 添加返回上一页的方法
  navigateBack() {
    wx.navigateBack({
      delta: 1,
      fail: function() {
        // 如果返回失败（例如没有上一页），则跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    });
  },
  
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },
  
  // 修改 buyBundle 方法
  buyBundle() {
    // 跳转到早C晚A套装详情页
    wx.navigateTo({
      url: '/pages/detail1/detail1',
      success: function() {
        console.log('跳转到早C晚A套装详情页成功');
      },
      fail: function(err) {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '跳转失败，请稍后再试',
          icon: 'none'
        });
      }
    });
  },
  
  // 页面滚动处理 - 导航条透明度变化
  onPageScroll(e) {
    if (e.scrollTop > 50) {
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
  },
  
  // 播放背景视频
  playBackgroundVideo() {
    const bgVideoContext = wx.createVideoContext('background-video');
    if (bgVideoContext) {
      bgVideoContext.play();
    }
  },
  
  // 处理背景视频错误
  bgVideoError(e) {
    console.error('背景视频错误:', e.detail.errMsg);
    // 如果视频加载失败，可以添加处理逻辑
    wx.showToast({
      title: '视频加载失败',
      icon: 'none'
    });
  },
  
  // 处理商品视频错误
  productVideoError(e) {
    console.error('商品视频加载失败:', e.detail.errMsg);
    const productId = e.currentTarget.dataset.id;
    console.log('加载失败的商品ID:', productId);
    
    // 视频加载失败时回退到图片显示
    const products = this.data.products;
    let product = products.find(p => p.id === productId);
    if (product) {
      // 可以在这里添加回退逻辑，比如显示一个图片占位符
      wx.showToast({
        title: '视频加载失败',
        icon: 'none',
        duration: 1500
      });
    }
  }
}) 