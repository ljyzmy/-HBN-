#!/bin/bash

# 部署礼品卡相关云函数

# 确保工作目录正确
cd "$(dirname "$0")"

# 部署云函数列表
echo "开始部署云函数..."

# 部署 transferGiftCard 云函数
echo "正在部署 transferGiftCard 云函数..."
cd transferGiftCard
npm install
cd ..
wx cloud deploy --env cloud1-0gxff61z2804383c --function-name transferGiftCard --function-path ./transferGiftCard

# 部署 activateGiftCard 云函数
echo "正在部署 activateGiftCard 云函数..."
cd activateGiftCard
npm install
cd ..
wx cloud deploy --env cloud1-0gxff61z2804383c --function-name activateGiftCard --function-path ./activateGiftCard

# 部署 useGiftCard 云函数
echo "正在部署 useGiftCard 云函数..."
cd useGiftCard
npm install
cd ..
wx cloud deploy --env cloud1-0gxff61z2804383c --function-name useGiftCard --function-path ./useGiftCard

echo "所有云函数部署完成!" 