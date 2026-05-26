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
      orderInfo,        // 订单信息
      newBalance,       // 更新后的余额
      deductAmount,     // 扣除的金额
      earnedPoints,     // 获得的积分
      couponId          // 使用的优惠券ID（如有）
    } = event
    
    // 记录所有操作结果
    const result = {
      success: true,
      operations: {}
    }
    
    // 1. 更新用户余额（user集合和user_balance集合）
    try {
      // 获取用户文档ID
      let docId = ''
      if (userId === 1) {
        docId = '81fbbcd56843e1b201a3215777235ffb' // 职场精英女性
      } else if (userId === 3) {
        docId = '81fbbcd56843e1b201a321597f5fd078' // 科研工作者
      } else {
        docId = '81fbbcd56843e1b201a3215836053277' // 都市新锐青年(默认)
      }
      
      // 更新user集合
      const userUpdateResult = await db.collection('user').doc(docId).update({
        data: {
          accountBalance: newBalance,
          updateTime: formatDate(new Date())
        }
      })
      
      // 查询user_balance集合是否存在记录
      const balanceQuery = await db.collection('user_balance').where({
        userId: userId
      }).get()
      
      let balanceUpdateResult
      if (balanceQuery.data && balanceQuery.data.length > 0) {
        // 更新已存在的记录
        const balanceDocId = balanceQuery.data[0]._id
        balanceUpdateResult = await db.collection('user_balance').doc(balanceDocId).update({
          data: {
            balance: newBalance,
            availableBalance: newBalance,
            totalExpense: _.inc(deductAmount),
            updateTime: formatDate(new Date())
          }
        })
      } else {
        // 创建新记录
        balanceUpdateResult = await db.collection('user_balance').add({
          data: {
            userId: userId,
            balance: newBalance,
            availableBalance: newBalance,
            frozenBalance: 0,
            totalIncome: 0,
            totalExpense: deductAmount,
            updateTime: formatDate(new Date()),
            createTime: formatDate(new Date())
          }
        })
      }
      
      result.operations.balance = {
        user: userUpdateResult,
        balance: balanceUpdateResult
      }
    } catch (err) {
      console.error('更新余额失败:', err)
      result.operations.balance = {
        success: false,
        error: err.message
      }
      result.success = false
    }
    
    // 2. 添加余额交易记录
    try {
      const transaction = {
        id: 'T' + Date.now(),
        userId: 'user_' + userId,
        type: 2, // 2表示消费
        amount: -deductAmount,
        date: formatDate(new Date()),
        status: 1, // 1表示成功
        desc: orderInfo.product.name,
        orderNo: orderInfo.orderNumber,
        createTime: formatDate(new Date())
      }
      
      const transactionResult = await db.collection('balance').add({
        data: transaction
      })
      
      result.operations.transaction = {
        success: true,
        result: transactionResult
      }
    } catch (err) {
      console.error('添加余额交易记录失败:', err)
      result.operations.transaction = {
        success: false,
        error: err.message
      }
    }
    
    // 3. 更新用户积分（如果有）
    if (earnedPoints && earnedPoints > 0) {
      try {
        // 获取用户文档ID（与上面相同，但为了模块化，再获取一次）
        let docId = ''
        if (userId === 1) {
          docId = '81fbbcd56843e1b201a3215777235ffb' // 职场精英女性
        } else if (userId === 3) {
          docId = '81fbbcd56843e1b201a321597f5fd078' // 科研工作者
        } else {
          docId = '81fbbcd56843e1b201a3215836053277' // 都市新锐青年(默认)
        }
        
        // 获取当前积分
        const userDoc = await db.collection('user').doc(docId).get()
        const currentUser = userDoc.data
        const assets = currentUser.assets || {}
        const currentPoints = assets.points || 0
        const newPoints = currentPoints + earnedPoints
        
        // 更新用户积分
        const pointsUpdateResult = await db.collection('user').doc(docId).update({
          data: {
            'assets.points': newPoints,
            experience: newPoints, // 同时更新experience字段
            updateTime: formatDate(new Date())
          }
        })
        
        // 添加积分记录
        const pointsRecordResult = await db.collection('points').add({
          data: {
            userId: userId,
            points: earnedPoints,
            type: 'earn',
            description: `购买商品获得${earnedPoints}积分`,
            date: formatDate(new Date()),
            createTime: formatDate(new Date()),
            orderNumber: orderInfo.orderNumber
          }
        })
        
        result.operations.points = {
          success: true,
          currentPoints: currentPoints,
          newPoints: newPoints,
          updateResult: pointsUpdateResult,
          recordResult: pointsRecordResult
        }
      } catch (err) {
        console.error('更新积分失败:', err)
        result.operations.points = {
          success: false,
          error: err.message
        }
      }
    }
    
    // 4. 更新优惠券状态（如果有使用优惠券）
    if (couponId) {
      try {
        const couponUpdateResult = await db.collection('coupons').doc(couponId).update({
          data: {
            used: true,
            useTime: formatDate(new Date()),
            orderNumber: orderInfo.orderNumber
          }
        })
        
        // 更新用户的优惠券数量
        try {
          let docId = ''
          if (userId === 1) {
            docId = '81fbbcd56843e1b201a3215777235ffb' // 职场精英女性
          } else if (userId === 3) {
            docId = '81fbbcd56843e1b201a321597f5fd078' // 科研工作者
          } else {
            docId = '81fbbcd56843e1b201a3215836053277' // 都市新锐青年(默认)
          }
          
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
          await db.collection('user').doc(docId).update({
            data: {
              'assets.coupons': couponsCount.total,
              updateTime: formatDate(new Date())
            }
          })
        } catch (err) {
          console.error('更新用户优惠券数量失败:', err)
        }
        
        result.operations.coupon = {
          success: true,
          result: couponUpdateResult
        }
      } catch (err) {
        console.error('更新优惠券状态失败:', err)
        result.operations.coupon = {
          success: false,
          error: err.message
        }
      }
    }
    
    // 5. 更新订单状态为待发货
    try {
      const orderUpdateResult = await db.collection('orders').where({
        orderId: orderInfo.orderId
      }).update({
        data: {
          status: 'unshipped',
          statusText: '待发货',
          payTime: formatDate(new Date()),
          payMethod: '余额支付',
          updateTime: formatDate(new Date())
        }
      })
      
      result.operations.orderStatus = {
        success: true,
        result: orderUpdateResult
      }
    } catch (err) {
      console.error('更新订单状态失败:', err)
      result.operations.orderStatus = {
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