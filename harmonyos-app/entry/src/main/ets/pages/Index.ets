import router from '@ohos.router';
import { createTrendingViewModel, TrendingUiState, createGitHubTrendingViewModel, GitHubTrendingUiState } from '../viewmodels';
import { Repository, createBrowsingHistoryManager, createFavoritesManager } from '../models';

@Entry
@Component
struct Index {
  @State currentTabIndex: number = 0;
  private zReadPageViewModel = createTrendingViewModel();
  @State zReadUiState: TrendingUiState = new TrendingUiState();
  private gitHubPageViewModel = createGitHubTrendingViewModel();
  @State gitHubUiState: GitHubTrendingUiState = new GitHubTrendingUiState();
  
  // "我的"页面的状态
  @State browsingHistoryCount: number = 0;
  @State favoritesCount: number = 0;
  @State appVersion: string = '2.0.0';
  
  // 数据管理器
  private browsingHistoryManager = createBrowsingHistoryManager();
  private favoritesManager = createFavoritesManager();

  aboutToAppear() {
    // 监听ZRead页面ViewModel状态变化
    this.zReadPageViewModel.addStateChangeListener((state: TrendingUiState) => {
      this.zReadUiState.isLoading = state.isLoading;
      this.zReadUiState.isRefreshing = state.isRefreshing;
      this.zReadUiState.repositories = state.repositories.slice();
      this.zReadUiState.error = state.error;
      this.zReadUiState.openBrowserEvent = state.openBrowserEvent;
      
      // 处理打开浏览器事件
      if (state.openBrowserEvent && state.openBrowserEvent.repository) {
        this.navigateToRepositoryDetail(state.openBrowserEvent.repository);
      }
    });
    
    // 监听GitHub页面ViewModel状态变化
    this.gitHubPageViewModel.addStateChangeListener((state: GitHubTrendingUiState) => {
      this.gitHubUiState.isLoading = state.isLoading;
      this.gitHubUiState.isRefreshing = state.isRefreshing;
      this.gitHubUiState.repositories = state.repositories.slice();
      this.gitHubUiState.error = state.error;
      this.gitHubUiState.openBrowserEvent = state.openBrowserEvent;
      
      // 处理打开浏览器事件
      if (state.openBrowserEvent && state.openBrowserEvent.repository) {
        this.navigateToRepositoryDetail(state.openBrowserEvent.repository);
      }
    });
    
    // 加载浏览历史和收藏数据
    this.loadUserData();
  }
  
  /**
   * 加载用户数据
   */
  private loadUserData() {
    try {
      this.browsingHistoryCount = this.browsingHistoryManager.getHistoryCount();
      this.favoritesCount = this.favoritesManager.getFavoritesCount();
      console.info('Index', '加载用户数据完成:', {
        browsingHistoryCount: this.browsingHistoryCount,
        favoritesCount: this.favoritesCount
      });
    } catch (error) {
      console.error('Index', '加载用户数据失败:', error);
    }
  }

  aboutToDisappear() {
    // 清理资源
    this.zReadPageViewModel.destroy();
    this.gitHubPageViewModel.destroy();
  }

  /**
   * 导航到仓库详情页面
   * @param url - 仓库URL
   */
  private navigateToRepositoryDetail(repository: Repository) {
    try {
      router.pushUrl({
        url: 'pages/WebViewPage',
        params: {
          url: repository.htmlUrl || repository.url,
          title: repository.name
        }
      });
    } catch (error) {
      console.error('Index', '导航到仓库详情页面失败:', error);
    }
  }

  @Builder
  ZReadTrendingContent() {
    Column({ space: 20 }) {
      // 标题
      Text('GitHub趋势仓库 (ZRead)')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 10 })

