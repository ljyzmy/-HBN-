# 商品数据库模式定义

## 集合名称
products

## 字段定义

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| _id | Number/String | 是 | 商品唯一标识符 |
| name | String | 是 | 商品名称 |
| subTitle | String | 否 | 商品副标题 |
| price | Number | 是 | 商品当前价格 |
| originalPrice | Number | 是 | 商品原价 |
| description | String | 是 | 商品详细描述 |
| mainImage | String | 是 | 商品主图URL |
| detailImages | Array<String> | 是 | 商品详情图片URL数组 |
| bannerImages | Array<String> | 是 | 商品轮播图URL数组 |
| stock | Number | 是 | 商品库存数量 |
| sales | Number | 是 | 商品销量 |
| category | Array<String> | 是 | 商品分类标签数组 |
| tags | Array<String> | 否 | 商品特性标签数组 |
| specs | Array<Object> | 是 | 商品规格数组 |
| specs[].name | String | 是 | 规格名称（如"规格"、"颜色"） |
| specs[].options | Array<String> | 是 | 规格可选值数组 |
| skinTypes | Array<String> | 是 | 适用肤质数组（如"干性"、"油性"） |
| skinConcerns | Array<String> | 是 | 针对肌肤问题数组（如"干燥"、"痘痘"） |
| ingredients | Array<String> | 否 | 主要成分数组 |
| usage | String | 否 | 使用方法 |
| rating | Number | 否 | 商品评分（1-5分） |
| ratingCount | Number | 否 | 评分数量 |
| isNew | Boolean | 否 | 是否新品 |
| isHot | Boolean | 否 | 是否热销 |
| isRecommended | Boolean | 否 | 是否推荐 |
| discount | Number | 否 | 折扣率（0-1之间） |
| productType | String | 否 | 产品类型（如"精华液"、"面霜"） |
| capacity | String | 否 | 容量/规格 |
| madeIn | String | 否 | 产地 |
| brand | String | 否 | 品牌 |
| shelfLife | String | 否 | 保质期 |
| productionDate | String | 否 | 生产日期 |
| videoUrl | String | 否 | 商品视频URL |
| productVideo | String | 否 | 产品主视频 |
| productVideo2 | String | 否 | 产品辅助视频 |
| detailVideoIndex | Number | 否 | 详情页视频在detailImages中的索引位置 |
| status | Number | 否 | 商品状态(1=上架，0=下架) |
| createdAt | Number | 否 | 创建时间戳 |
| updatedAt | Number | 否 | 更新时间戳 |

## 索引设计
- _id: 唯一索引
- category: 普通索引
- skinTypes: 普通索引
- skinConcerns: 普通索引
- tags: 普通索引

## 示例
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
  "bannerImages": [
    "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/products/product1_banner1.jpg",
    "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/products/product1_banner2.jpg"
  ],
  "stock": 860,
  "sales": 1240,
  "category": ["精华", "抗老", "修护"],
  "tags": ["抗皱", "淡纹", "提拉紧致"],
  "specs": [
    {
      "name": "规格",
      "options": ["30ml标准装", "15ml体验装", "30ml+15ml礼盒装"]
    }
  ],
  "skinTypes": ["干性", "中性", "混合型", "敏感性"],
  "skinConcerns": ["细纹", "松弛", "老化"],
  "ingredients": ["蓝铜胜肽", "六胜肽", "玻尿酸", "神经酰胺"],
  "usage": "取适量精华于掌心，轻轻按压于面部及颈部，由内向外、由下向上按摩吸收。建议早晚各一次。",
  "rating": 4.8,
  "ratingCount": 526,
  "isNew": false,
  "isHot": true,
  "isRecommended": true,
  "discount": 0.83,
  "productType": "精华液",
  "capacity": "30ml",
  "madeIn": "中国",
  "brand": "HBN",
  "shelfLife": "三年",
  "productionDate": "2023-01",
  "videoUrl": "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/products/product1_video.mp4",
  "status": 1,
  "createdAt": 1672531200000,
  "updatedAt": 1693584000000
}
``` 