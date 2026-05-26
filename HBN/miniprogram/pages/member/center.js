// pages/member/center.js
Page({
  data: {
    userInfo: {
      avatarUrl: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/头像/职场精英女性.jpg',
      nickName: '职场精英女性',
      memberLevel: '铂金会员'
    },
    memberCardBgUrl: 'https://img.api.aa1.cn/2025/05/09/24817c7281585.png',
    // 会员详情信息
    memberDetail: {
      points: 1580,
      expirePoints: 200, // 即将过期积分
      growth: 1580, // 当前成长值
      nextLevel: {
        name: '钻石会员',
        needGrowth: 2000, // 需要的成长值
        remainingGrowth: 420 // 距离下一级还需成长值
      }
    },
    // 会员特权列表
    privileges: [
      { id: 1, name: '专属客服', icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/客户服务.png' },
      { id: 2, name: '生日礼包', icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/生日礼包.png' },
      { id: 3, name: '积分加速', icon: 'cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/图标/积分加速.png' }
    ],
    // 会员等级规则
    levelRules: [
      { name: '普通会员', minGrowth: 0, maxGrowth: 999 },
      { name: '黄金会员', minGrowth: 1000, maxGrowth: 1999 },
      { name: '铂金会员', minGrowth: 2000, maxGrowth: 4999 },
      { name: '钻石会员', minGrowth: 5000, maxGrowth: null }
    ],
    // 成长值获取规则
    growthRules: [
      { title: '购物消费', desc: '每消费1元获得1点成长值' },
      { title: '评价商品', desc: '发布有效评价获得10点成长值' },
      { title: '邀请好友', desc: '每成功邀请1位好友获得50点成长值' },
      { title: '每日签到', desc: '连续签到额外增加成长值' }
    ],
    activeSectionIndex: 0 // 0:会员特权, 1:等级规则, 2:成长值规则
  },

  onLoad: function(options) {
    this.loadUserMemberInfo();
  },
  
  /**
   * 加载用户会员信息
   */
  loadUserMemberInfo() {
    // 实际项目中从服务器获取数据
  },
  
  /**
   * 切换选项卡
   */
  switchSection(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeSectionIndex: index
    });
  },
  
  /**
   * 查看积分明细
   */
  viewPointsDetail() {
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },
  
  /**
   * 查看我的权益
   */
  viewMyPrivileges() {
    wx.showToast({
      title: '查看我的权益',
      icon: 'none'
    });
  },
  
  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  }
}) 