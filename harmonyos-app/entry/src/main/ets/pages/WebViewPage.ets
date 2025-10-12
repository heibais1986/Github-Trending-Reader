/**
 * WebView page for displaying web content within the app
 */

import webview from '@ohos.web.webview';
import window from '@ohos.window';
import common from '@ohos.app.ability.common';
import promptAction from '@ohos.promptAction';
import { LoadingIndicator, LoadingType, LoadingSize } from '../components/LoadingIndicator';
import { FeedbackUtils } from '../utils/FeedbackManager';

@Entry
@Component
struct WebViewPage {
  @State url: string = '';
  @State title: string = '网页浏览';
  @State loading: boolean = true;
  @State error: string | null = null;
  
  private webviewController: webview.WebviewController = new webview.WebviewController();
  private context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;

  aboutToAppear() {
    // Get URL and title from router parameters
    const routerParams = router.getParams();
    if (routerParams && routerParams.url) {
      this.url = routerParams.url as string;
    }
    if (routerParams && routerParams.title) {
      this.title = routerParams.title as string;
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
  }

  /**
   * Handle page error
   */
  private onErrorReceived(errorInfo: webview.WebviewError) {
    this.loading = false;
    this.error = errorInfo.description || '加载网页时发生错误';
    console.error('WebView error:', errorInfo);
    
    FeedbackUtils.showError('网页加载失败');
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
      this.webviewController.refresh();
    }
  }

  /**
   * Close webview and go back
   */
  private close() {
    router.back();
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
            if (this.webviewController && this.webviewController.backward()) {
              this.goBack();
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
          url: this.url
        })
        .onPageStart((event) => {
          this.onPageStart();
        })
        .onPageFinish((event) => {
          this.onPageFinish();
        })
        .onError((event) => {
          this.onErrorReceived(event);
        })
        .layoutWeight(1)
        .width('100%')
        .height('100%')

        // Loading indicator
        if (this.loading && !this.error) {
          Column() {
            LoadingIndicator({
              type: LoadingType.SPINNER,
              size: LoadingSize.LARGE,
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