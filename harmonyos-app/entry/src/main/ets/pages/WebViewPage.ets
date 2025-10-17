/**
 * WebView page for displaying web content within the app
 */

import webview from '@ohos.web.webview';
import window from '@ohos.window';
import common from '@ohos.app.ability.common';
import promptAction from '@ohos.promptAction';
import router from '@ohos.router';
import { LoadingIndicator, LoadingType, LoadingSize } from '../components/LoadingIndicator';
import { FeedbackUtils } from '../utils/FeedbackManager';
import { createFavoritesManager, createRepository, createRepositoryOwner, Repository } from '../models';

@Entry
@Component
struct WebViewPage {
  @State url: string = '';
  @State title: string = '网页浏览';
  @State loading: boolean = true;
  @State error: string | null = null;
  @State isFavorited: boolean = false;
  @State repository: Repository | null = null;
  @State retryCount: number = 0;
  private maxRetries: number = 2;
  
  private webviewController: webview.WebviewController = new webview.WebviewController();
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
  private favoritesManager = createFavoritesManager();

  aboutToAppear() {
    // Get URL and title from router parameters
    const routerParams: Object | undefined = router.getParams();
    if (routerParams) {
      const params = routerParams as Object;
      this.url = (params as Record<string, string>)['url'] || '';
      this.title = (params as Record<string, string>)['title'] || '网页浏览';
    }
    
    // 重置状态
    this.loading = true;
    this.error = null;
    this.retryCount = 0;

    // 初始化仓库对象和收藏状态
    this.repository = this.createRepositoryFromUrl(this.url, this.title);
    this.checkFavoriteStatus();
  }

  /**
   * Handle page start loading
   */
  private onPageStart() {
    this.loading = true;
    this.error = null;
  }

  /**
   * Handle page finish loading
   */
  private onPageFinish() {
    this.loading = false;
  }

  /**
   * Handle page error
   */
  private onErrorReceived(errorInfo: Object) {
    this.loading = false;
    // 检查是否是网络超时错误
    const error = errorInfo as Record<string, Object>;
    const errorCode = error.errorCode || 0;

    if (errorCode === -7) { // ERR_TIMED_OUT
      this.error = '网页加载超时，请检查网络连接';
    } else {
      this.error = '加载网页时发生错误';
    }
    console.error('WebView error:', errorInfo);
    
    // 根据错误类型显示不同的提示
    if (errorCode === -7) { // ERR_TIMED_OUT
      FeedbackUtils.showError('网页加载超时，请检查网络连接');
    } else {
      FeedbackUtils.showError('网页加载失败');
    }
  }

  /**
   * Handle navigation back
   */
  private goBack() {
    if (this.webviewController) {
      this.webviewController.backward();
    }
  }

  /**
   * Handle navigation forward
   */
  private goForward() {
    if (this.webviewController) {
      this.webviewController.forward();
    }
  }

  /**
   * Reload current page
   */
  private reload() {
    if (this.webviewController) {
      this.loading = true;
      this.error = null;
      this.retryCount = 0; // 重置重试计数
      this.webviewController.refresh();
    }
  }

  /**
   * Close webview and go back
   */
  private close() {
    this.retryCount = 0; // 重置重试计数
    router.back();
  }

  /**
   * Toggle favorite status
   */
  private toggleFavorite() {
    if (!this.repository) {
      // 如果没有仓库信息，尝试从URL创建一个简单的仓库对象
      this.repository = this.createRepositoryFromUrl(this.url, this.title);
    }
    
    if (this.repository) {
      if (this.isFavorited) {
        // 取消收藏
        const success = this.favoritesManager.removeFromFavorites(this.repository.id);
        if (success) {
          this.isFavorited = false;
          FeedbackUtils.showSuccess('已取消收藏');
        }
      } else {
        // 添加收藏
        const success = this.favoritesManager.addToFavorites(this.repository);
        if (success) {
          this.isFavorited = true;
          FeedbackUtils.showSuccess('已添加到收藏');
        }
      }
    }
  }

  /**
   * Check if current repository is favorited
   */
  private checkFavoriteStatus() {
    if (this.repository) {
      this.isFavorited = this.favoritesManager.isFavorited(this.repository.id);
    }
  }

