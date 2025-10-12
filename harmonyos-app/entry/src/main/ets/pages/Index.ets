import { createTrendingViewModel, TrendingUiState } from '../viewmodels';
import { Repository } from '../models/Repository';

@Entry
@Component
struct Index {
  @State uiState: TrendingUiState = new TrendingUiState();
  private viewModel = createTrendingViewModel();

  aboutToAppear() {
    // 监听ViewModel状态变化
    this.viewModel.addStateChangeListener((state: TrendingUiState) => {
      this.uiState.isLoading = state.isLoading;
      this.uiState.isRefreshing = state.isRefreshing;
      this.uiState.repositories = state.repositories.slice();
      this.uiState.error = state.error;
      this.uiState.openBrowserEvent = state.openBrowserEvent;
    });
  }

  aboutToDisappear() {
    // 清理资源
    this.viewModel.destroy();
  }

  build() {
    Column({ space: 20 }) {
      // 标题
      Text('GitHub趋势仓库')
        .fontSize(30)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 50 })

      // 加载状态
      if (this.uiState.isLoading) {
        LoadingProgress()
          .width(40)
          .height(40)
          .margin({ top: 20 })
        Text('加载中...')
          .fontSize(16)
          .fontColor('#666')
      } 
      // 错误状态
      else if (this.uiState.error) {
        Column({ space: 10 }) {
          Text('加载失败')
            .fontSize(18)
            .fontColor('#f56c6c')
          Text(this.uiState.error)
            .fontSize(14)
            .fontColor('#999')
            .textAlign(TextAlign.Center)
            .maxLines(3)
          Button('重试')
            .backgroundColor('#409eff')
            .fontColor(Color.White)
            .onClick(() => {
              this.viewModel.retry();
            })
        }
        .padding(20)
      }
      // 数据展示
      else {
        // 刷新控制
        Row({ space: 10 }) {
          Text(`共 ${this.uiState.repositories.length} 个仓库`)
            .fontSize(14)
            .fontColor('#666')
          Button('刷新')
            .backgroundColor(this.uiState.isRefreshing ? '#ccc' : '#67c23a')
            .fontColor(Color.White)
            .enabled(!this.uiState.isRefreshing)
            .onClick(() => {
              this.viewModel.onRefresh();
            })
        }
        .margin({ bottom: 10 })

        // 仓库列表
        List({ space: 10 }) {
          ForEach(this.uiState.repositories, (item: Repository) => {
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
    .padding(20)
    .backgroundColor('#f5f5f5')
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
      this.viewModel.onRepositoryClick(repo);
    })
  }
}