/**
 * Favorites page
 */

import router from '@ohos.router';
import { createFavoritesManager, FavoriteItem } from '../models';
import { Repository } from '../models/Repository';

@Entry
@Component
struct FavoritesPage {
  @State favoriteItems: FavoriteItem[] = [];
  @State isLoading: boolean = true;
  @State isEmpty: boolean = true;
  
  private favoritesManager = createFavoritesManager();

  aboutToAppear() {
    this.loadFavorites();
  }

  /**
   * 加载收藏列表
   */
  private loadFavorites() {
    this.isLoading = true;
    try {
      this.favoriteItems = this.favoritesManager.getFavorites();
      this.isEmpty = this.favoriteItems.length === 0;
      console.info('FavoritesPage', '加载收藏:', this.favoriteItems.length, '条');
    } catch (error) {
      console.error('FavoritesPage', '加载收藏失败:', error);
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
      console.error('FavoritesPage', '导航失败:', error);
    }
  }

  /**
   * 从收藏中移除
   */
  private removeFromFavorites(repositoryId: string) {
    this.favoritesManager.removeFromFavorites(repositoryId);
    this.loadFavorites(); // 重新加载
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
        
        Text('我的收藏')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333')
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
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
          Text('暂无收藏')
            .fontSize(18)
            .fontColor('#999')
            .margin({ top: 50 })
          Text('收藏的仓库会显示在这里')
            .fontSize(14)
            .fontColor('#ccc')
            .margin({ top: 10 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else {
        // 收藏列表
        List({ space: 8 }) {
          ForEach(this.favoriteItems, (item: FavoriteItem) => {
            ListItem() {
              this.FavoriteItem(item)
            }
          }, (item: FavoriteItem) => item.id)
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
  FavoriteItem(item: FavoriteItem) {
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
        
        // 取消收藏按钮
        Button('❤️')
          .fontSize(16)
          .fontColor('#ff4757')
          .backgroundColor(Color.Transparent)
          .width(32)
          .height(32)
          .onClick(() => {
            this.removeFromFavorites(item.repository.id);
          })
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      // 收藏时间
      Text(`收藏于 ${this.formatDate(item.favoritedAt)}`)
        .fontSize(12)
        .fontColor('#999')
        .width('100%')
        .textAlign(TextAlign.Start)
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

      // 标签
      if (item.tags && item.tags.length > 0) {
        Row({ space: 8 }) {
          ForEach(item.tags, (tag: string) => {
            Text(tag)
              .fontSize(12)
              .fontColor('#409eff')
              .padding({ left: 8, right: 8, top: 2, bottom: 2 })
              .backgroundColor('#e6f7ff')
              .borderRadius(4)
          }, (tag: string) => tag)
        }
        .width('100%')
        .margin({ top: 4 })
      }

      // 备注
      if (item.notes && item.notes.trim() !== '') {
        Text(item.notes)
          .fontSize(12)
          .fontColor('#666')
          .fontStyle(FontStyle.Italic)
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