/**
 * Enhanced error feedback component with different error types and actions
 */

import { NetworkError, NetworkErrorType } from '../models';

/**
 * Error feedback type enumeration
 */
export enum ErrorFeedbackType {
  INLINE = 'INLINE',
  MODAL = 'MODAL',
  TOAST = 'TOAST',
  BANNER = 'BANNER'
}

/**
 * Error action interface
 */
export interface ErrorAction {
  label: string;
  action: () => void;
  isPrimary?: boolean;
}

/**
 * Error feedback component properties
 */
export interface ErrorFeedbackProps {
  error: NetworkError | null;
  type?: ErrorFeedbackType;
  showIcon?: boolean;
  showActions?: boolean;
  customMessage?: string;
  actions?: ErrorAction[];
  onDismiss?: () => void;
}

/**
 * Enhanced error feedback component
 */
@Component
export struct ErrorFeedback {
  @Prop error: NetworkError | null = null;
  @Prop type: ErrorFeedbackType = ErrorFeedbackType.INLINE;
  @Prop showIcon: boolean = true;
  @Prop showActions: boolean = true;
  @Prop customMessage: string = '';
  @Prop actions: ErrorAction[] = [];
  @Prop onDismiss?: () => void;

  /**
   * Get error icon based on error type
   */
  private getErrorIcon(): string {
    if (!this.error) return '❌';

    switch (this.error.type) {
      case NetworkErrorType.CONNECTION_ERROR:
        return '📡';
      case NetworkErrorType.TIMEOUT:
        return '⏱️';
      case NetworkErrorType.SERVER_ERROR:
        return '🔧';
      case NetworkErrorType.PARSE_ERROR:
        return '📄';
      default:
        return '❌';
    }
  }

  /**
   * Get error title based on error type
   */
  private getErrorTitle(): string {
    if (!this.error) return '错误';

    switch (this.error.type) {
      case NetworkErrorType.CONNECTION_ERROR:
        return '网络连接失败';
      case NetworkErrorType.TIMEOUT:
        return '请求超时';
      case NetworkErrorType.SERVER_ERROR:
        return '服务器错误';
      case NetworkErrorType.PARSE_ERROR:
        return '数据解析错误';
      default:
        return '未知错误';
    }
  }

  /**
   * Get error message
   */
  private getErrorMessage(): string {
    if (this.customMessage) {
      return this.customMessage;
    }
    return this.error?.message || '发生了未知错误，请稍后重试';
  }

  /**
   * Get error color based on error type
   */
  private getErrorColor(): ResourceColor {
    if (!this.error) return $r('app.color.error_color');

    switch (this.error.type) {
      case NetworkErrorType.CONNECTION_ERROR:
        return $r('app.color.warning_color');
      case NetworkErrorType.TIMEOUT:
        return $r('app.color.info_color');
      default:
        return $r('app.color.error_color');
    }
  }

  /**
   * Build error icon
   */
  @Builder
  buildErrorIcon() {
    if (this.showIcon) {
      Text(this.getErrorIcon())
        .fontSize(32)
        .margin({ bottom: 12 })
    }
  }

  /**
   * Build error content
   */
  @Builder
  buildErrorContent() {
    Column() {
      this.buildErrorIcon();

      Text(this.getErrorTitle())
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor($r('app.color.text_primary'))
        .margin({ bottom: 8 })
        .textAlign(TextAlign.Center)

      Text(this.getErrorMessage())
        .fontSize(14)
        .fontColor($r('app.color.text_secondary'))
        .textAlign(TextAlign.Center)
        .margin({ bottom: this.showActions ? 24 : 0 })
        .maxLines(3)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      if (this.showActions && this.actions.length > 0) {
        this.buildErrorActions();
      }
    }
    .width('100%')
    .alignItems(HorizontalAlign.Center)
  }

  /**
   * Build error actions
   */
  @Builder
  buildErrorActions() {
    if (this.actions.length === 1) {
      // Single action - full width button
      Button(this.actions[0].label)
        .fontSize(16)
        .backgroundColor(this.actions[0].isPrimary ? $r('app.color.primary_color') : $r('app.color.secondary_color'))
        .fontColor(this.actions[0].isPrimary ? Color.White : $r('app.color.text_primary'))
        .borderRadius(8)
        .padding({ left: 24, right: 24, top: 12, bottom: 12 })
        .onClick(() => {
          this.actions[0].action();
        })
    } else {
      // Multiple actions - horizontal layout
      Row({ space: 12 }) {
        ForEach(this.actions, (action: ErrorAction, index: number) => {
          Button(action.label)
            .fontSize(14)
            .backgroundColor(action.isPrimary ? $r('app.color.primary_color') : Color.Transparent)
            .fontColor(action.isPrimary ? Color.White : $r('app.color.primary_color'))
            .border(action.isPrimary ? undefined : { width: 1, color: $r('app.color.primary_color') })
            .borderRadius(6)
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .layoutWeight(1)
            .onClick(() => {
              action.action();
            })
        })
      }
      .width('100%')
    }
  }

  /**
   * Build inline error feedback
   */
  @Builder
  buildInlineError() {
    Column() {
      this.buildErrorContent();
    }
    .width('100%')
    .padding(24)
    .backgroundColor($r('app.color.card_background'))
    .borderRadius(12)
    .border({ width: 1, color: this.getErrorColor() })
  }

  /**
   * Build banner error feedback
   */
  @Builder
  buildBannerError() {
    Row() {
      if (this.showIcon) {
        Text(this.getErrorIcon())
          .fontSize(16)
          .margin({ right: 8 })
      }

      Column() {
        Text(this.getErrorTitle())
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor($r('app.color.text_primary'))
          .width('100%')

        Text(this.getErrorMessage())
          .fontSize(12)
          .fontColor($r('app.color.text_secondary'))
          .width('100%')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)

      if (this.onDismiss) {
        Button('✕')
          .fontSize(14)
          .backgroundColor(Color.Transparent)
          .fontColor($r('app.color.text_secondary'))
          .width(24)
          .height(24)
          .onClick(() => {
            this.onDismiss?.();
          })
      }
    }
    .width('100%')
    .padding(12)
    .backgroundColor(this.getErrorColor())
    .alignItems(VerticalAlign.Center)
  }

  build() {
    if (!this.error) {
      return;
    }

    Column() {
      switch (this.type) {
        case ErrorFeedbackType.BANNER:
          this.buildBannerError();
          break;
        case ErrorFeedbackType.INLINE:
        default:
          this.buildInlineError();
          break;
      }
    }
    .width('100%')
  }
}