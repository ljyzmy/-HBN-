# 物流详情数据表结构设计

## 表名：logistics

## 字段列表

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| _id | string | 是 | 文档ID，系统自动生成 |
| trackingId | string | 是 | 物流跟踪ID，格式为：TK + 时间戳 |
| orderId | string | 是 | 关联的订单ID |
| userId | string | 是 | 用户ID，关联用户表 |
| expressCompany | string | 是 | 快递公司名称 |
| expressCode | string | 是 | 快递公司编码，用于对接物流API |
| expressLogo | string | 否 | 快递公司logo图片URL |
| trackingNumber | string | 是 | 快递单号 |
| status | string | 是 | 物流状态，可选值：pending(待发货), delivering(运输中), delivered(已送达), exception(异常) |
| statusText | string | 是 | 物流状态文本，如：待发货、运输中、已送达、配送异常 |
| senderInfo | object | 是 | 发件人信息 |
| receiverInfo | object | 是 | 收件人信息 |
| packageInfo | object | 是 | 包裹信息 |
| trackingInfo | array | 是 | 物流跟踪信息数组 |
| createTime | string | 是 | 创建时间，格式：YYYY-MM-DD HH:MM:SS |
| updateTime | string | 是 | 更新时间，格式：YYYY-MM-DD HH:MM:SS |
| estimatedDeliveryTime | string | 否 | 预计送达时间，格式：YYYY-MM-DD HH:MM:SS |
| actualDeliveryTime | string | 否 | 实际送达时间，格式：YYYY-MM-DD HH:MM:SS |
| signedBy | string | 否 | 签收人 |

## senderInfo对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 是 | 发件人名称 |
| phone | string | 是 | 发件人联系电话 |
| address | object | 是 | 发件地址信息 |

## receiverInfo对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| name | string | 是 | 收件人名称 |
| phone | string | 是 | 收件人联系电话 |
| address | object | 是 | 收件地址信息 |

## address对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| province | string | 是 | 省份 |
| city | string | 是 | 城市 |
| district | string | 是 | 区/县 |
| detailAddress | string | 是 | 详细地址 |
| postalCode | string | 否 | 邮政编码 |

## packageInfo对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| weight | string | 否 | 包裹重量 |
| items | array | 是 | 包裹内物品信息 |
| itemCount | number | 是 | 物品总数量 |

## items对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| productId | number | 是 | 商品ID |
| productName | string | 是 | 商品名称 |
| productImage | string | 是 | 商品图片URL |
| specifications | object | 是 | 商品规格信息 |
| quantity | number | 是 | 商品数量 |

## trackingInfo对象结构

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| time | string | 是 | 时间，格式：YYYY-MM-DD HH:MM:SS |
| status | string | 是 | 状态描述 |
| location | string | 是 | 当前位置 |
| operator | string | 否 | 操作人员 |
| remark | string | 否 | 备注信息 |

## 索引设计

1. trackingNumber - 用于通过快递单号查询物流信息
2. orderId - 用于关联订单表查询物流信息
3. userId - 用于查询用户的所有物流信息
4. status - 按物流状态筛选
5. createTime - 按创建时间排序
6. (userId, status) - 复合索引，按用户和物流状态筛选
7. (orderId, createTime) - 复合索引，按订单和创建时间排序

## 权限设计

- 用户只能读取自己的物流信息
- 管理员可以读取和修改所有物流信息

## 数据示例

```json
{
  "_id": "物流文档ID",
  "trackingId": "TK1694229586000",
  "orderId": "ORDER1693805100000",
  "userId": "user123",
  "expressCompany": "顺丰速运",
  "expressCode": "SF",
  "expressLogo": "https://www.example.com/logistics/sf_logo.png",
  "trackingNumber": "SF1234567890",
  "status": "delivering",
  "statusText": "运输中",
  "senderInfo": {
    "name": "HBN官方商城",
    "phone": "4008008000",
    "address": {
      "province": "广东省",
      "city": "广州市",
      "district": "白云区",
      "detailAddress": "机场路1588号物流中心",
      "postalCode": "510000"
    }
  },
  "receiverInfo": {
    "name": "张三",
    "phone": "13800138000",
    "address": {
      "province": "广东省",
      "city": "广州市",
      "district": "天河区",
      "detailAddress": "体育西路123号",
      "postalCode": "510620"
    }
  },
  "packageInfo": {
    "weight": "0.5kg",
    "items": [
      {
        "productId": 2,
        "productName": "HBN发光水α-熊果苷精粹水2.0提亮保湿爽肤水湿敷水",
        "productImage": "https://www.hbn.cn/assets/1-Bsqoo_S0.png",
        "specifications": {
          "规格": "经典版",
          "净含量": "150ml赠水乳体验礼"
        },
        "quantity": 1
      }
    ],
    "itemCount": 1
  },
  "trackingInfo": [
    {
      "time": "2023-09-09 10:30:00",
      "status": "快递已揽收",
      "location": "广东省广州市白云区",
      "operator": "李师傅",
      "remark": "已成功取件"
    },
    {
      "time": "2023-09-09 15:45:00",
      "status": "已到达集散中心",
      "location": "广东省广州市白云区中转中心",
      "operator": "",
      "remark": ""
    },
    {
      "time": "2023-09-09 20:12:00",
      "status": "已发出",
      "location": "广东省广州市白云区中转中心",
      "operator": "",
      "remark": "发往广州天河集散中心"
    },
    {
      "time": "2023-09-10 07:30:00",
      "status": "运输中",
      "location": "广东省广州市天河区集散中心",
      "operator": "",
      "remark": "即将配送"
    }
  ],
  "createTime": "2023-09-09 10:30:00",
  "updateTime": "2023-09-10 07:30:00",
  "estimatedDeliveryTime": "2023-09-10 18:00:00",
  "actualDeliveryTime": "",
  "signedBy": ""
}
``` 