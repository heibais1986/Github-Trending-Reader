/**
 * Browsing history page
 */

import router from '@ohos.router';
import { createBrowsingHistoryManager, BrowsingHistoryItem } from '../models';
import { Repository } from '../models/Repository';

@Entry
@Component
struct BrowsingHistoryPage {
  @State historyItems: BrowsingHistoryItem[] = [];
  @State isLoading: boolean = true;
  @State isEmpty: boolean = true;
  
  private browsingHistoryManager = createBrowsingHistoryManager();

  aboutToAppear() {
    this.loadHistory();
  }

  /**
   * 加载浏览历史
   */
  private loadHistory() {
    this.isLoading = true;
    try {
      this.historyItems = this.browsingHistoryManager.getHistory();
      this.isEmpty = this.historyItems.length === 0;
      console.info('BrowsingHistoryPage', '加载历史记录:', this.historyItems.length, '条');
    } catch (error) {
      console.error('BrowsingHistoryPage', '加载历史记录失败:', error);
      this.isEmpty = true;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 导航到仓库详情
   */
  private navigateToRepositoryDetail(repository: Repository) {
    try {
      router.pushUrl({
        url: 'pages/WebViewPage',
        params: {
          url: repository.htmlUrl || '',
          title: repository.name
        }
      });
    } catch (error) {
      console.error('BrowsingHistoryPage', '导航失败:', error);
    }
  }

  /**
   * 删除历史记录
   */
  private removeFromHistory(repositoryId: string) {
    this.browsingHistoryManager.removeFromHistory(repositoryId);
    this.loadHistory(); // 重新加载
  }

  /**
   * 清空所有历史记录
   */
  private clearAllHistory() {
    this.browsingHistoryManager.clearHistory();
    this.loadHistory(); // 重新加载
  }

  /**
   * 格式化日期
   */
  private formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString();
    }
  }

  build() {
    Column() {
      // 页面标题
      Row() {
        Button('←')
          .fontSize(16)
          .fontColor('#333')
          .backgroundColor(Color.Transparent)
          .onClick(() => {
            router.back();
          })
        
        Text('浏览历史')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333')
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
        
        if (!this.isEmpty && !this.isLoading) {
          Button('清空')
            .fontSize(14)
            .fontColor('#ff4757')
            .backgroundColor(Color.Transparent)
            .onClick(() => {
              this.clearAllHistory();
            })
        }
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor('#f5f5f5')

      // 内容区域
      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(40)
            .height(40)
            .margin({ top: 50 })
          Text('加载中...')
            .fontSize(16)
            .fontColor('#666')
            .margin({ top: 10 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else if (this.isEmpty) {
        Column() {
          Text('暂无浏览历史')
            .fontSize(18)
            .fontColor('#999')
            .margin({ top: 50 })
          Text('浏览过的仓库会显示在这里')
            .fontSize(14)
            .fontColor('#ccc')
            .margin({ top: 10 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else {
        // 历史记录列表
        List({ space: 8 }) {
          ForEach(this.historyItems, (item: BrowsingHistoryItem) => {
            ListItem() {
              this.HistoryItem(item)
            }
          }, (item: BrowsingHistoryItem) => item.id)
        }
        .layoutWeight(1)
        .padding(12)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#f5f5f5')
  }

  @Builder
  HistoryItem(item: BrowsingHistoryItem) {
    Column() {
      Row() {
        // 仓库信息
        Column({ space: 4 }) {
          Text(item.repository.name)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
            .textAlign(TextAlign.Start)
          
          Text(item.repository.owner?.login || '')
            .fontSize(14)
            .fontColor('#666')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
            .textAlign(TextAlign.Start)
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)
        
        // 删除按钮
        Button('×')
          .fontSize(16)
          .fontColor('#999')
          .backgroundColor(Color.Transparent)
          .width(32)
          .height(32)
          .onClick(() => {
            this.removeFromHistory(item.repository.id);
          })
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      // 访问时间和描述
      Row({ space: 8 }) {
        Text(this.formatDate(item.visitedAt))
          .fontSize(12)
          .fontColor('#999')
        
        Text('•')
          .fontSize(12)
          .fontColor('#ddd')
        
        Text(`${item.visitDuration}秒`)
          .fontSize(12)
          .fontColor('#999')
      }
      .width('100%')
      .margin({ top: 4 })

      // 仓库描述
      if (item.repository.description) {
        Text(item.repository.description)
          .fontSize(14)
          .fontColor('#666')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
          .textAlign(TextAlign.Start)
          .margin({ top: 4 })
      }

      // 统计信息
      Row({ space: 16 }) {
        Row({ space: 4 }) {
          Text('⭐')
            .fontSize(12)
          Text(item.repository.stars.toString())
            .fontSize(12)
            .fontColor('#666')
        }

        if (item.repository.language) {
          Row({ space: 4 }) {
            Text('🔤')
              .fontSize(12)
            Text(item.repository.language)
              .fontSize(12)
              .fontColor('#666')
          }
        }
      }
      .width('100%')
      .margin({ top: 8 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .shadow({ radius: 2, color: '#00000010', offsetX: 0, offsetY: 1 })
    .onClick(() => {
      this.navigateToRepositoryDetail(item.repository);
    })
  }
}