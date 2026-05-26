Page({
  data: {
    pageTitle: '如何选择适合的精华乳',
    pageImage: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/护肤品摆拍.png',
    readCount: 1276,
    publishDate: '2023-05-18',
    introduction: '精华乳是护肤程序中的重要一环，它富含高浓度的活性成分，能够针对性解决肌肤问题。选择适合自己的精华乳对护肤效果至关重要。本文将从成分、肤质、季节变化等多个角度，帮助你找到最适合的精华乳。',
    
    // 精华乳类型数据
    serumTypes: [
      {
        type: '保湿型精华乳',
        suitable: '干性、中性肌肤',
        keyIngredients: '透明质酸、海藻糖、神经酰胺、甘油',
        description: '这类精华乳重点提供水分和锁水功能，适合缺水肌肤使用。它们能够深入肌肤底层补水，并形成保护膜防止水分流失，让肌肤持久水润饱满。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/保湿型精华乳.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/保湿型精华乳.mp4',
        recommendProducts: [
          { name: 'B5面霜', id: 201 },
          { name: '厚皮精华', id: 203 }
        ]
      },
      {
        type: '美白淡斑型精华乳',
        suitable: '暗沉、有色斑肌肤',
        keyIngredients: '维生素C、熊果苷、传明酸、烟酰胺',
        description: '这类精华乳含有抑制黑色素生成的成分，能够均匀肤色，淡化色斑，提亮肤色。长期使用能够改善肌肤暗沉，让肌肤焕发光彩。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/抗老紧致精华乳.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/美白淡斑型精华乳.mp4',
        recommendProducts: [
          { name: '原白乳', id: 103 },
          { name: '经典版发光水2.0', id: 101 }
        ]
      },
      {
        type: '抗老紧致型精华乳',
        suitable: '成熟、松弛肌肤',
        keyIngredients: '视黄醇、多肽、胶原蛋白、辅酶Q10',
        description: '这类精华乳含有促进胶原蛋白生成的成分，能够增强肌肤弹性，减少细纹和皱纹，达到紧致提拉的效果。适合初显老化迹象的肌肤使用。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/抗老紧致精华乳.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/抗老紧致型精华乳.mp4',
        recommendProducts: [
          { name: '双A醇精华乳2.0', id: 1 },
          { name: '超A瓶精华', id: 5 }
        ]
      },
      {
        type: '舒缓修护型精华乳',
        suitable: '敏感、泛红肌肤',
        keyIngredients: '积雪草、芦荟、泛醇、洋甘菊',
        description: '这类精华乳具有抗炎、镇静功效，能够迅速舒缓肌肤不适，修复受损肌肤屏障，减少泛红、刺痛等敏感症状，是敏感肌的救星。',
        imageUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/舒缓维护型精华乳.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/如何选择适合的精华乳/舒缓修护型精华乳.mp4',
        recommendProducts: [
          { name: '闪修精华', id: 204 },
          { name: '弹簧霜2.0', id: 202 }
        ]
      }
    ],
    
    // 导航栏透明度
    navTransparent: true
  },

  onLoad() {
    // 更新阅读数
    this.updateReadCount();
  },
  
  // 更新阅读数
  updateReadCount() {
    let newCount = this.data.readCount + 1;
    this.setData({
      readCount: newCount
    });
    
    // 实际应用中，这里应该将更新后的阅读数发送到服务器
    console.log('更新阅读数为:', newCount);
  },
  
  // 页面滚动处理
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    
    // 根据滚动位置动态调整导航栏透明度
    if (scrollTop > 50 && this.data.navTransparent) {
      this.setData({
        navTransparent: false
      });
    } else if (scrollTop <= 50 && !this.data.navTransparent) {
      this.setData({
        navTransparent: true
      });
    }
  },
  
  // 返回上一页
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
  
  // 跳转到产品详情
  goToProduct(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },
  
  // 播放视频处理
  playVideo(e) {
    const index = e.currentTarget.dataset.index;
    const videoContext = wx.createVideoContext(`serum-video-${index}`);
    videoContext.play();
    
    // 暂停其他视频
    this.pauseOtherVideos(index);
  },
  
  // 暂停其他视频
  pauseOtherVideos(currentIndex) {
    for (let i = 0; i < this.data.serumTypes.length; i++) {
      if (i !== currentIndex) {
        const videoContext = wx.createVideoContext(`serum-video-${i}`);
        videoContext.pause();
      }
    }
  },
  
  // 视频错误处理
  handleVideoError(e) {
    console.error('视频加载错误:', e.detail.errMsg);
  }
}) 