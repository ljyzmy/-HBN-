# 私密配置说明

上传到 GitHub 前已脱敏。本地开发请：

1. 复制 `miniprogram/config/env.example.js` 为 `miniprogram/config/env.js`，填写真实云环境 ID、Bot ID、AppID。
2. 在 `project.private.config.json` 中填写微信小程序 `appid`（该文件不会上传）。
3. 用微信开发者工具打开 `HBN` 目录进行调试。

勿将 `env.js`、`project.private.config.json` 提交到公开仓库。
