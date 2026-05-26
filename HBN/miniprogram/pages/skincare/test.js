// pages/skincare/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    currentStep: 0, // 当前问题步骤
    totalSteps: 6, // 总问题数量
    progress: 0, // 进度百分比
    
    // 问题数组
    questions: [
      {
        title: '您的基本肤质是？',
        options: ['干性', '油性', '中性', '混合型', '敏感性'],
        selected: -1,
        multiSelect: false
      },
      {
        title: '您的肌肤容易出现哪些问题？',
        options: ['干燥紧绷', '出油', '暗沉', '毛孔粗大', '痘痘'],
        multiSelect: false,
        selected: -1
      },
      {
        title: '您的肌肤是否有细纹问题？',
        options: ['几乎没有', '眼周有轻微细纹', '面部有明显细纹', '有较深纹路'],
        selected: -1,
        multiSelect: false
      },
      {
        title: '您的肌肤是否容易过敏？',
        options: ['从不过敏', '偶尔过敏', '季节性过敏', '经常过敏'],
        selected: -1,
        multiSelect: false
      },
      {
        title: '您的护肤重点是什么？',
        options: ['补水保湿', '控油', '美白提亮', '抗老紧致', '舒缓修护'],
        multiSelect: false,
        selected: -1
      },
      {
        title: '您的日常生活环境是？',
        options: ['户外较多', '长期在空调房', '经常熬夜', '压力较大'],
        selected: -1,
        multiSelect: false
      }
    ],
    
    // 分析结果
    result: {
      skinType: '',
      concerns: [],
      recommendation: ''
    },
    
    // 是否显示结果
    showResult: false,
    
    // 分析中状态
    analyzing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
    }
    
    // 初始化所有问题，确保selected都是-1
    let questions = this.data.questions.map(q => {
      q.selected = -1;
      return q;
    });
    
    this.setData({
      questions: questions
    });
    
    // 计算初始进度
    this.calculateProgress();
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
    return {
      title: 'HBN皮肤状态测试',
      path: '/pages/skincare/test'
    };
  },
  
  /**
   * 计算测试进度
   */
  calculateProgress() {
    const progress = Math.floor((this.data.currentStep / this.data.totalSteps) * 100);
    this.setData({
      progress: progress
    });
  },
  
  /**
   * 选择单选题选项
   */
  selectOption(e) {
    const { index } = e.currentTarget.dataset;
    const currentStep = this.data.currentStep;
    const questionKey = `questions[${currentStep}].selected`;
    
    this.setData({
      [questionKey]: index
    });
  },
  
  /**
   * 检查当前步骤是否已作答
   */
  checkCurrentAnswered() {
    const currentQuestion = this.data.questions[this.data.currentStep];
    return currentQuestion.selected !== -1;
  },
  
  /**
   * 前往下一题
   */
  nextStep() {
    // 验证当前题目是否已回答
    if (!this.checkCurrentAnswered()) {
      wx.showToast({
        title: '请先回答当前问题',
        icon: 'none'
      });
      return;
    }
    
    const nextStep = this.data.currentStep + 1;
    
    // 检查是否已经完成所有问题
    if (nextStep >= this.data.totalSteps) {
      // 完成所有问题，开始分析
      this.startAnalysis();
      return;
    }
    
    this.setData({
      currentStep: nextStep
    });
    
    // 重新计算进度
    this.calculateProgress();
  },
  
  /**
   * 返回上一题
   */
  prevStep() {
    if (this.data.currentStep <= 0) {
      return;
    }
    
    this.setData({
      currentStep: this.data.currentStep - 1
    });
    
    // 重新计算进度
    this.calculateProgress();
  },
  
  /**
   * 开始皮肤分析
   */
  startAnalysis() {
    this.setData({
      analyzing: true
    });
    
    // 模拟分析过程，实际项目中可以连接后端API进行分析
    setTimeout(() => {
      // 根据问题答案分析结果
      const result = this.analyzeResults();
      
      this.setData({
        result: result,
        showResult: true,
        analyzing: false
      });
      
      // 存储结果到本地，以便专属护肤方案页面使用
      wx.setStorageSync('skinAnalysisResult', result);
    }, 2000);
  },
  
  /**
   * 分析测试结果
   */
  analyzeResults() {
    const answers = this.data.questions.map(q => q.selected);
    
    // 确定皮肤类型（根据第一题的答案）
    const skinTypes = ['干性', '油性', '中性', '混合型', '敏感性'];
    const skinType = skinTypes[answers[0]];
    
    // 确定肌肤问题（根据第二题的答案 - 现在是单选题）
    const concernOptions = ['干燥紧绷', '出油', '暗沉', '毛孔粗大', '痘痘'];
    let concerns = [];
    
    // 将第二题选项添加到问题列表
    if (answers[1] !== -1) {
      concerns.push(concernOptions[answers[1]]);
    }
    
    // 添加细纹问题
    const wrinkleLevel = answers[2];
    if (wrinkleLevel >= 2) {
      concerns.push('细纹');
    }
    
    // 添加敏感问题
    const sensitiveLevel = answers[3];
    if (sensitiveLevel >= 2) {
      concerns.push('敏感');
    }
    
    // 处理第5题的护肤重点（现在也是单选题）
    const skincareFocus = ['补水保湿', '控油', '美白提亮', '抗老紧致', '舒缓修护'];
    let focusPoints = [];
    
    // 添加护肤重点
    if (answers[4] !== -1) {
      focusPoints.push(skincareFocus[answers[4]]);
    }
    
    // 生成护肤建议
    let recommendation = `针对${skinType}肌肤，`;
    
    // 根据肤质给出基础建议
    if (skinType === '干性') {
      recommendation += '建议重点补水保湿，使用温和不刺激的产品，避免过度清洁导致水分流失。';
    } else if (skinType === '油性') {
      recommendation += '建议注重控油清爽，选择质地轻薄的产品，定期使用深层清洁面膜。';
    } else if (skinType === '混合型') {
      recommendation += '建议T区重点控油，两颊注重保湿，选择平衡型护肤品。';
    } else if (skinType === '敏感性') {
      recommendation += '建议使用低敏无香配方，避免含酒精和香料的产品，注重肌肤屏障修护。';
    } else {
      recommendation += '建议保持均衡护肤，根据季节适当调整产品。';
    }
    
    // 根据具体肌肤问题添加建议
    if (concerns.includes('干燥紧绷')) {
      recommendation += ' 日常使用含玻尿酸、神经酰胺的保湿产品。';
    }
    
    if (concerns.includes('出油')) {
      recommendation += ' 选择控油配方，避免过度清洁导致的反弹出油。';
    }
    
    if (concerns.includes('暗沉')) {
      recommendation += ' 添加含维C、烟酰胺成分的美白产品，注重去角质和防晒。';
    }
    
    if (concerns.includes('细纹')) {
      recommendation += ' 建议使用抗老精华，含有视黄醇、肽类等成分的产品。';
    }
    
    if (concerns.includes('敏感')) {
      recommendation += ' 避免频繁换用新产品，注重舒缓修护。';
    }
    
    // 根据生活环境（最后一题）添加建议
    const lifestyleIndex = answers[5];
    if (lifestyleIndex === 0) { // 户外较多
      recommendation += ' 请务必做好防晒工作，选择SPF30以上的防晒产品，每2-3小时补涂一次。';
    } else if (lifestyleIndex === 1) { // 长期在空调房
      recommendation += ' 可以准备一瓶补水喷雾，随时为肌肤补充水分，避免空调环境引起的干燥。';
    } else if (lifestyleIndex === 2) { // 经常熬夜
      recommendation += ' 重点进行熬夜修护，选择含有抗氧化成分的产品，帮助肌肤对抗自由基损伤。';
    } else if (lifestyleIndex === 3) { // 压力较大
      recommendation += ' 可以尝试含有舒缓成分（如芦荟、洋甘菊）的产品，帮助肌肤舒压。';
    }
    
    // 根据用户关注的护肤重点添加建议
    if (focusPoints.length > 0) {
      recommendation += ` 根据您选择的护肤重点，建议重点关注`;
      
      if (focusPoints.includes('补水保湿')) {
        recommendation += `保湿锁水`;
      }
      
      if (focusPoints.includes('控油')) {
        recommendation += `油脂平衡`;
      }
      
      if (focusPoints.includes('美白提亮')) {
        recommendation += `肤色均匀`;
      }
      
      if (focusPoints.includes('抗老紧致')) {
        recommendation += `紧致弹性`;
      }
      
      if (focusPoints.includes('舒缓修护')) {
        recommendation += `肌肤修护`;
      }
      
      recommendation += `的产品与护理步骤。`;
    }
    
    console.log('皮肤分析结果:', {
      skinType,
      concerns,
      focusPoints,
      recommendation
    });
    
    return {
      skinType,
      concerns,
      recommendation
    };
  },
  
  /**
   * 完成测试，前往护肤方案
   */
  goToSkincarePlan() {
    wx.navigateBack({
      success: () => {
        // 发送事件通知plan页面刷新数据
        const eventChannel = this.getOpenerEventChannel();
        if (eventChannel) {
          eventChannel.emit('updateSkinAnalysis', this.data.result);
        }
      }
    });
  },
  
  /**
   * 重新测试
   */
  restartTest() {
    // 重置所有选项为-1
    const resetQuestions = this.data.questions.map(question => {
      return {
        ...question,
        selected: -1
      };
    });
    
    this.setData({
      questions: resetQuestions,
      currentStep: 0,
      showResult: false,
      progress: 0
    });
    
    // 计算初始进度
    this.calculateProgress();
  }
}) 