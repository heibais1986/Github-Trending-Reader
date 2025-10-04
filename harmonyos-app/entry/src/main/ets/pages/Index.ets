import { Repository, TrendingResponse, NetworkError, LoadingState } from '../models';
import { NetworkService } from '../services';
import { ErrorHandler } from '../utils';
import { RepositoryCard } from '../components';
import { StateHook, createStateHook, StateUtils, ComponentState } from '../state';
import { LoadingIndicator, LoadingType, LoadingSize } from '../components/LoadingIndicator';
import { ErrorFeedback, ErrorFeedbackType, ErrorAction } from '../components/ErrorFeedback';
import { FeedbackButton, ButtonType, ButtonSize } from '../components/FeedbackButton';
import { FeedbackUtils } from '../utils/FeedbackManager';
import { PerformanceOptimizer, AnimationOptimizer, ResponsivenessUtils } from '../utils/PerformanceOptimizer';

@Entry
@Component
struct Index {
  @State repositories: Repository[] = [];
  @State loadingState: LoadingState = LoadingState.IDLE;
  @State error: NetworkError | null = null;
  @State lastUpdated: string | null = null;
  @State isRefreshing: boolean = false;

  private stateHook: StateHook;
  private scroller: Scroller = new Scroller();
  private optimizedRefreshHandler: () => void;

  aboutToAppear() {
    // Initialize state hook with update callback
    this.stateHook = createStateHook((state: ComponentState) => {
      this.updateComponentState(state);
    });
    
    // Create optimized refresh handler
    this.optimizedRefreshHandler = PerformanceOptimizer.createOptimizedRefreshHandler(
      () => this.onRefresh(),
      1000,
      'main-refresh'
    );
    
    // Load initial data
    this.loadTrendingRepositories();
  }

  aboutToDisappear() {
    // Cleanup state hook
    if (this.stateHook) {
      this.stateHook.destroy();
    }
    
    // Cleanup performance optimizers
    PerformanceOptimizer.cleanup('main-refresh');
  }

  /**
   * Update component state from state hook
   */
  private updateComponentState(state: ComponentState) {
    this.repositories = state.repositories;
    this.loadingState = state.loadingState;
    this.error = state.error;
    this.lastUpdated = state.lastUpdated;
    this.isRefreshing = state.isRefreshing;
  }

  /**
   * Load trending repositories from API using state management
   */
  private async loadTrendingRepositories() {
    try {
      FeedbackUtils.onNetworkRequestStart();
      await this.stateHook.loadTrendingRepositories();
      
      if (this.repositories.length > 0) {
        FeedbackUtils.onNetworkRequestSuccess('数据加载成功');
      }
    } catch (error) {
      // Error handling is managed by state manager
      // Show user-friendly error message
      if (this.error) {
        FeedbackUtils.onNetworkRequestError(this.error.message);
      }
    }
  }

  /**
   * Handle pull-to-refresh action using state management
   */
  private async onRefresh() {
    try {
      FeedbackUtils.onRefreshAction();
      await this.stateHook.refresh();
      
      if (this.repositories.length > 0) {
        FeedbackUtils.showSuccess('刷新成功');
      }
    } catch (error) {
      // Error handling is managed by state manager
      console.error('Refresh failed:', error);
    }
  }



  /**
   * Build the main content based on loading state using state utilities
   */
  @Builder
  buildMainContent() {
    const currentState: ComponentState = {
      repositories: this.repositories,
      loadingState: this.loadingState,
      error: this.error,
      lastUpdated: this.lastUpdated,
      selectedDate: null,
      isRefreshing: this.isRefreshing
    };

    if (StateUtils.shouldShowLoading(currentState)) {
      this.buildLoadingView();
    } else if (StateUtils.shouldShowError(currentState)) {
      this.buildErrorView();
    } else {
      this.buildRepositoryList();
    }
  }

  /**
   * Build loading view with enhanced loading indicator
   */
  @Builder
  buildLoadingView() {
    Column() {
      LoadingIndicator({
        type: LoadingType.SPINNER,
        size: LoadingSize.LARGE,
        message: '正在加载热门仓库...',
        showMessage: true
      })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  /**
   * Build error view with enhanced error feedback
   */
  @Builder
  buildErrorView() {
    Column() {
      ErrorFeedback({
        error: this.error,
        type: ErrorFeedbackType.INLINE,
        showIcon: true,
        showActions: true,
        actions: [
          {
            label: '重试',
            isPrimary: true,
            action: () => {
              this.stateHook.clearError();
              this.loadTrendingRepositories();
            }
          }
        ]
      })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .padding({ left: 24, right: 24 })
  }

  /**
   * Build repository list
   */
  @Builder
  buildRepositoryList() {
    Column() {
      // Header with last updated info
      this.buildHeader();

      // Repository list
      Refresh({ refreshing: this.isRefreshing, offset: 64, friction: 100 }) {
        List({ scroller: this.scroller }) {
          ForEach(this.repositories, (repository: Repository, index: number) => {
            ListItem() {
              RepositoryCard({ repository: repository })
            }
            .padding({ left: 16, right: 16, top: index === 0 ? 8 : 4, bottom: 4 })
          }, (repository: Repository) => repository.id)
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Auto)
        .edgeEffect(EdgeEffect.Spring)
        .animation(AnimationOptimizer.getListItemAnimation())
      }
      .onStateChange((refreshStatus: RefreshStatus) => {
        if (refreshStatus === RefreshStatus.Refresh) {
          this.optimizedRefreshHandler();
        }
      })
      .width('100%')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
  }

  /**
   * Build header section
   */
  @Builder
  buildHeader() {
    Column() {
      Row() {
        Text('GitHub 热门')
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)

        if (this.loadingState === LoadingState.LOADING && this.repositories.length > 0) {
          LoadingIndicator({
            type: LoadingType.SPINNER,
            size: LoadingSize.SMALL,
            showMessage: false
          })
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 8 })

      if (this.lastUpdated) {
        Text(`最后更新: ${this.lastUpdated}`)
          .fontSize(12)
          .fontColor($r('app.color.text_tertiary'))
          .padding({ left: 16, right: 16, bottom: 8 })
          .width('100%')
      }

      // Divider
      Divider()
        .color($r('app.color.divider_color'))
        .strokeWidth(0.5)
    }
    .backgroundColor($r('app.color.card_background'))
  }



  build() {
    Column() {
      this.buildMainContent();
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_color'))
  }
}