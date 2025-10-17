/**
 * Enhanced loading indicator component with different styles and animations
 */

/**
 * Loading indicator type enumeration
 */
export enum LoadingType {
  SPINNER = 'SPINNER',
  DOTS = 'DOTS',
  PULSE = 'PULSE',
  SKELETON = 'SKELETON'
}

/**
 * Loading indicator size enumeration
 */
export enum LoadingSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

/**
 * Loading indicator size dimensions interface
 */
export interface LoadingDimensions {
  width: number;
  height: number;
  fontSize: number;
}

/**
 * Loading indicator component properties
 */
export interface LoadingIndicatorProps {
  type?: LoadingType;
  size?: LoadingSize;
  message?: string;
  color?: ResourceColor;
  backgroundColor?: ResourceColor;
  showMessage?: boolean;
}

/**
 * Enhanced loading indicator component
 */
@Component
export struct LoadingIndicator {
  @Prop type: LoadingType = LoadingType.SPINNER;
  @Prop indicatorSize: LoadingSize = LoadingSize.MEDIUM;
  @Prop message: string = '正在加载...';
  @Prop color: ResourceColor = $r('app.color.primary_color');
  @Prop bgColor: ResourceColor = Color.Transparent;
  @Prop showMessage: boolean = true;

  /**
   * Get size dimensions based on size prop
   */
  private getSizeDimensions(): LoadingDimensions {
    switch (this.indicatorSize) {
      case LoadingSize.SMALL:
        return { width: 24, height: 24, fontSize: 12 };
      case LoadingSize.LARGE:
        return { width: 60, height: 60, fontSize: 18 };
      default:
        return { width: 40, height: 40, fontSize: 16 };
    }
  }

  /**
   * Build spinner loading indicator
   */
  @Builder
  buildSpinner() {
    LoadingProgress()
      .width(40)
      .height(40)
      .color(this.color)
  }

  /**
   * Build dots loading indicator
   */
  @Builder
  buildDots() {
    Row() {
      ForEach([0, 1, 2], (index: number) => {
        Circle()
          .width(8)
          .height(8)
          .fill(this.color)
          .animation({
            duration: 600,
            delay: index * 200,
            iterations: -1,
            playMode: PlayMode.Alternate
          })
      })
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
  }

  /**
   * Build pulse loading indicator
   */
  @Builder
  buildPulse() {
    Circle()
      .width(40)
      .height(40)
      .fill(this.color)
      .animation({
        duration: 1000,
        iterations: -1,
        playMode: PlayMode.Alternate
      })
  }

  /**
   * Build skeleton loading indicator
   */
  @Builder
  buildSkeleton() {
    Column({ space: 8 }) {
      // Title skeleton
      Row()
        .width('80%')
        .height(16)
        .backgroundColor($r('app.color.skeleton_color'))
        .borderRadius(4)
        .animation({
          duration: 1500,
          iterations: -1,
          playMode: PlayMode.Alternate
        })

      // Content skeleton lines
      ForEach([0, 1, 2], (index: number) => {
        Row()
          .width(index === 2 ? '60%' : '100%')
          .height(12)
          .backgroundColor($r('app.color.skeleton_color'))
          .borderRadius(4)
          .animation({
            duration: 1500,
            delay: index * 100,
            iterations: -1,
            playMode: PlayMode.Alternate
          })
      })
    }
    .width('100%')
    .padding(16)
  }

  /**
   * Build loading content based on type
   */
  @Builder
  buildLoadingContent() {
    if (this.type === LoadingType.DOTS) {
      this.buildDots();
    } else if (this.type === LoadingType.PULSE) {
      this.buildPulse();
    } else if (this.type === LoadingType.SKELETON) {
      this.buildSkeleton();
    } else {
      this.buildSpinner();
    }
  }

  build() {
    Column() {
      if (this.type !== LoadingType.SKELETON) {
        this.buildLoadingContent();

        if (this.showMessage && this.message) {
          Text(this.message)
            .fontSize(this.getSizeDimensions().fontSize)
            .fontColor($r('app.color.text_secondary'))
            .margin({ top: 16 })
            .textAlign(TextAlign.Center)
        }
      } else {
        this.buildLoadingContent();
      }
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(this.bgColor)
    .padding(16)
  }
}