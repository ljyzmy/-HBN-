// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { 
      userId,           // 用户ID
      liveId,           // 直播间ID
      couponType,       // 优惠券类型：'live'表示直播专享
      couponValue       // 优惠券金额
    } = event
    
    // 记录所有操作结果
    const result = {
      success: true,
      operations: {},
      couponInfo: null // 将返回给前端的优惠券信息
    }
    
    // 获取用户文档ID
    let docId = ''
    if (userId === 1) {
      docId = '81fbbcd56843e1b201a3215777235ffb' // 职场精英女性
    } else if (userId === 3) {
      docId = '81fbbcd56843e1b201a321597f5fd078' // 科研工作者
    } else {
      docId = '81fbbcd56843e1b201a3215836053277' // 都市新锐青年(默认)
    }
    
    // 1. 检查用户是否已经领取过此直播间的优惠券
    try {
      const checkResult = await db.collection('coupons')
        .where({
          userId: userId,
          liveId: liveId,
          source: 'live'
        })
        .count()
      
      if (checkResult.total > 0) {
        return {
          success: false,
          error: '您已领取过该直播间的优惠券'
        }
      }
      
      result.operations.check = {
        success: true,
        count: checkResult.total
      }
    } catch (err) {
      console.error('检查优惠券领取状态失败:', err)
      // 检查失败但继续处理
      result.operations.check = {
        success: false,
        error: err.message
      }
    }
    
    // 2. 创建新的优惠券
    try {
      // 设置优惠券过期时间：30天后
      const expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + 30)
      
      // 获取用户当前的用户画像信息，为优惠券定制不同的特性
      const userDoc = await db.collection('user').doc(docId).get()
      const userData = userDoc.data || {}
      
      // 根据用户画像定制优惠券特性
      let couponName = `¥${couponValue}直播专享券`
      let couponDesc = '全场通用'
      let couponCondition = 0 // 默认无门槛
      
      if (userData.nickName === '职场精英女性') {
        // 职场精英女性：高端产品专享
        couponDesc = '高端护肤品专享'
        couponCondition = 300 // 满300可用
      } else if (userData.nickName === '科研工作者') {
        // 科研工作者：功效型产品专享
        couponDesc = '功效型产品专享'
        couponCondition = 200 // 满200可用
      } else {
        // 都市新锐青年：新品专享
        couponDesc = '新品专享'
        couponCondition = 100 // 满100可用
      }
      
      // 构建优惠券数据
      const couponData = {
        id: 'LIVE_' + liveId + '_' + Date.now(),
        name: couponName,
        type: 'discount',
        condition: couponCondition,
        value: couponValue,
        liveId: liveId,
        expireDate: formatDate(expireDate),
        desc: couponDesc,
        instructions: '直播间领取，不可与其他优惠同时使用',
        used: false,
        usable: true,
        userId: userId,
        source: 'live',
        createTime: formatDate(new Date())
      }
      
      // 添加到coupons集合
      const addResult = await db.collection('coupons').add({
        data: couponData
      })
      
      result.operations.addCoupon = {
        success: true,
        result: addResult
      }
      
      // 设置返回给前端的优惠券信息
      result.couponInfo = couponData
      result.couponInfo._id = addResult._id
    } catch (err) {
      console.error('创建优惠券失败:', err)
      result.operations.addCoupon = {
        success: false,
        error: err.message
      }
      result.success = false
      
      return {
        success: false,
        error: '创建优惠券失败：' + err.message
      }
    }
    
    // 3. 更新用户的优惠券数量
    try {
      // 获取可用优惠券数量
      const couponsCount = await db.collection('coupons')
        .where({
          userId: userId,
          used: false,
          usable: true,
          expireDate: _.gte(formatDate(new Date()))
        })
        .count()
      
      // 更新user集合中的优惠券数量
      const userUpdateResult = await db.collection('user').doc(docId).update({
        data: {
          'assets.coupons': couponsCount.total,
          updateTime: formatDate(new Date())
        }
      })
      
      result.operations.userUpdate = {
        success: true,
        couponCount: couponsCount.total,
        result: userUpdateResult
      }
    } catch (err) {
      console.error('更新用户优惠券数量失败:', err)
      result.operations.userUpdate = {
        success: false,
        error: err.message
      }
      // 这个错误不影响整体结果
    }
    
    // 4. 记录优惠券领取事件
    try {
      await db.collection('coupon_activity').add({
        data: {
          userId: userId,
          couponId: result.couponInfo._id,
          activityType: 'live',
          activityId: liveId,
          activityName: '直播间专享优惠券',
          couponValue: couponValue,
          createTime: formatDate(new Date())
        }
      })
    } catch (err) {
      console.error('记录优惠券领取事件失败:', err)
      // 这个错误不影响整体结果
    }
    
    // 5. 更新优惠券统计
    try {
      // 获取当前用户信息
      const userDoc = await db.collection('user').doc(docId).get()
      const userData = userDoc.data
      
      // 更新统计信息
      const couponStats = userData.couponStats || {}
      const totalReceived = (couponStats.totalReceived || 0) + 1
      const liveReceived = (couponStats.liveReceived || 0) + 1
      
      const statsResult = await db.collection('user').doc(docId).update({
        data: {
          'couponStats.totalReceived': totalReceived,
          'couponStats.liveReceived': liveReceived,
          'couponStats.lastReceiveTime': formatDate(new Date()),
          updateTime: formatDate(new Date())
        }
      })
      
      result.operations.couponStats = {
        success: true,
        totalReceived: totalReceived,
        liveReceived: liveReceived,
        result: statsResult
      }
    } catch (err) {
      console.error('更新优惠券统计信息失败:', err)
      // 这个错误不影响整体结果
    }
    
    return result
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 格式化日期辅助函数
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
} 