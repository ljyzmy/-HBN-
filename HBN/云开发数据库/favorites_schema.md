# 收藏功能数据库结构设计

## 收藏记录表 (favorites.jsonl)

存储用户收藏的商品记录。

| 字段名 | 类型 | 说明 |
| ------ | ---- | ---- |
| _id | String | 收藏记录ID，格式为"fav_xxx" |
| user_id | String | 用户ID，关联到用户表 |
| product_id | Number | 商品ID |
| name | String | 商品名称 |
| image | String | 商品主图URL |
| price | Number | 商品当前价格 |
| originalPrice | Number | 商品原价 |
| category | String | 商品分类 |
| create_time | String | 收藏时间，格式"YYYY-MM-DD HH:MM:SS" |
| portrait_tags | Array | 用户画像标签，如["干皮","敏感肌"] |
| source | String | 收藏来源，如"详情页"、"首页推荐" |

## 用户收藏画像表 (favorites_portrait.jsonl)

存储用户收藏行为的统计和画像分析结果。

| 字段名 | 类型 | 说明 |
| ------ | ---- | ---- |
| _id | String | 收藏画像ID，格式为"fp_xxx" |
| user_id | String | 用户ID，关联到用户表 |
| portrait_id | String | 用户画像ID，关联到用户画像表 |
| favorites_count | Number | 用户收藏商品数量 |
| top_categories | Array | 用户收藏商品的主要分类 |
| top_tags | Array | 用户收藏商品的主要特征标签 |
| last_favorite_time | String | 最后收藏时间，格式"YYYY-MM-DD HH:MM:SS" |
| analysis_result | String | 用户收藏行为分析结论 |

## 数据关系

1. 一个用户可以有多个收藏记录，通过user_id关联
2. 每个用户有一个收藏画像分析，通过user_id和portrait_id关联
3. 收藏记录和用户画像通过portrait_tags建立关联
4. 收藏画像的统计数据会随用户收藏行为动态更新

## 数据操作API

### 添加收藏
- 向favorites集合添加记录
- 更新favorites_portrait集合中的统计数据

### 取消收藏
- 从favorites集合删除记录
- 更新favorites_portrait集合中的统计数据

### 批量操作
- 支持批量添加/删除收藏
- 批量操作后需要重新计算favorites_portrait数据

### 用户画像分析
- 基于收藏记录，定期更新用户画像分析结果
- 可用于商品推荐和个性化营销 