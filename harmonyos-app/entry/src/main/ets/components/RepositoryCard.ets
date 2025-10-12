/**
 * Repository card component for displaying GitHub repository information
 */

import { Repository } from '../models';
import webview from '@ohos.web.webview';
import common from '@ohos.app.ability.common';
import promptAction from '@ohos.promptAction';
import router from '@ohos.router';
import { FeedbackUtils } from '../utils/FeedbackManager';
import { AnimationOptimizer, ResponsivenessUtils } from '../utils/PerformanceOptimizer';
import { LinkConverter } from '../utils/LinkConverter';

@Component
export struct RepositoryCard {
  @Prop repository: Repository;
  @State isPressed: boolean = false;

  /**
   * Handle repository card click - navigate to appropriate page based on URL
   */
  private async onCardClick() {
    try {
      // Provide haptic feedback for item selection
      FeedbackUtils.onItemClick();
      
      // Convert GitHub URL to zread.ai URL
      const convertedUrl = LinkConverter.convertGitHubToZread(this.repository.url);
      
      // Check if target is zread article (contains zread.ai and overview pattern)
      const isZreadArticle = convertedUrl.includes('zread.ai') && 
        /\/.*\/\d+-overview$/.test(convertedUrl);
      
      if (isZreadArticle) {
        // Navigate to article detail page
        router.pushUrl({
          url: 'pages/ArticleDetailPage',
          params: {
            url: convertedUrl,
            title: this.repository.name
          }
        });
      } else {
        // Open in webview for other URLs
        router.pushUrl({
          url: 'pages/WebViewPage',
          params: {
            url: convertedUrl,
            title: this.repository.name
          }
        });
      }
    } catch (error) {
      console.error('Failed to handle repository click:', error);
      
      // Show error feedback
      FeedbackUtils.showError(`无法打开链接: ${this.repository.name}`);
      
      // Fallback: show toast with URL
      promptAction.showToast({
        message: `无法打开链接: ${this.repository.url}`,
        duration: 3000
      });
    }
  }

  /**
   * Get color for programming language
   */
  private getLanguageColor(language: string): ResourceStr {
    const languageColors: Record<string, ResourceStr> = {
      'JavaScript': $r('app.color.language_javascript'),
      'TypeScript': $r('app.color.language_typescript'),
      'Python': $r('app.color.language_python'),
      'Java': $r('app.color.language_java'),
      'Go': $r('app.color.language_go'),
      'Rust': $r('app.color.language_rust'),
      'C++': $r('app.color.language_cpp'),
      'C': $r('app.color.language_cpp'),
      'Swift': $r('app.color.language_swift'),
      'Kotlin': $r('app.color.language_kotlin'),
      'PHP': $r('app.color.language_php'),
      'Ruby': $r('app.color.language_ruby'),
      'Shell': $r('app.color.language_shell'),
      'HTML': $r('app.color.language_html'),
      'CSS': $r('app.color.language_css'),
      'Vue': $r('app.color.language_vue'),
      'React': $r('app.color.language_react')
    };

    return languageColors[language] || $r('app.color.language_default');
  }

  /**
   * Format star count for display
   */
  private formatStarCount(stars: number): string {
    if (stars >= 1000000) {
      return `${(stars / 1000000).toFixed(1)}M`;
    } else if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}K`;
    }
    return stars.toString();
  }

  /**
   * Get appropriate star icon based on count
   */
  private getStarIcon(stars: number): string {
    if (stars >= 10000) {
      return '🌟'; // Glowing star for very popular repos
    } else if (stars >= 1000) {
      return '⭐'; // Regular star for popular repos
    } else {
      return '☆'; // Empty star for newer repos
    }
  }

  build() {
    Column() {
      Row() {
        Column() {
          // Repository name and full name
          Row() {
            Text(this.repository.name)
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .layoutWeight(1)

            // Star count with icon
            Row() {
              Text(this.getStarIcon(this.repository.stars))
                .fontSize(14)
                .margin({ right: 4 })

              Text(this.formatStarCount(this.repository.stars))
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor($r('app.color.text_secondary'))
            }
          }
          .width('100%')
          .margin({ bottom: 4 })

          // Full repository name (owner/repo)
          Text(this.repository.fullName)
            .fontSize(12)
            .fontColor($r('app.color.text_tertiary'))
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
            .margin({ bottom: 8 })

          // Repository description
          if (this.repository.description && this.repository.description.trim()) {
            Text(this.repository.description)
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .maxLines(3)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .width('100%')
              .margin({ bottom: 12 })
              .lineHeight(20)
          }

          // Repository metadata row
          Row() {
            // Programming language with color indicator
            if (this.repository.language) {
              Row() {
                Circle({ width: 12, height: 12 })
                  .fill(this.getLanguageColor(this.repository.language))
                  .margin({ right: 6 })

                Text(this.repository.language)
                  .fontSize(12)
                  .fontColor($r('app.color.text_tertiary'))
                  .fontWeight(FontWeight.Medium)
              }
              .margin({ right: 16 })
            }

            // Author information
            Row() {
              Text('👤')
                .fontSize(12)
                .margin({ right: 4 })

              Text(this.repository.author.name)
                .fontSize(12)
                .fontColor($r('app.color.text_tertiary'))
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
            }
            .layoutWeight(1)

            // External link indicator
            Text('🔗')
              .fontSize(12)
              .fontColor($r('app.color.text_tertiary'))
              .opacity(0.7)
          }
          .width('100%')
          .alignItems(VerticalAlign.Center)
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Start)
      }
      .width('100%')
      .padding(16)
      .backgroundColor(this.isPressed ? '#F0F0F0' : $r('app.color.card_background'))
      .borderRadius(12)
      .onClick(() => {
        this.onCardClick();
      })
      .onTouch((event: TouchEvent) => {
        if (event.type === TouchType.Down) {
          this.isPressed = true;
        } else if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
          this.isPressed = false;
        }
      })
      .animation(AnimationOptimizer.getButtonPressAnimation())

      // Enhanced shadow effect (optimized for performance)
      .shadow(ResponsivenessUtils.getOptimizedShadow() || {
        radius: this.isPressed ? 1 : 4,
        color: this.isPressed ? '#00000008' : '#00000015',
        offsetX: 0,
        offsetY: this.isPressed ? 1 : 2
      })
      .animation(AnimationOptimizer.getButtonPressAnimation())

      // Subtle border
      .border({
        width: 1,
        color: $r('app.color.divider_color'),
        radius: 12
      })
    }
    .width('100%')
  }
}