# 浏览历史记录数据库设计

## 表名
history

## 数据结构
```json
{
  "_id": "string", // 记录ID，系统自动生成
  "openId": "string", // 用户ID，用于区分不同用户的记录
  "productId": "string", // 商品ID，如P001
  "name": "string", // 商品名称
  "image": "string", // 商品图片路径
  "price": "number", // 商品当前价格
  "originalPrice": "number", // 商品原价
  "category": "string", // 商品分类
  "timestamp": "string", // 浏览时间戳，格式：YYYY-MM-DD HH:mm:ss
  "createTime": "date", // 记录创建时间
  "deleted": "boolean" // 是否已删除，用于软删除
}
```

## 索引设计
1. openId: 索引类型 - Regular，用于快速查询特定用户的浏览记录
2. timestamp: 索引类型 - Regular，用于按时间排序
3. openId + productId: 索引类型 - Unique，防止短时间内重复记录同一商品

## 权限设计
- 读取权限：仅创建者可读
- 写入权限：自定义安全规则，仅允许用户写入自己的记录
- 更新权限：仅创建者可更新
- 删除权限：仅创建者可删除

## 业务规则
1. 每条记录保存用户对特定商品的一次浏览行为
2. 当用户再次浏览同一商品时，更新已有记录的timestamp，而不是创建新记录
3. 系统自动按照timestamp倒序排列记录，最新浏览的商品显示在前面
4. 可按日期分组展示历史记录
5. 支持批量删除和清空操作
6. 浏览历史保留最近100条记录，超出后自动删除最早的记录

## 云函数接口
1. `getHistory`: 获取用户的浏览历史记录，支持分页和按日期分组
2. `addHistory`: 添加或更新浏览历史记录
3. `removeHistory`: 删除指定的浏览历史记录
4. `clearHistory`: 清空用户的所有浏览历史记录 