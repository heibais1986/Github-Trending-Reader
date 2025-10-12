import { TrendingRepository } from '../models/TrendingRepository';
import { Repository } from '../models/Repository';
import { LinkConverter } from '../utils/LinkConverter';
import Want from '@ohos.app.ability.Want';
import AbilityConstant from '@ohos.app.ability.AbilityConstant';

export class TrendingViewModel {
  private repository: TrendingRepository;
  private linkConverter: LinkConverter;
  
  // UI状态管理
  private uiState: TrendingUiState = new TrendingUiState();
  private uiStateChangeListeners: Array<(state: TrendingUiState) => void> = [];
  
  // 当前加载任务
  private currentLoadTask: number | null = null;
  private currentRefreshTask: number | null = null;

  constructor(repository: TrendingRepository, linkConverter: LinkConverter) {
    this.repository = repository;
    this.linkConverter = linkConverter;
    console.info('TrendingViewModel', 'ViewModel初始化');
    this.loadTrendingRepositories();
  }

  // 添加状态监听器
  addStateChangeListener(listener: (state: TrendingUiState) => void): void {
    this.uiStateChangeListeners.push(listener);
  }

  // 移除状态监听器
  removeStateChangeListener(listener: (state: TrendingUiState) => void): void {
    const index = this.uiStateChangeListeners.indexOf(listener);
    if (index > -1) {
      this.uiStateChangeListeners.splice(index, 1);
    }
  }

  // 通知状态变化
  private notifyStateChange(): void {
    const stateCopy: TrendingUiState = {
      isLoading: this.uiState.isLoading,
      isRefreshing: this.uiState.isRefreshing,
      repositories: this.uiState.repositories.slice(),
      error: this.uiState.error,
      openBrowserEvent: this.uiState.openBrowserEvent
    };
    this.uiStateChangeListeners.forEach(listener => {
      listener(stateCopy);
    });
  }

  // 更新UI状态
  private updateUiState(updates: Partial<TrendingUiState>): void {
    this.uiState.isLoading = updates.isLoading ?? this.uiState.isLoading;
    this.uiState.isRefreshing = updates.isRefreshing ?? this.uiState.isRefreshing;
    this.uiState.error = updates.error ?? this.uiState.error;
    this.uiState.openBrowserEvent = updates.openBrowserEvent ?? this.uiState.openBrowserEvent;
    
    if (updates.repositories) {
      this.uiState.repositories = updates.repositories.slice();
    }
    
    this.notifyStateChange();
  }

  // 获取调试信息
  getDebugInfo(): string {
    return `UI State: loading=${this.uiState.isLoading}, ` +
           `refreshing=${this.uiState.isRefreshing}, ` +
           `repositories=${this.uiState.repositories.length}, ` +
           `error=${this.uiState.error}`;
  }

  // 加载趋势仓库数据
  loadTrendingRepositories(): void {
    console.info('TrendingViewModel', '开始加载数据（来源=zread.ai）');
    
    // 取消之前的加载任务
    if (this.currentLoadTask) {
      clearTimeout(this.currentLoadTask);
    }

    this.updateUiState({ isLoading: true, error: null });

    // 模拟异步加载
    this.currentLoadTask = setTimeout(async () => {
      try {
        const repositories = await this.repository.getTrendingRepositories();
        console.info('TrendingViewModel', `成功获取 ${repositories.length} 个仓库`);
        this.updateUiState({
          isLoading: false,
          repositories: repositories,
          error: null
        });
      } catch (error) {
        console.error('TrendingViewModel', '数据加载异常', error);
        const errorMessage = this.getErrorMessage(error);
        this.updateUiState({
          isLoading: false,
          error: errorMessage
        });
      }
    }, 1000);
  }

  // 刷新数据
  onRefresh(): void {
    console.info('TrendingViewModel', '开始刷新数据（来源=zread.ai）');
    
    // 取消之前的刷新任务
    if (this.currentRefreshTask) {
      clearTimeout(this.currentRefreshTask);
    }

    this.updateUiState({ isRefreshing: true, error: null });

    // 模拟异步刷新
    this.currentRefreshTask = setTimeout(async () => {
      try {
        const repositories = await this.repository.getTrendingRepositories();
        console.info('TrendingViewModel', `刷新成功: ${repositories.length} 个仓库`);
        this.updateUiState({
          isRefreshing: false,
          repositories: repositories,
          error: null
        });
      } catch (error) {
        console.error('TrendingViewModel', '刷新异常', error);
        const errorMessage = this.getErrorMessage(error);
        this.updateUiState({
          isRefreshing: false,
          error: errorMessage
        });
      }
    }, 1000);
  }

  // 处理仓库点击事件
  onRepositoryClick(repository: Repository): void {
    console.info('TrendingViewModel', `点击仓库: ${repository.name}`);
    try {
      const convertedUrl = this.linkConverter.convertGitHubToZread(repository.url);
      console.info('TrendingViewModel', `转换后的URL: ${convertedUrl}`);
      this.updateUiState({ openBrowserEvent: new BrowserEvent(convertedUrl) });
    } catch (error) {
      console.warn('TrendingViewModel', 'URL转换失败，使用原始URL', error);
      this.updateUiState({ openBrowserEvent: new BrowserEvent(repository.url) });
    }
  }

  // 处理浏览器事件完成
  onBrowserEventHandled(): void {
    this.updateUiState({ openBrowserEvent: null });
  }

  // 清除错误
  clearError(): void {
    this.updateUiState({ error: null });
  }

  // 重试加载
  retry(): void {
    console.info('TrendingViewModel', '重试加载数据（来源=zread.ai）');
    this.clearError();
    this.loadTrendingRepositories();
  }

  // 获取错误消息
  private getErrorMessage(error: Error): string {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('network') || message.includes('connection')) {
        return '网络连接失败，请检查网络设置';
      } else if (message.includes('timeout')) {
        return '网络请求超时，请稍后重试';
      } else {
        return `数据加载失败: ${error.message}`;
      }
    }
    return '数据加载失败: 未知错误';
  }

  // 清理资源
  destroy(): void {
    console.info('TrendingViewModel', 'ViewModel销毁，清理资源');
    if (this.currentLoadTask) {
      clearTimeout(this.currentLoadTask);
      this.currentLoadTask = null;
    }
    if (this.currentRefreshTask) {
      clearTimeout(this.currentRefreshTask);
      this.currentRefreshTask = null;
    }
    this.uiStateChangeListeners = [];
  }
}

// 创建TrendingViewModel的工厂函数
export function createTrendingViewModel(): TrendingViewModel {
  const repository = new TrendingRepository();
  const linkConverter = new LinkConverter();
  return new TrendingViewModel(repository, linkConverter);
}

export class TrendingUiState {
  isLoading: boolean = false;
  isRefreshing: boolean = false;
  repositories: Repository[] = [];
  error: string | null = null;
  openBrowserEvent: BrowserEvent | null = null;
}

export class BrowserEvent {
  url: string;
  timestamp: number;

  constructor(url: string) {
    this.url = url;
    this.timestamp = Date.now();
  }
}