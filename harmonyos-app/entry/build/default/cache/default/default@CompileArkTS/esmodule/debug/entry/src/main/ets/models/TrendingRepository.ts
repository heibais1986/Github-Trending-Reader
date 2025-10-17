import type { Repository } from './Repository';
import { NetworkService } from "@bundle:com.github.trending/entry/ets/services/NetworkService";
export class TrendingRepository {
    private networkService: NetworkService;
    private baseUrl: string = 'https://api.zread.ai/v1/trending';
    constructor() {
        this.networkService = new NetworkService();
    }
    async getTrendingRepositories(): Promise<Repository[]> {
        try {
            console.info('TrendingRepository', '开始获取趋势仓库数据');
            // 使用NetworkService获取真实的zread.ai数据
            const trendingResponse = await this.networkService.getTrendingFromZRead();
            return trendingResponse.repositories;
        }
        catch (error) {
            console.error('TrendingRepository', '获取zread.ai趋势仓库数据失败，尝试备用方案', error);
            try {
                // 尝试使用GitHub官方API作为备用
                const fallbackResponse = await this.networkService.getTrendingFromGitHubOfficial();
                console.info('TrendingRepository', '成功从GitHub官方API获取数据');
                return fallbackResponse.repositories;
            }
            catch (fallbackError) {
                console.error('TrendingRepository', '所有数据源都失败了', fallbackError);
                throw new Error('所有数据源都不可用，请稍后再试');
            }
        }
    }
}
