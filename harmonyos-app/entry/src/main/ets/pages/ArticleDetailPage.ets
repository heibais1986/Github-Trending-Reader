/**
 * Article detail page for displaying zread.ai article content
 */

import webview from '@ohos.web.webview';
import common from '@ohos.app.ability.common';
import promptAction from '@ohos.promptAction';
import router from '@ohos.router';
import { LoadingIndicator, LoadingType, LoadingSize } from '../components/LoadingIndicator';
import { FeedbackUtils } from '../utils/FeedbackManager';

@Entry
@Component
struct ArticleDetailPage {
  @State url: string = '';
  @State title: string = '文章详情';
  @State loading: boolean = true;
  @State error: string | null = null;
  
  private webviewController: webview.WebviewController = new webview.WebviewController();
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;

  aboutToAppear() {
    // Get URL and title from router parameters
    const routerParams: Object | undefined = router.getParams();
    if (routerParams) {
      const params = routerParams as Object;
      this.url = (params as Record<string, string>)['url'] || '';
      this.title = (params as Record<string, string>)['title'] || '文章详情';
    }
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
    
    // Inject JavaScript to extract only the article content
    const jsCode = `
      (function() {
        // Try to find the article content
        const article = document.querySelector('article') || 
                      document.querySelector('.article-content') || 
                      document.querySelector('.post-content') ||
                      document.querySelector('.content');
        
        if (article) {
          // Hide all other elements
          const body = document.body;
          const children = Array.from(body.children);
          children.forEach(child => {
            if (child !== article) {
              child.style.display = 'none';
            }
          });
          
          // Style the article for better reading
          article.style.maxWidth = '100%';
          article.style.padding = '16px';
          article.style.margin = '0 auto';
        }
      })();
    `;
    
    this.webviewController.runJavaScript(jsCode);
  }

  /**
   * Handle page error
   */
  private onErrorReceived(errorInfo: Object) {
    this.loading = false;
    this.error = '加载文章时发生错误';
    console.error('Article detail error:', errorInfo);
    
    FeedbackUtils.showError('文章加载失败');
  }

  /**
   * Close article detail and go back
   */
  private close() {
    router.back();
  }

  build() {
    Column() {
      // Header with title and close button
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
            this.close();
          })

        // Title
        Text(this.title)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

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

      // Article content
      Stack() {
        // WebView component for article content
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
              message: '正在加载文章...',
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
                this.webviewController.refresh();
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