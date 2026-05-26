// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'YOUR_CLOUD_ENV_ID'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { collection, docId, updateData } = event
  
  console.log('云函数updateBalance被调用:', collection, docId, updateData)
  
  // 校验参数
  if (!collection || !docId || !updateData) {
    return {
      success: false,
      errMsg: '参数不完整'
    }
  }
  
  try {
    const db = cloud.database()
    
    // 如果更新数据包含递增操作
    if (updateData.totalIncome && typeof updateData.totalIncome === 'object') {
      // 递增操作需要特殊处理
      const _ = db.command
      const result = await db.collection(collection).doc(docId).update({
        data: {
          ...updateData,
          totalIncome: _.inc(updateData.totalIncome.inc)
        }
      })
      
      return {
        success: true,
        result: result
      }
    } else {
      // 普通更新操作
      const result = await db.collection(collection).doc(docId).update({
        data: updateData
      })
      
      return {
        success: true,
        result: result
      }
    }
  } catch (err) {
    console.error('云函数更新数据失败:', err)
    return {
      success: false,
      errMsg: err.message,
      error: err
    }
  }
} 