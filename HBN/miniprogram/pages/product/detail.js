Page({
  data: {
    navTransparent: true,
    currentMainSwiper: 0,
    product: null, // 初始为null，等待加载
    selectedSpecs: {
      '规格': '标准装',
      '净含量': '150ml赠水乳体验礼'
    },
    currentPrice: 119.00, // 默认价格
    currentOriginalPrice: 219.00, // 默认原价
    showSpecSelector: false,
    floatExpanded: true, // 浮窗展开状态，默认展开
    // 添加轮播配置
    swiperConfig: {
      indicatorDots: true,
      indicatorColor: "rgba(0, 0, 0, .3)",
      indicatorActiveColor: "#618a49",
      autoplay: false,
      interval: 3000,
      duration: 500,
      circular: true,
      previousMargin: '0px',
      nextMargin: '0px',
      displayMultipleItems: 1
    },
    quantity: 1,     // 默认数量为1
    minQuantity: 1,  // 最小数量限制
    maxQuantity: 99,  // 最大数量限制
    isFavorite: false, // 是否已收藏
    loadedDetailImages: [], // 已加载的详情图片
    visibleDetailImageCount: 5, // 初始可见详情图片数量
    detailImageLoadStep: 10, // 每次新加载图片数量
    isDetailImagesFullyLoaded: false, // 是否已全部加载完成
    isVideosLoaded: false, // 视频是否已加载
    videoLoading: false, // 视频加载中状态
    detailVideoContext: null, // 详情视频上下文
    actionType: 'cart' // 弹窗类型，cart=购物车，buy=立即购买
  },

  onLoad: function(options) {
    // 根据options.id加载商品数据
    const id = parseInt(options.id) || 1;
    console.log('加载商品ID:', id);
    
    // 加载对应的商品数据
    this.loadProductData(id);
  },

  onShow: function() {
    // 检查商品是否已收藏
    if (this.data.product) {
      this.checkFavoriteStatus();
      
      // 添加浏览记录
      this.addToHistory();
      
      // 确保价格计算正确
      this.updatePrice();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 添加浏览记录
    if (this.data.product) {
      this.addToHistory();
    }
  },

  /**
   * 添加到浏览历史
   */
  addToHistory: function() {
    const product = this.data.product;
    
    // 确保商品数据已加载
    if (!product || !product.id) {
      return;
    }
    
    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloud1-0gxff61z2804383c',
      traceUser: true
    });
    
    // 调用云函数记录浏览历史
    wx.cloud.callFunction({
      name: 'manageHistory',
      data: {
        action: 'add',
        data: {
          productId: product.id.toString(),
          name: product.name,
          image: product.bannerImages[0],
          price: this.data.currentPrice,
          originalPrice: this.data.currentOriginalPrice,
          category: product.category || '未分类'
        }
      }
    }).then(res => {
      console.log('浏览历史记录成功', res);
    }).catch(err => {
      console.error('记录浏览历史失败', err);
    });
  },

  loadProductData(id) {
    // 显示加载中
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    
    // 直接使用模拟数据，不从全局变量获取
    console.log('从本地模拟数据创建商品');
    
    // 模拟商品数据库
    const productsData = {
      // 抗老紧致系列的产品
      1: { 
        id: 1, 
        name: '视黄醇精华乳2.0',
        description: '多效靶向抗初老，卓效紧致焕亮肌肤，28天改善皱纹、饱满促弹、润泽保湿，紧致+11.8%，皱纹-25.56%、光泽+19.06%',
        price: 189.00,
        originalPrice: 299.00,
        sales: 3399,
        stock: 850,
        tags: ['多效靶向抗初老', '焕亮肌肤'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/下载 (3).mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/商品视频/1.mp4',
        bannerImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01YqErYI1OEk2SvfbzZ_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01sdXQwT1OEju0r9rnG_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01VINwlp1OEju4WyYe9_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01Ha9Wjb1OEk4Ls5tdD-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01bSa97s1OEk33I0ehH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01sUM92Q1OEk31ryHVt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01f2HgAY1OEjwHy6Dtl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dM2yxZ1OEk34d0rby_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jMZXpb1OEk314TYpW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01DXU1T31OEk33Hyyla_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cy4RQB1OEk32qe67A_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01OySwti1OEk339Vep8_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01qsHDCN1OEk2wk9vOB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Rp5Z8j1OEjwEfncod_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jKT6zk1OEk32qeMkr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01mNB53V1OEk4DrJhGP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN011m4NgC1OEk32qdteX_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01Vd7m3F1OEk35AF5fw_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01C3HIYE1OEk32qd1ar_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN015iGovO1OEk335Q4qt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01R3z8WO1OEk33ipqrU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01o80n4J1OEjwNAZ0Wh_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01XszR0J1OEk33Hydyl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01f26CQv1OEk34eo2YR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01C2EEpj1OEjwKVdxVr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01DXx9Ty1OEjwIkVsFr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ACH0ko1OEk32qdtfC_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01DFQ1N71OEk339X8IY_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01Bs4TvZ1OEjwIqjQBy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01IS1Vrn1OEjwEfpyJU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01KUKoFb1OEjwKGFMs1_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01afzthr1OEjzuSXauM_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01skfelJ1OEjzvtk0C5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN015ehnsl1OEjzvtkCfC_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UQaW4q1OEjzvDNxpK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018tXlSd1OEk34d1bMU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01Ccfx4c1OEk32qeZE2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01RpqadY1OEjwGAFd8e_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01STllsa1OEjwLMxSQL_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01MCp33q1OEjwIkWPUO_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01yV2lxY1OEk35AEHmv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01Umi1ex1OEk35ZwzwZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN015Vjr2k1OEk33I13f9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01eVjykk1OEk2wk8eNH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01gP1elX1OEjwLMzXMa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',
        ],
        specsPrices: {
          '120ml双A乳': {
            price: 189.00,
            originalPrice: 289.00
          },
          '210ml双A乳120ml+原白乳90ml': {
            price: 408.00,
            originalPrice: 598.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['120ml双A乳', '210ml双A乳120ml+原白乳90ml']
          }
        ],
        categoryId: 1
      },
      
      2: { 
        id: 2, 
        name: '双A醇晚霜2.0',
        description: '卓效激活胶原，显著抗皱紧致，28天皱纹-31.85%、弹性+22.67%、光泽+22.43%',
        price: 279.00,
        originalPrice: 399.00,
        sales: 4217,
        stock: 620,
        tags: ['卓效激活胶原'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/4.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/商品视频/抗老2.mp4',
        bannerImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01F7GMyK1OEk3TQzb0s_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01dUBuQK1OEk4SXad6g-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01W19QP01OEk3JpF9pG_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Eu8vNO1OEk4XsESac_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01T0tGyX1OEk4V7kfyZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01QL0Uo41OEk4XGrbtq_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kaT6lk1OEk4XGsPo5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN012lbT0v1OEk4PJUuVh_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01L1h7MN1OEk4WVuBXP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01e8wrXb1OEk4XGuE5j_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qyDdJL1OEk4WSSlAo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01zZXm3z1OEk4UAXgU7_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01j4i7MH1OEk4WSTlYG_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01iDSwUn1OEk4WBzEYA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015gIbNR1OEk4WSUhm1_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01QnstBU1OEk4VQxZqR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01mUc3j01OEk4XGs0s4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01tbmwds1OEk4V7loiQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01gFEfBE1OEk4VNXl4k_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01nXMeK21OEk4XGtpC1_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01EA4fza1OEk4UEq99J_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN010Kgbnj1OEk4V7jnxn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN019240l11OEk4V7m1CL_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01KXHM2H1OEk4VuD1k6_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01bg82OF1OEk4WyKX14_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01FkI3LR1OEk4UAXYCT_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dKaPzf1OEk4PJUJ9o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01mUIk8t1OEk4VDv5DD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01k34lbV1OEk4VDxZ2G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dcI7j21OEk4PJVz7o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01t7WgFM1OEk4UAYQHn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01hEBxiU1OEk4W0N81I_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01vsEUtw1OEk4WSTlcr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01eoCD611OEk4UEspXf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dNCMUQ1OEk4WyJKFX_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01LFTwwY1OEk4VuFJER_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01yya5YS1OEk4VDziF3_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kId8mv1OEk4WVxbnF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01oCCnd91OEk4WC44C6_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01kQh5oq1OEk4V7nhNN_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015hc7kQ1OEk4WC404t_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01E5qeH61OEk4WW0UgF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ehCK9N1OEk4TeOGDa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ri7E4U1OEk4WW01bL_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ML5b8t1OEk4V7rn7R_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01zIjXx61OEk4WSZwUp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01KCdnGD1OEk4VE1KFI_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01ZqgvxB1OEk4VE2jaK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '50g单瓶装': {
            price: 279.00,
            originalPrice: 399.00
          },
          '200g早C晚A水露组合': {
            price: 388.00,
            originalPrice: 798.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['50g单瓶装', '200g早C晚A水露组合']
          }
        ],
        categoryId: 1
      },

      3: {
        id: 3,
        name: 'HBN咖啡因眼霜3.0',
        description: '直击四大眼周暗沉，焕亮淡纹，即时起效',
        price: 279.00,
        originalPrice: 389.00,
        sales: 3214,
        stock: 546,
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/下载 (2).mp4',
        productVideo2: 'https://www.hbn.cn/videos/product/kl/3/1.mp4',
        bannerImages: [
          'https://www.hbn.cn/assets/3-BxE2s-DI.png',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01P57NaE1OEk4NlJ1H3-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01XC32Vo1OEk4OTh1C0-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN018wo0Ti1OEk2yMA0pq_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN018tJwKU1OEk4Ls7AnM-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01IrCyUL1OEk45y2W5G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZJP8le1OEk455eTkB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ZO0oXf1OEk48IKXqH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZI7R951OEk47V3WNm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01cITqdf1OEk47yF8Ba_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01weuugL1OEk46sDm4d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016hJbK01OEk4099Y0s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01KYpWZf1OEk48JQHjj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01APblQm1OEk46AGo7p_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01eYUxlL1OEk46sDZdQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ei50zM1OEk455bjFv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01RMqOfs1OEk46h5ioa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jd4zxe1OEk47TsgKp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01omAPJX1OEk46rXAso_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KWOA3k1OEk46LhL6i_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BzJZP51OEk47TuI7W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZjTZ6B1OEk48IKLNS_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01QtMw6S1OEk409CleU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q6X8in1OEk46LhPH4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN010KrCZg1OEk46sCpuc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01EwplT11OEk47QWYmr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010hx4BS1OEk46EB13X_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010FNqTy1OEk48IKPY4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ya0hZb1OEk46sC20S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01t8slVj1OEk44z0oBx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BshbjJ1OEk48IJ0EN_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN0160paI41OEk455ePXw_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01iEXPhL1OEk455eLOF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KBo8SJ1OEk45xzlaJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01juz3C61OEk47QXdMn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NnWnxM1OEk47QYAcj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lQYmIz1OEk47TtUFG_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tovldk1OEk48IJGsP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01fdbsPp1OEk455ec2c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01dNCIwD1OEk48om1Ch_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01i0zFob1OEk4099oin_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01RsbFZW1OEk46rYiaP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019wHU6U1OEk48JXbNf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01WQuJJ01OEk47yGGsr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01vEOiqU1OEk455eD5W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01gyhJnY1OEk46rZJzl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01zmPofR1OEk47QZqa2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cj2bLe1OEk44QIH77_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Hr7QQk1OEk455eD5o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01wawYYq1OEk44QJDIc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jeoNXM1OEk4695phm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01rqdBL51OEk46h42wi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018IZqUw1OEk47yEKL5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01oZsD0L1OEk46rZSKF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BEH7PT1OEk44z2kmy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png'
        ],
        specsPrices: {
          '15g一瓶罐': {
            price: 279.00,
            originalPrice: 399.00
          },
          '30g两瓶罐': {
            price: 498.00,
            originalPrice: 798.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['突破性升级【咖啡因眼霜3.0】']
          },
          {
            name: '净含量',
            options: ['15g一瓶罐', '30g两瓶罐']
          }
        ]
      },

      4: { 
        id: 4, 
        name: 'HBN双A醇眼部精华小咖管抗皱眼霜精华液黑眼圈',
        description: '卓效激活胶原，显著抗皱紧致，28天皱纹-31.85%、弹性+22.67%、光泽+22.43%',
        price: 219.00,
        originalPrice: 399.00,
        sales: 4217,
        stock: 620,
        tags: ['卓效激活胶原'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/5.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/商品视频/抗老4.mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01lIUNJQ1OEk4Vtwfwn-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01FjRoxo1OEjzln3F63_!!2204177871674.jpg_.webp',
          '//img.alicdn.com/imgextra/i4/2204177871674/O1CN011ZobO21OEjzlCOFme_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tnYI1g1OEk4PJ6Gwo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015MSWFT1OEk4VQWvJt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01hCJe011OEk4WAit4w_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aKNRLG1OEk4VDSLk9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cco0Jj1OEk4VN2wib_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01hOrBA31OEk4VN30sW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019XHMOE1OEk4UA6tpa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kts5UK1OEjzz3GM7D_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qxllNn1OEk01AwyjI_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OBQPWp1OEk4Wxlgwp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN014y88Dr1OEk4WVTX6c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01bacC561OEk4TdvOHA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01TMvZjb1OEk4Wxnq1L_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UAmXWD1OEk03FIv7y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01p4fZW91OEk4WUgODr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bXk5ug1OEjzyFVfHT_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lxgvPk1OEk4Tdvetl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZOtmGj1OEk4WS128S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01higJrD1OEjzz3GDpt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01kn01SL1OEk00aNSJH_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01XCR9IL1OEk4Wxm5ut_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01hN3D091OEk4WxoVbf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01y2mfVv1OEk00aMRwD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dstnol1OEk04YbRvo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01r6ylWG1OEk00aM7Bo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN0191qQLH1OEk4WSCa5j_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN017FB9Y71OEk4Wy1fZK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01XH7dx01OEk01Lec6Y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dIv6ZF1OEk01IfWsg_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01q0xBKc1OEk4VtkILW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019LkHSH1OEk4VN51cR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01cw5ml81OEk01LbnSH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01kS8y4K1OEk04YcFs5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aQBnGE1OEjztmrdGb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ONUZ0H1OEk03RMruQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q4zoaX1OEk01AwiCF_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ki7j651OEk02PuutZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01VHOg161OEjzz3GtVB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BQbcPP1OEk03FLTDA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BbOunT1OEk03FLTDP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '15ml': {
            price: 219.00,
            originalPrice: 399.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['15ml']
          }
        ],
        categoryId: 1
      },

      5: { 
        id: 5, 
        name: '超A瓶精华',
        description: '源头抗老，4周淡面部八大顽固深纹，卓效紧致抗皱',
        price: 369.00,
        originalPrice: 399.00,
        sales: 4217,
        stock: 620,
        tags: ['源头抗老'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/6.mp4',
        productVideo2: 'https://www.hbn.cn/videos/product/kl/5/1.mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01oibIbN1OEk4YB69VN-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN014hNurk1OEk4NoWjqm_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01FFRv8V1OEk0ZoeSAq_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016kdpfe1OEk4UGWgHf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015MSWFT1OEk4VQWvJt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01svHGi91OEk4OCNn8H_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01eBRhgZ1OEk4T3VCDk_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01njaJJG1OEk4UGO9mg_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01x0npyT1OEk4OCIURy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN0127WTsd1OEk4VPS5L2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01bq6dxj1OEk4UmlQuG_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01XiUe6d1OEk4T81HnZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN011l3M7F1OEk4U0fuFm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jsYR7u1OEk4VrC4WK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01TLF1O41OEk4Ut2BAY_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01c7YLW51OEk4V4gV8e_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qixuYl1OEk4OCKMpu_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01Brx0fe1OEk4V4lfk0_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01w17ENf1OEk4Ut5Ste_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aEv4ru1OEk4U0eMYt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KTWvdv1OEk4SWTGA0_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01nI9wjz1OEk4T3Uzhk_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01bZfTj91OEk4V4iB7f_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01K7OKdE1OEk4Ug8teW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tptChl1OEk4T86OGA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bhRvA41OEk4V4iiOk_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01WKhhw11OEk4UGMgHB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01jf43Ai1OEk4T3bEuo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01unLixB1OEk4OCPsH7_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01e31hvz1OEk4SWTC0z_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01vntLH21OEk4UGUOw4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01Tz2VS41OEk4WA10Qb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN013qoPJQ1OEk4VLcUY9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01CZ7azA1OEk4Ut33EE_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01HTph6u1OEk4OCQPXP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01AsOizn1OEk4UmmqCu_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NXsNmV1OEk4U6loWh_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN015xobGB1OEk4W9vyBH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01QBMtsl1OEk4Ug2v9l_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN0192DxnN1OEk4V4fQeq_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NFS3BU1OEk4T3Sz2x_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN017pNsBw1OEk4Ug0m7d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '30ml': {
            price: 369.00,
            originalPrice: 399.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['30ml']
          }
        ],
        categoryId: 1
      },


      6: { 
        id: 6, 
        name: 'HBN超A高阶晚霜面霜多重视黄醇高浓度早C晚A',
        description: '四重A醇高阶抗老¹，卓效淡纹赋弹，肌肤充盈饱满',
        price: 359.00,
        originalPrice: 499.00,
        sales: 4217,
        stock: 620,
        tags: ['卓效淡纹赋弹'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/7.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01xHvCF81OEk4Xci1nP-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01In31XW1OEjwQ5K5Xp_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01Hfa90B1OEk2mwejdR_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01O0ZCF51OEk4VzIjSu_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01QPRIGx1OEk4TdAjbk_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01RULhbD1OEk2oVhHCG_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01PfczGn1OEk2pUxD3c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN010Th1jz1OEk2pV2NNz_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01E0ykvt1OEk2oVhgAW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01ajkc3s1OEk2nAFbno_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01k3yvZk1OEk2oOrqV4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01TMcAzQ1OEk2nAB2tz_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Fs4Aqr1OEk2r1pTXd_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01JRJXZ01OEk2nA8Yz5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016BfDUU1OEk2r1mK0r_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01cHa4WQ1OEk2oOseQP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01sdsaZR1OEk2nABmfx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN012IdUOU1OEk4XFdXpi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01VNmx9M1OEk2nADC2a_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01TbIzxM1OEk2q1GEkL_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01l4wr2b1OEk2n14dyc_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01r93hqZ1OEk2nABJZJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01Hans0D1OEk2nAFH02_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ppVo9h1OEk2p6pS1p_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01y2XTYn1OEk2hz2zeA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN014JJIyf1OEk4WUgFtl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01oZCeh71OEk2n18bPf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01jtRYJk1OEk2r1nC5u_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN0187lHqb1OEk2oVjI0x_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01xuAAef1OEk2oVklYH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN016fCOv51OEk2oA0dEF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01OhHnIf1OEk2mKj9Fe_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dS8ubc1OEk2hz7l3I_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01S5Mur01OEk3761zk8_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01x5x3en1OEk37jD4A9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01d1J82f1OEk2qa23xm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01IvK6RR1OEk2p6pmq9_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01vyxUFs1OEk2n13da9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01loKqvC1OEk2q1G6RF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01mOVfhm1OEk2hz96Gb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qWofE51OEk2p6so5s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01trZLvo1OEk2oxwSUy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019gvO631OEk4UDguj9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '15ml': {
            price: 219.00,
            originalPrice: 399.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['15ml']
          }
        ],
        categoryId: 1
      },

      7: { 
        id: 7, 
        name: 'HBN三重视黄醇精华水3A3肽夜光瓶A醇紧致抗皱',
        description: '科研级创新"3A+3肽"，紧致抗皱，靶向对抗顽固老化¹',
        price: 229.00,
        originalPrice: 399.00,
        sales: 4217,
        stock: 620,
        tags: ['紧致抗皱'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/8.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01Fy7liQ1OEk4Vtygj9-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01nTvyPF1OEjwDZAsdx_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01Eay7v81OEjw9tqb8g_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01yVFXgd1OEk314kHDi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01peMpdW1OEk33IHREv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01iwGHsZ1OEk33IG65o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01yYswmZ1OEjwE2NdGC_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01UBjwAZ1OEjwBhkHGj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01fYry4b1OEjx5lDl0G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01IWKm0F1OEjwGJgtBJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01WXm2Ma1OEk31sGKyh_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ebvfWl1OEk314lLkZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01lefbOO1OEjwBmninx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01SdJoI41OEk349RToR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lptj9C1OEk340eLzl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01pAxqSz1OEjwBmqP8S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01SCAcWD1OEjwGJi1tW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Dm7gjs1OEjwE2Kof2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN013YBQYQ1OEjwFYRfyq_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01F9KCLz1OEk31jgd1d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01lmW1oU1OEk339niJd_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ERxUu61OEjw8NoJ1c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01afzthr1OEjzuSXauM_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01skfelJ1OEjzvtk0C5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN015ehnsl1OEjzvtkCfC_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UQaW4q1OEjzvDNxpK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN0160TC4k1OEjwBmneco_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01hmFmQp1OEjwCazc8t_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01x2xkGo1OEjwCb2A8W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01MRFzuf1OEjwBmpnhA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01s31ifK1OEk340dsv4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01CKMcd41OEk33IFlIl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01QWFVUp1OEjwFYQKrW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',


        ],
        specsPrices: {
          '100ml': {
            price: 229.00,
            originalPrice: 399.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['100ml']
          }
        ],
        categoryId: 1
      },

      8: { 
        id: 8, 
        name: 'HBN双A醇眼部精华小咖管抗皱眼霜精华液黑眼圈',
        description: '多维温和抗老¹，卓效促胶原、淡纹路',
        price: 459.00,
        originalPrice: 599.00,
        sales: 4217,
        stock: 620,
        tags: ['卓效促胶原'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/9.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://gw.alicdn.com/imgextra/O1CN0146LXVL1OEk4YqlQOp_!!2204177871674-0-yinheaigc.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01GfFUGF1OEjszcLJZd_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01wp1ib81OEjt79Bbd4_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
      

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tnYI1g1OEk4PJ6Gwo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015MSWFT1OEk4VQWvJt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01hCJe011OEk4WAit4w_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aKNRLG1OEk4VDSLk9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cco0Jj1OEk4VN2wib_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01hOrBA31OEk4VN30sW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019XHMOE1OEk4UA6tpa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kts5UK1OEjzz3GM7D_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qxllNn1OEk01AwyjI_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OBQPWp1OEk4Wxlgwp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN014y88Dr1OEk4WVTX6c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01bacC561OEk4TdvOHA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01TMvZjb1OEk4Wxnq1L_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UAmXWD1OEk03FIv7y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01p4fZW91OEk4WUgODr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bXk5ug1OEjzyFVfHT_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lxgvPk1OEk4Tdvetl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZOtmGj1OEk4WS128S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01higJrD1OEjzz3GDpt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01kn01SL1OEk00aNSJH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01XCR9IL1OEk4Wxm5ut_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01hN3D091OEk4WxoVbf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01y2mfVv1OEk00aMRwD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dstnol1OEk04YbRvo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01r6ylWG1OEk00aM7Bo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN0191qQLH1OEk4WSCa5j_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN017FB9Y71OEk4Wy1fZK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01XH7dx01OEk01Lec6Y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dIv6ZF1OEk01IfWsg_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01q0xBKc1OEk4VtkILW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019LkHSH1OEk4VN51cR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01cw5ml81OEk01LbnSH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01kS8y4K1OEk04YcFs5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aQBnGE1OEjztmrdGb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ONUZ0H1OEk03RMruQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q4zoaX1OEk01AwiCF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ki7j651OEk02PuutZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01VHOg161OEjzz3GtVB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BQbcPP1OEk03FLTDA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BbOunT1OEk03FLTDP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '30ml': {
            price: 459.00,
            originalPrice: 599.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['30ml']
          }
        ],
        categoryId: 1
      },

      9: { 
        id: 9, 
        name: 'HBN双A醇眼部精华小咖管抗皱眼霜精华液黑眼圈',
        description: '多维"闪充"胶原，淡化动静态纹，卓效紧致弹嫩肌肤，高阶抗老¹BUFF叠满',
        price: 388.00,
        originalPrice: 499.00,
        sales: 4217,
        stock: 620,
        tags: ['卓效紧致弹嫩肌肤'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/10.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01efxA1C1OEk4XciUuw-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01NfZkUM1OEjx3okHeD_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01WpPahh1OEjx6ZfsHn_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tnYI1g1OEk4PJ6Gwo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015MSWFT1OEk4VQWvJt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01hCJe011OEk4WAit4w_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aKNRLG1OEk4VDSLk9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cco0Jj1OEk4VN2wib_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01hOrBA31OEk4VN30sW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019XHMOE1OEk4UA6tpa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kts5UK1OEjzz3GM7D_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qxllNn1OEk01AwyjI_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OBQPWp1OEk4Wxlgwp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN014y88Dr1OEk4WVTX6c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01bacC561OEk4TdvOHA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01TMvZjb1OEk4Wxnq1L_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UAmXWD1OEk03FIv7y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01p4fZW91OEk4WUgODr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bXk5ug1OEjzyFVfHT_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lxgvPk1OEk4Tdvetl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZOtmGj1OEk4WS128S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01higJrD1OEjzz3GDpt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01kn01SL1OEk00aNSJH_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01XCR9IL1OEk4Wxm5ut_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01hN3D091OEk4WxoVbf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01y2mfVv1OEk00aMRwD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dstnol1OEk04YbRvo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01r6ylWG1OEk00aM7Bo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN0191qQLH1OEk4WSCa5j_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN017FB9Y71OEk4Wy1fZK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01XH7dx01OEk01Lec6Y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dIv6ZF1OEk01IfWsg_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01q0xBKc1OEk4VtkILW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019LkHSH1OEk4VN51cR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01cw5ml81OEk01LbnSH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01kS8y4K1OEk04YcFs5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aQBnGE1OEjztmrdGb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ONUZ0H1OEk03RMruQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q4zoaX1OEk01AwiCF_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ki7j651OEk02PuutZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01VHOg161OEjzz3GtVB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BQbcPP1OEk03FLTDA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BbOunT1OEk03FLTDP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '50ml': {
            price: 338.00,
            originalPrice: 499.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['50ml']
          }
        ],
        categoryId: 1
      },


      10: { 
        id: 10, 
        name: 'HBN视黄醇双A醇颈霜淡化颈纹颈纹霜提拉紧致美颈',
        description: '温和淡化颈纹，一抹弹润、紧致、透亮',
        price: 219.00,
        originalPrice: 399.00,
        sales: 4217,
        stock: 620,
        tags: ['温和淡化颈纹'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/11.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01bbQfT01OEk4XchQQc-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01ZnVCXe1OEjszdqYvm_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01kEdtcp1OEjyOlxL9b_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tnYI1g1OEk4PJ6Gwo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015MSWFT1OEk4VQWvJt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01hCJe011OEk4WAit4w_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aKNRLG1OEk4VDSLk9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cco0Jj1OEk4VN2wib_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01hOrBA31OEk4VN30sW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019XHMOE1OEk4UA6tpa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kts5UK1OEjzz3GM7D_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qxllNn1OEk01AwyjI_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OBQPWp1OEk4Wxlgwp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN014y88Dr1OEk4WVTX6c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01bacC561OEk4TdvOHA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01TMvZjb1OEk4Wxnq1L_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UAmXWD1OEk03FIv7y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01p4fZW91OEk4WUgODr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bXk5ug1OEjzyFVfHT_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lxgvPk1OEk4Tdvetl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZOtmGj1OEk4WS128S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01higJrD1OEjzz3GDpt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01kn01SL1OEk00aNSJH_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01XCR9IL1OEk4Wxm5ut_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01hN3D091OEk4WxoVbf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01y2mfVv1OEk00aMRwD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dstnol1OEk04YbRvo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01r6ylWG1OEk00aM7Bo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN0191qQLH1OEk4WSCa5j_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN017FB9Y71OEk4Wy1fZK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01XH7dx01OEk01Lec6Y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dIv6ZF1OEk01IfWsg_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01q0xBKc1OEk4VtkILW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019LkHSH1OEk4VN51cR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01cw5ml81OEk01LbnSH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01kS8y4K1OEk04YcFs5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aQBnGE1OEjztmrdGb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ONUZ0H1OEk03RMruQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q4zoaX1OEk01AwiCF_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ki7j651OEk02PuutZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01VHOg161OEjzz3GtVB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BQbcPP1OEk03FLTDA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BbOunT1OEk03FLTDP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '50ml': {
            price: 129.00,
            originalPrice: 299.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['50ml']
          }
        ],
        categoryId: 1
      },


      11: { 
        id: 11, 
        name: 'HBN高端黑钻精萃霜面霜玻色因维A醇抗皱早C晚A',
        description: '卓效激活胶原，显著抗皱紧致，28天皱纹-31.85%、弹性+22.67%、光泽+22.43%',
        price: 219.00,
        originalPrice: 399.00,
        sales: 4217,
        stock: 620,
        tags: ['卓效激活胶原'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/12.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://gw.alicdn.com/imgextra/O1CN01kehrji1OEk4VYvOUE_!!2204177871674-0-yinheaigc.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01etkdPo1OEk3r6PNd9_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OZM0Yb1OEk4Mw6u0Y-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tnYI1g1OEk4PJ6Gwo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015MSWFT1OEk4VQWvJt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01hCJe011OEk4WAit4w_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aKNRLG1OEk4VDSLk9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cco0Jj1OEk4VN2wib_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01hOrBA31OEk4VN30sW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019XHMOE1OEk4UA6tpa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kts5UK1OEjzz3GM7D_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qxllNn1OEk01AwyjI_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OBQPWp1OEk4Wxlgwp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN014y88Dr1OEk4WVTX6c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01bacC561OEk4TdvOHA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01TMvZjb1OEk4Wxnq1L_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UAmXWD1OEk03FIv7y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01p4fZW91OEk4WUgODr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bXk5ug1OEjzyFVfHT_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lxgvPk1OEk4Tdvetl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZOtmGj1OEk4WS128S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01higJrD1OEjzz3GDpt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01kn01SL1OEk00aNSJH_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01XCR9IL1OEk4Wxm5ut_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01hN3D091OEk4WxoVbf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01y2mfVv1OEk00aMRwD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dstnol1OEk04YbRvo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01r6ylWG1OEk00aM7Bo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN0191qQLH1OEk4WSCa5j_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN017FB9Y71OEk4Wy1fZK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01XH7dx01OEk01Lec6Y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dIv6ZF1OEk01IfWsg_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01q0xBKc1OEk4VtkILW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019LkHSH1OEk4VN51cR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01cw5ml81OEk01LbnSH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01kS8y4K1OEk04YcFs5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aQBnGE1OEjztmrdGb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ONUZ0H1OEk03RMruQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q4zoaX1OEk01AwiCF_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ki7j651OEk02PuutZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01VHOg161OEjzz3GtVB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BQbcPP1OEk03FLTDA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BbOunT1OEk03FLTDP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '50ml': {
            price: 549.00,
            originalPrice: 699.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['50ml']
          }
        ],
        categoryId: 1
      },


      12: { 
        id: 12, 
        name: 'HBN双A醇眼部精华小咖管抗皱眼霜精华液黑眼圈',
        description: '4重高浓度VC肽，卓效御氧¹焕亮，多链路抗老²',
        price: 399.00,
        originalPrice: 499.00,
        sales: 4217,
        stock: 620,
        tags: ['多链路抗老'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/抗老紧致/13.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01EuvEcZ1OEk4X9jhHA-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01pMWj7m1OEjt6vKHsI_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01LSmKd31OEjt4OwipG_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tnYI1g1OEk4PJ6Gwo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN015MSWFT1OEk4VQWvJt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01hCJe011OEk4WAit4w_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aKNRLG1OEk4VDSLk9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cco0Jj1OEk4VN2wib_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01hOrBA31OEk4VN30sW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019XHMOE1OEk4UA6tpa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01kts5UK1OEjzz3GM7D_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01qxllNn1OEk01AwyjI_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OBQPWp1OEk4Wxlgwp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN014y88Dr1OEk4WVTX6c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01bacC561OEk4TdvOHA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01TMvZjb1OEk4Wxnq1L_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01UAmXWD1OEk03FIv7y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01p4fZW91OEk4WUgODr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01bXk5ug1OEjzyFVfHT_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lxgvPk1OEk4Tdvetl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZOtmGj1OEk4WS128S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01higJrD1OEjzz3GDpt_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01kn01SL1OEk00aNSJH_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01XCR9IL1OEk4Wxm5ut_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01hN3D091OEk4WxoVbf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01y2mfVv1OEk00aMRwD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01dstnol1OEk04YbRvo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01r6ylWG1OEk00aM7Bo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN0191qQLH1OEk4WSCa5j_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN017FB9Y71OEk4Wy1fZK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01XH7dx01OEk01Lec6Y_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01dIv6ZF1OEk01IfWsg_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01q0xBKc1OEk4VtkILW_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019LkHSH1OEk4VN51cR_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01cw5ml81OEk01LbnSH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01kS8y4K1OEk04YcFs5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01aQBnGE1OEjztmrdGb_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ONUZ0H1OEk03RMruQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q4zoaX1OEk01AwiCF_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ki7j651OEk02PuutZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01VHOg161OEjzz3GtVB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BQbcPP1OEk03FLTDA_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BbOunT1OEk03FLTDP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01myhJko1OEk3r3RGqD_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',

        ],
        specsPrices: {
          '30ml': {
            price: 399.00,
            originalPrice: 499.00
          },
          // '200g早C晚A水露组合': {
          //   price: 388.00,
          //   originalPrice: 798.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['30ml']
          }
        ],
        categoryId: 1
      },

      // 美白焕亮系列产品
      101: { 
        id: 101, 
        name: '经典版发光水2.0',
        description: '多皮层分层抗氧改善暗黄，层层卓效提亮，绽现肌肤亮、透、嫩，28天光泽+45.45%、水润+25.4%、泛红-14.97%',
        price: 129.00,
        originalPrice: 199.00,
        sales: 5628,
        stock: 755,
        tags: ['淡化色斑', '提亮肤色'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/1.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/1.png',
          'https://www.hbn.cn/assets/1-Bsqoo_S0.png',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN016pBonP1OEk4NCa0sE-2204177871674.jpg',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01aWnQVG1OEk0mNTMJ2_!!2204177871674.jpg'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01IrCyUL1OEk45y2W5G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZJP8le1OEk455eTkB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ZO0oXf1OEk48IKXqH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZI7R951OEk47V3WNm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01cITqdf1OEk47yF8Ba_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01weuugL1OEk46sDm4d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016hJbK01OEk4099Y0s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01KYpWZf1OEk48JQHjj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01APblQm1OEk46AGo7p_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01eYUxlL1OEk46sDZdQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ei50zM1OEk455bjFv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01RMqOfs1OEk46h5ioa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jd4zxe1OEk47TsgKp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01omAPJX1OEk46rXAso_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KWOA3k1OEk46LhL6i_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BzJZP51OEk47TuI7W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZjTZ6B1OEk48IKLNS_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01QtMw6S1OEk409CleU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q6X8in1OEk46LhPH4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN010KrCZg1OEk46sCpuc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01EwplT11OEk47QWYmr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010hx4BS1OEk46EB13X_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010FNqTy1OEk48IKPY4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ya0hZb1OEk46sC20S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01t8slVj1OEk44z0oBx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BshbjJ1OEk48IJ0EN_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN0160paI41OEk455ePXw_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01iEXPhL1OEk455eLOF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KBo8SJ1OEk45xzlaJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01juz3C61OEk47QXdMn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NnWnxM1OEk47QYAcj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lQYmIz1OEk47TtUFG_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tovldk1OEk48IJGsP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01fdbsPp1OEk455ec2c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01dNCIwD1OEk48om1Ch_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01i0zFob1OEk4099oin_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01RsbFZW1OEk46rYiaP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019wHU6U1OEk48JXbNf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01WQuJJ01OEk47yGGsr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01vEOiqU1OEk455eD5W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01gyhJnY1OEk46rZJzl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01zmPofR1OEk47QZqa2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cj2bLe1OEk44QIH77_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Hr7QQk1OEk455eD5o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01wawYYq1OEk44QJDIc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jeoNXM1OEk4695phm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01rqdBL51OEk46h42wi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018IZqUw1OEk47yEKL5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01oZsD0L1OEk46rZSKF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BEH7PT1OEk44z2kmy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png'
        ],
        specsPrices: {
          '150ml赠水乳体验礼': {
            price: 129.00,
            originalPrice: 199.00
          },
          '300ml赠湿敷礼': {
            price: 238.00,
            originalPrice: 438.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['经典版']
          },
          {
            name: '净含量',
            options: ['150ml赠水乳体验礼', '300ml赠湿敷礼']
          }
        ],
        categoryId: 2
      },

      102: { 
        id: 102, 
        name: 'HBN原白霜美白面霜熊果苷精华霜淡斑提亮祛斑敏肌',
        description: '显著美白淡斑，温和不刺激，层层净黑不反黑¹',
        price: 278.00,
        originalPrice: 399.00,
        sales: 5628,
        stock: 755,
        tags: ['显著美白淡斑', '温和不刺激'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/2.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01O0xtim1OEk4VycMez-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN016JnPXp1OEk4S6dI0B-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01eVfN7W1OEk2jZKWse_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN011gMYat1OEk4MNrN1S-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01IrCyUL1OEk45y2W5G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZJP8le1OEk455eTkB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ZO0oXf1OEk48IKXqH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZI7R951OEk47V3WNm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01cITqdf1OEk47yF8Ba_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01weuugL1OEk46sDm4d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016hJbK01OEk4099Y0s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01KYpWZf1OEk48JQHjj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01APblQm1OEk46AGo7p_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01eYUxlL1OEk46sDZdQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ei50zM1OEk455bjFv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01RMqOfs1OEk46h5ioa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jd4zxe1OEk47TsgKp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01omAPJX1OEk46rXAso_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KWOA3k1OEk46LhL6i_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BzJZP51OEk47TuI7W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZjTZ6B1OEk48IKLNS_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01QtMw6S1OEk409CleU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q6X8in1OEk46LhPH4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN010KrCZg1OEk46sCpuc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01EwplT11OEk47QWYmr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010hx4BS1OEk46EB13X_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010FNqTy1OEk48IKPY4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ya0hZb1OEk46sC20S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01t8slVj1OEk44z0oBx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BshbjJ1OEk48IJ0EN_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN0160paI41OEk455ePXw_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01iEXPhL1OEk455eLOF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KBo8SJ1OEk45xzlaJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01juz3C61OEk47QXdMn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NnWnxM1OEk47QYAcj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lQYmIz1OEk47TtUFG_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tovldk1OEk48IJGsP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01fdbsPp1OEk455ec2c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01dNCIwD1OEk48om1Ch_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01i0zFob1OEk4099oin_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01RsbFZW1OEk46rYiaP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019wHU6U1OEk48JXbNf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01WQuJJ01OEk47yGGsr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01vEOiqU1OEk455eD5W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01gyhJnY1OEk46rZJzl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01zmPofR1OEk47QZqa2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cj2bLe1OEk44QIH77_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Hr7QQk1OEk455eD5o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01wawYYq1OEk44QJDIc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jeoNXM1OEk4695phm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01rqdBL51OEk46h42wi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018IZqUw1OEk47yEKL5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01oZsD0L1OEk46rZSKF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BEH7PT1OEk44z2kmy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png'
        ],
        specsPrices: {
          '150ml赠水乳体验礼': {
            price: 129.00,
            originalPrice: 199.00
          },
          '300ml赠湿敷礼': {
            price: 238.00,
            originalPrice: 438.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['经典版']
          },
          {
            name: '净含量',
            options: ['150ml赠水乳体验礼', '300ml赠湿敷礼']
          }
        ],
        categoryId: 2
      },


      103: { 
        id: 103, 
        name: 'HBN原白乳α-熊果苷美白淡斑精华乳液透亮温和',
        description: '硬核糖氧双抗¹，根源抑黑减黄，美白透亮不反黑²',
        price: 219.00,
        originalPrice: 399.00,
        sales: 5628,
        stock: 755,
        tags: ['根源抑黑减黄', '核糖氧双抗'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/3.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01Zy190x1OEk4X9kZLe-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01DaRiCj1OEk4UOvcCo-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01r9bAqc1OEjxIgzzGn_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01CtS7Es1OEk4MFCYIb-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01IrCyUL1OEk45y2W5G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZJP8le1OEk455eTkB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ZO0oXf1OEk48IKXqH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZI7R951OEk47V3WNm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01cITqdf1OEk47yF8Ba_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01weuugL1OEk46sDm4d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016hJbK01OEk4099Y0s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01KYpWZf1OEk48JQHjj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01APblQm1OEk46AGo7p_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01eYUxlL1OEk46sDZdQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ei50zM1OEk455bjFv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01RMqOfs1OEk46h5ioa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jd4zxe1OEk47TsgKp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01omAPJX1OEk46rXAso_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KWOA3k1OEk46LhL6i_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BzJZP51OEk47TuI7W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZjTZ6B1OEk48IKLNS_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01QtMw6S1OEk409CleU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q6X8in1OEk46LhPH4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN010KrCZg1OEk46sCpuc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01EwplT11OEk47QWYmr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010hx4BS1OEk46EB13X_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010FNqTy1OEk48IKPY4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ya0hZb1OEk46sC20S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01t8slVj1OEk44z0oBx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BshbjJ1OEk48IJ0EN_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN0160paI41OEk455ePXw_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01iEXPhL1OEk455eLOF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KBo8SJ1OEk45xzlaJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01juz3C61OEk47QXdMn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NnWnxM1OEk47QYAcj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lQYmIz1OEk47TtUFG_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tovldk1OEk48IJGsP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01fdbsPp1OEk455ec2c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01dNCIwD1OEk48om1Ch_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01i0zFob1OEk4099oin_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01RsbFZW1OEk46rYiaP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019wHU6U1OEk48JXbNf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01WQuJJ01OEk47yGGsr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01vEOiqU1OEk455eD5W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01gyhJnY1OEk46rZJzl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01zmPofR1OEk47QZqa2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cj2bLe1OEk44QIH77_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Hr7QQk1OEk455eD5o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01wawYYq1OEk44QJDIc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jeoNXM1OEk4695phm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01rqdBL51OEk46h42wi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018IZqUw1OEk47yEKL5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01oZsD0L1OEk46rZSKF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BEH7PT1OEk44z2kmy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png'
        ],
        specsPrices: {
          '90ml赠水乳体验礼': {
            price: 219.00,
            originalPrice: 199.00
          },
          '210ml赠湿敷礼': {
            price: 368.00,
            originalPrice: 438.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['经典版']
          },
          {
            name: '净含量',
            options: ['90ml', '210ml']
          }
        ],
        categoryId: 2
      },


      104: { 
        id: 104, 
        name: 'HBN原白乳α-熊果苷美白淡斑精华乳液透亮温和',
        description: '多维焕亮减黄，实力御氧¹焕亮，源头改善暗沉',
        price: 619.00,
        originalPrice: 799.00,
        sales: 5628,
        stock: 755,
        tags: ['多维焕亮减黄', '改善暗沉'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/4.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01Fmcqjp1OEk2myYINP_!!4611686018427384634-0-item_pic.jpg_.webp',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN016lLkuT1OEjuK8u3Jd_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01VuNMWs1OEjuV3tiE2_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01z69z3m1OEk4Me0Kxa-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01IrCyUL1OEk45y2W5G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZJP8le1OEk455eTkB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ZO0oXf1OEk48IKXqH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZI7R951OEk47V3WNm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01cITqdf1OEk47yF8Ba_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01weuugL1OEk46sDm4d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016hJbK01OEk4099Y0s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01KYpWZf1OEk48JQHjj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01APblQm1OEk46AGo7p_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01eYUxlL1OEk46sDZdQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ei50zM1OEk455bjFv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01RMqOfs1OEk46h5ioa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jd4zxe1OEk47TsgKp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01omAPJX1OEk46rXAso_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KWOA3k1OEk46LhL6i_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BzJZP51OEk47TuI7W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZjTZ6B1OEk48IKLNS_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01QtMw6S1OEk409CleU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q6X8in1OEk46LhPH4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN010KrCZg1OEk46sCpuc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01EwplT11OEk47QWYmr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010hx4BS1OEk46EB13X_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010FNqTy1OEk48IKPY4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ya0hZb1OEk46sC20S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01t8slVj1OEk44z0oBx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BshbjJ1OEk48IJ0EN_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN0160paI41OEk455ePXw_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01iEXPhL1OEk455eLOF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KBo8SJ1OEk45xzlaJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01juz3C61OEk47QXdMn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NnWnxM1OEk47QYAcj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lQYmIz1OEk47TtUFG_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tovldk1OEk48IJGsP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01fdbsPp1OEk455ec2c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01dNCIwD1OEk48om1Ch_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01i0zFob1OEk4099oin_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01RsbFZW1OEk46rYiaP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019wHU6U1OEk48JXbNf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01WQuJJ01OEk47yGGsr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01vEOiqU1OEk455eD5W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01gyhJnY1OEk46rZJzl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01zmPofR1OEk47QZqa2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cj2bLe1OEk44QIH77_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Hr7QQk1OEk455eD5o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01wawYYq1OEk44QJDIc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jeoNXM1OEk4695phm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01rqdBL51OEk46h42wi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018IZqUw1OEk47yEKL5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01oZsD0L1OEk46rZSKF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BEH7PT1OEk44z2kmy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png'
        ],
        specsPrices: {
          '90ml赠水乳体验礼': {
            price: 719.00,
            originalPrice: 619.00
          },
          // '210ml赠湿敷礼': {
          //   price: 368.00,
          //   originalPrice: 438.00
          // }
        },
        specs: [
          {
            name: '规格',
            options: ['经典版']
          },
          {
            name: '净含量',
            options: ['100ml']
          }
        ],
        categoryId: 2
      },



      105: { 
        id: 105, 
        name: 'HBN熊果苷发光面膜2.0补水保湿提亮肤色烟酰胺',
        description: '多通路密集焕亮修护，5维卓效淡暗沉，敷出莹润水光肌',
        price: 109.00,
        originalPrice: 399.00,
        sales: 5628,
        stock: 755,
        tags: ['5维卓效淡暗沉', '敷出莹润水光肌'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/美白焕亮/5.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01O0xtim1OEk4VycMez-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN016JnPXp1OEk4S6dI0B-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01eVfN7W1OEk2jZKWse_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN011gMYat1OEk4MNrN1S-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01IrCyUL1OEk45y2W5G_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZJP8le1OEk455eTkB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ZO0oXf1OEk48IKXqH_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ZI7R951OEk47V3WNm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01cITqdf1OEk47yF8Ba_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01weuugL1OEk46sDm4d_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016hJbK01OEk4099Y0s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01KYpWZf1OEk48JQHjj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01APblQm1OEk46AGo7p_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01eYUxlL1OEk46sDZdQ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ei50zM1OEk455bjFv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01RMqOfs1OEk46h5ioa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jd4zxe1OEk47TsgKp_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01omAPJX1OEk46rXAso_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KWOA3k1OEk46LhL6i_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BzJZP51OEk47TuI7W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ZjTZ6B1OEk48IKLNS_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01QtMw6S1OEk409CleU_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01q6X8in1OEk46LhPH4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN010KrCZg1OEk46sCpuc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01EwplT11OEk47QWYmr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010hx4BS1OEk46EB13X_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN010FNqTy1OEk48IKPY4_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01ya0hZb1OEk46sC20S_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01t8slVj1OEk44z0oBx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01BshbjJ1OEk48IJ0EN_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN0160paI41OEk455ePXw_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01iEXPhL1OEk455eLOF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01KBo8SJ1OEk45xzlaJ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01juz3C61OEk47QXdMn_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01NnWnxM1OEk47QYAcj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01lQYmIz1OEk47TtUFG_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01tovldk1OEk48IJGsP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01fdbsPp1OEk455ec2c_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01dNCIwD1OEk48om1Ch_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01i0zFob1OEk4099oin_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01RsbFZW1OEk46rYiaP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN019wHU6U1OEk48JXbNf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01WQuJJ01OEk47yGGsr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01vEOiqU1OEk455eD5W_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01gyhJnY1OEk46rZJzl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01zmPofR1OEk47QZqa2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Cj2bLe1OEk44QIH77_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01Hr7QQk1OEk455eD5o_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01wawYYq1OEk44QJDIc_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01jeoNXM1OEk4695phm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01rqdBL51OEk46h42wi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018IZqUw1OEk47yEKL5_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01oZsD0L1OEk46rZSKF_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01BEH7PT1OEk44z2kmy_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png'
        ],
        specsPrices: {
          '15片超值': {
            price: 327.00,
            originalPrice: 399.00
          },
          '10片': {
            price: 218.00,
            originalPrice: 238.00
          },
          '5片': {
            price: 109.00,
            originalPrice: 199.00
          },
        },
        specs: [
          {
            name: '规格',
            options: ['经典版']
          },
          {
            name: '净含量',
            options: ['15片', '10片', '5片']
          }
        ],
        categoryId: 2
      },



      // 维护保湿系列产品
      201: { 
        id: 201, 
        name: 'B5面霜',
        description: '构筑三重屏障修护体系，28天维稳舒缓，强韧肌肤屏障，修护屏障+11.88%、滋润保湿+11.44%、泛红-6.25%',
        price: 159.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['深层保湿', '修护屏障'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/1.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/1.png',
          'https://www.hbn.cn/assets/3-BxE2s-DI.png',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01P57NaE1OEk4NlJ1H3-2204177871674.jpg',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01XC32Vo1OEk4OTh1C0-2204177871674.jpg'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '50ml': {
            price: 229.00,
            originalPrice: 438.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['50ml']
          }
        ],
        categoryId: 3
      },


      202: { 
        id: 202, 
        name: 'HBN弹簧霜凝水霜重组胶原蛋白抗皱紧致清爽保湿',
        description: '敏肌抗老¹0门槛，边修护边抗老¹，促生四大关键胶原，肌肤嘭弹不显纹',
        price: 159.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['边修护边抗老', '肌肤嘭弹'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/2.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01GnML331OEk4R2TBVy-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01zTI0LA1OEk4MinlhQ-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01F5NoVn1OEk03VHSkx-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01LZ5x891OEk12VUIkP_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '50g': {
            price: 258.00,
            originalPrice: 338.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['50g']
          }
        ],
        categoryId: 3
      },

      203: { 
        id: 203, 
        name: 'HBN厚皮精华液五重高浓度神经酰胺B5屏障敏感肌',
        description: '卓效修护屏障，增厚表皮，减少泛红，显著提升皮肤耐受力',
        price: 159.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['增厚表皮', '减少泛红'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/3.mp4',
        productVideo2: 'https://www.hbn.cn/videos/product/xh/3/1.mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN015L6SZn1OEk4aTpiTS-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01sAlYGI1OEjtRgGHf6_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01ZDWhsB1OEjt53cpew_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01GjOUue1OEjt5QeW03_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '15g': {
            price: 169.00,
            originalPrice: 238.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['15g']
          }
        ],
        categoryId: 3
      },

      204: { 
        id: 204, 
        name: 'HBN闪修精华液修护维稳舒缓泛红屏障补水敏感肌',
        description: '精准修护光损泛红，快褪红、深舒缓、强修护',
        price: 159.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['快褪红', '深舒缓'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/4.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01s04XmL1OEk4aAksGP-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01tTJVDY1OEjt3TRLK8_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01yzGJsA1OEjt0FxA1n_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01BEv9ze1OEk4FkYjhm-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '48g': {
            price: 359.00,
            originalPrice: 438.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['48g']
          }
        ],
        categoryId: 3
      },

      205: { 
        id: 205, 
        name: 'HBN复原露2.0前导精华玻尿酸神经酰胺修护补水',
        description: '层层深润沁透，协同修护光损，显著改善干·糙·红',
        price: 179.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['修护光损', '深润沁透'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/5.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01GnML331OEk4R2TBVy-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01zTI0LA1OEk4MinlhQ-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01F5NoVn1OEk03VHSkx-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01LZ5x891OEk12VUIkP_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '80g': {
            price: 179.00,
            originalPrice: 238.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['80g']
          }
        ],
        categoryId: 3
      },


      206: { 
        id: 206, 
        name: 'HBN复原露2.0前导精华玻尿酸神经酰胺修护补水',
        description: '层层深润沁透，协同修护光损，显著改善干·糙·红',
        price: 179.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['修护光损', '深润沁透'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/6.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01GnML331OEk4R2TBVy-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01zTI0LA1OEk4MinlhQ-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01F5NoVn1OEk03VHSkx-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01LZ5x891OEk12VUIkP_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '80g': {
            price: 179.00,
            originalPrice: 238.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['80g']
          }
        ],
        categoryId: 3
      },



      207: { 
        id: 207, 
        name: 'HBN酵母面膜2.0玻尿酸补水保湿修护贴片面膜',
        description: '熬夜急修护，多维抵御光老化¹，敷出丰润水嫩肌',
        price: 109.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['熬夜急修护', '抵御光老化'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/维护保湿/7.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01GnML331OEk4R2TBVy-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01zTI0LA1OEk4MinlhQ-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01F5NoVn1OEk03VHSkx-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01LZ5x891OEk12VUIkP_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          '15片超值': {
            price: 327.00,
            originalPrice: 399.00
          },
          '10片': {
            price: 218.00,
            originalPrice: 238.00
          },
          '5片': {
            price: 109.00,
            originalPrice: 199.00
          },
        },
        specs: [
          {
            name: '规格',
            options: ['经典版']
          },
          {
            name: '净含量',
            options: ['15片', '10片', '5片']
          }
        ],
        categoryId: 3
      },


      301: { 
        id: 301, 
        name: 'HBN三重氨基酸洗面奶洁面乳2.0深层清洁温和男女',
        description: '超强起泡科技，SPA级奢润洗感，深入毛孔的净澈力',
        price: 179.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['净澈体系', '超强起泡'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/1.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01GnML331OEk4R2TBVy-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01zTI0LA1OEk4MinlhQ-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01F5NoVn1OEk03VHSkx-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01LZ5x891OEk12VUIkP_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '100g': {
            price: 125.00,
            originalPrice: 238.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['100g']
          }
        ],
        categoryId: 3
      },


      302: { 
        id: 302, 
        name: 'HBN无泪卸妆精华乳霜清洁温和敏感肌不糊眼不刺激',
        description: '不挑肤质¹的无泪配方²，精准溶解全脸彩妆，遇水一冲即化，享SPA级奢润洗卸体验',
        price: 179.00,
        originalPrice: 219.00,
        sales: 6531,
        stock: 620,
        tags: ['不挑肤质', '一冲即化'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/2.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://gw.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01wmTMNx1OEk4TMnTOy_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01c0KCjl1OEk2HPQwvz_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01g1tfFl1OEk2AaLsdO_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01ncgR8k1OEk3Ng4cxg_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '128ml': {
            price: 205.00,
            originalPrice: 288.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['128ml']
          }
        ],
        categoryId: 3
      },
      

      303: { 
        id: 303, 
        name: 'HBN黑盾防晒霜乳超高倍SPF50+清爽隔离通勤女',
        description: '全波段¹硬核防晒力，20h持久防晒⁴，一抹长效哑光，防晒力堪比硬防晒',
        price: 218.00,
        originalPrice: 299.00,
        sales: 6531,
        stock: 620,
        tags: ['PA++++', '晒不红'],
        productVideo: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/基础护肤/3.mp4',
        productVideo2: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/video-index (1).mp4',
        bannerImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01ISEqVW1OEk4awSQKS_!!4611686018427384634-0-item_pic.jpg_.webp',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN017Z5R0C1OEk4aI2Q4C_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01zTe4En1OEk4bAQyIF-2204177871674.jpg_.webp',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01HV5g0F1OEk3gdPu4e_!!2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01fHnKUr1OEk4YB6Lzm-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i1/2204177871674/O1CN01ERNb2q1OEk4OxqImi-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01rrn6Ze1OEk4MQPjm1_!!2204177871674.png_.webp',
          'https://img.alicdn.com/bao/uploaded/i4/2204177871674/O1CN01SmXOll1OEk4Me0k5U-2204177871674.jpg_.webp'
        ],
        specsPrices: {
          // '50g单瓶装': {
          //   price: 159.00,
          //   originalPrice: 219.00
          // },
          '50ml': {
            price: 218.00,
            originalPrice: 288.00
          }
        },
        specs: [
          {
            name: '规格',
            options: ['标准装']
          },
          {
            name: '净含量',
            options: ['50ml']
          }
        ],
        categoryId: 3
      },

      
    };
    
    // 获取指定ID的商品数据或默认返回第一个商品
    const product = productsData[id] || productsData[1];
    
    // 安全地设置默认价格和规格
    let defaultSpec = '';
    let defaultPrice = product.price || 0;
    let defaultOriginalPrice = product.originalPrice || 0;
    
    // 安全检查：确保规格数据存在且格式正确
    if (product.specs && Array.isArray(product.specs) && product.specs.length > 1 && 
        product.specs[1].options && product.specs[1].options.length > 0) {
      defaultSpec = product.specs[1].options[0];
      
      // 如果规格价格信息存在，使用规格价格
      if (product.specsPrices && product.specsPrices[defaultSpec]) {
        defaultPrice = product.specsPrices[defaultSpec].price;
        defaultOriginalPrice = product.specsPrices[defaultSpec].originalPrice;
      }
    }
    
    // 更新商品数据和默认价格到页面
    this.setData({
      product: product,
      currentPrice: defaultPrice,
      currentOriginalPrice: defaultOriginalPrice,
      selectedSpecs: {
        '规格': product.specs && product.specs[0] ? product.specs[0].options[0] : '标准装',
        '净含量': defaultSpec
      }
    });
    
    // 设置页面标题为商品名称
    wx.setNavigationBarTitle({
      title: product.name
    });
    
    // 隐藏加载提示
    wx.hideLoading();
    
    // 检查商品是否已收藏
    this.checkFavoriteStatus();
    
    // 初始化价格计算
    this.updatePrice();
    
    // 初始化详情图片懒加载
    this.initDetailImagesLazyLoad(product.detailImages);
  },

  // 初始化详情图片懒加载
  initDetailImagesLazyLoad(detailImages) {
    if (!detailImages || !detailImages.length) return;
    
    // 计算初始加载图片
    const initialImages = detailImages.slice(0, this.data.visibleDetailImageCount);
    
    this.setData({
      loadedDetailImages: initialImages,
      isDetailImagesFullyLoaded: initialImages.length >= detailImages.length
    });
    
    console.log(`初始加载 ${initialImages.length}/${detailImages.length} 张详情图片`);
  },
  
  // 加载更多详情图片
  loadMoreDetailImages() {
    if (this.data.isDetailImagesFullyLoaded) return;
    
    const allImages = this.data.product.detailImages;
    const loadedCount = this.data.loadedDetailImages.length;
    const nextLoadCount = Math.min(loadedCount + this.data.detailImageLoadStep, allImages.length);
    
    // 加载下一批图片
    const newLoadedImages = allImages.slice(0, nextLoadCount);
    
    this.setData({
      loadedDetailImages: newLoadedImages,
      isDetailImagesFullyLoaded: nextLoadCount >= allImages.length
    });
    
    console.log(`已加载 ${nextLoadCount}/${allImages.length} 张详情图片`);
  },
  
  // 详情滚动触底事件
  onDetailScrollToLower() {
    console.log("滚动到底部，加载更多图片");
    this.loadMoreDetailImages();
  },
  
  // 检查商品是否已收藏
  checkFavoriteStatus() {
    const productId = this.data.product.id;
    
    // 首先检查本地存储
    const favorites = wx.getStorageSync('favorites') || [];
    const isLocalFavorite = favorites.some(item => item.id === productId);
    
    // 确保云环境已初始化
    wx.cloud.init({
      env: 'cloud1-0gxff61z2804383c',
      traceUser: true
    });
    
    // 检查云数据库中是否已收藏
    wx.cloud.callFunction({
      name: 'syncFavorites',
      data: {
        action: 'getFromCloud',
        userId: 'user_001' // 固定用户ID，实际应该从登录状态获取
      }
    })
    .then(res => {
      if (res.result && res.result.code === 0 && res.result.data) {
        const cloudFavorites = res.result.data;
        const isCloudFavorite = cloudFavorites.some(item => item.product_id === productId);
        
        // 如果云端和本地状态不一致，以云端为准
        if (isCloudFavorite !== isLocalFavorite) {
          // 更新本地收藏状态
          if (isCloudFavorite) {
            // 云端有但本地没有，添加到本地
            if (!isLocalFavorite) {
              const cloudItem = cloudFavorites.find(item => item.product_id === productId);
              if (cloudItem) {
                favorites.push({
                  id: cloudItem.product_id,
                  name: cloudItem.name,
                  image: cloudItem.image,
                  price: cloudItem.price,
                  originalPrice: cloudItem.originalPrice,
                  category: cloudItem.category || '商品',
                  date: cloudItem.create_time.split(' ')[0],
                  portrait_tags: cloudItem.portrait_tags || []
                });
                wx.setStorageSync('favorites', favorites);
              }
            }
          } else {
            // 云端没有但本地有，从本地移除
            const index = favorites.findIndex(item => item.id === productId);
            if (index > -1) {
              favorites.splice(index, 1);
              wx.setStorageSync('favorites', favorites);
            }
          }
        }
        
        // 更新UI显示
        this.setData({
          isFavorite: isCloudFavorite
        });
      } else {
        // 如果云端获取失败，使用本地状态
        this.setData({
          isFavorite: isLocalFavorite
        });
      }
    })
    .catch(err => {
      console.error('检查收藏状态失败:', err);
      // 如果检查失败，使用本地状态
      this.setData({
        isFavorite: isLocalFavorite
      });
    });
  },
  
  // 收藏/取消收藏商品
  toggleFavorite() {
    const product = this.data.product;
    if (!product) return;
    
    // 显示加载中提示
    wx.showLoading({
      title: this.data.isFavorite ? '取消收藏中...' : '收藏中...',
      mask: true
    });
    
    let favorites = wx.getStorageSync('favorites') || [];
    const productId = product.id;
    
    // 判断是否已收藏
    const favoriteIndex = favorites.findIndex(item => item.id === productId);
    
    // 创建收藏对象
    const favoriteItem = {
      id: productId,
      name: product.name,
      image: product.bannerImages[0],
      price: this.data.currentPrice,
      originalPrice: this.data.currentOriginalPrice,
      sales: product.sales || 0,
      category: product.category || '商品',
      date: new Date().toISOString().split('T')[0], // 当前日期，格式：YYYY-MM-DD
      portrait_tags: product.portrait_tags || []
    };
    
    // 调用云函数处理收藏
    wx.cloud.init({
      env: 'cloud1-0gxff61z2804383c',
      traceUser: true
    });
    
    if (favoriteIndex > -1) {
      // 已收藏，取消收藏
      favorites.splice(favoriteIndex, 1);
      
      // 调用云函数取消收藏
      wx.cloud.callFunction({
        name: 'syncFavorites',
        data: {
          action: 'removeFavorite',
          userId: 'user_001', // 用固定用户ID，实际应该从登录状态获取
          data: {
            productId: productId
          }
        }
      })
      .then(() => {
        this.setData({ isFavorite: false });
        wx.hideLoading();
        wx.showToast({
          title: '已取消收藏',
          icon: 'success'
        });
        
        // 保存收藏列表到本地存储
        wx.setStorageSync('favorites', favorites);
      })
      .catch(err => {
        console.error('取消收藏失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      });
    } else {
      // 未收藏，添加收藏
      favorites.push(favoriteItem);
      
      // 调用云函数添加收藏
      wx.cloud.callFunction({
        name: 'syncFavorites',
        data: {
          action: 'addFavorite',
          userId: 'user_001', // 用固定用户ID，实际应该从登录状态获取
          data: favoriteItem
        }
      })
      .then(() => {
        this.setData({ isFavorite: true });
        wx.hideLoading();
        wx.showToast({
          title: '收藏成功',
          icon: 'success'
        });
        
        // 保存收藏列表到本地存储
        wx.setStorageSync('favorites', favorites);
      })
      .catch(err => {
        console.error('添加收藏失败:', err);
        wx.hideLoading();
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      });
    }
  },

  // 视频资源懒加载
  lazyLoadVideo() {
    if (this.data.isVideosLoaded || this.data.videoLoading) return;
    
    this.setData({ videoLoading: true });
    
    // 延迟创建视频上下文，避免一次性加载太多资源
    setTimeout(() => {
      if (this.data.currentMainSwiper === 0) {
        this.videoContext1 = wx.createVideoContext('product-video-1');
        setTimeout(() => {
          if (this.videoContext1) this.videoContext1.play();
        }, 500);
      }
      
      this.setData({
        isVideosLoaded: true,
        videoLoading: false
      });
    }, 800);
  },

  swiperChange(e) {
    const current = e.detail.current;
    console.log('主轮播切换到:', current);
    
    this.setData({
      currentMainSwiper: current
    });
    
    // 当切换到第一屏时，懒加载视频
    if (current === 0 && !this.data.isVideosLoaded) {
      this.lazyLoadVideo();
    }
  },

  // 显示规格选择器 - 加入购物车
  showCartSelector() {
    this.setData({ 
      showSpecSelector: true,
      actionType: 'cart'
    });
  },
  
  // 显示规格选择器 - 立即购买
  showBuySelector() {
    this.setData({ 
      showSpecSelector: true,
      actionType: 'buy'
    });
  },

  // 隐藏规格选择器
  hideSpecSelector() {
    this.setData({
      showSpecSelector: false
    });
  },

  preventTouchMove() {
    return false;
  },

  selectSpec(e) {
    const { type, value } = e.currentTarget.dataset;
    
    // 更新已选规格
    const selectedSpecs = {...this.data.selectedSpecs};
    selectedSpecs[type] = value;
    
    // 更新数据
    this.setData({
      selectedSpecs
    });
    
    // 更新价格
    this.updatePrice();
  },

  // 更新价格方法
  updatePrice() {
    // 获取选中的净含量规格
    const selectedSpec = this.data.selectedSpecs['净含量'];
    let basePrice = this.data.product.price;
    let baseOriginalPrice = this.data.product.originalPrice;
    
    // 如果有根据规格的价格，使用规格价格作为基础价格
    if (this.data.product.specsPrices && this.data.product.specsPrices[selectedSpec]) {
      const priceInfo = this.data.product.specsPrices[selectedSpec];
      basePrice = priceInfo.price;
      baseOriginalPrice = priceInfo.originalPrice;
    }
    
    // 根据数量计算总价
    const totalPrice = (basePrice * this.data.quantity).toFixed(2);
    const totalOriginalPrice = (baseOriginalPrice * this.data.quantity).toFixed(2);
    
    this.setData({
      currentPrice: totalPrice,
      currentOriginalPrice: totalOriginalPrice
    });
  },

  // 导航到首页
  goToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 导航到购物车
  goToCart() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  // 添加到购物车
  addToCart() {
    // 获取选中的商品信息
    const product = this.data.product;
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.bannerImages[0],
      price: product.price, // 存储单价，而非总价
      originalPrice: product.originalPrice,
      quantity: this.data.quantity,
      specs: this.data.selectedSpecs,
      selected: true // 默认选中
    };
    
    // 从本地存储获取购物车数据
    const cartItems = wx.getStorageSync('cartItems') || [];
    
    // 查找购物车中是否已有该商品+规格组合
    const existingItemIndex = cartItems.findIndex(item => 
      item.id === cartItem.id && 
      JSON.stringify(item.specs) === JSON.stringify(cartItem.specs)
    );
    
    if (existingItemIndex > -1) {
      // 已有该商品，增加数量
      cartItems[existingItemIndex].quantity += this.data.quantity;
    } else {
      // 没有该商品，新增
      cartItems.push(cartItem);
    }
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', cartItems);
    
    // 显示添加成功提示
    wx.showToast({
      title: `已加入购物车 ${this.data.quantity} 件`,
      icon: 'success'
    });
    
    this.hideSpecSelector();
  },

  // 立即购买
  buyNow() {
    // 获取商品信息和选择的规格
    const product = this.data.product;
    const selectedSpecs = this.data.selectedSpecs;
    const quantity = this.data.quantity;
    
    // 构建购买信息对象
    const productInfo = {
      id: product.id,
      name: product.name,
      image: product.bannerImages[0],
      price: product.price,  // 存储单价，而非总价
      originalPrice: product.originalPrice,
      specs: selectedSpecs
    };
    
    // 将商品信息编码并传递给确认订单页
    wx.navigateTo({
      url: `/pages/order/confirm?productInfo=${encodeURIComponent(JSON.stringify(productInfo))}&quantity=${quantity}`
    });
    
    this.hideSpecSelector();
  },

  // 添加页面滚动监听方法
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    if (scrollTop > 50) {
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

  // 添加返回方法
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 添加视频控制相关方法
  onReady() {
    // 页面渲染完后设置延迟，确保视频元素已加载
    setTimeout(() => {
      this.videoContext1 = wx.createVideoContext('product-video-1');
      
      if (this.data.product && this.data.product.productVideo2) {
        this.videoContext2 = wx.createVideoContext('product-video-2');
      }
      
      if (this.videoContext1) {
        this.videoContext1.play();
      }
      
      // 设置稍长一点的延迟加载第二个视频，避免两个视频同时初始化可能导致的资源竞争
      setTimeout(() => {
        if (this.videoContext2) {
          this.videoContext2.play();
        }
      }, 300);
      
      // 商品详情视频处理
      if (this.data.product && this.data.product.detailVideoIndex !== undefined) {
        this.detailVideoContext = wx.createVideoContext('detail-video');
      }
    }, 500);
  },
  
  // 处理视频错误
  videoError(e) {
    console.error('视频播放错误:', e.detail.errMsg);
    const videoId = e.currentTarget.id;
    console.log('视频ID:', videoId);
    
    // 错误处理：切换到静态图片显示
    if (videoId === 'product-video-1' && this.data.product && this.data.product.bannerImages.length > 0) {
      // 使用第一张静态图片作为替代
      wx.showToast({
        title: '视频加载失败，已切换为图片模式',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 切换浮窗展开/收起
  toggleFloatExpand() {
    this.setData({
      floatExpanded: !this.data.floatExpanded
    });
  },

  // 轮播图切换处理
  bannerSwiperChange(e) {
    const current = e.detail.current;
    console.log('当前轮播索引:', current);
    
    // 如果切换到视频项，确保视频播放
    if (current === 0 && this.videoContext1) {
      this.videoContext1.play();
    } else if (current === 1 && this.videoContext2) {
      this.videoContext2.play();
    }
  },

  // 添加数量控制方法
  decreaseQuantity() {
    if (this.data.quantity > this.data.minQuantity) {
      this.setData({
        quantity: this.data.quantity - 1
      });
      // 更新价格
      this.updatePrice();
    } else {
      wx.showToast({
        title: '不能再减少了',
        icon: 'none'
      });
    }
  },

  increaseQuantity() {
    if (this.data.quantity < this.data.maxQuantity) {
      this.setData({
        quantity: this.data.quantity + 1
      });
      // 更新价格
      this.updatePrice();
    } else {
      wx.showToast({
        title: '已达到最大购买数量',
        icon: 'none'
      });
    }
  },

  // 直接输入数量
  inputQuantity(e) {
    let value = parseInt(e.detail.value);
    
    // 检查是否是合法数字
    if (isNaN(value)) {
      value = this.data.minQuantity;
    }
    
    // 限制数量范围
    if (value < this.data.minQuantity) {
      value = this.data.minQuantity;
    } else if (value > this.data.maxQuantity) {
      value = this.data.maxQuantity;
    }
    
    this.setData({
      quantity: value
    });
    
    // 更新价格
    this.updatePrice();
  },

  // 添加图片点击方法
  viewImage(e) {
    const url = e.currentTarget.dataset.url;
    const urls = this.data.product.bannerImages;
    
    wx.previewImage({
      current: url,
      urls: urls
    });
  },

  // 添加处理详情视频错误的方法
  detailVideoError(e) {
    console.error('详情视频播放错误:', e.detail.errMsg);
    // 显示更友好的错误提示
    wx.showToast({
      title: '视频加载失败，请检查网络后重试',
      icon: 'none',
      duration: 2000
    });
  }
}) 