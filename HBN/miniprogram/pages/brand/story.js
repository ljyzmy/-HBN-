// pages/brand/story.js
Page({
  data: {
    // 品牌轮播图
    banners: [
      {
        id: 1,
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/品牌故事/制作主题图片.png',
        title: '匠心独运',
      },
      {
        id: 2,
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/品牌故事/介绍瀑布及生成瀑布图片.png',
        title: '极致之美',
      },
      {
        id: 3,
        imageUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/品牌故事/矿脉质感与象征.png',
        title: '永恒质感',
      }
    ],
    // 创始人信息
    founder: {
      name: '姚哲男',
      title: 'HBN品牌创始人',
      avatar: 'https://bkimg.cdn.bcebos.com/pic/8cb1cb1349540923dd5439ed8b01c609b3de9c82e355?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536',
      quote: '让"真功效"名副其实，专研成分，对抗肌肤老化，是我们不变的追求。'
    },
    // 品牌历程
    timeline: [
      { year: '2010', event: 'HBN品牌创立，首家实体店在北京开业' },
      { year: '2012', event: '推出首个抗老化系列产品，获得行业一致好评' },
      { year: '2015', event: '全球研发中心在瑞士成立，与多所知名院校建立研发合作' },
      { year: '2018', event: '全线产品配方升级，推出"真功效"理念' },
      { year: '2021', event: '进军国际市场，在巴黎、东京设立旗舰店' },
      { year: '2022', event: '联合Discovery探索频道创作国内首支抗老主题纪录片《肌肤衰老的秘密》' },
      { year: '2023', event: '联合广东省化妆品学会、江南大学化妆品创新中心发布《原生白护肤白皮书》' },
      { year: '2023', event: '与江南大学共建"化妆品功能分子创新联合实验室"' },
      { year: '2023', event: '与厦门大学共建"皮肤生物医学联合研究中心"' },
      { year: '2024', event: '央广网特别策划"求真计划"上线，揭示HBN咖啡因眼霜背后的科研实力' },
      { year: '2024', event: '成功备案首个特色植物新原料——两色金鸡菊花提取物' },
      { year: '2024', event: '联合《中国妇女报》共同打造公益短片《她的成长故事——求真的决意II》' }
    ],
    // 品牌价值观
    values: [
      { id: 1, title: '真实', desc: '拒绝虚假宣传，只做真功效', icon: '	cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/品牌故事/真实.png' },
      { id: 2, title: '专业', desc: '严格科学测试，专注肌肤健康', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/品牌故事/专业.png' },
      { id: 3, title: '创新', desc: '不断突破界限，追求卓越品质', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/品牌故事/创新.png' },
      { id: 4, title: '责任', desc: '环保配方，尊重自然与生命', icon: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/品牌故事/责任.png' }
    ],
    // 品牌荣誉
    awards: [
      { id: 1, title: '荣获沙利文权威认证"中国A醇护肤品销量第一"', year: '2025', logo: 'https://dss3.baidu.com/-rVXeDTa2gU2pMbgoY3K/it/u=167524564,3853844092&fm=202' },
      { id: 2, title: '荣获沙利文权威认证"中国精华水销量第一"', year: '2025', logo: 'https://dss3.baidu.com/-rVXeDTa2gU2pMbgoY3K/it/u=167524564,3853844092&fm=202' },
      { id: 3, title: '荣登"胡润中国美妆新势力品牌TOP10', year: '2025', logo: 'https://res.hurun.net/image/20240905/20240905090357606.jpg' }
    ],
    currentBanner: 0
  },

  onLoad() {
    this.loadCloudImages();
  },

  // 加载云存储图片
  loadCloudImages() {
    // 加载banner图片
    this.data.banners.forEach((banner, index) => {
      wx.cloud.getTempFileURL({
        fileList: [banner.imageUrl],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `banners[${index}].imageUrl`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });

    // 加载创始人头像
    wx.cloud.getTempFileURL({
      fileList: [this.data.founder.avatar],
      success: res => {
        if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
          this.setData({
            'founder.avatar': res.fileList[0].tempFileURL
          });
        }
      }
    });

    // 加载价值观图标
    this.data.values.forEach((value, index) => {
      wx.cloud.getTempFileURL({
        fileList: [value.icon],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `values[${index}].icon`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });

    // 加载奖项图标
    this.data.awards.forEach((award, index) => {
      wx.cloud.getTempFileURL({
        fileList: [award.logo],
        success: res => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            const tempPath = `awards[${index}].logo`;
            this.setData({
              [tempPath]: res.fileList[0].tempFileURL
            });
          }
        }
      });
    });
  },

  // 轮播图变化事件
  onBannerChange(e) {
    this.setData({
      currentBanner: e.detail.current
    });
  },

  // 点击查看大图
  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      urls: this.data.banners.map(banner => banner.imageUrl),
      current: url
    });
  },
  
  // 观看品牌视频
  watchBrandVideo() {
    wx.navigateTo({
      url: '/pages/brand/video'
    });
  },
  
  // 查看更多品牌资讯
  viewMoreNews() {
    wx.navigateTo({
      url: '/pages/brand/news'
    });
  },
  
  // 联系我们
  contactUs() {
    wx.navigateTo({
      url: '/pages/brand/contact'
    });
  }
}) 