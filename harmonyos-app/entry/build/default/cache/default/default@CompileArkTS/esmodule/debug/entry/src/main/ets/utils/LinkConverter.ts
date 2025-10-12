export class LinkConverter {
    /**
     * 将GitHub URL转换为zread.ai的阅读链接
     * @param githubUrl GitHub仓库URL
     * @returns 转换后的zread.ai阅读链接
     */
    convertGitHubToZread(githubUrl: string): string {
        try {
            console.info('LinkConverter', `开始转换GitHub链接: ${githubUrl}`);
            // 解析GitHub URL - 使用字符串处理代替URL类
            const urlParts = githubUrl.split('/');
            if (urlParts.length < 5 || urlParts[2] !== 'github.com') {
                throw new Error('不是有效的GitHub链接');
            }
            // 提取仓库路径
            const repoPath = urlParts.slice(3, 5).join('/');
            // 构建zread.ai阅读链接
            const zreadUrl = `https://zread.ai/repo/${repoPath}`;
            console.info('LinkConverter', `转换成功: ${zreadUrl}`);
            return zreadUrl;
        }
        catch (error) {
            console.error('LinkConverter', 'GitHub链接转换失败', error);
            throw new Error(`链接转换失败: ${error.message}`);
        }
    }
    /**
     * 验证URL是否有效
     * @param url 要验证的URL
     * @returns 是否有效
     */
    isValidUrl(url: string): boolean {
        // 简单的URL验证
        const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
        return urlPattern.test(url);
    }
    /**
     * 检查是否为GitHub仓库链接
     * @param url 要检查的URL
     * @returns 是否为GitHub仓库链接
     */
    isGitHubRepoUrl(url: string): boolean {
        if (!this.isValidUrl(url)) {
            return false;
        }
        const urlParts = url.split('/');
        return urlParts.length >= 5 &&
            urlParts[2] === 'github.com' &&
            Boolean(urlParts[3] && urlParts[4]); // 包含用户名和仓库名
    }
}
