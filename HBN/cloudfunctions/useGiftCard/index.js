// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 获取传入的参数
    const { 
      cardId,       // 礼品卡ID
      userId,       // 用户ID
      userName,     // 用户名称
      useAmount     // 使用金额
    } = event
    
    // 当前时间
    const useTime = new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
    
    // 查询卡的当前状态
    const cardResult = await db.collection('gift_cards').doc(cardId).get()
    const card = cardResult.data
    
    // 验证卡是否属于当前用户
    if (card.userId !== userId) {
      return {
        success: false,
        code: 'NOT_OWNER',
        message: '您不是该礼品卡的持有者'
      }
    }
    
    // 验证卡是否有效
    if (card.status !== 'valid') {
      return {
        success: false,
        code: 'INVALID_CARD',
        message: '礼品卡状态无效'
      }
    }
    
    // 验证可用余额
    const availableBalance = card.value - card.usedAmount
    if (useAmount > availableBalance) {
      return {
        success: false,
        code: 'INSUFFICIENT_BALANCE',
        message: '礼品卡余额不足',
        availableBalance: availableBalance
      }
    }
    
    // 开始事务
    const transaction = await db.startTransaction()
    
    try {
      // 1. 创建使用记录
      await transaction.collection('gift_card_transactions').add({
        data: {
          cardId: cardId,
          userId: userId,
          userName: userName,
          type: 'use',
          amount: useAmount,
          balance: availableBalance - useAmount,
          time: useTime,
          remark: '礼品卡使用',
          operatorId: userId
        }
      })
      
      // 2. 更新礼品卡已使用金额
      const newUsedAmount = card.usedAmount + useAmount
      const newStatus = newUsedAmount >= card.value ? 'used' : 'valid'
      
      await transaction.collection('gift_cards').doc(cardId).update({
        data: {
          usedAmount: newUsedAmount,
          status: newStatus,
          lastUsedTime: useTime
        }
      })
      
      // 提交事务
      await transaction.commit()
      
      return {
        success: true,
        message: '礼品卡使用成功',
        usedAmount: newUsedAmount,
        remainingBalance: card.value - newUsedAmount,
        status: newStatus
      }
    } catch (err) {
      // 事务失败，回滚
      await transaction.rollback()
      
      console.error('事务执行失败：', err)
      return {
        success: false,
        code: 'TRANSACTION_FAILED',
        message: '使用礼品卡失败',
        error: err
      }
    }
  } catch (err) {
    console.error('云函数执行异常：', err)
    return {
      success: false,
      code: 'CLOUD_FUNCTION_ERROR',
      message: '服务异常，请稍后重试',
      error: err
    }
  }
} 