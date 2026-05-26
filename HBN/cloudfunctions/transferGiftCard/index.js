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
      cardId,         // 礼品卡ID
      fromUserId,     // 转出用户ID
      fromUserName,   // 转出用户名称
      toUserId,       // 接收用户ID
      toUserName      // 接收用户名称
    } = event
    
    // 当前时间
    const transferTime = new Date().toISOString().replace('T', ' ').replace(/\..+/, '')
    
    // 查询卡的当前状态
    const cardResult = await db.collection('gift_cards').doc(cardId).get()
    const card = cardResult.data
    
    // 验证卡是否属于当前用户
    if (card.userId !== fromUserId) {
      return {
        success: false,
        code: 'NOT_OWNER',
        message: '您不是该礼品卡的持有者'
      }
    }
    
    // 验证卡是否可以转赠
    if (!card.canTransfer) {
      return {
        success: false,
        code: 'TRANSFER_NOT_ALLOWED',
        message: '此礼品卡不可转赠'
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
    
    // 开始事务
    const transaction = await db.startTransaction()
    
    try {
      // 1. 创建交易记录
      await transaction.collection('gift_card_transactions').add({
        data: {
          cardId: cardId,
          userId: toUserId,
          userName: toUserName,
          type: 'transfer',
          amount: card.value - card.usedAmount,
          balance: card.value - card.usedAmount,
          time: transferTime,
          remark: '礼品卡转赠',
          operatorId: fromUserId
        }
      })
      
      // 2. 更新礼品卡所有权
      await transaction.collection('gift_cards').doc(cardId).update({
        data: {
          userId: toUserId,
          userName: toUserName,
          transferHistory: db.command.push({
            fromUserId: fromUserId,
            fromUserName: fromUserName,
            toUserId: toUserId,
            toUserName: toUserName,
            transferTime: transferTime
          })
        }
      })
      
      // 提交事务
      await transaction.commit()
      
      return {
        success: true,
        message: '礼品卡转赠成功'
      }
    } catch (err) {
      // 事务失败，回滚
      await transaction.rollback()
      
      console.error('事务执行失败：', err)
      return {
        success: false,
        code: 'TRANSACTION_FAILED',
        message: '转赠操作失败',
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