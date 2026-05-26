# 订单数据表结构设计

## 表名：orders

## 字段列表

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| _id | string | 是 | 文档ID，系统自动生成 |
| orderId | string | 是 | 订单ID，格式为：ORDER + 时间戳 |
| orderNumber | string | 是 | 订单编号，格式为：HBN + 时间戳 |
| userId | string | 是 | 用户ID，关联用户表 |
| totalAmount | number | 是 | 订单总金额 |
| createTime | string | 是 | 订单创建时间，格式：YYYY-MM-DD HH:MM:SS |
| payTime | string | 否 | 支付时间，格式：YYYY-MM-DD HH:MM:SS |
| payMethod | string | 否 | 支付方式，如：微信支付、余额支付等 |
| status | string | 是 | 订单状态，可选值：unpaid, unshipped, shipped, completed, canceled, afterSale |
| statusText | string | 是 | 订单状态文本，如：待付款、待发货、待收货、已完成、已取消、售后中 |
| completeTime | string | 否 | 订单完成时间，格式：YYYY-MM-DD HH:MM:SS |
| cancelTime | string | 否 | 订单取消时间，格式：YYYY-MM-DD HH:MM:SS |
| remainPayTime | string | 否 | 剩余支付时间，倒计时格式：HH:MM:SS |
| logistics | object | 否 | 物流信息，包含快递公司、快递单号等 |
| product | object | 是 | 商品信息，包含商品ID、名称、图片、价格、数量、规格等 |
| review | object | 否 | 评价信息，包含评分、内容、图片、是否匿名、标签、评价时间等 |
| hasReviewed | boolean | 否 | 是否已评价，默认false |
| afterSale | object | 否 | 售后信息，包含类型、原因、描述、图片、申请时间、处理状态等 |
| address | object | 是 | 收货地址信息 |
| couponInfo | object | 否 | 优惠券使用信息 |
| deleted | boolean | 否 | 是否删除，默认false，用于软删除 |
| updateTime | string | 否 | 更新时间，格式：YYYY-MM-DD HH:MM:SS |

## logistics对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| company | string | 是 | 快递公司名称 |
| number | string | 是 | 快递单号 |

## product对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | number | 是 | 商品ID |
| name | string | 是 | 商品名称 |
| image | string | 是 | 商品图片URL |
| price | number | 是 | 商品价格 |
| quantity | number | 是 | 购买数量 |
| specs | object | 是 | 商品规格信息，如：{"规格":"标准装", "净含量":"150ml"} |

## review对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| rating | number | 是 | 评分，1-5分 |
| content | string | 是 | 评价内容 |
| images | array | 否 | 评价图片URL数组 |
| anonymity | boolean | 是 | 是否匿名评价 |
| tags | array | 否 | 标签数组，如["商品质量好", "物流很快"] |
| time | string | 是 | 评价时间，格式：YYYY-MM-DD HH:MM:SS |

## afterSale对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| type | string | 是 | 售后类型，可选值：refund, return_refund, exchange |
| reason | string | 是 | 退款原因 |
| description | string | 是 | 问题描述 |
| images | array | 否 | 凭证图片URL数组 |
| applyTime | string | 是 | 申请时间，格式：YYYY-MM-DD HH:MM:SS |
| status | string | 是 | 处理状态，如：pending, processing, completed, rejected |
| statusText | string | 是 | 处理状态文本，如：处理中、已完成、已拒绝 |
| responseTime | string | 否 | 处理回复时间，格式：YYYY-MM-DD HH:MM:SS |
| responseContent | string | 否 | 处理回复内容 |

## address对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 是 | 收货人姓名 |
| phone | string | 是 | 收货人手机号 |
| province | string | 是 | 省份 |
| city | string | 是 | 城市 |
| district | string | 是 | 区/县 |
| detailAddress | string | 是 | 详细地址 |

## 索引设计

1. userId - 用户查询自己的订单列表
2. status - 按订单状态筛选
3. createTime - 按创建时间排序
4. orderId - 唯一索引，确保订单ID不重复
5. (userId, status) - 复合索引，按用户和订单状态筛选
6. (userId, createTime) - 复合索引，按用户和创建时间排序

## 权限设计

- 用户只能读取和修改自己的订单数据
- 管理员可以读取和修改所有订单数据

## 数据示例

```json
{
  "_id": "订单文档ID",
  "orderId": "ORDER1628735168000",
  "orderNumber": "HBN1628735168000",
  "userId": "user123",
  "totalAmount": 119.00,
  "createTime": "2023-08-12 10:32:48",
  "payTime": "2023-08-12 10:35:28",
  "payMethod": "微信支付",
  "status": "shipped",
  "statusText": "待收货",
  "logistics": {
    "company": "顺丰速运",
    "number": "SF1234567890"
  },
  "product": {
    "id": 2,
    "name": "HBN发光水α-熊果苷精粹水2.0提亮保湿爽肤水湿敷水",
    "image": "https://www.hbn.cn/assets/1-Bsqoo_S0.png",
    "price": 119.00,
    "quantity": 1,
    "specs": {
      "规格": "经典版",
      "净含量": "150ml赠水乳体验礼"
    }
  },
  "address": {
    "name": "张三",
    "phone": "13800138000",
    "province": "广东省",
    "city": "广州市",
    "district": "天河区",
    "detailAddress": "体育西路123号"
  },
  "deleted": false,
  "updateTime": "2023-08-12 10:35:28"
}
``` 