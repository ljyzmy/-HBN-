// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化云函数
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, userId, data } = event
  
  // 获取用户OPENID
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID || userId
  
  // 根据不同操作类型执行不同逻辑
  switch (action) {
    // 同步本地收藏到云端
    case 'syncToCloud':
      return await syncToCloud(openid, data)
      
    // 从云端同步到本地
    case 'getFromCloud':
      return await getFromCloud(openid)
      
    // 添加单个收藏
    case 'addFavorite':
      return await addFavorite(openid, data)
      
    // 移除单个收藏
    case 'removeFavorite':
      return await removeFavorite(openid, data.productId)
      
    // 批量移除收藏
    case 'batchRemove':
      return await batchRemoveFavorites(openid, data.productIds)
      
    // 更新用户画像分析
    case 'updatePortrait':
      return await updateUserPortrait(openid)
      
    default:
      return {
        code: -1,
        message: '未知的操作类型'
      }
  }
}

// 同步本地收藏到云端
async function syncToCloud(userId, favorites) {
  if (!favorites || !Array.isArray(favorites)) {
    return {
      code: -1,
      message: '无效的收藏数据'
    }
  }
  
  try {
    // 清空用户之前的收藏
    await db.collection('favorites').where({
      user_id: userId
    }).remove()
    
    // 批量添加新收藏
    // 由于小程序云函数不支持一次性添加多条记录，这里使用循环添加
    const tasks = favorites.map(item => {
      // 生成唯一ID
      const _id = `fav_${userId}_${item.id}_${Date.now()}`
      
      return db.collection('favorites').add({
        data: {
          _id: _id,
          user_id: userId,
          product_id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          category: item.category || '商品',
          create_time: new Date().toLocaleString(),
          portrait_tags: item.portrait_tags || [],
          source: '本地同步'
        }
      })
    })
    
    await Promise.all(tasks)
    
    // 更新用户画像数据
    await updateUserPortrait(userId)
    
    return {
      code: 0,
      message: '同步成功',
      data: {
        count: favorites.length
      }
    }
  } catch (err) {
    console.error('同步收藏到云端失败', err)
    return {
      code: -1,
      message: '同步失败:' + err.message
    }
  }
}

// 从云端获取收藏
async function getFromCloud(userId) {
  try {
    const result = await db.collection('favorites')
      .where({
        user_id: userId
      })
      .orderBy('create_time', 'desc')
      .get()
    
    return {
      code: 0,
      message: '获取成功',
      data: result.data
    }
  } catch (err) {
    console.error('从云端获取收藏失败', err)
    return {
      code: -1,
      message: '获取失败:' + err.message
    }
  }
}

// 添加单个收藏
async function addFavorite(userId, item) {
  if (!item || !item.id) {
    return {
      code: -1,
      message: '无效的商品数据'
    }
  }
  
  try {
    // 检查是否已经收藏
    const exist = await db.collection('favorites')
      .where({
        user_id: userId,
        product_id: item.id
      })
      .count()
    
    if (exist.total > 0) {
      return {
        code: 1,
        message: '该商品已收藏',
        data: {
          exist: true
        }
      }
    }
    
    // 生成唯一ID
    const _id = `fav_${userId}_${item.id}_${Date.now()}`
    
    // 添加收藏
    await db.collection('favorites').add({
      data: {
        _id: _id,
        user_id: userId,
        product_id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        category: item.category || '商品',
        create_time: new Date().toLocaleString(),
        portrait_tags: item.portrait_tags || [],
        source: item.source || '详情页'
      }
    })
    
    // 更新用户画像数据
    await updateUserPortrait(userId)
    
    return {
      code: 0,
      message: '收藏成功'
    }
  } catch (err) {
    console.error('添加收藏失败', err)
    return {
      code: -1,
      message: '收藏失败:' + err.message
    }
  }
}

// 删除单个收藏
async function removeFavorite(userId, productId) {
  if (!productId) {
    return {
      code: -1,
      message: '商品ID不能为空'
    }
  }
  
  try {
    await db.collection('favorites')
      .where({
        user_id: userId,
        product_id: productId
      })
      .remove()
    
    // 更新用户画像数据
    await updateUserPortrait(userId)
    
    return {
      code: 0,
      message: '取消收藏成功'
    }
  } catch (err) {
    console.error('删除收藏失败', err)
    return {
      code: -1,
      message: '取消收藏失败:' + err.message
    }
  }
}

