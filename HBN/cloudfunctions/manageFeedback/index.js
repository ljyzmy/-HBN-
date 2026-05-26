// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-0gxff61z2804383c' }) // 使用指定的云环境ID
const db = cloud.database()
const feedbackCollection = db.collection('feedback')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  
  // 根据action执行不同的操作
  switch (action) {
    case 'add':
      return await addFeedback(data, wxContext)
    case 'getList':
      return await getFeedbackList(data, wxContext)
    case 'getFeedbackByUser':
      return await getFeedbackByUser(wxContext)
    case 'getFeedbackById':
      return await getFeedbackById(data)
    case 'updateStatus':
      return await updateFeedbackStatus(data, wxContext)
    case 'updateFeedback':
      return await updateFeedback(data, wxContext)
    case 'delete':
      return await deleteFeedback(data, wxContext)
    default:
      return {
        code: -1,
        message: '未知的操作类型'
      }
  }
}

// 添加反馈
async function addFeedback(data, wxContext) {
  try {
    // 准备反馈数据
    const feedbackData = {
      ...data,
      openid: wxContext.OPENID,
      status: 'pending', // 默认状态为待处理
      dealt: false,
      dealTime: '',
      dealResult: '',
      createTime: formatTime(new Date())
    }
    
    // 添加到数据库
    const result = await feedbackCollection.add({
      data: feedbackData
    })
    
    return {
      code: 0,
      message: '反馈提交成功',
      _id: result._id
    }
  } catch (error) {
    console.error('添加反馈失败：', error)
    return {
      code: -1,
      message: '添加反馈失败',
      error
    }
  }
}

// 获取反馈列表（管理员用）
async function getFeedbackList(data, wxContext) {
  try {
    // 验证权限（这里简单示例，实际项目中应有更严格的权限控制）
    // const isAdmin = await checkIsAdmin(wxContext.OPENID)
    // if (!isAdmin) {
    //   return { code: 403, message: '权限不足' }
    // }
    
    const { status, pageSize = 10, pageIndex = 0, sortBy = 'createTime', sortDirection = 'desc' } = data
    
    // 构建查询条件
    let query = feedbackCollection
    if (status) {
      query = query.where({
        status
      })
    }
    
    // 获取总数
    const countResult = await query.count()
    
    // 构建排序
    const sortObj = {}
    sortObj[sortBy] = sortDirection === 'desc' ? -1 : 1
    
    // 分页查询
    const result = await query
      .orderBy(sortBy, sortDirection)
      .skip(pageSize * pageIndex)
      .limit(pageSize)
      .get()
    
    return {
      code: 0,
      message: '获取反馈列表成功',
      data: result.data,
      total: countResult.total,
      pageSize,
      pageIndex
    }
  } catch (error) {
    console.error('获取反馈列表失败：', error)
    return {
      code: -1,
      message: '获取反馈列表失败',
      error
    }
  }
}

// 获取用户自己的反馈列表
async function getFeedbackByUser(wxContext) {
  try {
    const openid = wxContext.OPENID
    
    // 获取该用户的所有反馈
    const result = await feedbackCollection
      .where({
        openid
      })
      .orderBy('createTime', 'desc')
      .get()
    
    return {
      code: 0,
      message: '获取个人反馈列表成功',
      data: result.data
    }
  } catch (error) {
    console.error('获取个人反馈列表失败：', error)
    return {
      code: -1,
      message: '获取个人反馈列表失败',
      error
    }
  }
}

// 根据ID获取反馈详情
async function getFeedbackById(data) {
  try {
    const { id } = data
    if (!id) {
      return { code: -1, message: '缺少反馈ID' }
    }
    
    const result = await feedbackCollection.doc(id).get()
    
    return {
      code: 0,
      message: '获取反馈详情成功',
      data: result.data
    }
  } catch (error) {
    console.error('获取反馈详情失败：', error)
    return {
      code: -1,
      message: '获取反馈详情失败',
      error
    }
  }
}

// 更新反馈状态（管理员用）
async function updateFeedbackStatus(data, wxContext) {
  try {
    // 验证权限（这里简单示例，实际项目中应有更严格的权限控制）
    // const isAdmin = await checkIsAdmin(wxContext.OPENID)
    // if (!isAdmin) {
    //   return { code: 403, message: '权限不足' }
    // }
    
    const { id, status, dealResult = '' } = data
    if (!id || !status) {
      return { code: -1, message: '缺少必要参数' }
    }
    
    const updateData = {
      status,
      dealResult
    }
    
    // 如果标记为已处理，添加额外信息
    if (status === 'processing' || status === 'completed') {
      updateData.dealt = true
      updateData.dealTime = formatTime(new Date())
    }
    
    // 更新记录
    await feedbackCollection.doc(id).update({
      data: updateData
    })
    
    return {
      code: 0,
      message: '更新反馈状态成功'
    }
  } catch (error) {
    console.error('更新反馈状态失败：', error)
    return {
      code: -1,
      message: '更新反馈状态失败',
      error
    }
  }
}

// 更新反馈信息（管理员用）
async function updateFeedback(data, wxContext) {
  try {
    // 验证权限（这里简单示例，实际项目中应有更严格的权限控制）
    // const isAdmin = await checkIsAdmin(wxContext.OPENID)
    // if (!isAdmin) {
    //   return { code: 403, message: '权限不足' }
    // }
    
    const { id, updateData } = data
    if (!id || !updateData) {
      return { code: -1, message: '缺少必要参数' }
    }
    
    // 移除不允许更新的字段
    const safeUpdateData = { ...updateData }
    delete safeUpdateData._id
    delete safeUpdateData.openid
    delete safeUpdateData.createTime
    
    // 更新记录
    await feedbackCollection.doc(id).update({
      data: safeUpdateData
    })
    
    return {
      code: 0,
      message: '更新反馈信息成功'
    }
  } catch (error) {
    console.error('更新反馈信息失败：', error)
    return {
      code: -1,
      message: '更新反馈信息失败',
      error
    }
  }
}

// 删除反馈（管理员用）
async function deleteFeedback(data, wxContext) {
  try {
    // 验证权限（这里简单示例，实际项目中应有更严格的权限控制）
    // const isAdmin = await checkIsAdmin(wxContext.OPENID)
    // if (!isAdmin) {
    //   return { code: 403, message: '权限不足' }
    // }
    
    const { id } = data
    if (!id) {
      return { code: -1, message: '缺少反馈ID' }
    }
    
    // 删除记录
    await feedbackCollection.doc(id).remove()
    
    return {
      code: 0,
      message: '删除反馈成功'
    }
  } catch (error) {
    console.error('删除反馈失败：', error)
    return {
      code: -1,
      message: '删除反馈失败',
      error
    }
  }
}

// 格式化时间工具函数
function formatTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 检查用户是否管理员（实际项目中可以通过数据库或其他方式验证）
// async function checkIsAdmin(openid) {
//   try {
//     // 示例：通过管理员列表验证
//     const adminListResult = await db.collection('admin_users').where({
//       openid,
//       role: 'admin'
//     }).get()
//     
//     return adminListResult.data.length > 0
//   } catch (error) {
//     console.error('检查管理员权限失败：', error)
//     return false
//   }
// } 