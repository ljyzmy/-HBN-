// pages/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpCategories: [
      {
        id: 1,
        title: '常见问题',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/帮助中心.png',
        questions: [
          {
            id: 101,
            question: '如何下单购买产品？',
            answer: '您可以在产品详情页面点击"加入购物车"或"立即购买"按钮，然后根据页面提示完成购买流程。',
            expanded: false
          },
          {
            id: 102,
            question: '支持哪些支付方式？',
            answer: '目前支持微信支付、余额支付和礼品卡支付等多种方式。',
            expanded: false
          },
          {
            id: 103,
            question: '订单如何取消？',
            answer: '在订单发货前，您可以在"我的订单"中找到待发货订单，点击"取消订单"按钮并选择取消原因即可。',
            expanded: false
          },
          {
            id: 104,
            question: '商品何时发货？',
            answer: '正常情况下，我们会在您付款成功后48小时内发货（节假日除外）。如遇特殊情况，我们会通过站内信或微信通知您。',
            expanded: false
          }
        ]
      },
      {
        id: 2,
        title: '订单相关',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/待付款.png',
        questions: [
          {
            id: 201,
            question: '如何查询订单状态？',
            answer: '您可以在"个人中心"->"我的订单"中查看所有订单状态，包括待付款、待发货、待收货和已完成等。',
            expanded: false
          },
          {
            id: 202,
            question: '订单显示已发货，但没收到物流更新？',
            answer: '订单发货后，物流信息可能会有1-2天的延迟更新，请您耐心等待。如超过3天仍未更新，请联系客服处理。',
            expanded: false
          },
          {
            id: 203,
            question: '收到商品后如何确认收货？',
            answer: '您可以在"我的订单"->"待收货"中找到相应订单，点击"确认收货"按钮即可。系统默认超过15天自动确认收货。',
            expanded: false
          }
        ]
      },
      {
        id: 3,
        title: '退款/售后',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/售后.png',
        questions: [
          {
            id: 301,
            question: '如何申请退款？',
            answer: '您可以在"我的订单"中找到相应订单，点击"申请退款"按钮，填写退款原因并上传相关凭证，提交后等待审核。',
            expanded: false
          },
          {
            id: 302,
            question: '退款多久能到账？',
            answer: '退款申请审核通过后，原路退回的资金将在1-7个工作日内到账，具体时间取决于您的支付方式和银行处理时间。',
            expanded: false
          },
          {
            id: 303,
            question: '商品有质量问题怎么办？',
            answer: '如果您收到的商品有质量问题，请在收货后48小时内联系客服并提供相关照片证明，我们会为您安排退换货事宜。',
            expanded: false
          },
          {
            id: 304,
            question: '退换货运费谁承担？',
            answer: '因商品质量问题产生的退换货，运费由商家承担；因个人原因申请退换货，运费由买家承担。',
            expanded: false
          }
        ]
      },
      {
        id: 4,
        title: '会员积分',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/个人资料.png',
        questions: [
          {
            id: 401,
            question: '如何成为会员？',
            answer: '当您首次下单并完成支付后，系统会自动为您注册成为会员，您可以在"个人中心"查看会员等级和积分情况。',
            expanded: false
          },
          {
            id: 402,
            question: '积分如何获取？',
            answer: '您可以通过购物、评价、分享等方式获取积分。一般情况下，消费1元可获得1积分。',
            expanded: false
          },
          {
            id: 403,
            question: '积分可以做什么用？',
            answer: '积分可以在商城兑换礼品、抵扣订单金额、参与特定活动等。具体兑换规则可在"积分商城"中查看。',
            expanded: false
          },
          {
            id: 404,
            question: '积分会过期吗？',
            answer: '积分有效期为一年，自获取当日起计算。临近过期前，我们会通过消息提醒您及时使用。',
            expanded: false
          }
        ]
      },
      {
        id: 5,
        title: '关于HBN',
        icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/关于我们.png',
        questions: [
          {
            id: 501,
            question: 'HBN的品牌理念是什么？',
            answer: 'HBN的品牌理念是"让真功效名副其实"，我们专注于成分科学，致力于为消费者提供真实有效的护肤方案，解决肌肤问题。',
            expanded: false
          },
          {
            id: 502,
            question: 'HBN产品是否进行动物测试？',
            answer: 'HBN坚决反对动物测试。我们所有产品均通过人体临床测试和先进的体外检测技术来保证安全有效。',
            expanded: false
          },
          {
            id: 503,
            question: '产品如何确保安全性？',
            answer: 'HBN所有产品均经过严格的安全评估和皮肤耐受性测试，配方温和且有效，适合敏感肌肤使用。',
            expanded: false
          }
        ]
      }
    ],
    searchValue: '',
    searchResults: [],
    activeCategory: 0,
    isSearching: false
  },

  /**
   * 点击展开或收起问题
   */
  toggleQuestion(e) {
    const { categoryIndex, questionIndex } = e.currentTarget.dataset;
    const key = `helpCategories[${categoryIndex}].questions[${questionIndex}].expanded`;
    const currentValue = this.data.helpCategories[categoryIndex].questions[questionIndex].expanded;
    
    this.setData({
      [key]: !currentValue
    });
  },

  /**
   * 切换分类
   */
  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeCategory: index
    });
  },

  /**
   * 搜索问题
   */
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    });
    
    if (e.detail.value.trim() === '') {
      this.setData({
        isSearching: false,
        searchResults: []
      });
    }
  },

  /**
   * 执行搜索
   */
  doSearch() {
    const keyword = this.data.searchValue.trim();
    if (keyword === '') {
      this.setData({
        isSearching: false,
        searchResults: []
      });
      return;
    }
    
    // 搜索所有分类中的问题
    let results = [];
    this.data.helpCategories.forEach((category, categoryIndex) => {
      category.questions.forEach((question, questionIndex) => {
        if (question.question.includes(keyword) || question.answer.includes(keyword)) {
          results.push({
            ...question,
            categoryName: category.title,
            categoryIndex,
            questionIndex
          });
        }
      });
    });
    
    this.setData({
      searchResults: results,
      isSearching: true
    });
  },

  /**
   * 清除搜索
   */
  clearSearch() {
    this.setData({
      searchValue: '',
      isSearching: false,
      searchResults: []
    });
  },

  /**
   * 从搜索结果中点击问题
   */
  handleSearchResultClick(e) {
    const { categoryIndex, questionIndex } = e.currentTarget.dataset;
    
    // 切换到对应分类并展开问题
    this.setData({
      activeCategory: categoryIndex,
      isSearching: false,
      searchValue: '',
      [`helpCategories[${categoryIndex}].questions[${questionIndex}].expanded`]: true
    });
  },

  /**
   * 联系客服
   */
  contactCustomerService() {
    wx.showToast({
      title: '正在接入客服',
      icon: 'loading',
      duration: 1000,
      success: () => {
        setTimeout(() => {
          // 如果有客服系统，在这里调用
          wx.showToast({
            title: '客服接入成功',
            icon: 'success'
          });
        }, 1000);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 如果从其他页面带有关键词参数跳转过来，自动搜索
    if (options.keyword) {
      this.setData({
        searchValue: options.keyword
      });
      this.doSearch();
    }
    
    // 如果指定了分类，自动切换到该分类
    if (options.category) {
      const categoryIndex = this.data.helpCategories.findIndex(
        item => item.id === parseInt(options.category)
      );
      if (categoryIndex !== -1) {
        this.setData({
          activeCategory: categoryIndex
        });
      }
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
      title: 'HBN护肤品帮助中心',
      path: '/pages/help/help'
    };
  }
}) 