# skin_analysis 皮肤分析数据集合

## 描述
存储用户皮肤状态分析结果，用于生成个性化护肤方案。

## 字段说明

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| _id | string | 是 | 文档ID，系统自动生成 |
| userId | number | 是 | 用户ID，用于关联用户 |
| skinType | string | 是 | 皮肤类型，如"干性"、"油性"、"混合型"、"中性"、"敏感性" |
| concerns | array | 是 | 皮肤问题数组，如["干燥","暗沉","毛孔粗大"] |
| recommendation | string | 是 | 针对该用户的皮肤护理建议 |
| recommendedProducts | array | 否 | 推荐产品ID数组，关联products集合 |
| analysisDate | timestamp | 是 | 分析日期时间戳 |
| testResults | object | 否 | 测试详细结果，包含各项指标 |
| skinAge | number | 否 | 皮肤年龄评估 |
| moisture | number | 否 | 肌肤水分含量评分(0-100) |
| oil | number | 否 | 肌肤油分评分(0-100) |
| elasticity | number | 否 | 肌肤弹性评分(0-100) |
| sensitivity | number | 否 | 肌肤敏感度评分(0-100) |
| updatedAt | timestamp | 是 | 更新时间 |
| createdAt | timestamp | 是 | 创建时间 |

## 索引设计
1. `userId` 字段创建索引，提高按用户查询性能

## 示例文档
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

## 关联集合
- products: 通过recommendedProducts字段关联产品信息
- users: 通过userId字段关联用户信息

## 业务规则
- 每个用户只保存最近的一次皮肤分析结果
- 分析结果有效期为30天，超过30天应提示用户重新测试
- 推荐产品应根据皮肤类型和问题进行个性化匹配 