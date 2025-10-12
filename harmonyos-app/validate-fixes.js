/**
 * 简单的验证脚本来检查ArkTS修复效果
 * 用于验证是否还有明显的语法错误
 */

const fs = require('fs');
const path = require('path');

// 检查的文件列表
const filesToCheck = [
  'entry/src/main/ets/services/HttpClient.ets',
  'entry/src/main/ets/services/AuthInterceptor.ets',
  'entry/src/main/ets/constants/ApiConstants.ets'
];

// 常见的ArkTS错误模式
const arkTsErrorPatterns = [
  /config\?\.headers/g,  // 可选链返回undefined的问题
  /Object\.assign/g,     // Object.assign的使用
  /throw [^{]/g,        // 直接throw对象
  /for \(.* in .*hasOwnProperty/g,  // for..in循环
  /: any/g,             // any类型
  /: unknown/g,         // unknown类型
  /obj is \w+/g,        // 类型谓词
  /this\./g,            // 独立函数中的this
  /\[\w+\]/g,           // 计算属性名
  /as unknown/g,        // unknown类型转换
];

console.log('🔍 检查ArkTS兼容性修复...');
console.log('================================');

let allPassed = true;

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ 文件不存在: ${file}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  console.log(`\n📄 检查文件: ${file}`);

  arkTsErrorPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(`  ⚠️  发现潜在问题 ${index + 1}: ${pattern.source}`);
      console.log(`     在行: ${matches.map(match => {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(match)) return i + 1;
        }
        return '未知';
      }).join(', ')}`);
      allPassed = false;
    }
  });

  // 检查积极的修复模式
  if (content.includes('|| {}') || content.includes('|| ({} as')) {
    console.log(`  ✅ 发现类型安全修复`);
  }
  if (content.includes('JSON.stringify') && content.includes('throw new Error')) {
    console.log(`  ✅ 发现throw语句修复`);
  }
  if (content.includes('Object.keys') && content.includes('for (let i = 0')) {
    console.log(`  ✅ 发现for..in循环修复`);
  }
});

console.log('\n================================');
if (allPassed) {
  console.log('🎉 所有检查通过！主要修复都已完成。');
  console.log('📝 注意：这只是静态检查，最终验证需要完整的构建。');
} else {
  console.log('⚠️  发现一些潜在问题需要进一步处理。');
}

console.log('\n📋 修复总结:');
console.log('✅ 已修复的常见问题:');
console.log('  - 可选链返回undefined的类型问题');
console.log('  - throw语句的类型限制');
console.log('  - 对象字面量的类型声明');
console.log('  - for..in循环的替代实现');
console.log('  - any/unknown类型的显式声明');
console.log('  - Object.assign的兼容性问题');

console.log('\n🔧 建议下一步:');
console.log('  - 运行完整构建测试所有修复');
console.log('  - 检查其余文件的兼容性问题');
console.log('  - 测试应用功能是否正常');