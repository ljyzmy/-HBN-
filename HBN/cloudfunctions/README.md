# 礼品卡系统云函数

本目录包含HBN礼品卡系统所需的云函数，这些云函数用于处理礼品卡的核心业务逻辑。

## 云函数列表

### 1. transferGiftCard - 礼品卡转赠

用于处理礼品卡转赠功能，将礼品卡从当前持有者转赠给另一位用户。

**参数**:
- `cardId`: 礼品卡ID
- `fromUserId`: 转出用户ID
- `fromUserName`: 转出用户名称
- `toUserId`: 接收用户ID
- `toUserName`: 接收用户名称

**返回值**:
- 成功: `{success: true, message: '礼品卡转赠成功'}`
- 失败: `{success: false, code: 错误代码, message: 错误信息}`

### 2. activateGiftCard - 礼品卡激活

用于激活新获得的礼品卡，只有激活后的礼品卡才能使用。

**参数**:
- `cardId`: 礼品卡ID
- `userId`: 用户ID
- `userName`: 用户名称

**返回值**:
- 成功: `{success: true, message: '礼品卡激活成功'}`
- 失败: `{success: false, code: 错误代码, message: 错误信息}`

### 3. useGiftCard - 礼品卡使用

用于在购买商品时使用礼品卡抵扣金额。

**参数**:
- `cardId`: 礼品卡ID
- `userId`: 用户ID
- `userName`: 用户名称
- `useAmount`: 使用金额

**返回值**:
- 成功: `{success: true, message: '礼品卡使用成功', usedAmount: 已使用金额, remainingBalance: 剩余金额, status: 卡片状态}`
- 失败: `{success: false, code: 错误代码, message: 错误信息}`

## 部署说明

1. 确保已安装最新版本的微信开发者工具
2. 确保已登录微信开发者工具并关联了云开发环境
3. 运行部署脚本: 
   ```
   bash deployCloudFunctions.sh
   ```

## 错误代码说明

- `NOT_OWNER`: 用户不是该礼品卡的持有者
- `TRANSFER_NOT_ALLOWED`: 礼品卡不允许转赠
- `INVALID_CARD`: 礼品卡状态无效
- `ALREADY_ACTIVATED`: 礼品卡已经激活
- `INSUFFICIENT_BALANCE`: 礼品卡余额不足
- `TRANSACTION_FAILED`: 数据库事务执行失败
- `CLOUD_FUNCTION_ERROR`: 云函数执行异常

## 使用示例

```javascript
// 转赠礼品卡
wx.cloud.callFunction({
  name: 'transferGiftCard',
  data: {
    cardId: 'card123',
    fromUserId: 'user001',
    fromUserName: '张三',
    toUserId: 'user002',
    toUserName: '李四'
  }
}).then(res => {
  console.log('转赠结果:', res.result);
}).catch(err => {
  console.error('转赠失败:', err);
});

// 激活礼品卡
wx.cloud.callFunction({
  name: 'activateGiftCard',
  data: {
    cardId: 'card123',
    userId: 'user001',
    userName: '张三'
  }
}).then(res => {
  console.log('激活结果:', res.result);
}).catch(err => {
  console.error('激活失败:', err);
});

// 使用礼品卡
wx.cloud.callFunction({
  name: 'useGiftCard',
  data: {
    cardId: 'card123',
    userId: 'user001',
    userName: '张三',
    useAmount: 50
  }
}).then(res => {
  console.log('使用结果:', res.result);
}).catch(err => {
  console.error('使用失败:', err);
});
``` 