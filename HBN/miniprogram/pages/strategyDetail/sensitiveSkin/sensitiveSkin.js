Page({
  data: {
    pageTitle: '敏感肌护肤全攻略',
    pageImage: 'https://tucdn.wpon.cn/2025/05/18/d2a240b17f396-1747580835.jpg',
    readCount: 2103,
    publishDate: '2025-05-18',
    
    // 主要内容部分
    introduction: '敏感肌肤容易受到外界刺激而产生不适反应，表现为发红、瘙痒、刺痛等症状。正确的护理方法和产品选择对敏感肌至关重要。本指南将帮助您了解如何正确护理敏感肌肤，选择合适的产品。',
    
    // 敏感肌类型
    skinTypes: [
      {
        type: '先天性敏感肌',
        description: '由基因决定，角质层天生较薄，保护功能较弱',
        symptoms: ['肌肤天生薄透', '微刺激就会泛红发痒', '长期存在敏感问题'],
        carePoints: [
          '选择温和、低刺激的护肤品', 
          '避免过度清洁', 
          '建立简单的护肤程序'
        ],
        recommendProducts: [
          {
            name: 'HBN视黄醇精华乳2.0',
            price: '￥199',
            description: '温和修护配方，适合敏感肌使用',
            imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/2.png',
            videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/2.mp4'
          }
        ]
      },
      {
        type: '后天性敏感肌',
        description: '由外界因素如环境污染、不当护肤习惯等造成',
        symptoms: ['肌肤屏障受损', '对平时使用的产品突然过敏', '季节变换时皮肤状态不稳定'],
        carePoints: [
          '修复受损的肌肤屏障', 
          '避免使用含有酒精、香料的产品', 
          '注意防晒'
        ],
        recommendProducts: [
          {
            name: 'HBN发光水α-熊果苷精粹水2.0',
            price: '￥129',
            description: '温和保湿，提升肌肤屏障功能',
            imageUrl: 'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01FRNyop1OEk4Fglmu9-2204177871674.jpg_.webp',
            videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/1.mp4'
          }
        ]
      },
      {
        type: '季节性敏感肌',
        description: '特定季节（如冬季或换季时期）出现的敏感状态',
        symptoms: ['季节交替时皮肤泛红发痒', '冬季易出现干燥紧绷', '夏季易出现油光和敏感'],
        carePoints: [
          '根据季节调整护肤程序', 
          '冬季增加保湿步骤', 
          '夏季注重控油和防晒'
        ],
        recommendProducts: [
          {
            name: 'HBN视黄醇精华乳2.0双a醇乳液',
            price: '￥199',
            description: '四季适用，调节肌肤水油平衡',
            imageUrl: 'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01KH33QL1OEk49dAfJU-2204177871674.jpg_.webp',
            videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/2.mp4'
          }
        ]
      }
    ],
    
    // 护理步骤
    careSteps: [
      {
        title: '温和清洁',
        content: '使用酸碱度接近皮肤的弱酸性洁面产品，避免洗面奶起泡过多，水温不宜过热，洗脸时间控制在1分钟内。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/敏感肌肤全攻略/温和清洁.png'
      },
      {
        title: '充分保湿',
        content: '敏感肌肤需要更多保湿，可使用HBN发光水进行日常保湿，必要时可湿敷加强补水，提升肌肤屏障功能。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/敏感肌肤全攻略/充分保湿.png'
      },
      {
        title: '修护受损屏障',
        content: '使用HBN视黄醇精华乳2.0，其温和配方可修复受损肌肤屏障，减少敏感反应，改善肌肤耐受性。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/敏感肌肤全攻略/维护受损屏障.png'
      },
      {
        title: '防晒防护',
        content: '选择物理防晒霜，避免含有香精、酒精等刺激成分的防晒产品，室内也要做好防晒工作。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/敏感肌肤全攻略/防嗮保护.png'
      }
    ],
    
    // 注意事项
    precautions: [
      {
        title: '避免刺激成分',
        content: '避免使用含有酒精、香料、色素、水杨酸等刺激性成分的产品，选择标注为"适合敏感肌肤"的产品。'
      },
      {
        title: '简化护肤流程',
        content: '敏感肌应减少护肤步骤，以"洁面+保湿+防晒"为基础，避免过度护肤导致肌肤负担。'
      },
      {
        title: '新产品先测试',
        content: '使用新产品前应先在耳后或手臂内侧进行局部测试，确认无不适反应后再使用。'
      },
      {
        title: '避免频繁换产品',
        content: '找到适合自己的护肤品后应坚持使用，频繁更换产品容易引起肌肤不适应。'
      }
    ],
    
    // 推荐产品
    relatedProducts: [
      {
        id: 1,
        name: 'HBN视黄醇精华乳2.0双a醇乳液',
        price: '￥199',
        originalPrice: '￥289',
        description: '修护敏感肌肤屏障，减少刺激反应',
        imageUrl: 'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01KH33QL1OEk49dAfJU-2204177871674.jpg_.webp',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/2.mp4'
      },
      {
        id: 2,
        name: 'HBN发光水α-熊果苷精粹水2.0',
        price: '￥129',
        originalPrice: '￥199',
        description: '温和保湿，适合敏感肌日常使用',
        imageUrl: 'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01FRNyop1OEk4Fglmu9-2204177871674.jpg_.webp',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/1.mp4'
      },
      {
        id: 3,
        name: 'HBN视黄醇精华乳2.0',
        price: '￥199',
        originalPrice: '￥289',
        description: '温和修护配方，缓解肌肤不适',
        imageUrl: 'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01KH33QL1OEk49dAfJU-2204177871674.jpg_.webp',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/3.mp4'
      }
    ]
  },

  onLoad: function (options) {
    console.log('敏感肌护肤全攻略页面加载成功');
    
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
    // 如果视频播放错误，显示封面图片
  },
  
  // 监听页面滚动
  onPageScroll: function(e) {
    // 滚动超过100rpx时，导航栏变为不透明
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
      path: '/pages/strategyDetail/sensitiveSkin/sensitiveSkin',
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