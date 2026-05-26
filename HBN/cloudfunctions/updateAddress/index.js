// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const addressesCollection = db.collection('addresses')

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, userId, addressData, addressId, docId } = event
  
  // 格式化当前时间
  const now = formatDateTime(new Date())
  
  try {
    switch (action) {
      case 'add': // 添加地址
        return await addAddress(docId, userId, addressData, now)
      
      case 'update': // 更新地址
        return await updateAddress(docId, userId, addressData, addressId, now)
      
      case 'delete': // 删除地址
        return await deleteAddress(docId, userId, addressId, now)
      
      case 'setDefault': // 设置默认地址
        return await setDefaultAddress(docId, userId, addressId, now)
        
      default:
        return {
          success: false,
          message: '未知操作类型'
        }
    }
  } catch (err) {
    console.error('操作失败:', err)
    return {
      success: false,
      message: '操作失败: ' + err.message,
      error: err
    }
  }
}

/**
 * 添加地址
 */
async function addAddress(docId, userId, addressData, now) {
  try {
    // 先查询文档是否存在
    const docResult = await addressesCollection.doc(docId).get()
    
    // 为新地址生成ID
    addressData.id = generateId()
    
    // 如果设为默认，需要将其他地址设为非默认
    let addresses = docResult.data.addresses || []
    
    if (addressData.isDefault) {
      addresses = addresses.map(address => ({
        ...address,
        isDefault: false
      }))
    }
    
    // 添加新地址
    addresses.push(addressData)
    
    // 更新文档
    await addressesCollection.doc(docId).update({
      data: {
        addresses,
        updateTime: now
      }
    })
    
    return {
      success: true,
      message: '添加地址成功',
      addressId: addressData.id
    }
    
  } catch (err) {
    if (err.message.includes('document not found')) {
      // 文档不存在，创建新文档
      const nickname = await getUserNickname(userId)
      
      await addressesCollection.add({
        data: {
          _id: docId,
          userId: userId,
          nickname,
          addresses: [{ ...addressData, id: generateId() }],
          createTime: now,
          updateTime: now
        }
      })
      
      return {
        success: true,
        message: '创建地址文档成功',
        addressId: addressData.id
      }
    }
    
    throw err
  }
}

/**
 * 更新地址
 */
async function updateAddress(docId, userId, addressData, addressId, now) {
  // 获取当前地址列表
  const docResult = await addressesCollection.doc(docId).get()
  let addresses = docResult.data.addresses || []
  
  // 查找要更新的地址索引
  const index = addresses.findIndex(addr => addr.id === addressId)
  
  if (index === -1) {
    throw new Error('地址不存在')
  }
  
  // 如果设为默认地址，将其他地址设为非默认
  if (addressData.isDefault) {
    addresses = addresses.map(addr => ({
      ...addr,
      isDefault: false
    }))
  }
  
  // 更新地址信息
  addresses[index] = {
    ...addressData,
    id: addressId // 确保ID不变
  }
  
  // 更新文档
  await addressesCollection.doc(docId).update({
    data: {
      addresses,
      updateTime: now
    }
  })
  
  return {
    success: true,
    message: '更新地址成功'
  }
}

/**
 * 删除地址
 */
async function deleteAddress(docId, userId, addressId, now) {
  // 获取当前地址列表
  const docResult = await addressesCollection.doc(docId).get()
  let addresses = docResult.data.addresses || []
  
  // 查找要删除的地址索引
  const index = addresses.findIndex(addr => addr.id === addressId)
  
  if (index === -1) {
    throw new Error('地址不存在')
  }
  
  // 删除地址
  addresses.splice(index, 1)
  
  // 更新文档
  await addressesCollection.doc(docId).update({
    data: {
      addresses,
      updateTime: now
    }
  })
  
  return {
    success: true,
    message: '删除地址成功'
  }
}

/**
 * 设置默认地址
 */
async function setDefaultAddress(docId, userId, addressId, now) {
  // 获取当前地址列表
  const docResult = await addressesCollection.doc(docId).get()
  let addresses = docResult.data.addresses || []
  
  // 更新默认状态
  addresses = addresses.map(addr => ({
    ...addr,
    isDefault: addr.id === addressId
  }))
  
  // 更新文档
  await addressesCollection.doc(docId).update({
    data: {
      addresses,
      updateTime: now
    }
  })
  
  return {
    success: true,
    message: '设置默认地址成功'
  }
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}

/**
 * 获取用户昵称
 */
async function getUserNickname(userId) {
  try {
    // 根据userId获取对应昵称
    if (userId === 1) {
      return '职场精英女性'
    } else if (userId === 2) {
      return '都市新锐青年'
    } else if (userId === 3) {
      return '科研工作者'
    } else {
      return '用户'
    }
  } catch (err) {
    console.error('获取用户昵称失败:', err)
    return '用户'
  }
}

/**
 * 格式化日期时间为字符串
 */
function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
} 