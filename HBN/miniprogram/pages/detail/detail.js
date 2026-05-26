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

  loadProductData(id) {
    // 模拟商品数据库
    const productsData = {
      // 第一个商品 - 早C晚A套装
      1: {
        id: 1,
        name: 'HBN视黄醇精华乳2.0双a醇乳液紧致抗皱焕亮',
        description: '初老救星，焕亮抚纹',
        price: 189.00, // 默认价格（120ml规格）
        originalPrice: 289.00,
        sales: 2156,
        stock: 999,
        productVideo: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载 (3).mp4',
        productVideo2: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/商品视频/1.mp4',
        bannerImages: [
          'https://www.hbn.cn/assets/1-BZbFkdFc.png',
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
        ]
      },
      
      // 第二个商品 - 发光水
      2: {
        id: 2,
        name: 'HBN发光水α-熊果苷精粹水2.0提亮保湿爽肤水湿敷水',
        description: '淡细纹焕亮眼周，抗皱紧致保湿修护眼霜',
        price: 119.00,
        originalPrice: 219.00,
        sales: 1892,
        stock: 765,
        productVideo: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载.mp4',
        productVideo2: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/商品视频/2.mp4',
        bannerImages: [
          'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/美白焕亮/1.png',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN016pBonP1OEk4NCa0sE-2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i3/2204177871674/O1CN01aWnQVG1OEk0mNTMJ2_!!2204177871674.jpg_.webp',
          'https://img.alicdn.com/bao/uploaded/i2/2204177871674/O1CN01tAUUhn1OEk4Mw5I3u-2204177871674.jpg_.webp'
        ],
        detailImages: [
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01w4e2LS1OEk3sqmFxu_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01OiEEQ91OEk0vOeTUP_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01P1DxXY1OEk3td1dtd_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01PRQBDU1OEk3rBwHAo_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01h0tWrN1OEk0u507fx_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01NgYD0v1OEk0vCVUdF_!!2204177871674.jpg',
          'https://cloud.video.taobao.com/play/u/2204177871674/p/2/e/6/t/1/487091759285.mp4?appKey=38824',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01zoE6go1OEk3mDQbgd_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01DJJBUL1OEk3sUClN6_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01t7Aohe1OEk3t46Lnr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01T4vJXm1OEk3sr1QTj_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01a9hO8B1OEk3rBwLL0_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01p1IFPZ1OEk3s4OD6N_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01zoE6go1OEk3mDQbgd_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01ioBmx01OEk3r4lZbm_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01W9YhAl1OEk3sK058s_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN016NKPh01OEk0mF8MJ7_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01EBquSJ1OEk3sK2hJ8_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01Sexnvl1OEk3rBvXQ9_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01jUmuG61OEk3qWFnX2_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01acvm1h1OEk3uAKMg0_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01v060am1OEk3r4jpU7_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01fdMoeT1OEk3tFkNUf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01HgkETv1OEk0sqaddi_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN012pCFot1OEk3sUBl0U_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01OFUgoQ1OEk3tf8LzK_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01XnVBPe1OEk0vCSCTB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01NXqsAj1OEk3td3WLB_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01M4UMmw1OEk3tf8Q98_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01raeGTK1OEk3r4jd0g_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01eISX291OEk3s4PHaC_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01NS58sX1OEjwHf06Pl_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01nBoDGR1OEk3tFjIzd_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN0189quLt1OEk3uAGwby_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01OBCev71OEk0u4vUPZ_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01TteUxU1OEk0tUvzQd_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01bsaAmA1OEk0qc1hdE_!!2204177871674.jpg',

          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01JDd5FR1OEk3tFm7aa_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i4/2204177871674/O1CN01kJpHfk1OEk3td3vHr_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i2/2204177871674/O1CN01mOcO7T1OEk0vCQzfv_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01epEuoV1OEk0vOZIyf_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN018iGDer1OEk0sqZMgq_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/2204177871674/O1CN01a8JEDv1OEk0uXaH8E_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i1/2204177871674/O1CN01wag42R1OEk0rPmb6l_!!2204177871674.jpg',
          'https://img.alicdn.com/imgextra/i3/O1CN01XU1Y2d1Sk7fIMOkeU_!!6000000002284-2-tps-1125-1446.png',
        ],
        detailVideoIndex: 6,
        specsPrices: {
          '150ml赠水乳体验礼': {
            price: 119.00,
            originalPrice: 219.00
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
        ]
      },
      
      // 第三个商品 - 视黄醇精华乳
      3: {
        id: 3,
        name: 'HBN视黄醇精华乳2.0',
        description: '双A醇乳液紧致抗皱焕亮淡化细纹护肤品',
        price: 199.00,
        originalPrice: 289.00,
        sales: 3214,
        stock: 546,
        productVideo: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/下载 (2).mp4',
        productVideo2: 'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/商品视频/3.mp4',
        bannerImages: [
          'cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/抗老紧致/3.png',
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
            price: 538.00,
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
      }
    };
    
    // 获取指定ID的商品数据
    const productData = productsData[id] || productsData[1]; // 如果找不到，默认返回第一个商品
    
    // 安全地设置默认价格和规格
    let defaultSpec = '';
    let defaultPrice = productData.price || 0;
    let defaultOriginalPrice = productData.originalPrice || 0;
    
    // 安全检查：确保规格数据存在且格式正确
    if (productData.specs && Array.isArray(productData.specs) && productData.specs.length > 1 && 
        productData.specs[1].options && productData.specs[1].options.length > 0) {
      defaultSpec = productData.specs[1].options[0];
      
      // 如果规格价格信息存在，使用规格价格
      if (productData.specsPrices && productData.specsPrices[defaultSpec]) {
        defaultPrice = productData.specsPrices[defaultSpec].price;
        defaultOriginalPrice = productData.specsPrices[defaultSpec].originalPrice;
      }
    }
    
    // 更新商品数据和默认价格到页面
    this.setData({
      product: productData,
      currentPrice: defaultPrice,
      currentOriginalPrice: defaultOriginalPrice,
      selectedSpecs: {
        '规格': productData.specs && productData.specs[0] ? productData.specs[0].options[0] : '标准装',
        '净含量': defaultSpec
      }
    });
    
    // 设置页面标题为商品名称
    wx.setNavigationBarTitle({
      title: productData.name
    });

    // 检查商品是否已收藏
    this.checkFavoriteStatus();
    
    // 初始化价格计算
    this.updatePrice();
    
    // 初始化详情图片懒加载
    this.initDetailImagesLazyLoad(productData.detailImages);
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
      env: 'YOUR_CLOUD_ENV_ID',
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

  // 添加收藏/取消收藏
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
      env: 'YOUR_CLOUD_ENV_ID',
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

  // 主轮播图切换事件
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

  // 选择规格
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
      price: this.data.currentPrice,
      originalPrice: this.data.currentOriginalPrice,
      quantity: this.data.quantity,
      specs: this.data.selectedSpecs,
      selected: true // 默认选中
    };
    
    // 从本地存储获取购物车数据
    let cartItems = wx.getStorageSync('cartItems') || [];
    
    // 检查购物车中是否已有相同规格的商品
    const existingItemIndex = cartItems.findIndex(item => 
      item.id === cartItem.id && 
      JSON.stringify(item.specs) === JSON.stringify(cartItem.specs)
    );
    
    if (existingItemIndex > -1) {
      // 如果已经存在，增加数量
      cartItems[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // 如果不存在，添加新项
      cartItems.push(cartItem);
    }
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', cartItems);
    
    // 提示用户
    wx.showToast({
      title: `已加入购物车 ${this.data.quantity} 件`,
      icon: 'success'
    });
    
    this.hideSpecSelector();
  },

  // 立即购买
  buyNow() {
    // 检查是否选择了规格
    if (!this.validateSpecSelection()) {
      return;
    }
    
    // 获取商品信息
    const product = this.data.product;
    const productInfo = {
      id: product.id,
      name: product.name,
      image: product.bannerImages[0],
      price: this.data.currentPrice,
      originalPrice: this.data.currentOriginalPrice,
      selectedSpecs: this.data.selectedSpecs,
      bannerImages: product.bannerImages
    };
    
    // 隐藏规格选择器
    this.hideSpecSelector();
    
    // 将商品信息编码，以便传递到订单确认页面
    const encodedProductInfo = encodeURIComponent(JSON.stringify(productInfo));
    
    // 跳转到订单确认页面
    wx.navigateTo({
      url: `/pages/order/confirm?productInfo=${encodedProductInfo}&quantity=${this.data.quantity}`
    });
  },
  
  // 验证规格选择
  validateSpecSelection() {
    // 可以在这里添加更多的规格验证逻辑
    return true;
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

  // 添加视频处理相关方法
  onReady() {
    // 如果页面初始停留在第一屏，初始化第一个视频
    if (this.data.currentMainSwiper === 0) {
      this.lazyLoadVideo();
    }
    
    // 第二个视频在轮播切换时才加载
    this.videoContext2 = null; // 初始化为null，后续按需创建

    // 商品ID为2时，创建详情视频上下文，但不自动播放
    if (this.data.product && this.data.product.id === 2 && 
        this.data.product.detailVideoIndex !== undefined) {
      // 详情视频会懒加载，不在初始化时创建
      this.detailVideoContext = null;
    }
  },
  
  // 处理视频错误
  videoError(e) {
    console.error('视频播放错误:', e.detail.errMsg);
    const videoId = e.currentTarget.id;
    console.log('视频ID:', videoId);
  },

  // 切换浮窗展开/收起
  toggleFloatExpand() {
    this.setData({
      floatExpanded: !this.data.floatExpanded
    });
  },

  // 轮播图切换处理 - 增强版
  bannerSwiperChange(e) {
    const current = e.detail.current;
    console.log('banner轮播索引:', current);
    
    // 处理视频播放
    if (current === 0 && this.videoContext1) {
      this.videoContext1.play();
    } else if (current === 1) {
      if (!this.videoContext2) {
        // 懒加载第二个视频
        setTimeout(() => {
          this.videoContext2 = wx.createVideoContext('product-video-2');
          if (this.videoContext2) this.videoContext2.play();
        }, 300);
      } else {
        this.videoContext2.play();
      }
    }
    
    // 如果切换到图片项，优化图片显示
    if (current > 1) {
      // 可以在这里做一些图片特定的优化
      console.log('显示图片，索引:', current);
    }
  },

  // 添加数量控制方法
  decreaseQuantity() {
    if (this.data.quantity > this.data.minQuantity) {
      const newQuantity = this.data.quantity - 1;
      this.setData({
        quantity: newQuantity
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
      const newQuantity = this.data.quantity + 1;
      this.setData({
        quantity: newQuantity
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
    const value = parseInt(e.detail.value);
    if (!isNaN(value)) {
      let newQuantity = value;
      if (value < this.data.minQuantity) {
        newQuantity = this.data.minQuantity;
      } else if (value > this.data.maxQuantity) {
        newQuantity = this.data.maxQuantity;
      } 
      
      this.setData({ quantity: newQuantity });
      // 更新价格
      this.updatePrice();
    } else {
      this.setData({ quantity: this.data.minQuantity });
      // 更新价格
      this.updatePrice();
    }
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
  },
  
  // 处理详情视频点击事件
  detailVideoTap() {
    // 懒加载详情视频
    if (!this.detailVideoContext && this.data.product && 
        this.data.product.id === 2 && this.data.product.detailVideoIndex !== undefined) {
      
      console.log('初始化详情视频上下文');
      this.detailVideoContext = wx.createVideoContext('detail-video');
    }
  },
  
  // 处理详情视频播放状态变化
  detailVideoPlay() {
    console.log('详情视频开始播放');
  },
  
  // 处理详情视频暂停
  detailVideoPause() {
    console.log('详情视频暂停');
  },

  /**
   * 添加到浏览历史记录
   */
  addToHistory: function() {
    const product = this.data.product;
    
    // 确保商品数据已加载
    if (!product || !product.id) {
      return;
    }
    
    // 初始化云开发环境
    wx.cloud.init({
      env: 'YOUR_CLOUD_ENV_ID',
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
}) 