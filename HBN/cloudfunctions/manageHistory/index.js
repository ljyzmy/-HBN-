// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const historyCollection = db.collection('history')
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, data = {} } = event
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  // 定义标准化响应格式
  const response = {
    code: 0,
    data: null,
    message: 'success'
  }

  try {
    switch (action) {
      case 'add':
        return await addHistory(openId, data, response)
      case 'list':
        return await listHistory(openId, data, response)
      case 'remove':
        return await removeHistory(openId, data, response)
      case 'clear':
        return await clearHistory(openId, response)
      default:
        response.code = 400
        response.message = '未知的操作类型'
        return response
    }
  } catch (error) {
    console.error('操作失败:', error)
    response.code = 500
    response.message = '服务器内部错误: ' + error.message
    return response
  }
}

/**
 * 添加或更新浏览历史记录
 * @param {string} openId - 用户ID
 * @param {object} data - 包含浏览记录信息
 * @param {object} response - 响应对象
 */
async function addHistory(openId, data, response) {
  const { productId, name, image, price, originalPrice, category } = data
  
  if (!productId || !name || !image || !price) {
    response.code = 400
    response.message = '缺少必要的商品信息'
    return response
  }
  
  // 生成当前时间戳
  const now = new Date()
  const timestamp = formatDate(now)
  
  try {
    // 检查是否已存在该商品的浏览记录
    const existingRecord = await historyCollection
      .where({
        openId,
        productId,
        deleted: false
      })
      .get()
    
    if (existingRecord.data && existingRecord.data.length > 0) {
      // 更新现有记录的时间戳
      await historyCollection.doc(existingRecord.data[0]._id).update({
        data: {
          timestamp,
          // 如果商品信息有变化，也一并更新
          name,
          image,
          price,
          originalPrice,
          category
        }
      })
      response.data = { updated: true, recordId: existingRecord.data[0]._id }
    } else {
      // 创建新的浏览记录
      const result = await historyCollection.add({
        data: {
          openId,
          productId,
          name,
          image,
          price,
          originalPrice,
          category,
          timestamp,
          createTime: now,
          deleted: false
        }
      })
      response.data = { added: true, recordId: result._id }
      
      // 检查并限制历史记录数量（最多保留100条）
      await limitHistoryRecords(openId)
    }
    
    response.message = '添加浏览记录成功'
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 获取用户浏览历史记录列表
 * @param {string} openId - 用户ID
 * @param {object} data - 请求参数，包含分页和排序信息
 * @param {object} response - 响应对象
 */
async function listHistory(openId, data, response) {
  const { page = 1, pageSize = 20, grouped = true } = data
  const skip = (page - 1) * pageSize
  
  try {
    if (grouped) {
      // 按日期分组查询
      const groupedResult = await historyCollection
        .aggregate()
        .match({
          openId,
          deleted: false
        })
        .sort({
          timestamp: -1
        })
        .group({
          _id: {
            date: $.substr(['$timestamp', 0, 10])
          },
          items: $.push({
            _id: '$_id',
            productId: '$productId',
            name: '$name',
            image: '$image',
            price: '$price',
            originalPrice: '$originalPrice',
            category: '$category',
            timestamp: '$timestamp'
          })
        })
        .sort({
          '_id.date': -1
        })
        .skip(skip)
        .limit(pageSize)
        .end()
      
      response.data = {
        list: groupedResult.list,
        total: await getHistoryCount(openId)
      }
    } else {
      // 不分组，直接查询
      const result = await historyCollection
        .where({
          openId,
          deleted: false
        })
        .orderBy('timestamp', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get()
      
      response.data = {
        list: result.data,
        total: await getHistoryCount(openId)
      }
    }
    
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 删除指定的浏览历史记录
 * @param {string} openId - 用户ID
 * @param {object} data - 包含要删除的记录ID
 * @param {object} response - 响应对象
 */
async function removeHistory(openId, data, response) {
  const { ids } = data
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    response.code = 400
    response.message = '未提供有效的记录ID'
    return response
  }
  
  try {
    // 使用软删除方式删除记录
    const result = await historyCollection
      .where({
        _id: _.in(ids),
        openId // 确保只能删除自己的记录
      })
      .update({
        data: {
          deleted: true
        }
      })
    
    response.data = { deleted: result.stats.updated }
    response.message = `成功删除${result.stats.updated}条记录`
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 清空用户的所有浏览历史记录
 * @param {string} openId - 用户ID
 * @param {object} response - 响应对象
 */
async function clearHistory(openId, response) {
  try {
    // 使用软删除方式清空记录
    const result = await historyCollection
      .where({
        openId,
        deleted: false
      })
      .update({
        data: {
          deleted: true
        }
      })
    
    response.data = { deleted: result.stats.updated }
    response.message = `成功清空${result.stats.updated}条浏览记录`
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 格式化日期为 YYYY-MM-DD HH:mm:ss 格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 获取用户历史记录总数
 * @param {string} openId - 用户ID
 * @returns {number} 记录总数
 */
async function getHistoryCount(openId) {
  const result = await historyCollection
    .where({
      openId,
      deleted: false
    })
    .count()
  
  return result.total
}

/**
 * 限制历史记录数量，只保留最新的100条记录
 * @param {string} openId - 用户ID
 */
async function limitHistoryRecords(openId) {
  // 获取当前记录总数
  const countResult = await getHistoryCount(openId)
  
  // 如果超过100条，则删除多余的记录
  if (countResult > 100) {
    const recordsToDelete = await historyCollection
      .where({
        openId,
        deleted: false
      })
      .orderBy('timestamp', 'asc') // 按时间正序，最旧的在前
      .limit(countResult - 100) // 超出的记录数
      .get()
    
    if (recordsToDelete.data.length > 0) {
      const idsToDelete = recordsToDelete.data.map(item => item._id)
      await historyCollection
        .where({
          _id: _.in(idsToDelete)
        })
        .update({
          data: {
            deleted: true
          }
        })
    }
  }
} 