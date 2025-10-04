# HarmonyOS构建诊断脚本
Write-Host "=== HarmonyOS构建环境诊断 ===" -ForegroundColor Green

# 检查DevEco Studio安装
$devEcoPath = "D:\Program Files\Huawei\DevEco Studio"
if (Test-Path $devEcoPath) {
    Write-Host "✅ DevEco Studio已安装" -ForegroundColor Green
} else {
    Write-Host "❌ DevEco Studio未找到" -ForegroundColor Red
}

# 检查SDK路径
$sdkPath = "D:\Program Files\Huawei\DevEco Studio\sdk"
if (Test-Path $sdkPath) {
    Write-Host "✅ SDK路径正确" -ForegroundColor Green
} else {
    Write-Host "❌ SDK路径不正确" -ForegroundColor Red
}

# 检查构建工具
$hvigorPath = "D:\Program Files\Huawei\DevEco Studio\tools\hvigor\bin\hvigorw.bat"
if (Test-Path $hvigorPath) {
    Write-Host "✅ Hvigir工具存在" -ForegroundColor Green
} else {
    Write-Host "❌ Hvigir工具缺失" -ForegroundColor Red
}

# 检查ohpm工具
$ohpmPath = "D:\Program Files\Huawei\DevEco Studio\tools\ohpm\bin\ohpm.bat"
if (Test-Path $ohpmPath) {
    Write-Host "✅ Ohpm工具存在" -ForegroundColor Green
} else {
    Write-Host "❌ Ohpm工具缺失" -ForegroundColor Red
}

# 检查配置文件
$configFiles = @("local.properties", "oh-package.json5", "build-profile.json5")
foreach ($file in $configFiles) {
    if (Test-Path ".\$file") {
        Write-Host "✅ $file 存在" -ForegroundColor Green
    } else {
        Write-Host "❌ $file 缺失" -ForegroundColor Red
    }
}

Write-Host "`n=== 推荐解决方案 ===" -ForegroundColor Yellow
Write-Host "1. 尝试使用DevEco Studio GUI构建（推荐）"
Write-Host "2. 如果命令行仍有问题，请检查："
Write-Host "   - DevEco Studio是否完整安装"
Write-Host "   - 防火墙是否阻止了网络访问"
Write-Host "   - 尝试重新安装DevEco Studio"
Write-Host "3. 或者联系华为开发者支持"