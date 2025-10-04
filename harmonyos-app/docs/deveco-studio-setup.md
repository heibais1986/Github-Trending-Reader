# DevEco Studio 项目设置指南

## 概述

要成功构建HarmonyOS应用，需要使用DevEco Studio进行初始项目配置。本指南将帮助您正确设置开发环境。

## 为什么需要DevEco Studio？

虽然我们提供了命令行构建脚本，但HarmonyOS应用的完整构建需要：

1. **完整的HarmonyOS SDK** - 包含编译器、工具链和运行时
2. **正确的项目配置** - SDK路径、签名配置等
3. **依赖管理** - 自动下载和配置必要的构建依赖
4. **签名证书** - 用于应用签名的开发证书

DevEco Studio会自动处理这些复杂的配置。

## 安装步骤

### 1. 下载和安装DevEco Studio

1. 访问官方网站：https://developer.harmonyos.com/en/develop/deveco-studio
2. 下载适合您操作系统的版本
3. 按照安装向导完成安装

### 2. 初始配置

1. **启动DevEco Studio**
2. **配置SDK**：
   - 首次启动时会提示下载HarmonyOS SDK
   - 选择API Level 9和11（推荐）
   - 等待SDK下载完成

3. **配置Node.js**：
   - DevEco Studio会自动检测Node.js
   - 如果没有安装，请先安装Node.js 16+

### 3. 导入项目

1. **打开DevEco Studio**
2. **选择 "Open"**
3. **导航到项目目录**：选择 `harmonyos-app` 文件夹
4. **等待项目加载**：DevEco Studio会自动：
   - 分析项目结构
   - 下载必要的依赖
   - 配置构建环境

### 4. 首次构建

1. **等待索引完成**：让DevEco Studio完成项目索引
2. **检查配置**：
   - 确保SDK路径正确
   - 检查签名配置（开发阶段使用自动签名）
3. **构建项目**：
   - 点击 **Build** → **Build Hap(s)/APP(s)**
   - 或使用快捷键 `Ctrl+F9`

### 5. 验证构建

构建成功后，您应该能在以下位置找到HAP文件：
```
harmonyos-app/entry/build/outputs/hap/entry/debug/entry-default-signed.hap
```

## 常见问题解决

### 问题1：SDK下载失败
**解决方案**：
- 检查网络连接
- 使用VPN（如果在中国大陆）
- 手动下载SDK并配置路径

### 问题2：Node.js版本不兼容
**解决方案**：
- 安装Node.js 16或更高版本
- 在DevEco Studio中重新配置Node.js路径

### 问题3：构建失败
**解决方案**：
1. 清理项目：**Build** → **Clean Project**
2. 重新构建：**Build** → **Rebuild Project**
3. 检查错误日志并根据提示修复

### 问题4：签名错误
**解决方案**：
- 使用自动签名（开发阶段）
- 确保开发者账号已登录
- 检查签名配置文件

## 配置验证

### 检查SDK配置
1. **File** → **Settings** → **SDK**
2. 确保HarmonyOS SDK路径正确
3. 验证API Level 9和11已安装

### 检查项目配置
1. 打开 `build-profile.json5`
2. 确认以下配置：
```json5
{
  "app": {
    "compileSdkVersion": 11,
    "compatibleSdkVersion": 9
  }
}
```

### 检查模块配置
1. 打开 `entry/src/main/module.json5`
2. 确认应用信息正确：
```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "abilities": [...],
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      }
    ]
  }
}
```

## 命令行构建配置

成功在DevEco Studio中构建后，命令行构建应该也能正常工作：

```powershell
# 构建应用
.\scripts\build.ps1 -Mode release

# 测试应用
.\scripts\test.ps1 -Install

# 打包发布
.\scripts\package.ps1 -Mode release
```

## 开发工作流程

### 推荐的开发流程：

1. **使用DevEco Studio进行开发**：
   - 代码编写和调试
   - 界面设计和预览
   - 设备调试和测试

2. **使用命令行进行自动化**：
   - 持续集成构建
   - 自动化测试
   - 批量打包发布

### 混合工作流程：

```bash
# 1. 在DevEco Studio中开发和调试
# 2. 使用命令行进行构建验证
.\scripts\build.ps1 -Mode debug

# 3. 运行自动化测试
.\scripts\test.ps1 -DeviceId 127.0.0.1:5555 -Install

# 4. 打包发布版本
.\scripts\package.ps1 -Mode release
```

## 故障排除

### 构建日志检查
```powershell
# 查看构建日志
Get-Content .hvigor\outputs\build-logs\build.log -Tail 50

# 查看详细构建信息
node .\hvigor\bin\hvigor.js assembleHap --stacktrace --debug
```

### 环境验证
```powershell
# 检查Node.js版本
node --version

# 检查SDK路径
Get-Content local.properties

# 检查项目结构
Get-ChildItem entry\src\main\ets -Recurse
```

## 支持资源

- **官方文档**：https://developer.harmonyos.com/cn/docs/documentation/doc-guides/start-overview-0000001478061421
- **开发者论坛**：https://developer.huawei.com/consumer/cn/forum/block/harmonyos
- **示例代码**：https://gitee.com/openharmony/applications_app_samples

## 总结

DevEco Studio是HarmonyOS开发的官方IDE，提供了完整的开发环境配置。虽然我们的命令行脚本提供了自动化支持，但初始项目配置和复杂的构建问题最好通过DevEco Studio解决。

一旦在DevEco Studio中成功构建，命令行工具就可以用于日常的自动化构建和部署任务。