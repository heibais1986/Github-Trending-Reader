import { Repository, createRepository, RepositoryOwner, createRepositoryOwner } from './Repository';
import { NetworkService } from '../services/NetworkService';

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
    } catch (error) {
      console.error('TrendingRepository', '获取趋势仓库数据失败', error);
      throw new Error('网络请求失败');
    }
  }


}