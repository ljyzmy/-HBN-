// pages/ingredients/search.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    searching: false,
    searchHistory: [],
    popularIngredients: [
      { name: '玻尿酸', category: '保湿', safetyLevel: 1, description: '保湿成分，能够锁住水分' },
      { name: '烟酰胺', category: '美白', safetyLevel: 1, description: '能够改善暗沉，美白肌肤' },
      { name: '视黄醇', category: '抗老', safetyLevel: 2, description: '有效抗衰老成分，促进胶原蛋白生成' },
      { name: '水杨酸', category: '祛痘', safetyLevel: 2, description: '化学性去角质成分，疏通毛孔' },
      { name: '乙基维A醇', category: '抗老', safetyLevel: 2, description: '视黄醇衍生物，刺激性较小' },
      { name: '甘草酸二钾', category: '舒缓', safetyLevel: 1, description: '舒缓镇静成分，缓解肌肤泛红' }
    ],
    ingredientResult: null,
    categories: ['保湿', '美白', '抗老', '祛痘', '舒缓', '防晒'],
    safetyLevels: [
      { level: 1, description: '安全', color: '#618a49' },
      { level: 2, description: '一般安全', color: '#e6a23c' },
      { level: 3, description: '慎用', color: '#f56c6c' },
      { level: 4, description: '不推荐', color: '#ff4949' }
    ],
    ingredientsDatabase: [
      { 
        name: '玻尿酸', 
        englishName: 'Hyaluronic Acid',
        alias: ['透明质酸', 'HA', 'Sodium Hyaluronate'],
        category: '保湿', 
        safetyLevel: 1, 
        description: '保湿成分，能够锁住水分，是皮肤中天然存在的成分。一个玻尿酸分子可以结合多达1000倍于自身重量的水分子，为皮肤提供丰富的水分。',
        benefits: ['强效保湿', '改善皮肤纹理', '提升皮肤弹性'],
        suitableSkinTypes: ['所有肤质', '特别适合干性和缺水肌肤'],
        usage: '早晚均可使用，通常作为精华使用，也可在保湿产品中找到。',
        cautions: '无特别注意事项，几乎不会引起过敏或刺激。',
        commonProducts: ['精华液', '面霜', '爽肤水']
      },
      { 
        name: '烟酰胺', 
        englishName: 'Niacinamide',
        alias: ['维生素B3', 'Vitamin B3', '尼克酰胺'],
        category: '美白', 
        safetyLevel: 1, 
        description: '多功能活性成分，能够改善暗沉，美白肌肤，减少痘印，控油，增强肌肤屏障功能。',
        benefits: ['改善肤色不均', '减少黑色素沉淀', '调节皮脂分泌', '缩小毛孔', '抗炎'],
        suitableSkinTypes: ['所有肤质', '特别适合油性和混合性肤质'],
        usage: '早晚均可使用，建议浓度在2%-5%之间。',
        cautions: '较少引起皮肤刺激，但建议从低浓度开始使用。',
        commonProducts: ['精华液', '面霜', '爽肤水']
      },
      { 
        name: '视黄醇', 
        englishName: 'Retinol',
        alias: ['维生素A醇', 'Vitamin A'],
        category: '抗老', 
        safetyLevel: 2, 
        description: '有效抗衰老成分，促进胶原蛋白生成，加速细胞更新，减少细纹和皱纹。',
        benefits: ['促进皮肤更新', '减少细纹和皱纹', '改善肤色不均', '减少痘痘和痘印'],
        suitableSkinTypes: ['正常皮肤', '成熟皮肤', '痘痘皮肤'],
        usage: '建议晚间使用，初次使用建议每周2-3次，逐渐增加至每晚使用。',
        cautions: '可能引起皮肤干燥、刺痛和脱皮，使用期间需加强保湿和防晒。孕妇禁用。',
        commonProducts: ['精华液', '面霜']
      },
      { 
        name: '水杨酸', 
        englishName: 'Salicylic Acid',
        alias: ['BHA', '贝他羟基酸'],
        category: '祛痘', 
        safetyLevel: 2, 
        description: '油溶性去角质成分，能够深入毛孔清洁，溶解堵塞物，预防和治疗痘痘。',
        benefits: ['深层清洁毛孔', '溶解油脂堵塞', '减少黑头和粉刺', '控油'],
        suitableSkinTypes: ['油性皮肤', '混合性皮肤', '痘痘皮肤'],
        usage: '建议从低浓度开始（0.5%-2%），每周使用2-3次。',
        cautions: '可能引起皮肤干燥和轻微刺激，使用后需加强保湿和防晒。孕妇慎用。',
        commonProducts: ['精华液', '爽肤水', '洁面产品']
      },
      { 
        name: '甘草酸二钾', 
        englishName: 'Dipotassium Glycyrrhizate',
        alias: ['甘草提取物'],
        category: '舒缓', 
        safetyLevel: 1, 
        description: '从甘草根中提取的成分，具有显著的抗炎和舒缓作用，能够缓解肌肤泛红和刺激。',
        benefits: ['舒缓肌肤', '减轻炎症', '抗敏感', '抗氧化'],
        suitableSkinTypes: ['敏感肌肤', '红血丝肌肤', '受损肌肤'],
        usage: '早晚均可使用，特别适合敏感期和修复期使用。',
        cautions: '较少引起过敏反应，但有甘草过敏史者应避免使用。',
        commonProducts: ['舒缓面膜', '修复精华', '舒缓喷雾']
      }
    ],
    showResult: false
  },

  /**
   * 处理搜索框输入
   */
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  /**
   * 清除输入框内容
   */
  clearInput() {
    this.setData({
      searchValue: ''
    });
  },

  /**
   * 执行搜索
   */
  doSearch() {
    const searchValue = this.data.searchValue.trim();
    if (!searchValue) {
      return;
    }

    // 将搜索词添加到历史记录
    let history = this.data.searchHistory;
    if (!history.includes(searchValue)) {
      history.unshift(searchValue);
      if (history.length > 10) {
        history = history.slice(0, 10);
      }
      wx.setStorageSync('ingredientSearchHistory', history);
    }

    this.setData({
      searching: true,
      searchHistory: history
    });

    // 在数据库中查找成分
    this.searchIngredient(searchValue);
  },

  /**
   * 从历史记录中搜索
   */
  searchFromHistory(e) {
    const searchValue = e.currentTarget.dataset.keyword;
    this.setData({
      searchValue: searchValue
    });
    this.searchIngredient(searchValue);
  },

  /**
   * 从热门成分中搜索
   */
  searchPopular(e) {
    const index = e.currentTarget.dataset.index;
    const ingredient = this.data.popularIngredients[index];
    
    this.setData({
      searchValue: ingredient.name
    });
    
    this.searchIngredient(ingredient.name);
  },

  /**
   * 在数据库中搜索成分
   */
  searchIngredient(keyword) {
    const db = this.data.ingredientsDatabase;
    let found = null;

    for (let i = 0; i < db.length; i++) {
      const item = db[i];
      if (item.name === keyword || 
          (item.alias && item.alias.includes(keyword)) || 
          item.englishName === keyword) {
        found = item;
        break;
      }
    }

    if (found) {
      this.setData({
        ingredientResult: found,
        showResult: true,
        searching: false
      });
    } else {
      // 找不到精确匹配，尝试模糊匹配
      let matches = [];
      for (let i = 0; i < db.length; i++) {
        const item = db[i];
        if (item.name.includes(keyword) || 
            item.englishName.includes(keyword) || 
            (item.alias && item.alias.some(a => a.includes(keyword)))) {
          matches.push(item);
        }
      }

      if (matches.length > 0) {
        // 找到部分匹配
        this.setData({
          ingredientResult: matches[0],  // 显示第一个匹配的结果
          showResult: true,
          searching: false
        });
      } else {
        // 无匹配结果
        wx.showToast({
          title: '未找到该成分',
          icon: 'none'
        });
        this.setData({
          showResult: false,
          searching: false
        });
      }
    }
  },

  /**
   * 清除搜索历史
   */
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清除搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            searchHistory: []
          });
          wx.setStorageSync('ingredientSearchHistory', []);
        }
      }
    });
  },

  /**
   * 返回搜索
   */
  backToSearch() {
    this.setData({
      showResult: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载搜索历史
    const history = wx.getStorageSync('ingredientSearchHistory') || [];
    this.setData({
      searchHistory: history
    });
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

  }
}) 