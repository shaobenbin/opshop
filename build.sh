#!/bin/bash

# 检查是否输入了版本号
if [ -z "$1" ]; then
    echo "错误: 请输入版本号 (例如: ./build.sh 0.1.1)"
    exit 1
fi

VERSION=$1
APP_NAME="opshop"
RELEASE_DIR="release"

# 创建 release 文件夹（如果不存在）
mkdir -p $RELEASE_DIR

# 清理历史产物
rm -f $RELEASE_DIR/*.tar.gz

echo "开始构建版本: v$VERSION"
echo "-----------------------------------"

# 待编译的架构列表
PLATFORMS=("amd64" "arm64")

for ARCH in "${PLATFORMS[@]}"
do
    FILENAME="${APP_NAME}-v${VERSION}-darwin-${ARCH}"
    TAR_NAME="${FILENAME}.tar.gz"

    echo "编译中: [$ARCH] ..."

    # 1. 编译二进制文件
    # CGO_ENABLED=0 确保静态编译，增加移植性
    GOOS=darwin GOARCH=$ARCH CGO_ENABLED=0 go build -o $APP_NAME .

    # 2. 检查编译是否成功
    if [ $? -ne 0 ]; then
        echo "编译失败: $ARCH"
        exit 1
    fi

    # 3. 打包
    tar -czvf "${RELEASE_DIR}/${TAR_NAME}" $APP_NAME > /dev/null

    # 4. 清理临时二进制文件
    rm $APP_NAME

    echo "完成打包: ${RELEASE_DIR}/${TAR_NAME}"

    # 5. 计算并显示 SHA256 (Homebrew 需要)
    SHASUM=$(shasum -a 256 "${RELEASE_DIR}/${TAR_NAME}" | awk '{print $1}')
    echo "SHA256 ($ARCH): $SHASUM"
    echo "-----------------------------------"
done

echo "所有构建任务已完成！产物位于: $RELEASE_DIR/"
