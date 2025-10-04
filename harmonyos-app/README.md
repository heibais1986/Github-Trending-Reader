# GitHub Trending HarmonyOS App

这是一个展示GitHub热门仓库的鸿蒙应用。

## 功能特性

- 展示每日GitHub热门仓库
- 支持下拉刷新获取最新数据
- 一键跳转到GitHub仓库页面
- 优雅的错误处理和加载状态
- 响应式设计，适配不同屏幕尺寸

## 项目结构

```
harmonyos-app/
├── AppScope/                 # 应用级配置
│   └── app.json5            # 应用配置文件
├── entry/                   # 入口模块
│   ├── src/main/
│   │   ├── ets/            # ArkTS源码
│   │   │   ├── entryability/
│   │   │   └── pages/
│   │   ├── resources/      # 资源文件
│   │   └── module.json5    # 模块配置
│   ├── oh-package.json5    # 模块依赖
│   └── hvigorfile.ts       # 构建配置
├── build-profile.json5     # 构建配置
├── hvigorfile.ts          # 项目构建配置
└── oh-package.json5       # 项目依赖
```

## 开发环境要求

- **DevEco Studio**: 4.0+ (**必需**，用于初始项目配置和完整构建)
- **HarmonyOS SDK**: API 9+ (最低), API 11 (推荐)
- **Node.js**: 16+
- **构建系统**: hvigor (项目自带)

> **重要**: 要生成真正的HAP文件，必须使用DevEco Studio进行初始项目配置。命令行脚本用于自动化构建，但需要先在DevEco Studio中成功构建一次。

## 快速开始

### 0. 环境检查（推荐）

首先运行环境检查脚本，验证开发环境：

```powershell
.\scripts\check-environment.ps1
```

这个脚本会检查：
- 项目结构完整性
- Node.js版本
- HarmonyOS SDK配置
- DevEco Studio安装
- 之前的构建产物

### 1. 使用DevEco Studio（必需的第一步）

1. 下载并安装 [DevEco Studio](https://developer.harmonyos.com/en/develop/deveco-studio)
2. 打开项目：选择 `harmonyos-app` 文件夹
3. 等待SDK下载和项目配置完成
4. 构建项目：**Build** → **Build Hap(s)/APP(s)**

详细设置指南：`docs/deveco-studio-setup.md`

### 2. 验证构建成功

构建成功后，应该能找到HAP文件：
```
entry/build/outputs/hap/entry/debug/entry-default-signed.hap
```

### 3. 使用命令行自动化（可选）

DevEco Studio构建成功后，可以使用命令行脚本：

## 构建和运行

### 自动化构建（推荐）

使用构建脚本：

```bash
# 调试版本
./scripts/build.sh --mode debug

# 发布版本
./scripts/build.sh --mode release

# 清理构建
./scripts/build.sh --mode release --clean
```

Windows系统：
```powershell
# 调试版本
.\scripts\build.ps1 -Mode debug

# 发布版本
.\scripts\build.ps1 -Mode release

# 清理构建
.\scripts\build.ps1 -Mode release -Clean
```

### 手动构建

1. 使用DevEco Studio打开项目
2. 配置HarmonyOS SDK
3. 连接设备或启动模拟器
4. 点击运行按钮构建并安装应用

### 测试应用

```bash
# 基础测试
./scripts/test.sh

# 在设备上测试
./scripts/test.sh --device 127.0.0.1:5555 --install

# 测试API连接
./scripts/test.sh --api-url https://api.yourdomain.com
```

Windows系统：
```powershell
# 基础测试
.\scripts\test.ps1

# 在设备上测试
.\scripts\test.ps1 -DeviceId 127.0.0.1:5555 -Install

# 测试API连接
.\scripts\test.ps1 -ApiUrl https://api.yourdomain.com
```

### 打包发布

```bash
# 打包发布版本
./scripts/package.sh --mode release --output dist
```

Windows系统：
```powershell
# 打包发布版本
.\scripts\package.ps1 -Mode release -OutputDir dist
```

## 权限说明

应用需要以下权限：
- `ohos.permission.INTERNET`: 用于访问网络获取GitHub数据

## API配置

应用默认连接到部署在Cloudflare Worker上的API服务。如需修改API地址，请在以下文件中更新：

```typescript
// entry/src/main/ets/constants/ApiConstants.ets
export const API_BASE_URL = 'https://api.yourdomain.com';
```

## 测试和部署

详细的测试和部署指南请参考：`docs/testing-deployment-guide.md`

### 快速测试流程

1. **构建应用**：`./scripts/build.sh --mode release`
2. **运行测试**：`./scripts/test.sh --install`
3. **打包发布**：`./scripts/package.sh --mode release`

### 设备安装

```bash
# 安装到连接的设备
hdc install dist/github-trending-harmonyos-1.0.0-release-*.hap

# 启动应用
hdc shell aa start -a EntryAbility -b com.github.trending
```

## 故障排除

### 常见问题

1. **HAP文件只有1KB或没有生成**
   - **原因**: 没有使用DevEco Studio进行初始构建
   - **解决**: 按照上面的"快速开始"步骤操作

2. **构建命令失败**
   - **解决**: 确保先在DevEco Studio中成功构建
   - **备用**: 使用 `node .\hvigor\bin\hvigor.js assembleHap`

3. **SDK路径问题**
   - **解决**: 让DevEco Studio自动配置SDK路径
   - **手动**: 检查 `local.properties` 文件

4. **OHPM依赖下载失败**
   - **症状**: `NOTFOUND package '@ohos/hvigor-ohos-plugin@4.0.5' not found` 或 `401 未经授权`
   - **原因**: 包仓库认证问题或网络限制
   - **解决**: 参考 `docs/ohpm-dependency-issues.md`
   - **推荐**: 使用DevEco Studio（自动处理认证）
   - **诊断**: 运行 `.\scripts\diagnose-ohpm.ps1`

### 详细指南

- **🚀 快速解决方案**: `docs/quick-solution-guide.md` ⭐ **推荐先看**
- **DevEco Studio设置**: `docs/deveco-studio-setup.md`
- **构建要求**: `docs/build-requirements.md`
- **OHPM依赖问题**: `docs/ohpm-dependency-issues.md`
- **HAP构建故障排除**: `docs/hap-build-troubleshooting.md`
- **测试和部署**: `docs/testing-deployment-guide.md`

### 获取帮助

如果遇到问题：
1. 首先尝试在DevEco Studio中构建
2. 查看构建日志：`.hvigor\outputs\build-logs\build.log`
3. 参考官方文档：https://developer.harmonyos.com/