const env = require('../config/env.js')

let initialized = false

function ensureCloud() {
  if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    return false
  }
  if (!initialized) {
    wx.cloud.init({
      env: env.CLOUD_ENV,
      traceUser: true,
    })
    initialized = true
  }
  return true
}

module.exports = {
  ensureCloud,
  CLOUD_ENV: env.CLOUD_ENV,
  cloudFile(path) {
    return `cloud://${env.CLOUD_ENV}.${env.CLOUD_STORAGE_ID}/${path}`
  },
}
