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
      cardId,     // 礼品卡ID
      userId,     // 用户ID
      userName    // 用户名称
    } = event
    
    // 当前时间
    const activateTime = new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
    
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
    
    // 验证卡是否已经激活
    if (card.status === 'valid') {
      return {
        success: false,
        code: 'ALREADY_ACTIVATED',
        message: '礼品卡已经激活'
      }
    }
    
    // 开始事务
    const transaction = await db.startTransaction()
    
    try {
      // 1. 创建激活记录
      await transaction.collection('gift_card_transactions').add({
        data: {
          cardId: cardId,
          userId: userId,
          userName: userName,
          type: 'activate',
          amount: card.value,
          balance: card.value,
          time: activateTime,
          remark: '礼品卡激活',
          operatorId: userId
        }
      })
      
      // 2. 更新礼品卡状态
      await transaction.collection('gift_cards').doc(cardId).update({
        data: {
          status: 'valid',
          lastUsedTime: activateTime
        }
      })
      
      // 提交事务
      await transaction.commit()
      
      return {
        success: true,
        message: '礼品卡激活成功'
      }
    } catch (err) {
      // 事务失败，回滚
      await transaction.rollback()
      
      console.error('事务执行失败：', err)
      return {
        success: false,
        code: 'TRANSACTION_FAILED',
        message: '激活操作失败',
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