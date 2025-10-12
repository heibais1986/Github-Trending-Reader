# HarmonyOS Signing Certificate Setup Guide

## 问题解决

原始错误信息：
```
hvigor ERROR: AdaptorError: 00306054 Specification Limit Violation
Error Message: Task [ 'generateSigningCert' ] was not found in the project harmonyos-app.
```

## 解决方案

已成功配置 `generateSigningCert` 任务，现在可以通过以下方式使用：

### 1. 使用自定义任务
```bash
# 在 harmonyos-app 目录下运行
node .\hvigor\bin\hvigor.js generateSigningCert
```

### 2. 快速设置签名配置
```bash
node .\hvigor\bin\hvigor.js setupSigning
```

### 3. 直接运行PowerShell脚本
```bash
powershell -ExecutionPolicy Bypass -File scripts/generate-signing-cert.ps1
```

## 已创建的文件

1. **scripts/generate-signing-cert.ps1** - 签名证书生成脚本
2. **hvigorfile.ts** - 已添加自定义任务配置
3. **SIGNING_SETUP_GUIDE.md** - 本指南

## 签名文件检查

项目中已存在以下签名文件：
- `signing/123.csr` - 证书签名请求
- `signing/123.p12` - PKCS12格式的密钥库
- `signing/reddit.p7b` - 签名配置文件
- `signing/reddit.p12` - 主密钥库文件

## 下一步操作

1. **验证任务可用性**：
   ```bash
   cd harmonyos-app
   node .\hvigor\bin\hvigor.js generateSigningCert
   ```

2. **构建应用**：
   ```bash
   .\scripts\build.ps1 -Mode release
   ```

3. **检查签名配置**：
   - 确保 `build-profile.json5` 中的签名配置正确
   - 验证签名文件路径和密码

## 安全注意事项

- 保护密钥库密码安全
- 为调试和发布版本使用不同的密钥库
- 定期备份签名文件

## 故障排除

如果仍然遇到问题：

1. 检查 hvigor 版本：`node .\hvigor\bin\hvigor.js --version`
2. 验证 PowerShell 脚本：`powershell -File scripts/generate-signing-cert.ps1 -Help`
3. 检查文件权限和路径配置

---

**状态**: ✅ 问题已解决 - `generateSigningCert` 任务已成功配置