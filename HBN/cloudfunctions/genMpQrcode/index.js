// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('收到生成二维码请求，参数：', event);
    
    // 默认生成主页的二维码，也可以接收参数指定其他页面
    const pagePath = event.pagePath || 'pages/index/index';
    console.log('生成二维码的路径:', pagePath);
    
    try {
      // 获取小程序二维码的buffer
      console.log('开始调用wxacode.get生成二维码');
      const resp = await cloud.openapi.wxacode.get({
        path: pagePath,
      });
      
      const { buffer } = resp;
      console.log('生成二维码成功，buffer大小:', buffer.length);
      
      // 将图片上传云存储空间
      console.log('开始上传二维码到云存储');
      const cloudPath = `qrcode/${Date.now()}_${String(pagePath).replace(/\//g, '_').replace(/\?/g, '_')}.png`;
      console.log('云存储路径:', cloudPath);
      
      const upload = await cloud.uploadFile({
        cloudPath: cloudPath,
        fileContent: buffer
      });
      
      console.log('上传成功，fileID:', upload.fileID);
      
      // 返回文件ID
      return {
        code: 0,
        fileID: upload.fileID,
        message: '生成二维码成功'
      };
    } catch (innerError) {
      console.error('二维码生成或上传过程出错:', innerError);
      
      // 检查是否是路径参数错误 (常见错误)
      if (innerError.message && innerError.message.includes('path')) {
        return {
          code: -1,
          error: '路径参数错误，请检查path格式是否正确',
          message: '路径参数错误',
          details: innerError
        };
      }
      
      throw innerError;
    }
    
  } catch (error) {
    console.error('生成二维码失败，完整错误：', error);
    return {
      code: -1,
      error: error.message || '未知错误',
      message: '生成二维码失败',
      stack: error.stack
    };
  }
} 