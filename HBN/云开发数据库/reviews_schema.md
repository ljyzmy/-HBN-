# 商品评价数据表结构设计

## 表名：reviews

## 字段列表

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| _id | string | 是 | 文档ID，系统自动生成 |
| reviewId | string | 是 | 评价ID，格式为：REV + 时间戳 |
| orderId | string | 是 | 关联的订单ID |
| productId | number | 是 | 商品ID |
| userId | string | 是 | 用户ID，关联用户表 |
| rating | number | 是 | 评分，1-5分 |
| content | string | 是 | 评价内容 |
| images | array | 否 | 评价图片URL数组 |
| anonymity | boolean | 是 | 是否匿名评价，默认false |
| tags | array | 否 | 标签数组，如["商品质量好", "物流很快"] |
| time | string | 是 | 评价时间，格式：YYYY-MM-DD HH:MM:SS |
| likes | number | 否 | 点赞数，默认0 |
| replies | array | 否 | 回复列表 |
| orderInfo | object | 是 | 订单简要信息，包含商品名称、图片、规格等 |
| userInfo | object | 是 | 用户简要信息，包含昵称、头像等 |
| deleted | boolean | 否 | 是否删除，默认false，用于软删除 |
| createTime | string | 是 | 创建时间，格式：YYYY-MM-DD HH:MM:SS |
| updateTime | string | 否 | 更新时间，格式：YYYY-MM-DD HH:MM:SS |

## replies对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| replyId | string | 是 | 回复ID，格式为：RP + 时间戳 |
| content | string | 是 | 回复内容 |
| fromUserId | string | 是 | 回复用户ID |
| fromUserName | string | 是 | 回复用户名称 |
| fromUserAvatar | string | 否 | 回复用户头像 |
| isOfficial | boolean | 是 | 是否官方回复，默认false |
| time | string | 是 | 回复时间，格式：YYYY-MM-DD HH:MM:SS |

## orderInfo对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| orderNumber | string | 是 | 订单编号 |
| productName | string | 是 | 商品名称 |
| productImage | string | 是 | 商品图片URL |
| specs | object | 是 | 商品规格信息，如：{"规格":"标准装", "净含量":"150ml"} |
| purchaseTime | string | 是 | 购买时间，格式：YYYY-MM-DD HH:MM:SS |

## userInfo对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| nickname | string | 是 | 用户昵称 |
| avatar | string | 否 | 用户头像URL |
| level | number | 否 | 用户等级 |
| isVip | boolean | 否 | 是否VIP用户，默认false |

## 索引设计

1. orderId - 用于关联订单表
2. productId - 按商品筛选评价
3. userId - 用户查询自己的评价列表
4. rating - 按评分筛选
5. time - 按评价时间排序
6. reviewId - 唯一索引，确保评价ID不重复
7. (productId, time) - 复合索引，按商品和评价时间排序
8. (productId, rating) - 复合索引，按商品和评分筛选

## 权限设计

- 用户只能读取所有评价，但只能创建和修改自己的评价
- 管理员可以读取和修改所有评价数据

## 数据示例

```json
{
  "_id": "评价文档ID",
  "reviewId": "REV1694142330000",
  "orderId": "ORDER1693632300000",
  "productId": 1,
  "userId": "user123",
  "rating": 5,
  "content": "效果很好，质地清爽不粘腻，用了一个月后皮肤状态改善了很多",
  "images": ["cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/评价图片/img001.jpg"],
  "anonymity": false,
  "tags": ["商品质量好", "效果明显"],
  "time": "2023-09-08 08:12:10",
  "likes": 12,
  "replies": [
    {
      "replyId": "RP1694145930000",
      "content": "感谢您的评价，很高兴我们的产品能够帮到您！",
      "fromUserId": "admin001",
      "fromUserName": "HBN官方客服",
      "fromUserAvatar": "https://www.hbn.cn/assets/logo.png",
      "isOfficial": true,
      "time": "2023-09-08 09:12:10"
    }
  ],
  "orderInfo": {
    "orderNumber": "HBN1693632300000",
    "productName": "HBN视黄醇精华乳2.0双a醇乳液紧致抗皱焕亮",
    "productImage": "https://www.hbn.cn/assets/1-BZbFkdFc.png",
    "specs": {
      "规格": "标准装",
      "净含量": "120ml双A乳"
    },
    "purchaseTime": "2023-09-02 10:05:00"
  },
  "userInfo": {
    "nickname": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "level": 3,
    "isVip": true
  },
  "deleted": false,
  "createTime": "2023-09-08 08:12:10",
  "updateTime": "2023-09-08 08:12:10"
}
``` 