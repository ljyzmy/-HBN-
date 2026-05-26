const app = getApp();

Page({
  data: {
    navTransparent: true,
    categoryName: '',
    categoryId: null,
    categoryDesc: '',
    productList: [],
    originalProductList: [], // 保存原始排序的商品数据
    scrollTop: 0,
    currentCategory: 0, // 当前选中的分类
    currentSort: 0, // 当前排序方式：0-综合, 1-销量, 2-价格
    priceSortAsc: true, // 价格排序是否升序
    cartCount: 5, // 购物车商品数量
    
    // 分类列表
    categoryList: [
      { id: 1, name: '抗老紧致', desc: '专研精纯活性成分，精准抵御肌肤老化，赋活肌肤三维支架，重塑饱满年轻轮廓。' },
      { id: 2, name: '美白焕亮', desc: '科学美白配方，温和提亮肤色，改善暗沉不均，焕发肌肤自然光彩，让肌肤绽放健康光泽。' },
      { id: 3, name: '维护保湿', desc: '多层次保湿锁水，强化肌肤水分屏障，提供持久滋润，塑造水润饱满肌肤，舒缓干燥不适。' },
      { id: 4, name: '基础护肤', desc: '温和配方全面清洁调理，平衡肌肤状态，为后续护肤打下坚实基础，满足日常护肤需求。' }
    ],
    
    // 筛选选项
    filters: {
      priceRange: [
        { id: 1, name: '0-199元', selected: false },
        { id: 2, name: '200-399元', selected: false },
        { id: 3, name: '400元以上', selected: false }
      ],
      effect: [
        { id: 1, name: '紧致提拉', selected: false },
        { id: 2, name: '抚平细纹', selected: false },
        { id: 3, name: '淡化皱纹', selected: false },
        { id: 4, name: '修护屏障', selected: false }
      ]
    },
    showFilterPopup: false,
    
    // 添加主题相关数据
    theme: {
      primaryColor: '#a08679',
      accentColor: '#c98c60',
      backgroundColor: '#f9f7f5'
    },
    searchKeyword: '', // 搜索关键词
    searchFocus: false, // 搜索框是否聚焦
    searchResults: [], // 搜索结果
    isSearching: false, // 是否处于搜索状态
    searchHistory: [] // 搜索历史
  },

  onLoad(options) {
    const { categoryId, categoryName } = options;
    const categoryIndex = categoryId ? Number(categoryId) - 1 : 0;
    
    this.setData({
      categoryId: Number(categoryId) || 1,
      categoryName: categoryName || this.data.categoryList[0].name,
      categoryDesc: this.data.categoryList[categoryIndex].desc,
      currentCategory: categoryIndex
    });
    
    // 加载产品数据
    this.loadProductData();
    this.loadSearchHistory();
  },
  
  loadProductData() {
    // 模拟加载中状态
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    
    // 检查全局变量中是否已有商品数据
    if (app.globalData.allProducts && app.globalData.allProducts.length > 0) {
      console.log('从全局变量获取所有商品数据');
      
      // 根据当前分类筛选商品
      let filteredProducts = app.globalData.allProducts.filter(item => item.categoryId === this.data.categoryId);
      
      // 如果全局分类数据中还没有当前分类的数据，保存它
      if (!app.globalData.productsByCategory[this.data.categoryId]) {
        app.setProductsByCategory(this.data.categoryId, filteredProducts);
      }
      
      // 设置当前分类的商品列表
      this.setData({
        productList: filteredProducts,
        originalProductList: [...filteredProducts]
      });
      
      wx.hideLoading();
      return;
    }
    
    // 全局变量中没有数据，创建产品数据
    const products = [
      // 抗老紧致系列的现有产品 (categoryId: 1)
      { 
        id: 1, 
        name: '视黄醇精华乳2.0',
        desc: '多效靶向抗初老¹，卓效紧致焕亮肌肤，28天²改善皱纹、饱满促弹、润泽保湿，紧致+11.8%²，皱纹-25.56%²、光泽+19.06%²',
        price: 189.00,
        originalPrice: 299.00,
        sales: 3399,
        tags: ['多效靶向抗初老', '焕亮肌肤'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/2.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/2.mp4',
        categoryId: 1
      },
      { 
        id: 2, 
        name: '双A醇晚霜2.0',
        desc: '卓效激活胶原，显著抗皱紧致，28天¹皱纹-31.85%¹、弹性+22.67%¹、光泽+22.43%¹',
        price: 299.00,
        originalPrice: 399.00,
        sales: 4217,
        tags: ['卓效激活胶原'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/4.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/4.mp4',
        categoryId: 1
      },
      { 
        id: 3, 
        name: '咖啡因眼霜3.0',
        desc: '直击四大眼周暗沉，焕亮淡纹，即时起效³，12h熬夜通宵使用，即刻眼周光泽+36.43%³，10次最大表情开合，即时眼周皱纹数量-45.90%⁴',
        price: 279.00,
        originalPrice: 329.00,
        sales: 3104,
        tags: ['直击四大眼周暗沉'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/3.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/3.mp4',
        categoryId: 1
      },
      { 
        id: 4, 
        name: '双A醇眼精华2.0',
        desc: '12h淡纹提拉¹ 4周²精修顽固深纹，眼下纹-39.86%² 鱼尾纹-25%² 紧致+21.68%²',
        price: 229.00,
        originalPrice: 398.00,
        sales: 2891,
        tags: ['12h淡纹提拉¹'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/5.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/5.mp4',
        categoryId: 1
      },
      { 
        id: 5, 
        name: '超A瓶精华',
        desc: '源头抗老¹，4周²淡面部八大顽固深纹，卓效紧致抗皱，鱼尾纹-24.39%² 面颊纹-23.19%² 抬头纹-22.57%² 眼下皱纹-32.56%² 眉间纹-12.50%² 木偶纹-18.42%²',
        price: 379.00,
        originalPrice: 479.00,
        sales: 2175,
        tags: ['4周淡面部八大顽固深纹'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/6.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/6.mp4',
        categoryId: 1
      },
      { 
        id: 6, 
        name: '超A晚霜',
        desc: '四重A醇高阶抗老¹，卓效淡纹赋弹，肌肤充盈饱满，28天³皱纹-31.88%³、紧致+16.07%³、弹性+13.78%³',
        price: 369.00,
        originalPrice: 469.00,
        sales: 1965,
        tags: ['四重A醇高阶抗老'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/7.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/7.mp4',
        categoryId: 1
      },
      { 
        id: 7, 
        name: '3A3肽夜光瓶精华水',
        desc: '科研级创新"3A+3肽"，紧致抗皱，靶向对抗顽固老化¹，96.6%²认可改善皱纹、93.3%²认可更加紧致、96.6%²认可提亮肤色',
        price: 199.00,
        originalPrice: 259.00,
        sales: 7823, // 高销量商品
        tags: ['科研级创新"3A+3肽'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/8.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/8.mp4',
        categoryId: 1
      },
      { 
        id: 8, 
        name: '流金瓶精华液',
        desc: '多维温和抗老¹，卓效促胶原、淡纹路，28天⁴皱纹减少高达30.23%⁴、弹性+20.45%⁴、紧致+14.34%⁴',
        price: 229.00,
        originalPrice: 289.00,
        sales: 3562,
        tags: ['深层保湿'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/9.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/9.mp4',
        categoryId: 1
      },
      { 
        id: 9, 
        name: '流金5A面膜',
        desc: '多维"闪充"胶原，淡化动静态纹，卓效紧致弹嫩肌肤，高阶抗老¹BUFF叠满，28天⁴紧致+24.49%⁴，皱纹-30.34%⁴、水润+40.30%⁴',
        price: 199.00,
        originalPrice: 299.00,
        sales: 3399,
        tags: ['多效靶向抗初老', '焕亮肌肤'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/10.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/10.mp4',
        categoryId: 1
      },
      { 
        id: 10, 
        name: '双A醇颈霜',
        desc: '温和淡化颈纹，一抹弹润、紧致、透亮，28天¹颈纹淡化-38.8%¹、紧致柔嫩+14.5%¹、肤色提升+12.5%¹',
        price: 299.00,
        originalPrice: 399.00,
        sales: 4217,
        tags: ['卓效激活胶原'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/11.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/11.mp4',
        categoryId: 1
      },
      { 
        id: 11, 
        name: '黑钻面霜',
        desc: '高奢御龄¹，卓效促胶原、淡纹路、防松垮，28天²皱纹-31.54%²、紧致+10.64%²、水润度+20.28%²',
        price: 259.00,
        originalPrice: 329.00,
        sales: 3104,
        tags: ['直击四大眼周暗沉'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/12.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/12.mp4',
        categoryId: 1
      },
      { 
        id: 12, 
        name: '鎏光精华油',
        desc: '4重高浓度VC肽，卓效御氧¹焕亮，多链路抗老²，28天³皱纹-34.93%³、光泽+ 21.35%³、水润+33.33%³',
        price: 229.00,
        originalPrice: 398.00,
        sales: 2891,
        tags: ['12h淡纹提拉¹'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/13.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/13.mp4',
        categoryId: 1
      },
      
      // 美白焕亮系列产品 (categoryId: 2)
      { 
        id: 101, 
        name: '经典版发光水2.0',
        desc: '多皮层分层抗氧¹改善暗黄，层层卓效提亮，绽现肌肤亮、透、嫩，28天²光泽+45.45%²、水润+25.4%²、泛红-14.97%²',
        price: 129.00,
        originalPrice: 199.00,
        sales: 5628,
        tags: ['淡化色斑', '提亮肤色'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/1.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/1.mp4',
        categoryId: 2
      },
      { 
        id: 102, 
        name: '原白霜',
        desc: '显著美白淡斑，温和不刺激，层层净黑不反黑¹，28天³光泽+17.38%³、美白+6.9%³、泛红-11.63%³',
        price: 229.00,
        originalPrice: 299.00,
        sales: 3245,
        tags: ['密集修护', '淡斑提亮'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/2.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/2.mp4',
        categoryId: 2
      },
      { 
        id: 103, 
        name: '原白乳',
        desc: '硬核糖氧双抗¹，根源抑黑减黄，美白透亮不反黑²，28天⁴光泽+16.83%⁴、白皙+6.58%⁴、水润+28.68%⁴',
        price: 189.00,
        originalPrice: 259.00,
        sales: 4129,
        tags: ['淡斑精华', '改善暗沉'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/3.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/3.mp4',
        categoryId: 2
      },
      { 
        id: 104, 
        name: '鎏光水',
        desc: '多维焕亮减黄，实力御氧¹焕亮，源头改善暗沉，28天²水润保湿+56.33%²、屏障修护+13.06%²、光泽度+17.71%²',
        price: 239.00,
        originalPrice: 359.00,
        sales: 2876,
        tags: ['提亮遮瑕', '美白养肤'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/4.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/4.mp4',
        categoryId: 2
      },
      { 
        id: 105, 
        name: '发光面膜2.0',
        desc: '多通路密集焕亮修护，5维卓效淡暗沉，敷出莹润水光肌，28天¹保湿滋润+17.76%¹、屏障修护+16.42%¹、光泽+8.69%¹',
        price: 239.00,
        originalPrice: 359.00,
        sales: 2876,
        tags: ['提亮遮瑕', '美白养肤'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/5.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/5.mp4',
        categoryId: 2
      },
      
      // 维护保湿系列产品 (categoryId: 3)
      { 
        id: 201, 
        name: 'B5面霜',
        desc: '构筑三重屏障修护体系，28天¹维稳舒缓，强韧肌肤屏障，修护屏障+11.88%¹、滋润保湿+11.44%¹、泛红-6.25%¹',
        price: 159.00,
        originalPrice: 219.00,
        sales: 6531,
        tags: ['深层保湿', '修护屏障'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/1.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/1.mp4',
        categoryId: 3
      },
      { 
        id: 202, 
        name: '弹簧霜2.0',
        desc: '敏肌抗老¹0门槛，边修护边抗老¹，促生四大关键胶原，肌肤嘭弹不显纹，促弹+6.30%³、淡纹-15.22%³、修护+21.29%³',
        price: 169.00,
        originalPrice: 229.00,
        sales: 4872,
        tags: ['急救补水', '舒缓镇静'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/2.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/2.mp4',
        categoryId: 3
      },
      { 
        id: 203, 
        name: '厚皮精华',
        desc: '卓效修护屏障，增厚表皮，减少泛红，显著提升皮肤耐受力，28天¹屏障修护+16.99%¹、水润保湿+11.31%¹、泛红-10.18%¹',
        price: 189.00,
        originalPrice: 259.00,
        sales: 5134,
        tags: ['深层补水', '长效锁水'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/3.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/3.mp4',
        categoryId: 3
      },
      { 
        id: 204, 
        name: '闪修精华',
        desc: '精准修护光损泛红，快褪红、深舒缓、强修护，28天¹乳酸刺痛-51.06%¹、皮肤发红-20%¹、屏障强韧+12.53%¹',
        price: 99.00,
        originalPrice: 139.00,
        sales: 7245,
        tags: ['随时补水', '舒缓敏感'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/4.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/4.mp4',
        categoryId: 3
      },
      { 
        id: 205, 
        name: '复原露2.0',
        desc: '层层深润沁透，协同修护光损，显著改善干·糙·红，28天¹水润+10.19%¹、泛红-8.27%¹、修护+4.86%¹',
        price: 169.00,
        originalPrice: 229.00,
        sales: 4872,
        tags: ['急救补水', '舒缓镇静'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/5.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/5.mp4',
        categoryId: 3
      },
      { 
        id: 206, 
        name: '四重蛋白瓶精华水',
        desc: '5维改善干瘪垮脸，多链路还原弹嫩蛋白年轻肌，100%用户认可¹更紧致、100%用户认可¹修护屏障、100%用户认可¹润泽保湿',
        price: 189.00,
        originalPrice: 259.00,
        sales: 5134,
        tags: ['深层补水', '长效锁水'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/6.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/6.mp4',
        categoryId: 3
      },
      { 
        id: 207, 
        name: '酵母面膜2.0',
        desc: '熬夜急修护，多维抵御光老化¹，敷出丰润水嫩肌，28天²水润保湿+45.15%²、光泽+21.04%²、修护屏障+20.65%²',
        price: 99.00,
        originalPrice: 139.00,
        sales: 7245,
        tags: ['随时补水', '舒缓敏感'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/7.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/7.mp4',
        categoryId: 3
      },
      
      // 基础护肤系列产品 (categoryId: 4)
      { 
        id: 301, 
        name: '氨基酸洁面2.0',
        desc: '超强起泡科技，SPA级奢润洗感，深入毛孔的净澈力，28天¹毛孔-22.33%¹、油脂-32.45%¹、水润+44.73%¹',
        price: 119.00,
        originalPrice: 169.00,
        sales: 8752,
        tags: ['温和清洁', '不紧绷'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/1.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/1.mp4',
        categoryId: 4
      },
      { 
        id: 302, 
        name: '无泪卸妆精华乳',
        desc: '不挑肤质¹的无泪配方²，精准溶解全脸彩妆，遇水一冲即化，享SPA级奢润洗卸体验，黑头-31.38%³、油脂-91.86%⁴、水润度+32.78%⁵',
        price: 139.00,
        originalPrice: 189.00,
        sales: 4528,
        tags: ['温和焕肤', '细致毛孔'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/2.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/2.mp4',
        categoryId: 4
      },
      { 
        id: 303, 
        name: '黑盾防晒',
        desc: '全波段¹硬核防晒力，20h持久防晒⁴，一抹长效哑光，防晒力堪比硬防晒，SPF50+，PA++++，浴后依旧SPF50+²，97%⁵认可晒不黑，真实晒不黑（光泽+26.68%⁵）、晒不红（泛红-8.82%⁵）、晒不老³（弹性+18.98%⁵）',
        price: 109.00,
        originalPrice: 159.00,
        sales: 6321,
        tags: ['控油收敛', '平衡调理'],
        image: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/3.png',
        videoUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/3.mp4',
        categoryId: 4
      }
      
    ];
    
    // 保存所有产品到全局变量
    app.setAllProducts(products);
    
    // 根据当前分类筛选商品
    let filteredProducts = products.filter(item => item.categoryId === this.data.categoryId);
    
    // 保存当前分类的商品到全局变量
    app.setProductsByCategory(this.data.categoryId, filteredProducts);
    
    // 设置当前页面的商品列表
    this.setData({
      productList: filteredProducts,
      originalProductList: [...filteredProducts]
    });
    
    // 同步全局原始排序
    app.globalData.originalProductList = [...filteredProducts];
    
    // 延迟一下，模拟网络请求
    setTimeout(() => {
      wx.hideLoading();
    }, 500);
  },
  
  // 切换分类
  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    const category = this.data.categoryList[index];
    
    // 若点击当前已选中分类，不做任何操作
    if (index === this.data.currentCategory) {
      return;
    }
    
    // 更新分类信息
    this.setData({
      currentCategory: index,
      categoryName: category.name,
      categoryDesc: category.desc,
      categoryId: category.id,
      currentSort: 0 // 重置为综合排序
    });
    
    // 检查全局变量中是否已有此分类的商品数据
    if (app.globalData.productsByCategory[category.id] && 
        app.globalData.productsByCategory[category.id].length > 0) {
      
      console.log('从全局变量获取分类 ' + category.id + ' 的商品数据');
      
      // 使用全局变量中的数据
      this.setData({
        productList: app.globalData.productsByCategory[category.id],
        originalProductList: [...app.globalData.productsByCategory[category.id]]
      });
      
      wx.showToast({
        title: '切换成功',
        icon: 'success',
        duration: 800
      });
    } else {
      // 如果全局变量中没有，通过筛选全局所有商品来获取该分类下的商品
      if (app.globalData.allProducts && app.globalData.allProducts.length > 0) {
        let filteredProducts = app.globalData.allProducts.filter(item => item.categoryId === category.id);
        
        // 保存到全局变量
        app.setProductsByCategory(category.id, filteredProducts);
        
        // 更新当前页面数据
        this.setData({
          productList: filteredProducts,
          originalProductList: [...filteredProducts]
        });
        
        wx.showToast({
          title: '切换成功',
          icon: 'success',
          duration: 800
        });
      } else {
        // 如果全局变量中没有所有商品数据，重新加载该分类下的商品
        this.loadProductData();
      }
    }
  },
  
  // 切换排序方式
  switchSort(e) {
    const index = e.currentTarget.dataset.index;
    
    // 如果点击当前排序并且不是价格排序，不做操作
    if (index === this.data.currentSort && index !== 2) {
      return;
    }
    
    this.setData({
      currentSort: index
    });
    
    // 根据排序类型执行对应的排序
    if (index === 0) {
      // 综合排序 - 恢复原始排序
      this.setData({
        productList: [...this.data.originalProductList]
      });
      
      wx.showToast({
        title: '默认排序',
        icon: 'success',
        duration: 800
      });
    } else if (index === 1) {
      // 销量排序
      this.sortBySales();
    } else if (index === 2) {
      // 价格排序
      this.sortByPrice(this.data.priceSortAsc);
    }
  },
  
  // 切换价格排序
  togglePriceSort() {
    const priceSortAsc = !this.data.priceSortAsc;
    
    this.setData({
      currentSort: 2,
      priceSortAsc
    });
    
    // 排序商品
    this.sortByPrice(priceSortAsc);
  },
  
  // 排序商品 - 修复销量排序问题
  sortProducts(sortType) {
    // 添加加载动画
    wx.showLoading({
      title: '排序中...',
      mask: true
    });
    
    try {
      // 确保有商品数据可供排序
      if (!this.data.productList || this.data.productList.length === 0) {
        wx.hideLoading();
        wx.showToast({
          title: '暂无商品可排序',
          icon: 'none'
        });
        return;
      }
      
      let sortedProducts = [];
      
      switch(sortType) {
        case 0: // 综合(默认排序)
          // 恢复原始排序
          sortedProducts = [...this.data.originalProductList];
          break;
          
        case 1: // 销量排序 - 修复这里的问题
          // 深拷贝商品列表，确保排序不影响原始数据
          sortedProducts = JSON.parse(JSON.stringify(this.data.productList));
          // 根据销量从高到低排序
          sortedProducts.sort((a, b) => b.sales - a.sales);
          console.log('销量排序后的商品列表:', sortedProducts); // 添加调试日志
          break;
          
        case 2: // 价格排序
          this.sortByPrice(this.data.priceSortAsc);
          wx.hideLoading();
          return;
          
        default:
          sortedProducts = [...this.data.productList];
          break;
      }
      
      // 确保排序后的列表不为空
      if (!sortedProducts || sortedProducts.length === 0) {
        console.error('排序后商品列表为空');
        sortedProducts = [...this.data.productList]; // 使用当前商品列表作为备选
      }
      
      // 更新列表数据
      this.setData({
        productList: sortedProducts
      }, () => {
        console.log('设置后的商品列表长度:', this.data.productList.length);
      });
      
      wx.hideLoading();
      
      // 显示排序完成提示
      wx.showToast({
        title: sortType === 0 ? '默认排序' : '销量排序',
        icon: 'success',
        duration: 800
      });
    } catch (error) {
      console.error('排序过程中出错:', error);
      wx.hideLoading();
      wx.showToast({
        title: '排序出错，请重试',
        icon: 'none'
      });
    }
  },
  
  // 按价格排序
  sortByPrice(asc) {
    wx.showLoading({
      title: '排序中...',
      mask: true
    });
    
    try {
      // 确保有商品数据
      if (!this.data.productList || this.data.productList.length === 0) {
        wx.hideLoading();
        wx.showToast({
          title: '暂无商品可排序',
          icon: 'none'
        });
        return;
      }
      
      let sortedProducts = JSON.parse(JSON.stringify(this.data.productList));
      
      if(asc) {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else {
        sortedProducts.sort((a, b) => b.price - a.price);
      }
      
      this.setData({
        productList: sortedProducts
      });
      
      wx.hideLoading();
      
      // 显示排序完成提示
      wx.showToast({
        title: asc ? '价格从低到高' : '价格从高到低',
        icon: 'success',
        duration: 800
      });
    } catch (error) {
      console.error('价格排序出错:', error);
      wx.hideLoading();
      wx.showToast({
        title: '排序出错，请重试',
        icon: 'none'
      });
    }
  },
  
  // 跳转到产品详情
  goToProductDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    });
  },
  
  // 跳转到搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },
  
  // 跳转到购物车页面
  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
  // 跳转到智能客服页面
  goToChatBot() {
    wx.navigateTo({
      url: '/pages/chatBot/chatBot'
    });
  },
  
  // 页面滚动事件
  onPageScroll(e) {
    const scrollTop = e;  // 直接使用传入的参数，它就是scrollTop值
    
    // 更新导航栏透明度
    if (scrollTop > 50 && this.data.navTransparent) {
      this.setData({
        navTransparent: false
      });
    } else if (scrollTop <= 50 && !this.data.navTransparent) {
      this.setData({
        navTransparent: true
      });
    }
    
    this.setData({
      scrollTop
    });
  },
  
  // 返回方法
  navigateBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  
  // 打开/关闭筛选弹出框
  toggleFilterPopup() {
    this.setData({
      showFilterPopup: !this.data.showFilterPopup,
      showSortPopup: false
    });
  },
  
  // 选择筛选条件
  selectFilter(e) {
    const { type, index } = e.currentTarget.dataset;
    const filters = this.data.filters;
    
    filters[type][index].selected = !filters[type][index].selected;
    
    this.setData({
      filters
    });
  },
  
  // 重置筛选条件
  resetFilters() {
    const filters = this.data.filters;
    
    // 重置所有筛选条件
    Object.keys(filters).forEach(key => {
      filters[key].forEach(item => {
        item.selected = false;
      });
    });
    
    this.setData({
      filters
    });
  },
  
  // 应用筛选条件
  applyFilters() {
    // 实现筛选逻辑
    this.setData({
      showFilterPopup: false
    });
    
    // 模拟刷新数据
    wx.showToast({
      title: '筛选成功',
      icon: 'success'
    });
  },
  
  // 处理scroll-view的滚动事件
  onScrollViewScroll(e) {
    const scrollTop = e.detail.scrollTop;
    
    // 更新导航栏透明度
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

  // 添加视频控制相关方法
  onReady: function() {
    // 获取视频上下文
    this.introBgVideo = wx.createVideoContext('intro-bg-video');
  },

  // 处理视频播放错误
  handleVideoError: function(e) {
    console.error('视频播放错误:', e.detail.errMsg);
    // 可以在这里添加错误处理逻辑，比如显示一个静态背景图
  },

  // 聚焦搜索框
  focusSearch() {
    this.setData({
      searchFocus: true
    });
  },

  // 处理搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    
    // 实时搜索（可选）
    if (keyword.length > 1) {
      this.doSearch();
    } else if (keyword.length === 0) {
      this.cancelSearch();
    }
  },

  // 清除搜索
  clearSearch() {
    this.setData({
      searchKeyword: '',
      isSearching: false
    });
    
    // 恢复原始商品列表
    this.setData({
      productList: [...this.data.originalProductList]
    });
  },

  // 执行搜索
  doSearch() {
    const keyword = this.data.searchKeyword.trim().toLowerCase();
    if (!keyword) {
      return;
    }
    
    wx.showLoading({
      title: '搜索中...',
      mask: true
    });
    
    try {
      // 从所有商品中筛选符合关键词的商品
      const filteredProducts = this.getAllProducts().filter(product => {
        return (
          product.name.toLowerCase().includes(keyword) ||
          product.desc.toLowerCase().includes(keyword) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(keyword)))
        );
      });
      
      // 保存搜索结果
      this.setData({
        productList: filteredProducts,
        isSearching: true,
        // 保存搜索历史（可选）
        searchHistory: [...new Set([keyword, ...this.data.searchHistory])].slice(0, 10)
      });
      
      // 保存到本地存储（可选）
      wx.setStorageSync('searchHistory', this.data.searchHistory);
      
      // 显示搜索结果
      if (filteredProducts.length === 0) {
        wx.showToast({
          title: '没有找到相关商品',
          icon: 'none',
          duration: 2000
        });
      } else {
        wx.showToast({
          title: `找到${filteredProducts.length}个商品`,
          icon: 'success',
          duration: 1500
        });
      }
    } catch (error) {
      console.error('搜索出错:', error);
      wx.showToast({
        title: '搜索失败，请重试',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 取消搜索
  cancelSearch() {
    this.setData({
      searchKeyword: '',
      isSearching: false,
      searchFocus: false,
      // 恢复原始商品列表
      productList: [...this.data.originalProductList]
    });
  },

  // 获取所有商品数据（用于搜索）
  getAllProducts() {
    // 这里可以根据实际情况，返回当前分类的商品或所有商品
    if (this.data.originalProductList && this.data.originalProductList.length) {
      return this.data.originalProductList;
    }
    
    // 如果没有缓存的商品列表，可以从服务器获取或返回当前分类的商品
    // 这里简化处理，直接返回当前显示的商品
    return this.data.productList || [];
  },

  // 加载搜索历史（在 onLoad 方法中调用）
  loadSearchHistory() {
    try {
      const history = wx.getStorageSync('searchHistory');
      if (history) {
        this.setData({
          searchHistory: history
        });
      }
    } catch (e) {
      console.error('加载搜索历史失败:', e);
    }
  },

  // 添加或修改销量排序方法
  sortBySales() {
    wx.showLoading({
      title: '排序中...',
      mask: true
    });
    
    try {
      // 确保有商品数据
      if (!this.data.productList || this.data.productList.length === 0) {
        wx.hideLoading();
        wx.showToast({
          title: '暂无商品可排序',
          icon: 'none'
        });
        return;
      }
      
      let sortedProducts = JSON.parse(JSON.stringify(this.data.productList));
      
      // 销量始终从高到低排序
      sortedProducts.sort((a, b) => b.sales - a.sales);
      
      this.setData({
        productList: sortedProducts
      });
      
      wx.hideLoading();
      
      // 显示排序完成提示
      wx.showToast({
        title: '销量排序',
        icon: 'success',
        duration: 800
      });
    } catch (error) {
      console.error('销量排序出错:', error);
      wx.hideLoading();
      wx.showToast({
        title: '排序出错，请重试',
        icon: 'none'
      });
    }
  },

  // 修改获取商品数据的相关方法
  getGlobalProducts() {
    return app.globalData.allProducts;
  },

  getProductsByCategory(categoryId) {
    return app.globalData.productsByCategory[categoryId] || [];
  },

  getProductById(productId) {
    return app.globalData.allProducts.find(item => item.id === productId) || null;
  },

  // 添加视频错误处理函数
  handleVideoError(e) {
    console.error('视频加载失败:', e.detail.errMsg);
    const productId = e.currentTarget.dataset.id;
    console.log('产品ID:', productId);
    // 可以在这里添加回退逻辑，例如显示静态图片
  }
}) 