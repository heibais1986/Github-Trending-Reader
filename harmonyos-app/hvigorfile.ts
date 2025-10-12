import { appTasks } from '@ohos/hvigor-ohos-plugin';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default {
  system: appTasks,
  plugins: [],  // 可添加自定义插件
  
  // 自定义任务
  tasks: {
    /**
     * 生成HarmonyOS签名证书
     * 用法: hvigor generateSigningCert
     */
    async generateSigningCert() {
      console.log('🚀 开始生成HarmonyOS签名证书...');
      
      try {
        // 执行PowerShell脚本来生成签名证书
        const { stdout, stderr } = await execAsync('powershell -ExecutionPolicy Bypass -File scripts/generate-signing-cert.ps1');
        
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.error(stderr);
        }
        
        console.log('✅ 签名证书生成完成!');
        console.log('📋 生成的文件在signing/目录中');
        console.log('📖 请查看BUILD_INSTRUCTIONS.md了解后续步骤');
        
      } catch (error) {
        console.error('❌ 生成签名证书时出错:');
        console.error(error);
        throw error;
      }
    },
    
    /**
     * 快速设置签名配置
     */
    async setupSigning() {
      console.log('⚙️ 设置HarmonyOS签名配置...');
      
      try {
        // 使用默认参数执行
        const { stdout, stderr } = await execAsync('powershell -ExecutionPolicy Bypass -File scripts/generate-signing-cert.ps1 -KeystorePath signing/reddit.p12 -KeystorePassword 123456 -KeyAlias reddit');
        
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.error(stderr);
        }
        
        console.log('✅ 签名设置完成!');
        
      } catch (error) {
        console.error('❌ 设置签名时出错:');
        console.error(error);
        throw error;
      }
    }
  }
};