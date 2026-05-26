# 反馈数据库结构说明

## 集合名称: feedback

该集合用于存储用户提交的反馈信息，包括问题报告、功能建议等。

### 字段结构

| 字段名 | 类型 | 必填 | 描述 |
| ----- | ---- | ---- | ---- |
| _id | String | 是 | 文档ID，系统自动生成或指定格式 |
| typeId | Number | 是 | 问题类型ID |
| typeName | String | 是 | 问题类型名称 |
| content | String | 是 | 问题描述内容 |
| contactWay | String | 否 | 联系方式，如手机号或微信号 |
| imageFileIDs | Array | 否 | 图片云存储文件ID数组 |
| status | String | 是 | 反馈状态，可选值: pending(待处理), processing(处理中), completed(已完成) |
| createTime | String | 是 | 创建时间，格式: YYYY-MM-DD HH:MM:SS |
| openid | String | 是 | 提交反馈的用户openid |
| dealt | Boolean | 是 | 是否已处理 |
| dealTime | String | 否 | 处理时间，格式: YYYY-MM-DD HH:MM:SS |
| dealResult | String | 否 | 处理结果或回复内容 |

### 索引设置
- openid: 按用户查询其提交的反馈
- status: 按状态查询反馈
- createTime: 按时间排序查询

### 权限设置
- 创建者可读写
- 管理员可读写
- 其他用户不可访问

### 使用场景
1. 用户提交反馈
2. 用户查询自己的反馈历史
3. 管理员处理和回复反馈

### 数据示例
```json
{
  "_id": "feedback123456",
  "typeId": 1,
  "typeName": "商品相关",
  "content": "我购买的护肤品包装有轻微损坏，希望能改进物流包装",
  "contactWay": "13812345678",
  "imageFileIDs": [
    "cloud://YOUR_CLOUD_ENV_ID.636c-YOUR_CLOUD_ENV_ID-1333491872/feedback/1622531245000_0.jpg"
  ],
  "status": "pending",
  "createTime": "2023-09-15 14:32:15",
  "openid": "user123456",
  "dealt": false,
  "dealTime": "",
  "dealResult": ""
}
``` 