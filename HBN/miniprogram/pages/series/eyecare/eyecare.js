Page({
  data: {
    navTransparent: true,
    // 主推商品数据
    mainProduct: {
      id: 3,
      name: 'HBN咖啡因眼霜3.0',
      desc: '淡细纹焕亮眼周，抗皱紧致保湿眼霜',
      fullDesc: '3倍咖啡因浓度精准渗透，15分钟快速淡化黑眼圈，28天改善细纹',
      image: 'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01aVv2Zp1OEk4G9TXIx-2204177871674.jpg_.webp',
      videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/3.mp4',
      detailId: 3
    },
    // 相关商品数据
    relatedProducts: [
      {
        id: 4,
        name: 'HBN多肽眼部精华',
        desc: '舒缓紧致，去眼袋眼纹',
        image: 'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01yBb14K1OEjx4nBHCU_!!2204177871674.jpg_.webp',
        detailId: 3
      }
    ],
    // 使用方法步骤
    usageSteps: [
      { title: "取适量", desc: "取黄豆大小的量于指腹" },
      { title: "按压手法", desc: "轻轻从内眼角向外点压" },
      { title: "提拉手法", desc: "由下至上轻轻提拉眼周" }
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
    
    // 播放主推商品视频
    setTimeout(() => {
      this.playMainProductVideo();
    }, 500);
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
  
  // 购买主商品方法
  buyMainProduct() {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${this.data.mainProduct.detailId}`,
      success: function() {
        console.log('跳转到咖啡因紧致眼霜详情页成功');
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
  
  // 播放主推商品视频
  playMainProductVideo() {
    const videoContext = wx.createVideoContext('main-product-video');
    if (videoContext) {
      videoContext.play();
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
  
  // 处理主推商品视频错误
  mainProductVideoError(e) {
    console.error('主推商品视频错误:', e.detail.errMsg);
    // 如果视频加载失败，显示封面图片
    wx.showToast({
      title: '视频加载失败，显示图片',
      icon: 'none',
      duration: 2000
    });
  }
}) 