// pages/chatBot/chatBot.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chatMode: "model", // bot 表示使用agent，model 表示使用大模型
    showBotAvatar: true, // 是否在对话框左侧显示头像
    agentConfig: {
      botId: "YOUR_BOT_ID", // agent id,
      allowWebSearch: true, // 允许客户端选择启用联网搜索
      allowUploadFile: true, // 允许上传文件
      allowPullRefresh: true, // 允许下拉刷新
      allowUploadImage: true, // 允许上传图片
    },
    modelConfig: {
      modelProvider: "deepseek",
      quickResponseModel: "deepseek-v3", // 快速响应模型 （混元 turbo, gpt4 turbo版，deepseek v3等）
      logo: "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/图标/LOGO.png", // model 头像
      welcomeMsg: "您好，我是HBN的智能产品顾问，很高兴为您提供护肤咨询和产品推荐。请问有什么可以帮助您的？", // model 欢迎语
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