// 批量删除收藏
async function batchRemoveFavorites(userId, productIds) {
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return {
      code: -1,
      message: '商品ID列表不能为空'
    }
  }
  
  try {
    // 小程序云数据库不支持一次性删除多条记录，需要循环删除
    const tasks = productIds.map(productId => {
      return db.collection('favorites')
        .where({
          user_id: userId,
          product_id: productId
        })
        .remove()
    })
    
    await Promise.all(tasks)
    
    // 更新用户画像数据
    await updateUserPortrait(userId)
    
    return {
      code: 0,
      message: '批量取消收藏成功'
    }
  } catch (err) {
    console.error('批量删除收藏失败', err)
    return {
      code: -1,
      message: '批量取消收藏失败:' + err.message
    }
  }
}

// 更新用户收藏画像
async function updateUserPortrait(userId) {
  try {
    // 获取用户所有收藏记录
    const favorites = await db.collection('favorites')
      .where({ user_id: userId })
      .get()
    
    if (!favorites.data || favorites.data.length === 0) {
      // 如果用户没有收藏记录，则删除用户画像
      await db.collection('favorites_portrait')
        .where({ user_id: userId })
        .remove()
      
      return {
        code: 0,
        message: '用户无收藏记录，已清空画像数据'
      }
    }
    
    // 分析用户收藏数据
    const favoriteItems = favorites.data
    const count = favoriteItems.length
    
    // 统计分类数量
    const categories = {}
    favoriteItems.forEach(item => {
      const category = item.category || '商品'
      categories[category] = (categories[category] || 0) + 1
    })
    
    // 提取排名靠前的分类
    const topCategories = Object.keys(categories)
      .sort((a, b) => categories[b] - categories[a])
      .slice(0, 3)
    
    // 统计标签
    const tags = {}
    favoriteItems.forEach(item => {
      if (item.portrait_tags && Array.isArray(item.portrait_tags)) {
        item.portrait_tags.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1
        })
      }
    })
    
    // 提取排名靠前的标签
    const topTags = Object.keys(tags)
      .sort((a, b) => tags[b] - tags[a])
      .slice(0, 5)
    
    // 获取最近收藏时间
    const lastFavoriteTime = favoriteItems
      .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))[0].create_time
    
    // 简单的分析结论生成
    let analysisResult = '该用户'
    
    // 根据标签生成分析
    if (topTags.length > 0) {
      analysisResult += `偏好${topTags.join('、')}类型的产品，`
    }
    
    // 根据分类生成分析
    if (topCategories.length > 0) {
      analysisResult += `主要关注${topCategories.join('、')}分类，`
    }
    
    // 根据收藏数量判断活跃度
    if (count > 10) {
      analysisResult += '非常关注美妆护肤产品，建议提供会员专属优惠。'
    } else if (count > 5) {
      analysisResult += '对美妆护肤有较高兴趣，可推荐相关套装优惠。'
    } else {
      analysisResult += '刚开始关注美妆护肤，可推荐入门级产品和试用装。'
    }
    
    // 检查是否已有画像数据
    const exist = await db.collection('favorites_portrait')
      .where({ user_id: userId })
      .count()
    
    const portraitData = {
      user_id: userId,
      portrait_id: `portrait_${userId}`,
      favorites_count: count,
      top_categories: topCategories,
      top_tags: topTags,
      last_favorite_time: lastFavoriteTime,
      analysis_result: analysisResult,
      update_time: new Date().toLocaleString()
    }
    
    if (exist.total > 0) {
      // 更新已有画像
      await db.collection('favorites_portrait')
        .where({ user_id: userId })
        .update({
          data: portraitData
        })
    } else {
      // 创建新画像
      await db.collection('favorites_portrait')
        .add({
          data: {
            _id: `fp_${userId}_${Date.now()}`,
            ...portraitData
          }
        })
    }
    
    return {
      code: 0,
      message: '用户画像更新成功',
      data: portraitData
    }
  } catch (err) {
    console.error('更新用户画像失败', err)
    return {
      code: -1,
      message: '更新用户画像失败:' + err.message
    }
  }
} 