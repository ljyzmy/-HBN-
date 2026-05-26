# HBN微信小程序云开发数据库

本文档描述了HBN护肤品小程序的云开发数据库结构，包括各集合的定义、字段说明和使用示例。

## 数据库集合概览

1. **用户相关**
   - `users`: 用户基本信息
   - `addresses`: 用户收货地址
   - `favorites`: 用户收藏商品
   - `favorites_portrait`: 用户收藏画像

2. **商品相关**
   - `products`: 产品信息
   - `reviews`: 产品评价

3. **财务相关**
   - `points`: 用户积分记录
   - `balance`: 用户余额记录
   - `user_balance`: 用户余额汇总
   - `gift_cards`: 礼品卡信息
   - `gift_card_transactions`: 礼品卡交易记录

4. **优惠券相关**
   - `coupons`: 优惠券定义
   - `coupon_rules`: 优惠券规则
   - `coupon_center`: 优惠券中心活动
   - `coupon_user_relation`: 用户与优惠券关系

5. **用户反馈相关**
   - `feedback`: 用户意见反馈

6. **皮肤测试相关**
   - `skin_analysis`: 用户皮肤分析结果

7. **订单与售后相关**
   - `orders`: 订单信息
   - `aftersales`: 售后申请
   - `logistics`: 物流信息

## 集合结构详情

### products集合

该集合存储所有护肤产品的详细信息，用于展示、搜索和推荐。

**字段说明:**
- `_id`: 产品唯一ID
- `name`: 产品名称
- `subTitle`: 产品副标题
- `price`: 产品价格
- `originalPrice`: 原价
- `description`: 产品描述
- `mainImage`: 主图URL
- `detailImages`: 详情图片URL数组
- `bannerImages`: 轮播图URL数组
- `stock`: 库存数量
- `sales`: 销售数量
- `category`: 产品分类数组
- `tags`: 产品标签数组
- `specs`: 规格信息数组
- `skinTypes`: 适用皮肤类型数组
- `skinConcerns`: 解决的肌肤问题数组
- `ingredients`: 主要成分数组
- `usage`: 使用方法
- `rating`: 产品评分(0-5)
- `status`: 状态(0:下架, 1:上架)

**权限设置:**
- 所有用户可读，仅管理员可写

**示例:**
```json
{
  "_id": 1,
  "name": "HBN蓝铜胜肽原液",
  "subTitle": "抗老紧致淡纹修护精华",
  "price": 298.00,
  "originalPrice": 359.00,
  "description": "富含3%高纯度蓝铜胜肽和2%六胜肽，有效对抗面部细纹，提升肌肤紧致度，改善老化松弛",
  "mainImage": "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/products/product1_main.jpg",
  "detailImages": [
    "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/products/product1_detail1.jpg",
    "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/products/product1_detail2.jpg"
  ],
  "stock": 860,
  "sales": 1240,
  "category": ["精华", "抗老", "修护"],
  "skinTypes": ["干性", "中性", "混合型", "敏感性"],
  "skinConcerns": ["细纹", "松弛", "老化"]
}
```

### feedback集合

该集合存储用户提交的问题反馈、建议等信息，用于后台管理和问题处理。

**字段说明:**
- `_id`: 记录唯一标识符
- `typeId`: 问题类型ID (1-商品相关, 2-订单相关, 3-物流相关, 4-售后相关, 5-功能异常, 6-优化建议, 7-其他问题)
- `typeName`: 问题类型名称
- `content`: 反馈内容
- `contactWay`: 联系方式
- `imageFileIDs`: 图片文件ID数组
- `status`: 处理状态 (pending-待处理, processing-处理中, completed-已完成)
- `createTime`: 创建时间
- `openid`: 用户openid
- `dealt`: 是否已处理
- `dealTime`: 处理时间
- `dealResult`: 处理结果

**权限设置:**
- 仅创建者和管理员可读写

