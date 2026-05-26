Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/默认头像.png',
      nickName: '默认用户',
      gender: '未设置', // 性别
      birthday: '未设置', // 生日
      phone: '未设置', // 电话号
      email: '未设置', // 邮箱
      region: ['未设置', '', ''] // 地区 [省, 市, 区]
    },
    genderOptions: ['男', '女', '未设置'],
    showGenderPicker: false, // 是否显示性别选择框
    showBirthdayPicker: false, // 是否显示生日选择框
    showRegionPicker: false, // 是否显示地区选择框
    currentDate: new Date().getTime(), // 当前日期
    tempInfo: {}, // 临时存放的信息
    isEditing: false, // 是否正在编辑
    isLogged: false, // 是否已登录
    showProfilePicker: false, // 是否显示用户画像选择器
    currentProfile: 0, // 当前选择的用户画像
    
    // 个人信息项
    profileItems: [
      { key: 'nickName', label: '昵称', type: 'text' },
      { key: 'gender', label: '性别', type: 'picker' },
      { key: 'birthday', label: '生日', type: 'date' },
      { key: 'phone', label: '电话号', type: 'text' },
      { key: 'email', label: '邮箱', type: 'text' },
      { key: 'region', label: '地区', type: 'region' }
    ],

    // HBN三种用户画像
    userProfiles: [
      {
        id: 1,
        name: '职场精英女性',
        info: {
          avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/头像/职场精英女性.jpg',
          nickName: '陈敏',
          gender: '女',
          birthday: '1990-05-15',
          phone: '13812345678',
          email: 'chenmin@company.com',
          region: ['上海市', '上海市', '浦东新区'],
          occupation: '跨国公司中层管理者',
          income: '月收入15000-30000元',
          lifestyle: [
            '工作时间长，经常加班到晚上9点以后',
            '周末会安排SPA、瑜伽等自我放松活动',
            '社交活动频繁，重视个人形象管理',
            '喜欢通过小红书、B站等平台学习专业护肤知识',
            '每季度会固定购买护肤产品，愿意为有效产品持续投资'
          ],
          painPoints: [
            '发现眼角出现细纹，面部有轻微下垂感',
            '肌肤开始失去弹性，熬夜后暗沉明显'
          ],
          purchaseBehavior: '会详细研究产品成分和临床报告，重视专业评测',
          decisionFactors: ['性价比', '功效验证', '品牌专业度'],
          infoSources: ['美妆博主测评', '专业医美平台', '朋友推荐'],
          brandNeeds: [
            '需要能有效对抗初老迹象的产品，特别是淡化细纹、提亮肤色',
            '追求有科学依据的护肤方案，不盲目追随网红产品',
            '希望产品操作简单高效，适合快节奏生活',
            '偏好"早C晚A2.0套组"这类系统性解决方案'
          ],
          memberLevel: '铂金会员',
          purchaseHistory: [
            { date: '2023-11-15', product: '早C晚A2.0套组', price: '¥1280' },
            { date: '2023-08-22', product: '多肽紧致精华液', price: '¥680' },
            { date: '2023-06-10', product: '焕能修护面霜', price: '¥520' }
          ]
        }
      },
      {
        id: 2,
        name: '都市新锐青年',
        info: {
          avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/头像/都市新锐青年.webp',
          nickName: '李阳',
          gender: '男',
          birthday: '1997-08-23',
          phone: '13923456789',
          email: 'liyang@creative.com',
          region: ['北京市', '北京市', '朝阳区'],
          occupation: '新媒体行业从业者',
          income: '月收入8000-15000元',
          lifestyle: [
            '社交媒体活跃用户，热衷分享生活点滴',
            '注重个人形象，愿意尝试新品牌和新产品',
            '生活规律不稳定，经常熬夜完成工作',
            '崇尚小确幸，偏好网红美食和潮流店铺',
            '对国货品牌持开放态度，但要求品质不输国际品牌'
          ],
          painPoints: [
            '皮肤泛黄暗沉，熬夜后肌肤状态差',
            '开始担忧初老问题'
          ],
          purchaseBehavior: '受社交媒体影响大，会被高评价产品吸引',
          decisionFactors: ['品牌调性', '使用体验', '视觉包装', '产品口碑'],
          infoSources: ['小红书', '抖音', '微博等社交平台'],
          brandNeeds: [
            '追求即时提亮效果，改善暗沉肤色',
            '希望产品有好的质地和使用体验，适合拍照分享',
            '寻找性价比高且有实际功效的产品',
            '偏好"明星发光水"等能快速改善肤质的单品'
          ],
          memberLevel: '黄金会员',
          purchaseHistory: [
            { date: '2023-12-05', product: '明星发光水', price: '¥360' },
            { date: '2023-10-18', product: '维C亮肤精华', price: '¥420' },
            { date: '2023-09-01', product: '多效保湿面膜', price: '¥168' }
          ]
        }
      },
      {
        id: 3,
        name: '科研工作者',
        info: {
          avatarUrl: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/头像/科研工作者.jpeg',
          nickName: '张博',
          gender: '男',
          birthday: '1986-12-10',
          phone: '13734567890',
          email: 'zhangbo@research.edu',
          region: ['广东省', '深圳市', '南山区'],
          occupation: '医药研发/高校教师',
          income: '月收入20000-35000元',
          lifestyle: [
            '工作强度大，经常面对电脑屏幕超过10小时',
            '生活理性务实，重视健康与科学',
            '消费谨慎，会详细研究产品成分和原理',
            '喜欢参加专业讲座和学习活动',
            '注重长期投资，包括健康和个人形象管理'
          ],
          painPoints: [
            '长期用眼疲劳导致眼周问题突出',
            '黑眼圈、眼袋、细纹同时存在'
          ],
          purchaseBehavior: '注重产品成分和科学依据，不轻信广告宣传',
          decisionFactors: ['专业背书', '成分配方', '临床实验数据'],
          infoSources: ['学术论文', '专业评测网站', '权威机构报告'],
          brandNeeds: [
            '需要有实际功效的眼部护理产品，特别是能改善多种眼周问题',
            '重视产品的科研背景和成分创新',
            '希望了解产品作用机制和实际效果数据',
            '偏好"咖啡因紧致修护眼霜"等有专业背书的产品',
            '欣赏品牌登入国际SCI的研究成果和权威第三方人体功效检测'
          ],
          memberLevel: '钻石会员',
          purchaseHistory: [
            { date: '2023-12-20', product: '咖啡因紧致修护眼霜', price: '¥580' },
            { date: '2023-11-05', product: '多肽修复精华', price: '¥860' },
            { date: '2023-09-28', product: '科研级面部精华套装', price: '¥1480' }
          ]
        }
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkLoginStatus();
    this.getUserInfo();
    
    // 获取当前选择的用户画像
    const profileId = options.profileId || wx.getStorageSync('currentProfileId');
    if (profileId) {
      this.switchUserProfile(profileId);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.checkLoginStatus();
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
    this.getUserInfo();
    wx.stopPullDownRefresh();
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

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    // 始终设为已登录状态以便查看用户画像
    this.setData({
      isLogged: true
    });
    wx.setStorageSync('isLogged', true);
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...userInfo
        }
      });
    }
  },

  /**
   * 切换用户画像
   */
  switchUserProfile(e) {
    const profileId = e && e.currentTarget ? e.currentTarget.dataset.profileId : e;
    const profile = this.data.userProfiles.find(p => p.id == profileId);
    if (profile) {
      // 更新用户信息
      this.setData({
        userInfo: {
          ...this.data.userInfo,
          ...profile.info
        },
        currentProfile: profileId - 1
      });
      
      // 保存当前用户画像ID到本地存储
      wx.setStorageSync('currentProfileId', profileId);
      wx.setStorageSync('userInfo', profile.info);
      
      wx.showToast({
        title: '画像切换成功',
        icon: 'success',
        duration: 1500
      });
    }
  },

  /**
   * 打开用户画像选择器
   */
  openProfilePicker() {
    this.setData({
      showProfilePicker: true
    });
  },

  /**
   * 关闭用户画像选择器
   */
  closeProfilePicker() {
    this.setData({
      showProfilePicker: false
    });
  },

  /**
   * 确认用户画像选择
   */
  confirmProfilePicker(e) {
    const index = e.currentTarget.dataset.index;
    const profileId = this.data.userProfiles[index].id;
    this.switchUserProfile(profileId);
    this.setData({
      showProfilePicker: false
    });
  },

  /**
   * 开始编辑
   */
  startEditing() {
    this.setData({
      isEditing: true,
      tempInfo: JSON.parse(JSON.stringify(this.data.userInfo)) // 备份当前用户信息为临时数据
    });
  },

  /**
   * 保存个人信息
   */
  saveProfile() {
    // 这里应该是保存到服务器的逻辑
    // 模拟上传到服务器中
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    
    setTimeout(() => {
      wx.setStorageSync('userInfo', this.data.tempInfo);
      
      this.setData({
        userInfo: this.data.tempInfo,
        isEditing: false
      });
      
      wx.hideLoading();
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    }, 800);
  },

  /**
   * 取消编辑
   */
  cancelEditing() {
    this.setData({
      isEditing: false,
      tempInfo: {}
    });
  },

  /**
   * 处理输入框的值
   */
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    this.setData({
      [`tempInfo.${field}`]: value
    });
  },

  /**
   * 更新头像
   */
  updateAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 模拟上传图片的过程中，实际应该上传到云存储
        wx.showLoading({
          title: '上传中...',
          mask: true
        });
        
        setTimeout(() => {
          this.setData({
            'tempInfo.avatarUrl': tempFilePath
          });
          
          wx.hideLoading();
        }, 1000);
      }
    });
  },

  /**
   * 打开性别选择框
   */
  openGenderPicker() {
    if (this.data.isEditing) {
      this.setData({
        showGenderPicker: true
      });
    }
  },

  /**
   * 关闭性别选择框
   */
  closeGenderPicker() {
    this.setData({
      showGenderPicker: false
    });
  },

  /**
   * 确认性别选择
   */
  confirmGenderPicker(e) {
    const gender = this.data.genderOptions[e.detail.value];
    this.setData({
      'tempInfo.gender': gender,
      showGenderPicker: false
    });
  },

  /**
   * 打开生日选择框
   */
  openBirthdayPicker() {
    if (this.data.isEditing) {
      this.setData({
        showBirthdayPicker: true
      });
    }
  },

  /**
   * 关闭生日选择框
   */
  closeBirthdayPicker() {
    this.setData({
      showBirthdayPicker: false
    });
  },

  /**
   * 确认生日选择
   */
  confirmBirthdayPicker(e) {
    const date = new Date(e.detail.value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const birthday = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    this.setData({
      'tempInfo.birthday': birthday,
      showBirthdayPicker: false
    });
  },

  /**
   * 打开地区选择框
   */
  openRegionPicker() {
    if (this.data.isEditing) {
      this.setData({
        showRegionPicker: true
      });
    }
  },

  /**
   * 地区选择框变更
   */
  bindRegionChange(e) {
    this.setData({
      'tempInfo.region': e.detail.value,
      showRegionPicker: false
    });
  },

  /**
   * 跳转到登录页面
   */
  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  }
}) 