      // 加载状态
      if (this.zReadUiState.isLoading) {
        LoadingProgress()
          .width(40)
          .height(40)
          .margin({ top: 20 })
        Text('加载中...')
          .fontSize(16)
          .fontColor('#666')
      } 
      // 错误状态
      else if (this.zReadUiState.error) {
        Column({ space: 10 }) {
          Text('加载失败')
            .fontSize(18)
            .fontColor('#f56c6c')
          Text(this.zReadUiState.error)
            .fontSize(14)
            .fontColor('#999')
            .textAlign(TextAlign.Center)
            .maxLines(3)
          Button('重试')
            .backgroundColor('#409eff')
            .fontColor(Color.White)
            .onClick(() => {
              this.zReadPageViewModel.retry();
            })
        }
        .padding(20)
      }
      // 数据展示
      else {
        // 刷新控制
        Row({ space: 10 }) {
          Text(`共 ${this.zReadUiState.repositories.length} 个仓库`)
            .fontSize(14)
            .fontColor('#666')
          Button('刷新')
            .backgroundColor(this.zReadUiState.isRefreshing ? '#ccc' : '#67c23a')
            .fontColor(Color.White)
            .enabled(!this.zReadUiState.isRefreshing)
            .onClick(() => {
              this.zReadPageViewModel.onRefresh();
            })
        }
        .margin({ bottom: 10 })

        // 仓库列表
        List({ space: 10 }) {
          ForEach(this.zReadUiState.repositories, (item: Repository) => {
            ListItem() {
              this.RepositoryItem(item)
            }
          }, (item: Repository) => item.id)
        }
        .layoutWeight(1)
        .padding(10)
      }
    }
    .width('100%')
    .height('100%')
    .padding({ left: 20, right: 20, bottom: 60 })
    .backgroundColor('#f5f5f5')
  }

  @Builder
  GitHubTrendingContent() {
    Column({ space: 20 }) {
      // 标题
      Text('GitHub趋势仓库')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 10 })

      // 加载状态
      if (this.gitHubUiState.isLoading) {
        LoadingProgress()
          .width(40)
          .height(40)
          .margin({ top: 20 })
        Text('加载中...')
          .fontSize(16)
          .fontColor('#666')
      } 
      // 错误状态
      else if (this.gitHubUiState.error) {
        Column({ space: 10 }) {
          Text('加载失败')
            .fontSize(18)
            .fontColor('#f56c6c')
          Text(this.gitHubUiState.error)
            .fontSize(14)
            .fontColor('#999')
            .textAlign(TextAlign.Center)
            .maxLines(3)
          Button('重试')
            .backgroundColor('#409eff')
            .fontColor(Color.White)
            .onClick(() => {
              this.gitHubPageViewModel.retry();
            })
        }
        .padding(20)
      }
      // 数据展示
      else {
        // 刷新控制
        Row({ space: 10 }) {
          Text(`共 ${this.gitHubUiState.repositories.length} 个仓库`)
            .fontSize(14)
            .fontColor('#666')
          Button('刷新')
            .backgroundColor(this.gitHubUiState.isRefreshing ? '#ccc' : '#67c23a')
            .fontColor(Color.White)
            .enabled(!this.gitHubUiState.isRefreshing)
            .onClick(() => {
              this.gitHubPageViewModel.onRefresh();
            })
        }
        .margin({ bottom: 10 })

        // 仓库列表
        List({ space: 10 }) {
          ForEach(this.gitHubUiState.repositories, (item: Repository) => {
            ListItem() {
              this.RepositoryItem(item)
            }
          }, (item: Repository) => item.id)
        }
        .layoutWeight(1)
        .padding(10)
      }
    }
    .width('100%')
    .height('100%')
    .padding({ left: 20, right: 20, bottom: 60 })
    .backgroundColor('#f5f5f5')
  }

  @Builder
  MyPageContent() {
    Column({ space: 16 }) {
      // 页面标题
      Text('我的')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#333333')
        .margin({ top: 20, bottom: 10 })
        .alignSelf(ItemAlign.Start)

      // 功能卡片列表
      Column({ space: 12 }) {
        // 我的卡片
        this.MenuCard(
          '👤',
          '我的',
          '管理你的浏览记录和收藏',
          () => {
            // 可以跳转到个人信息页面
          }
        )

        // 浏览历史卡片
        this.MenuCard(
          '🕐',
          '浏览历史',
          `${this.browsingHistoryCount} 个仓库`,
          () => {
            // 跳转到浏览历史页面
            try {
              router.pushUrl({
                url: 'pages/BrowsingHistoryPage'
              });
            } catch (error) {
              console.error('Index', '跳转到浏览历史页面失败:', error);
            }
          }
        )

        // 我的收藏卡片
        this.MenuCard(
          '❤️',
          '我的收藏',
          `${this.favoritesCount} 个仓库`,
          () => {
            // 跳转到收藏页面
            try {
              router.pushUrl({
                url: 'pages/FavoritesPage'
              });
            } catch (error) {
              console.error('Index', '跳转到收藏页面失败:', error);
            }
          }
        )

        // 关于卡片
        this.MenuCard(
          'ℹ️',
          '关于',
          `版本 ${this.appVersion}`,
          () => {
            // 可以跳转到关于页面
          }
        )
      }
      .padding({ left: 16, right: 16 })
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5FAFB')
    .padding({ bottom: 60 })
  }

  @Builder
  MenuCard(icon: string, title: string, subtitle: string, onClick: () => void) {
    Row() {
      // 左侧图标
      Text(icon)
        .fontSize(24)
        .width(40)
        .height(40)
        .textAlign(TextAlign.Center)

      // 中间标题和副标题
      Column({ space: 4 }) {
        Text(title)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')
          .alignSelf(ItemAlign.Start)
        
        Text(subtitle)
          .fontSize(14)
          .fontColor('#666666')
          .alignSelf(ItemAlign.Start)
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 12 })

      // 右侧箭头
      Text('>')
        .fontSize(16)
        .fontColor('#999999')
        .margin({ right: 8 })
    }
    .width('100%')
    .height(60)
    .padding({ left: 16, right: 16 })
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
    .justifyContent(FlexAlign.SpaceBetween)
    .onClick(() => {
      onClick();
    })
  }

  @Builder
  RepositoryItem(repo: Repository) {
    Column({ space: 8 }) {
      // 仓库名称和作者
      Row({ space: 10 }) {
        Text(repo.name)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333')
        Text(repo.owner.login || '')
          .fontSize(14)
          .fontColor('#666')
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)

      // 描述
      if (repo.description) {
        Text(repo.description)
          .fontSize(14)
          .fontColor('#666')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
          .textAlign(TextAlign.Start)
      }

      // 统计信息
      Row({ space: 20 }) {
        Row({ space: 5 }) {
          Image($r('app.media.ic_star'))
            .width(16)
            .height(16)
          Text(repo.stars.toString())
            .fontSize(12)
            .fontColor('#666')
        }

        if (repo.language) {
          Row({ space: 5 }) {
            Image($r('app.media.ic_language'))
              .width(16)
              .height(16)
            Text(repo.language)
              .fontSize(12)
              .fontColor('#666')
          }
        }
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)
    }
    .padding(15)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
    .onClick(() => {
      // 添加到浏览历史
      try {
        this.browsingHistoryManager.addToHistory(repo);
        // 强制更新计数，确保UI刷新
        this.browsingHistoryCount = 0;
        setTimeout(() => {
          this.browsingHistoryCount = this.browsingHistoryManager.getHistoryCount();
        }, 0);
      } catch (error) {
        console.error('Index', '添加浏览历史失败:', error);
      }
      
      // 处理页面导航
      if (this.currentTabIndex === 0) {
        this.zReadPageViewModel.onRepositoryClick(repo);
      } else if (this.currentTabIndex === 1) {
        this.gitHubPageViewModel.onRepositoryClick(repo);
      }
    })
  }

  build() {
    Column() {
      // 内容区域
      Tabs({ barPosition: BarPosition.End, index: this.currentTabIndex }) {
        TabContent() {
          this.ZReadTrendingContent()
        }
        .tabBar('ZRead')
        .backgroundColor('#f5f5f5')

        TabContent() {
          this.GitHubTrendingContent()
        }
        .tabBar('GitHub')
        .backgroundColor('#f5f5f5')

        TabContent() {
          this.MyPageContent()
        }
        .tabBar('我的')
        .backgroundColor('#f5f5f5')
      }
      .barHeight(50)
      .animationDuration(300)
      .onChange((index: number) => {
        this.currentTabIndex = index;
      })
      .backgroundColor('#f5f5f5')
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }
}