**示例:**
```json
{
  "_id": "feedback123456",
  "typeId": 5,
  "typeName": "功能异常",
  "content": "小程序在查看历史订单时偶尔会闪退，iPhone 13 Pro系统版本16.5",
  "contactWay": "wx123456",
  "imageFileIDs": [
    "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/feedback/1622531245000_1.jpg"
  ],
  "status": "processing",
  "createTime": "2023-09-16 09:45:22",
  "openid": "user234567",
  "dealt": true,
  "dealTime": "2023-09-16 15:20:45",
  "dealResult": "正在排查问题"
}
```

### addresses集合

## 文件说明

本文件夹包含小程序云开发数据库的数据结构和示例数据，采用JSONL格式存储。

### 数据库文件列表

1. **gift_cards.jsonl** - 礼品卡主数据表
   - 存储所有用户的礼品卡信息
   - 包含卡片基本信息、状态、样式等

2. **gift_card_transactions.jsonl** - 礼品卡交易记录表
   - 记录礼品卡的所有交易行为，如激活、使用、转赠等
   - 用于数据分析和交易追溯

3. **gift_card_scheme.jsonl** - 礼品卡方案配置表
   - 定义系统中可用的礼品卡类型和兑换方案
   - 包含卡片样式、积分兑换规则等

4. **points.json** - 用户积分数据表
   - 记录用户的积分余额和积分变动

5. **user_balance.json** - 用户账户余额表
   - 用户账户金额记录

6. **balance.json** - 系统余额汇总表
   - 系统级别的余额汇总和统计数据

7. **用户画像数据库.json** - 用户画像数据
   - 存储用户的基本资料和画像标签

8. **addresses.json** - 地址数据库
   - 存储用户的收货地址信息

## 数据格式说明

### gift_cards.jsonl 字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| _id | String | 礼品卡唯一标识符 |
| userId | String | 用户ID |
| userName | String | 用户名称 |
| name | String | 礼品卡名称 |
| value | Number | 礼品卡面额 |
| type | String | 礼品卡类型(shopping/birthday/vip) |
| status | String | 状态(valid/used/expired) |
| validUntil | String | 有效期 |
| backgroundColor | String | 背景颜色 |
| textColor | String | 文字颜色 |
| code | String | 礼品卡编码 |
| createdAt | String | 创建时间 |
| usedAmount | Number | 已使用金额 |
| canTransfer | Boolean | 是否可以转赠 |
| icon | String | 图标地址 |
| lastUsedTime | String | 最近使用时间 |
| transferHistory | Array | 转赠历史记录 |

### gift_card_transactions.jsonl 字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| _id | String | 交易记录唯一标识符 |
| cardId | String | 礼品卡ID |
| userId | String | 用户ID |
| userName | String | 用户名称 |
| type | String | 交易类型(activate/use/transfer) |
| amount | Number | 交易金额 |
| balance | Number | 交易后余额 |
| time | String | 交易时间 |
| remark | String | 备注信息 |
| operatorId | String | 操作者ID |

### gift_card_scheme.jsonl 字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| _id | String | 方案唯一标识符 |
| name | String | 礼品卡方案名称 |
| value | Number | 礼品卡面额 |
| type | String | 礼品卡类型 |
| backgroundColor | String | 背景颜色 |
| textColor | String | 文字颜色 |
| validPeriod | Number | 有效期(天数) |
| canTransfer | Boolean | 是否可转赠 |
| icon | String | 图标地址 |
| description | String | 方案描述 |
| pointsRequired | Number | 兑换所需积分 |
| status | String | 状态(active/inactive) |
| createdAt | String | 创建时间 |
| updatedAt | String | 更新时间 |

## 使用说明

1. 导入到云开发数据库时，建议保持相同的集合名称
2. 数据格式为JSONL(JSON Lines)，每行一个完整的JSON对象
3. 可以通过云开发控制台导入工具直接导入
4. 导入前请确保云开发环境已创建对应集合 

## 优惠券相关数据库

### coupons 表
优惠券数据表，存储所有优惠券的详细信息。