  /**
   * Create repository from URL
   */
  private createRepositoryFromUrl(url: string, title: string): Repository | null {
    try {
      // 尝试从URL解析GitHub仓库信息
      const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (githubMatch) {
        const owner = githubMatch[1];
        const name = githubMatch[2];
        
        return createRepository({
          id: `repo_${owner}_${name}`,
          name: name,
          fullName: `${owner}/${name}`,
          description: title,
          owner: createRepositoryOwner({
            login: owner,
            avatarUrl: ''
          }),
          url: url,
          stars: 0,
          language: ''
        });
      }
      
      // 如果不是GitHub仓库，创建一个通用的仓库对象
      return createRepository({
        id: `repo_${Date.now()}`,
        name: title || 'Unknown',
        fullName: title || 'Unknown',
        description: title,
        owner: createRepositoryOwner({
          login: 'Unknown',
          avatarUrl: ''
        }),
        url: url,
        stars: 0,
        language: ''
      });
    } catch (error) {
      console.error('WebViewPage', '创建仓库对象失败:', error);
      return null;
    }
  }

  build() {
    Column() {
      // Header with navigation controls
      Row() {
        // Back button
        Button('←')
          .fontSize(16)
          .fontColor($r('app.color.text_primary'))
          .backgroundColor($r('app.color.card_background'))
          .borderRadius(8)
          .width(40)
          .height(40)
          .margin({ right: 8 })
          .onClick(() => {
            if (this.webviewController && this.webviewController.accessBackward()) {
              this.webviewController.backward();
            } else {
              this.close();
            }
          })

        // Title
        Text(this.title)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        // Favorite button
        Button(this.isFavorited ? '❤️' : '🤍')
          .fontSize(16)
          .fontColor(this.isFavorited ? '#ff4757' : $r('app.color.text_primary'))
          .backgroundColor($r('app.color.card_background'))
          .borderRadius(8)
          .width(40)
          .height(40)
          .margin({ right: 8 })
          .onClick(() => {
            this.toggleFavorite();
          })

        // Reload button
        Button('↻')
          .fontSize(16)
          .fontColor($r('app.color.text_primary'))
          .backgroundColor($r('app.color.card_background'))
          .borderRadius(8)
          .width(40)
          .height(40)
          .margin({ right: 8 })
          .onClick(() => {
            this.reload();
          })

        // Close button
        Button('✕')
          .fontSize(16)
          .fontColor($r('app.color.text_primary'))
          .backgroundColor($r('app.color.card_background'))
          .borderRadius(8)
          .width(40)
          .height(40)
          .onClick(() => {
            this.close();
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor($r('app.color.card_background'))
      .alignItems(VerticalAlign.Center)

      // Progress bar when loading
      if (this.loading) {
        Divider()
          .color($r('app.color.primary_color'))
          .strokeWidth(2)
          .width('30%')
          .alignSelf(ItemAlign.Start)
      }

      // WebView content
      Stack() {
        // WebView component
        Web({
          controller: this.webviewController,
          src: this.url
        })
        .onPageBegin((event) => {
          this.onPageStart();
        })
        .onPageEnd((event) => {
          this.onPageFinish();
        })
        .onErrorReceive((event) => {
          this.onErrorReceived(event.error);
        })
        .layoutWeight(1)
        .width('100%')
        .height('100%')

        // Loading indicator
        if (this.loading && !this.error) {
          Column() {
            LoadingIndicator({
              type: LoadingType.SPINNER,
              indicatorSize: LoadingSize.LARGE,
              message: '正在加载网页...',
              showMessage: true
            })
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
          .backgroundColor('#FFFFFF')
        }

        // Error view
        if (this.error) {
          Column() {
            Text(this.error)
              .fontSize(14)
              .fontColor($r('app.color.error_color'))
              .textAlign(TextAlign.Center)
              .padding(24)

            Button('重新加载')
              .fontSize(14)
              .fontColor(Color.White)
              .backgroundColor($r('app.color.primary_color'))
              .borderRadius(8)
              .padding({ left: 24, right: 24, top: 12, bottom: 12 })
              .onClick(() => {
                this.reload();
              })
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
          .backgroundColor('#FFFFFF')
        }
      }
      .layoutWeight(1)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.background_color'))
  }
}