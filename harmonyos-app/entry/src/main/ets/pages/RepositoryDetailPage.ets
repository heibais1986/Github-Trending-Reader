/**
 * Repository Detail Page for displaying GitHub repository overview content
 */

import router from '@ohos.router';
import webview from '@ohos.web.webview';
import { LoadingIndicator, LoadingType, LoadingSize } from '../components/LoadingIndicator';
import { FeedbackUtils } from '../utils/FeedbackManager';
import { GitHubContentService, GitHubRepositoryContent } from '../services/GitHubContentService';
import { NetworkError } from '../models/NetworkModels';



@Entry
@Component
struct RepositoryDetailPage {
  @State repoUrl: string = '';
  @State repository: GitHubRepositoryContent | null = null;
  @State loading: boolean = true;
  @State error: string | null = null;
  
  private contentService: GitHubContentService = new GitHubContentService();

  aboutToAppear() {
    // Get repository URL from router parameters
    const routerParams: Object | undefined = router.getParams();
    if (routerParams) {
      const params = routerParams as Object;
      this.repoUrl = (params as Record<string, string>)['url'] || '';
    }
    
    if (this.repoUrl) {
      this.loadRepositoryContent();
    } else {
      this.error = '无效的仓库URL';
      this.loading = false;
    }
  }

  /**
   * Load repository content from GitHub API
   */
  private async loadRepositoryContent() {
    try {
      this.loading = true;
      this.error = null;
      
      console.info('RepositoryDetailPage', `加载仓库内容: ${this.repoUrl}`);
      this.repository = await this.contentService.getRepositoryContent(this.repoUrl);
      
      console.info('RepositoryDetailPage', '仓库内容加载成功');
    } catch (error) {
      console.error('RepositoryDetailPage', '加载仓库内容失败:', error);
      
      const networkError = error as NetworkError;
      this.error = networkError.message || '加载失败';
      
      FeedbackUtils.showError(this.error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle page refresh
   */
  private onRefresh() {
    this.loadRepositoryContent();
  }

  /**
   * Handle navigation back
   */
  private goBack() {
    router.back();
  }

  /**
   * Open repository in external browser
   */
  private openInBrowser() {
    if (this.repoUrl) {
      // Open in external browser
      console.info('RepositoryDetailPage', `在外部浏览器中打开: ${this.repoUrl}`);
      // Implementation depends on platform capabilities
    }
  }

  build() {
    Column() {
      // Header
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
            this.goBack();
          })

        // Title
        Text(this.repository?.name || '仓库详情')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        // Refresh button
        Button('↻')
          .fontSize(16)
          .fontColor($r('app.color.text_primary'))
          .backgroundColor($r('app.color.card_background'))
          .borderRadius(8)
          .width(40)
          .height(40)
          .margin({ right: 8 })
          .onClick(() => {
            this.onRefresh();
          })

        // Browser button
        Button('⛉')
          .fontSize(16)
          .fontColor($r('app.color.text_primary'))
          .backgroundColor($r('app.color.card_background'))
          .borderRadius(8)
          .width(40)
          .height(40)
          .onClick(() => {
            this.openInBrowser();
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

      // Content
      Stack() {
        // Repository content
        if (this.repository) {
          Scroll() {
            Column({ space: 16 }) {
              // Repository info card
              this.RepositoryInfoCard()

              // README content
              this.ReadmeContent()
            }
            .padding(16)
          }
          .layoutWeight(1)
          .width('100%')
        }

        // Loading indicator
        if (this.loading && !this.error) {
          Column() {
            LoadingIndicator({
              type: LoadingType.SPINNER,
              indicatorSize: LoadingSize.LARGE,
              message: '正在加载仓库内容...',
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
                this.onRefresh();
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

  @Builder
  RepositoryInfoCard() {
    Column({ space: 12 }) {
      // Repository name and owner
      Row({ space: 8 }) {
        Text(this.repository.name)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
        
        Text('by')
          .fontSize(14)
          .fontColor($r('app.color.text_secondary'))
        
        Text(this.repository.owner.login)
          .fontSize(14)
          .fontColor($r('app.color.text_secondary'))
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)

      // Description
      if (this.repository.description) {
        Text(this.repository.description)
          .fontSize(14)
          .fontColor($r('app.color.text_secondary'))
          .width('100%')
      }

      // Stats
      Row({ space: 20 }) {
        Row({ space: 4 }) {
          Image($r('app.media.ic_star'))
            .width(16)
            .height(16)
          Text(this.repository.stars.toString())
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
        }

        Row({ space: 4 }) {
          Image($r('app.media.ic_fork'))
            .width(16)
            .height(16)
          Text(this.repository.forks.toString())
            .fontSize(12)
            .fontColor($r('app.color.text_secondary'))
        }

        if (this.repository.language) {
          Row({ space: 4 }) {
            Image($r('app.media.ic_language'))
              .width(16)
              .height(16)
            Text(this.repository.language)
              .fontSize(12)
              .fontColor($r('app.color.text_secondary'))
          }
        }
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)

      // Updated time
      Text(`更新于 ${this.formatDate(this.repository.updatedAt)}`)
        .fontSize(12)
        .fontColor($r('app.color.text_tertiary'))
        .width('100%')
    }
    .padding(16)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(8)
    .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
  }

  @Builder
  ReadmeContent() {
    Column({ space: 12 }) {
      Text('README')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor($r('app.color.text_primary'))
        .width('100%')
        .margin({ bottom: 8 })

      // Use Text component to render markdown content (simplified version)
      Scroll() {
        Text(this.repository?.readmeContent || '')
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))
          .width('100%')
          .textAlign(TextAlign.Start)
      }
      .layoutWeight(1)
      .width('100%')
      .height('100%')
    }
    .padding(16)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(8)
    .shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 })
    .layoutWeight(1)
  }

  /**
   * Generate HTML content for Web component
   * @returns HTML string with README content
   */
  private generateHtmlContent(): string {
    if (!this.repository) {
      return '<html><body><p>No content available</p></body></html>';
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 16px;
            background-color: #fff;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
          }
          h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
          h3 { font-size: 1.25em; }
          h4 { font-size: 1em; }
          h5 { font-size: 0.875em; }
          h6 { font-size: 0.85em; color: #6a737d; }
          p { margin-bottom: 16px; }
          code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: rgba(27,31,35,0.05);
            border-radius: 3px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          }
          pre {
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #f6f8fa;
            border-radius: 6px;
            margin-bottom: 16px;
          }
          pre code {
            padding: 0;
            margin: 0;
            font-size: 100%;
            background-color: transparent;
            border-radius: 0;
          }
          blockquote {
            padding: 0 1em;
            color: #6a737d;
            border-left: 0.25em solid #dfe2e5;
            margin-bottom: 16px;
          }
          ul, ol {
            padding-left: 2em;
            margin-bottom: 16px;
          }
          li {
            margin-bottom: 0.25em;
          }
          table {
            border-spacing: 0;
            border-collapse: collapse;
            margin-bottom: 16px;
            width: 100%;
          }
          table th, table td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
          }
          table th {
            font-weight: 600;
            background-color: #f6f8fa;
          }
          table tr:nth-child(2n) {
            background-color: #f6f8fa;
          }
          img {
            max-width: 100%;
            height: auto;
            margin-bottom: 16px;
          }
          a {
            color: #0366d6;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        ${this.repository.readmeHtml}
      </body>
      </html>
    `;
  }

  /**
   * Format date string
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }
}