- **表结构**：见 `coupons.json`

## 优惠券数据库设计概述

优惠券系统采用了三层设计：
1. **优惠券模板（coupon_center）**：定义可以被领取的优惠券基本信息
2. **优惠券实例（coupons）**：被创建的实际优惠券
3. **用户-优惠券关系（coupon_user_relation）**：记录用户与优惠券的关联关系

系统支持针对不同用户画像提供个性化优惠券，并通过规则配置实现灵活的优惠券使用策略。 

## 地址数据库（addresses）
存储用户的收货地址信息。

### addresses.json

```json
[
  {
    "_id": "address_001",
    "userId": 1,
    "nickname": "职场精英女性",
    "addresses": [
      {
        "id": "1",
        "name": "林美玲",
        "phone": "13812345678",
        "province": "北京市",
        "city": "北京市",
        "district": "朝阳区",
        "detail": "国贸CBD写字楼A座1802室",
        "isDefault": true,
        "tag": "公司"
      },
      // ... 更多地址
    ],
    "createTime": "2023-10-01 10:00:00",
    "updateTime": "2024-06-02 16:35:22"
  }
]
```

#### 字段说明：
- **_id**: 记录唯一标识
- **userId**: 用户ID（1: 职场精英女性, 2: 都市新锐青年, 3: 科研工作者）
- **nickname**: 用户昵称
- **addresses**: 地址数组
  - **id**: 地址唯一标识
  - **name**: 收货人姓名
  - **phone**: 联系电话
  - **province**: 省份
  - **city**: 城市
  - **district**: 区/县
  - **detail**: 详细地址
  - **isDefault**: 是否默认地址
  - **tag**: 地址标签（如"家"、"公司"等）
- **createTime**: 创建时间
- **updateTime**: 更新时间

#### 业务逻辑：
1. 用户切换画像时，加载对应画像的地址列表
2. 用户添加/编辑/删除地址时，同步到云数据库
3. 为每个用户画像维护独立的地址列表
4. 支持设置默认地址功能 

## 数据库表列表

1. **用户画像** (user_portrait): 存储用户的个人信息、喜好和标签
2. **商品** (products): 存储所有产品信息
3. **订单** (orders): 存储用户订单信息
4. **购物车** (cart): 存储用户购物车信息
5. **收藏** (favorites): 存储用户收藏的商品
6. **地址** (addresses): 存储用户收货地址
7. **评论** (comments): 存储产品评论
8. **商品评价** (reviews): 存储用户对商品的评价信息
9. **售后申请** (aftersales): 存储用户的售后申请记录
10. **物流详情** (logistics): 存储订单的物流信息和跟踪记录
11. **皮肤分析** (skin_analysis): 存储用户皮肤分析结果

## 皮肤分析系统数据库

### skin_analysis表 - 皮肤分析结果表

皮肤分析结果表存储用户的皮肤测试结果，用于生成个性化护肤方案和产品推荐。

**详细结构**：见 `skin_analysis_schema.md`

**字段说明:**
- `_id`: 文档ID，系统自动生成
- `userId`: 用户ID，关联用户信息
- `skinType`: 皮肤类型，如"干性"、"油性"、"混合型"、"中性"、"敏感性"
- `concerns`: 皮肤问题数组，如["干燥","暗沉","毛孔粗大"]
- `recommendation`: 针对该用户的皮肤护理建议
- `recommendedProducts`: 推荐产品ID数组，关联products集合
- `analysisDate`: 分析日期时间戳
- `testResults`: 测试详细结果，包含各项指标
- `skinAge`: 皮肤年龄评估
- `moisture`: 肌肤水分含量评分(0-100)
- `oil`: 肌肤油分评分(0-100)
- `elasticity`: 肌肤弹性评分(0-100) 
- `sensitivity`: 肌肤敏感度评分(0-100)

