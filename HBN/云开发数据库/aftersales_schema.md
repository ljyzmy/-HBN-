# 售后申请数据表结构设计

## 表名：aftersales

## 字段列表

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| _id | string | 是 | 文档ID，系统自动生成 |
| aftersaleId | string | 是 | 售后单ID，格式为：AS + 时间戳 |
| orderId | string | 是 | 关联的订单ID |
| userId | string | 是 | 用户ID，关联用户表 |
| type | string | 是 | 售后类型，可选值：refund(仅退款), return_refund(退货退款), exchange(换货) |
| reason | string | 是 | 退款原因 |
| description | string | 是 | 问题描述 |
| images | array | 否 | 凭证图片URL数组 |
| applyTime | string | 是 | 申请时间，格式：YYYY-MM-DD HH:MM:SS |
| status | string | 是 | 处理状态，可选值：pending(待处理), processing(处理中), completed(已完成), rejected(已拒绝) |
| statusText | string | 是 | 处理状态文本，如：处理中、已完成、已拒绝 |
| responseTime | string | 否 | 处理回复时间，格式：YYYY-MM-DD HH:MM:SS |
| responseContent | string | 否 | 处理回复内容 |
| adminId | string | 否 | 处理人员ID |
| refundAmount | number | 否 | 退款金额 |
| refundTime | string | 否 | 退款时间，格式：YYYY-MM-DD HH:MM:SS |
| returnLogistics | object | 否 | 退货物流信息 |
| exchangeLogistics | object | 否 | 换货物流信息 |
| orderInfo | object | 是 | 订单简要信息，包含商品名称、图片、规格等 |
| deleted | boolean | 否 | 是否删除，默认false，用于软删除 |
| createTime | string | 是 | 创建时间，格式：YYYY-MM-DD HH:MM:SS |
| updateTime | string | 否 | 更新时间，格式：YYYY-MM-DD HH:MM:SS |

## returnLogistics对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| company | string | 是 | 快递公司名称 |
| number | string | 是 | 快递单号 |
| time | string | 是 | 发货时间，格式：YYYY-MM-DD HH:MM:SS |
| address | object | 是 | 退货地址信息 |

## exchangeLogistics对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| company | string | 是 | 快递公司名称 |
| number | string | 是 | 快递单号 |
| time | string | 是 | 发货时间，格式：YYYY-MM-DD HH:MM:SS |
| address | object | 是 | 收货地址信息 |

## orderInfo对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| orderNumber | string | 是 | 订单编号 |
| productName | string | 是 | 商品名称 |
| productImage | string | 是 | 商品图片URL |
| specs | object | 是 | 商品规格信息，如：{"规格":"标准装", "净含量":"150ml"} |
| price | number | 是 | 商品价格 |
| quantity | number | 是 | 购买数量 |
| totalAmount | number | 是 | 订单总金额 |

## 索引设计

1. orderId - 用于关联订单表
2. userId - 用户查询自己的售后申请列表
3. status - 按处理状态筛选
4. applyTime - 按申请时间排序
5. aftersaleId - 唯一索引，确保售后单ID不重复
6. (userId, status) - 复合索引，按用户和处理状态筛选
7. (userId, applyTime) - 复合索引，按用户和申请时间排序

## 权限设计

- 用户只能读取和创建自己的售后申请数据
- 管理员可以读取和修改所有售后申请数据

## 数据示例

```json
{
  "_id": "售后单文档ID",
  "aftersaleId": "AS1694056410000",
  "orderId": "ORDER1693805100000",
  "userId": "user123",
  "type": "return_refund",
  "reason": "商品质量问题",
  "description": "收到商品发现有漏液情况，包装已经湿了一片",
  "images": ["cloud://cloud1-0gxff61z2804383c.636c-cloud1-0gxff61z2804383c-1333491872/售后凭证/img001.jpg"],
  "applyTime": "2023-09-07 08:06:50",
  "status": "pending",
  "statusText": "待处理",
  "orderInfo": {
    "orderNumber": "HBN1693805100000",
    "productName": "HBN发光水α-熊果苷精粹水2.0提亮保湿爽肤水湿敷水",
    "productImage": "https://www.hbn.cn/assets/1-Bsqoo_S0.png",
    "specs": {
      "规格": "经典版",
      "净含量": "150ml赠水乳体验礼"
    },
    "price": 119.00,
    "quantity": 1,
    "totalAmount": 119.00
  },
  "deleted": false,
  "createTime": "2023-09-07 08:06:50",
  "updateTime": "2023-09-07 08:06:50"
}
``` 