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
      couponId,         // 优惠券ID
      orderInfo,        // 订单信息
      couponAmount      // 优惠券减免金额
    } = event
    
    // 记录所有操作结果
    const result = {
      success: true,
      operations: {}
    }
    
    // 1. 更新优惠券状态为已使用
    try {
      if (!couponId) {
        throw new Error('优惠券ID不能为空')
      }
      
      const couponUpdateResult = await db.collection('coupons').doc(couponId).update({
        data: {
          used: true,
          useTime: formatDate(new Date()),
          orderNumber: orderInfo.orderNumber
        }
      })
      
      result.operations.couponUpdate = {
        success: true,
        result: couponUpdateResult
      }
    } catch (err) {
      console.error('更新优惠券状态失败:', err)
      result.operations.couponUpdate = {
        success: false,
        error: err.message
      }
      result.success = false
    }
    
    // 2. 获取用户文档ID
    let docId = ''
    if (userId === 1) {
      docId = '81fbbcd56843e1b201a3215777235ffb' // 职场精英女性
    } else if (userId === 3) {
      docId = '81fbbcd56843e1b201a321597f5fd078' // 科研工作者
    } else {
      docId = '81fbbcd56843e1b201a3215836053277' // 都市新锐青年(默认)
    }
    
    // 3. 查询剩余可用优惠券数量并更新用户资产
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
    }
    
    // 4. 添加优惠券使用记录
    try {
      const couponRecord = {
        userId: userId,
        couponId: couponId,
        orderNumber: orderInfo.orderNumber,
        amount: couponAmount,
        useTime: formatDate(new Date()),
        productInfo: {
          id: orderInfo.product.id,
          name: orderInfo.product.name,
          quantity: orderInfo.product.quantity
        },
        createTime: formatDate(new Date())
      }
      
      const recordResult = await db.collection('coupon_usage').add({
        data: couponRecord
      })
      
      result.operations.couponRecord = {
        success: true,
        result: recordResult
      }
    } catch (err) {
      console.error('添加优惠券使用记录失败:', err)
      result.operations.couponRecord = {
        success: false,
        error: err.message
      }
    }
    
    // 5. 验证并同步优惠券总使用金额统计
    try {
      // 获取当前用户信息
      const userDoc = await db.collection('user').doc(docId).get()
      const userData = userDoc.data
      
      // 更新统计信息
      const couponStats = userData.couponStats || {}
      const totalUsed = (couponStats.totalUsed || 0) + 1
      const totalAmount = (couponStats.totalAmount || 0) + couponAmount
      
      const statsResult = await db.collection('user').doc(docId).update({
        data: {
          'couponStats.totalUsed': totalUsed,
          'couponStats.totalAmount': totalAmount,
          'couponStats.lastUseTime': formatDate(new Date()),
          updateTime: formatDate(new Date())
        }
      })
      
      result.operations.couponStats = {
        success: true,
        totalUsed: totalUsed,
        totalAmount: totalAmount,
        result: statsResult
      }
    } catch (err) {
      console.error('更新优惠券统计信息失败:', err)
      result.operations.couponStats = {
        success: false,
        error: err.message
      }
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