**示例:**
```json
{
  "_id": "skin_analysis_1",
  "userId": 1,
  "skinType": "混合偏油",
  "concerns": ["油光", "毛孔粗大", "敏感"],
  "recommendation": "针对混合偏油肌肤，重点控油同时保湿，使用温和配方，避免过度清洁带来的刺激。",
  "recommendedProducts": [1, 4, 5, 7, 9],
  "analysisDate": 1641916800000,
  "testResults": {
    "oilRegions": ["T区", "鼻翼"],
    "dryRegions": ["两颊"],
    "poreSize": "中等",
    "pigmentation": "轻微"
  },
  "skinAge": 28,
  "moisture": 45,
  "oil": 75,
  "elasticity": 65,
  "sensitivity": 60,
  "updatedAt": 1641916800000,
  "createdAt": 1641916800000
}
```

## 订单与售后系统数据库

### orders表 - 订单主表

订单主表存储所有用户的订单信息，包括订单状态、商品信息、物流信息等。

**详细结构**：见 `orders_schema.md`

**字段说明:**
- `_id`: 文档ID，系统自动生成
- `orderId`: 订单ID，格式为：ORDER + 时间戳
- `orderNumber`: 订单编号，格式为：HBN + 时间戳
- `userId`: 用户ID
- `totalAmount`: 订单总金额
- `status`: 订单状态，可选值：unpaid, unshipped, shipped, completed, canceled, afterSale
- `product`: 商品信息，包含商品ID、名称、图片、价格、数量、规格等
- `review`: 评价信息，包含评分、内容、图片、是否匿名、标签、评价时间等
- `afterSale`: 售后信息，包含类型、原因、描述、图片、申请时间、处理状态等

**示例:**
```json
{
  "_id": "order1",
  "orderId": "ORDER1693805100000",
  "orderNumber": "HBN1693805100000",
  "userId": "user123",
  "totalAmount": 119.00,
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
  }
}
```

### aftersales表 - 售后申请表

售后申请表存储用户提交的售后请求信息，包括退款、退货退款、换货等类型的申请。

**详细结构**：见 `aftersales_schema.md`

**字段说明:**
- `_id`: 文档ID，系统自动生成
- `aftersaleId`: 售后单ID，格式为：AS + 时间戳
- `orderId`: 关联的订单ID
- `type`: 售后类型，可选值：refund(仅退款), return_refund(退货退款), exchange(换货)
- `reason`: 退款原因
- `description`: 问题描述
- `images`: 凭证图片URL数组
- `status`: 处理状态，可选值：pending(待处理), processing(处理中), completed(已完成), rejected(已拒绝)

**示例:**
```json
{
  "_id": "aftersale1",
  "aftersaleId": "AS1694056410000",
  "orderId": "ORDER1693805100000",
  "userId": "user123",
  "type": "return_refund",
  "reason": "商品质量问题",
  "description": "收到商品发现有漏液情况，包装已经湿了一片",
  "images": ["cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/售后凭证/img001.jpg"],
  "status": "pending",
  "statusText": "待处理"
}
```

### reviews表 - 商品评价表

商品评价表存储用户对已购买商品的评价信息，包括评分、评价内容、标签、图片等。

**详细结构**：见 `reviews_schema.md`

**字段说明:**
- `_id`: 文档ID，系统自动生成
- `reviewId`: 评价ID，格式为：REV + 时间戳
- `orderId`: 关联的订单ID
- `productId`: 商品ID
- `rating`: 评分，1-5分
- `content`: 评价内容
- `images`: 评价图片URL数组
- `anonymity`: 是否匿名评价
- `tags`: 标签数组，如["商品质量好", "物流很快"]
- `likes`: 点赞数
- `replies`: 回复列表

**示例:**
```json
{
  "_id": "review1",
  "reviewId": "REV1694142330000",
  "orderId": "ORDER1693632300000",
  "productId": 1,
  "userId": "user123",
  "rating": 5,
  "content": "效果很好，质地清爽不粘腻，用了一个月后皮肤状态改善了很多",
  "images": ["cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/评价图片/img001.jpg"],
  "anonymity": false,
  "tags": ["商品质量好","效果明显"],
  "time": "2023-09-08 08:12:10",
  "likes": 12
}
```

