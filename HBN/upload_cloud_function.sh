#!/bin/bash

# 获取当前目录
CURRENT_DIR=$(pwd)
CLOUD_FUNCTION_NAME="updateAddress"
CLOUD_ENV="cloud1-0gxff61z2804383c"

echo "正在上传 $CLOUD_FUNCTION_NAME 云函数到 $CLOUD_ENV 环境..."

# 进入云函数目录
cd "$CURRENT_DIR/cloudfunctions/$CLOUD_FUNCTION_NAME"

# 安装依赖
echo "安装云函数依赖..."
npm install

# 上传云函数
echo "上传云函数..."
# 这里需要使用微信开发者工具的cli，下面的命令可能需要调整
# 如果你使用的是Windows，可以调整路径为开发者工具的安装位置
# 例如："C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat" cloud functions deploy --env $CLOUD_ENV --name $CLOUD_FUNCTION_NAME --force

# 提示手动上传
echo "请在微信开发者工具中右键点击 cloudfunctions/$CLOUD_FUNCTION_NAME 文件夹，选择'上传并部署：云端安装依赖'"
echo "并确保云环境选择为：$CLOUD_ENV"

# 返回到项目根目录
cd "$CURRENT_DIR"

echo "脚本执行完成。" 