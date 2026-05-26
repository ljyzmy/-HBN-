Page({
  data: {
    pageTitle: '春夏底妆选择指南',
    pageImage: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/春夏底妆展示图制作 .png',
    // 移除头部视频，保持使用图片
    readCount: 1592,
    publishDate: '2025-05-18',
    
    // 主要内容部分
    introduction: '春夏季节，空气温度升高，肌肤出油也会增多，如何选择一款合适的底妆产品十分重要。本指南带你了解不同肤质如何挑选适合春夏的底妆产品，让妆容持久清爽。',
    
    skinTypes: [
      {
        type: '油性肌肤',
        description: '春夏季节更易出油，应选择控油持久的底妆产品',
        tips: ['选择哑光质地的粉底液', '可使用控油妆前乳打底', '定妆时多在T区加强'],
        recommendProducts: [
          {
            name: 'HBN发光水α-熊果苷精粹水2.0',
            price: '￥129',
            description: '控油提亮，适合油性肌肤使用',
            imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.png',
            // 添加视频URL
            videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.mp4'
          }
        ]
      },
      {
        type: '干性肌肤',
        description: '春夏季虽然湿度增加，但干性肌肤仍需补水保湿',
        tips: ['选择滋润型粉底液', '底妆前做好保湿工作', '可用保湿喷雾定妆'],
        recommendProducts: [
          {
            name: 'HBN视黄醇精华乳2.0双a醇乳液',
            price: '￥189',
            description: '滋润保湿，适合干性肌肤',
            imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.png',
            // 添加视频URL
            videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4'
          }
        ]
      },
      {
        type: '混合性肌肤',
        description: '春夏季T区易出油，而两颊容易干燥，需要平衡护理',
        tips: ['可用不同粉底针对不同区域', 'T区可使用控油产品', '两颊用保湿型产品'],
        recommendProducts: [
          {
            name: 'HBN视黄醇精华乳2.0',
            price: '￥189',
            description: '平衡油水，适合混合性肌肤',
            imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.png',
            // 添加视频URL
            videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4'
          },
          {
            name: 'HBN发光水α-熊果苷精粹水2.0',
            price: '￥119',
            description: '调节肌肤水油平衡',
            imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.png',
            // 添加视频URL
            videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.mp4'
          }
        ]
      },
      {
        type: '敏感性肌肤',
        description: '春夏季温度升高，敏感肌更容易受到刺激，需要温和护理',
        tips: ['选择低刺激性底妆', '避免含有酒精和香料的产品', '卸妆时动作要轻柔'],
        recommendProducts: [
          {
            name: 'HBN视黄醇精华乳2.0',
            price: '￥189',
            description: '温和修护，舒缓敏感肌肤',
            imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.png',
            // 添加视频URL
            videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4'
          },
          {
            name: 'HBN发光水α-熊果苷精粹水2.0',
            price: '￥119',
            description: '温和无刺激，适合敏感肌使用',
            imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.png',
            // 添加视频URL
            videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.mp4'
          }
        ]
      }
    ],
    
    // 通用底妆技巧 - 这部分保持图片不变
    makeupTips: [
      {
        title: '春夏底妆持久技巧',
        content: '使用HBN发光水α-熊果苷精粹水2.0作为底妆前的爽肤水步骤，帮助控油提亮，选择合适的妆前乳打底，使用定妆散粉或定妆喷雾。',
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/春夏底妆选择指南/底妆技巧分享.png'
      },
      {
        title: '春夏底妆修护重点',
        content: '晚间使用HBN视黄醇精华乳2.0双a醇乳液修护肌肤，选择含SPF的底妆产品，同时肌肤补水非常重要，可使用HBN发光水湿敷补水。',
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/春夏底妆选择指南/底妆修护场景.png'
      },
      {
        title: '洁面与卸妆步骤',
        content: '春夏季彻底清洁更为重要，卸妆后使用温和洁面产品，确保彻底清洁，然后涂抹HBN视黄醇精华乳2.0修护肌肤。',
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/春夏底妆选择指南/女生洁面场景.png'
      }
    ],
    
    // 推荐产品
    relatedProducts: [
      {
        id: 1,
        name: 'HBN视黄醇精华乳2.0双a醇乳液',
        price: '￥199',
        originalPrice: '￥289',
        description: '紧致抗皱焕亮淡化细纹，双A醇强效修护',
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.png',
        // 添加视频URL
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4'
      },
      {
        id: 2,
        name: 'HBN发光水α-熊果苷精粹水2.0',
        price: '￥129',
        originalPrice: '￥199',
        description: '提亮肤色保湿爽肤水，适合湿敷使用',
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.png',
        // 添加视频URL
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.mp4'
      },
      {
        id: 3,
        name: 'HBN视黄醇精华乳2.0',
        price: '￥199',
        originalPrice: '￥289',
        description: '紧致抗皱焕亮，高效修护肌肤',
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.png',
        // 添加视频URL
        videoUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/2.mp4'
      }
    ]
  },

  onLoad: function (options) {
    console.log('春夏底妆选择指南页面加载成功');
    
    // 从页面栈中获取页面信息
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        const statusBarHeight = res.statusBarHeight;
        const navHeight = statusBarHeight + 44; // 导航栏默认高度
        
        this.setData({
          statusBarHeight,
          navHeight: navHeight,
          scrolled: false
        });
      }
    });
    
    // 更新阅读数量
    this.setData({
      readCount: this.data.readCount + Math.floor(Math.random() * 10)
    });

    // 在页面加载后延迟启动视频播放
    setTimeout(() => {
      this.playAllProductVideos();
    }, 500);
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  
  // 跳转到产品详情页
  goToProduct: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },
  
  // 播放所有产品视频
  playAllProductVideos: function() {
    // 推荐产品视频
    this.data.skinTypes.forEach((type, typeIndex) => {
      type.recommendProducts.forEach((product, productIndex) => {
        const videoContext = wx.createVideoContext(`product-video-${typeIndex}-${productIndex}`);
        if (videoContext) {
          videoContext.play();
        }
      });
    });
    
    // 相关产品视频
    this.data.relatedProducts.forEach((product, index) => {
      const videoContext = wx.createVideoContext(`related-product-video-${index}`);
      if (videoContext) {
        videoContext.play();
      }
    });
  },
  
  // 处理视频错误
  videoError: function(e) {
    console.error('视频播放错误:', e.detail.errMsg);
    // 获取视频ID
    const videoId = e.currentTarget.id;
    console.log('视频加载失败，ID:', videoId);
    
    // 显示视频封面图片，可以通过修改DOM元素样式实现
    // 在小程序中，视频加载失败会自动显示封面图片
    // 这里我们只需要记录日志并允许继续使用封面图片
    wx.showToast({
      title: '视频加载失败，使用图片显示',
      icon: 'none',
      duration: 1500
    });
  },
  
  // 监听页面滚动
  onPageScroll: function(e) {
    // 滚动超过200rpx时，导航栏变为不透明
    if (e.scrollTop > 100 && !this.data.scrolled) {
      this.setData({
        scrolled: true
      });
    } else if (e.scrollTop <= 100 && this.data.scrolled) {
      this.setData({
        scrolled: false
      });
    }
  },
  
  // 分享页面
  onShareAppMessage: function() {
    return {
      title: this.data.pageTitle,
      path: '/pages/strategyDetail/springMakeup/springMakeup',
      imageUrl: this.data.pageImage
    };
  },
  
  // 页面显示时恢复视频播放
  onShow: function() {
    setTimeout(() => {
      this.playAllProductVideos();
    }, 300);
  }
}) 