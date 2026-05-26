// 引入全局函数
const app = getApp()
Component({
  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#afafaf",
    selectedColor: "#618a49",
    backgroundColor: "#F7F8F8",
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/assets/index.png",
        selectedIconPath: "/assets/index-light.png",
        text: "首页",
      },
      {
        pagePath: "/pages/classify/classify",
        iconPath: "/assets/classify.png",
        selectedIconPath: "/assets/classify-light.png",
        text: "分类"
      },
      {
        pagePath: "/pages/HBN/HBN",
        bulge:true,
        iconPath: "/assets/logo.png",
        selectedIconPath: "/assets/logo.png",
        text: "直播有赠"
      },
      {
        pagePath: "/pages/cart/cart",
        iconPath: "/assets/cart.png",
        selectedIconPath: "/assets/cart-light.png",
        text: "购物车",
      },
      {
        pagePath: "/pages/Personal/Personal",
        iconPath: "/assets/vip.png",
        selectedIconPath: "/assets/vip-light.png",
        text: "个人中心"
      },
    ]
  },
  ready: function() {
    this.setData({
      selected: app.globalData.selected
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      // console.log(e);
      const data = e.currentTarget.dataset;
      const url = data.path;
      app.globalData.selected = data.index;
      wx.switchTab({url})
    }
  }
})