### logistics表 - 物流详情表

物流详情表存储订单物流信息，包括快递公司、物流跟踪记录、收发货地址等。

**详细结构**：见 `logistics_schema.md`

**字段说明:**
- `_id`: 文档ID，系统自动生成
- `trackingId`: 物流跟踪ID，格式为：TK + 时间戳
- `orderId`: 关联的订单ID
- `expressCompany`: 快递公司名称
- `expressCode`: 快递公司编码
- `trackingNumber`: 快递单号
- `status`: 物流状态，可选值：pending(待发货), delivering(运输中), delivered(已送达), exception(异常)
- `trackingInfo`: 物流跟踪信息数组，包含时间、状态、位置等
- `senderInfo`: 发件人信息
- `receiverInfo`: 收件人信息
- `packageInfo`: 包裹信息

**示例:**
```json
{
  "_id": "logistics1",
  "trackingId": "TK1694229586000",
  "orderId": "ORDER1693805100000",
  "userId": "user123",
  "expressCompany": "顺丰速运",
  "expressCode": "SF",
  "trackingNumber": "SF1234567890",
  "status": "delivering",
  "statusText": "运输中",
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
    }
  ]
}
```

## 数据关系图

```
users (用户) ──┐
               │
               ├── orders (订单) ─┬── reviews (评价)
               │                  │
               │                  ├── aftersales (售后)
               │                  │
               │                  └── logistics (物流)
               │
               ├── addresses (地址)
               │
               └── skin_analysis (皮肤分析)
```

## 业务流程图

### 订单流程

1. 创建订单 (status: unpaid)
2. 支付订单 (status: unshipped)
3. 发货 (status: shipped)
4. 确认收货 (status: completed)
5. 评价商品 (hasReviewed: true)

### 售后流程

1. 申请售后 (status: pending)
2. 售后处理 (status: processing)
3. 完成售后 (status: completed/rejected)

### 皮肤测试流程

1. 用户完成皮肤测试问卷
2. 系统分析结果并保存到skin_analysis集合
3. 基于分析结果生成个性化护肤方案
4. 根据皮肤类型和问题推荐适合的产品

## 导入新的皮肤分析数据库说明

皮肤分析功能需要创建skin_analysis集合，请按照以下步骤导入数据：

1. 在微信开发者工具中打开云开发控制台
2. 选择"数据库"标签
3. 点击"创建集合"，输入集合名称"skin_analysis"
4. 选择新创建的集合，点击"导入"按钮
5. 上传本目录下的`skin_analysis.jsonl`文件
6. 确认导入数据

导入完成后，皮肤测试和个性化推荐功能将正常工作。

## 注意事项

- 每个用户只保存最近一次的皮肤分析结果
- 分析结果有效期为30天，超过时间应提示用户重新测试
- 更新皮肤分析结果时，需要同时更新推荐产品列表

## 导入新的products商品数据库说明

皮肤分析结果需要关联products集合以展示推荐商品。请按照以下步骤导入商品数据：

1. 在微信开发者工具中打开云开发控制台
2. 选择"数据库"标签
3. 点击"创建集合"，输入集合名称"products"
4. 选择新创建的集合，点击"导入"按钮
5. 上传本目录下的`products.jsonl`文件或`products.json`文件
   - `products.jsonl`: 每行一个商品记录，适合大量数据导入
   - `products.json`: 标准JSON格式，包含data数组
6. 确认导入数据

导入完成后，皮肤测试后的商品推荐功能将正常工作。

## 注意事项

- 产品ID必须唯一，用于在各处引用该产品
- 库存为0时自动标记为售罄状态
- 适用皮肤类型和解决的肌肤问题用于皮肤测试后的产品推荐
- 产品上下架状态通过status字段控制，不删除产品记录