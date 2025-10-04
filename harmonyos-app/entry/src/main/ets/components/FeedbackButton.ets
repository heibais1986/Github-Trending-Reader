/**
 * Enhanced button component with visual and haptic feedback
 */

import { FeedbackUtils, FeedbackType } from '../utils/FeedbackManager';

/**
 * Button type enumeration
 */
export enum ButtonType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  OUTLINE = 'OUTLINE',
  TEXT = 'TEXT',
  DANGER = 'DANGER'
}

/**
 * Button size enumeration
 */
export enum ButtonSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

/**
 * Feedback button properties
 */
export interface FeedbackButtonProps {
  text: string;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  feedbackType?: FeedbackType;
  enableHaptic?: boolean;
  enableVisualFeedback?: boolean;
  onClick?: () => void;
}

/**
 * Enhanced button component with feedback
 */
@Component
export struct FeedbackButton {
  @Prop text: string = '';
  @Prop type: ButtonType = ButtonType.PRIMARY;
  @Prop size: ButtonSize = ButtonSize.MEDIUM;
  @Prop disabled: boolean = false;
  @Prop loading: boolean = false;
  @Prop icon: string = '';
  @Prop feedbackType: FeedbackType = FeedbackType.SELECTION;
  @Prop enableHaptic: boolean = true;
  @Prop enableVisualFeedback: boolean = true;
  @Prop onClick?: () => void;

  @State private isPressed: boolean = false;
  @State private isHovered: boolean = false;

  /**
   * Get button style based on type and state
   */
  private getButtonStyle(): {
    backgroundColor: ResourceColor,
    fontColor: ResourceColor,
    borderColor?: ResourceColor,
    borderWidth?: number
  } {
    const isDisabledOrLoading = this.disabled || this.loading;
    
    if (isDisabledOrLoading) {
      return {
        backgroundColor: $r('app.color.button_disabled'),
        fontColor: $r('app.color.text_disabled')
      };
    }

    switch (this.type) {
      case ButtonType.PRIMARY:
        return {
          backgroundColor: this.isPressed ? $r('app.color.primary_pressed') : $r('app.color.primary_color'),
          fontColor: Color.White
        };
      case ButtonType.SECONDARY:
        return {
          backgroundColor: this.isPressed ? $r('app.color.secondary_pressed') : $r('app.color.secondary_color'),
          fontColor: $r('app.color.text_primary')
        };
      case ButtonType.OUTLINE:
        return {
          backgroundColor: this.isPressed ? $r('app.color.primary_light') : Color.Transparent,
          fontColor: $r('app.color.primary_color'),
          borderColor: $r('app.color.primary_color'),
          borderWidth: 1
        };
      case ButtonType.TEXT:
        return {
          backgroundColor: this.isPressed ? $r('app.color.button_text_pressed') : Color.Transparent,
          fontColor: $r('app.color.primary_color')
        };
      case ButtonType.DANGER:
        return {
          backgroundColor: this.isPressed ? $r('app.color.danger_pressed') : $r('app.color.danger_color'),
          fontColor: Color.White
        };
      default:
        return {
          backgroundColor: $r('app.color.primary_color'),
          fontColor: Color.White
        };
    }
  }

  /**
   * Get button size dimensions
   */
  private getSizeDimensions(): {
    height: number,
    fontSize: number,
    paddingHorizontal: number,
    borderRadius: number
  } {
    switch (this.size) {
      case ButtonSize.SMALL:
        return {
          height: 32,
          fontSize: 14,
          paddingHorizontal: 16,
          borderRadius: 6
        };
      case ButtonSize.LARGE:
        return {
          height: 48,
          fontSize: 18,
          paddingHorizontal: 32,
          borderRadius: 12
        };
      default:
        return {
          height: 40,
          fontSize: 16,
          paddingHorizontal: 24,
          borderRadius: 8
        };
    }
  }

  /**
   * Handle button press
   */
  private handlePress(): void {
    if (this.disabled || this.loading) {
      return;
    }

    // Provide feedback
    if (this.enableHaptic) {
      FeedbackUtils.onButtonPress();
    }

    // Visual feedback
    if (this.enableVisualFeedback) {
      this.isPressed = true;
      setTimeout(() => {
        this.isPressed = false;
      }, 150);
    }

    // Execute callback
    this.onClick?.();
  }

  /**
   * Build button content
   */
  @Builder
  buildButtonContent() {
    Row({ space: 8 }) {
      if (this.loading) {
        LoadingProgress()
          .width(16)
          .height(16)
          .color(this.getButtonStyle().fontColor)
      } else if (this.icon) {
        Text(this.icon)
          .fontSize(this.getSizeDimensions().fontSize)
          .fontColor(this.getButtonStyle().fontColor)
      }

      if (this.text) {
        Text(this.text)
          .fontSize(this.getSizeDimensions().fontSize)
          .fontColor(this.getButtonStyle().fontColor)
          .fontWeight(FontWeight.Medium)
      }
    }
    .justifyContent(FlexAlign.Center)
    .alignItems(VerticalAlign.Center)
  }

  build() {
    const style = this.getButtonStyle();
    const dimensions = this.getSizeDimensions();

    Row() {
      this.buildButtonContent();
    }
    .width('100%')
    .height(dimensions.height)
    .backgroundColor(style.backgroundColor)
    .borderRadius(dimensions.borderRadius)
    .border(style.borderColor ? {
      width: style.borderWidth || 1,
      color: style.borderColor
    } : undefined)
    .padding({
      left: dimensions.paddingHorizontal,
      right: dimensions.paddingHorizontal
    })
    .justifyContent(FlexAlign.Center)
    .alignItems(VerticalAlign.Center)
    .opacity(this.disabled || this.loading ? 0.6 : 1.0)
    .animation({
      duration: 150,
      curve: Curve.EaseInOut
    })
    .onClick(() => {
      this.handlePress();
    })
    .onTouch((event: TouchEvent) => {
      if (event.type === TouchType.Down) {
        this.isPressed = true;
      } else if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
        this.isPressed = false;
      }
    })
    .onHover((isHover: boolean) => {
      this.isHovered = isHover;
    })
  }
}