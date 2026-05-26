// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'YOUR_CLOUD_ENV_ID'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, recordData, userId, points, reason } = event
  
  console.log('云函数updatePoints被调用:', action, userId, points)
  
  // 校验参数
  if (!action || !userId) {
    return {
      success: false,
      errMsg: '参数不完整'
    }
  }
  
  const db = cloud.database()
  const _ = db.command
  
  try {
    // 根据不同的操作执行不同的逻辑
    if (action === 'addRecord' && recordData) {
      // 添加积分记录
      const result = await db.collection('points').add({
        data: recordData
      })
      
      // 更新用户积分
      await updateUserPoints(db, userId, recordData.points)
      
      return {
        success: true,
        result: result
      }
    } else if (action === 'addPoints' && points && reason) {
      // 获取用户当前积分
      const userResult = await db.collection('user').where({
        id: userId
      }).get()
      
      if (!userResult.data || userResult.data.length === 0) {
        return {
          success: false,
          errMsg: '未找到用户'
        }
      }
      
      const userData = userResult.data[0]
      const userName = userData.name
      const currentPoints = userData.experience || userData.assets.points || 0
      const newPoints = currentPoints + points
      
      // 生成记录ID
      const now = new Date()
      const recordId = `P${userId}${now.getTime().toString().slice(-6)}`
      
      // 创建记录数据
      const dateStr = formatDate(now)
      const recordData = {
        id: recordId,
        userId: userId,
        userName: userName,
        type: points > 0 ? 'earn' : 'spend',
        points: points,
        desc: reason,
        date: dateStr,
        balance: newPoints,
        createTime: dateStr,
        updateTime: dateStr,
        status: 1
      }
      
      // 添加积分记录
      const result = await db.collection('points').add({
        data: recordData
      })
      
      // 更新用户积分
      await updateUserPoints(db, userId, points)
      
      return {
        success: true,
        result: result,
        newPoints: newPoints
      }
    } else {
      return {
        success: false,
        errMsg: '未知操作或参数不完整'
      }
    }
  } catch (err) {
    console.error('云函数更新积分失败:', err)
    return {
      success: false,
      errMsg: err.message,
      error: err
    }
  }
}

// 更新用户积分
async function updateUserPoints(db, userId, points) {
  // 获取用户当前积分
  const userResult = await db.collection('user').where({
    id: userId
  }).get()
  
  if (!userResult.data || userResult.data.length === 0) {
    throw new Error('未找到用户')
  }
  
  const userData = userResult.data[0]
  const currentPoints = userData.experience || userData.assets.points || 0
  const newPoints = currentPoints + points
  
  // 更新用户积分
  await db.collection('user').where({
    id: userId
  }).update({
    data: {
      experience: newPoints,
      'assets.points': newPoints
    }
  })
  
  return newPoints
}

// 格式化日期
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
} 