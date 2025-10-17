/**
 * Feedback manager for handling user interactions and visual feedback
 * Provides haptic feedback, visual feedback, and user interaction responses
 */

/**
 * Feedback type enumeration
 */
export enum FeedbackType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  SELECTION = 'SELECTION',
  IMPACT_LIGHT = 'IMPACT_LIGHT',
  IMPACT_MEDIUM = 'IMPACT_MEDIUM',
  IMPACT_HEAVY = 'IMPACT_HEAVY'
}

/**
 * Toast configuration interface
 */
export interface ToastConfig {
  message: string;
  duration?: number;
  type?: FeedbackType;
  showIcon?: boolean;
}

/**
 * Visual feedback configuration interface
 */
export interface VisualFeedbackConfig {
  type: FeedbackType;
  duration?: number;
  intensity?: number;
}

/**
 * Feedback manager class
 */
export class FeedbackManager {
  private static instance: FeedbackManager;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): FeedbackManager {
    if (!FeedbackManager.instance) {
      FeedbackManager.instance = new FeedbackManager();
    }
    return FeedbackManager.instance;
  }

  /**
   * Provide haptic feedback
   */
  hapticFeedback(type: FeedbackType): void {
    try {
      // Note: In a real HarmonyOS implementation, you would use the vibrator API
      // For now, we'll simulate the feedback
      console.log(`Haptic feedback: ${type}`);
      
      // Simulated haptic feedback implementation
      // In real implementation, use: vibrator.vibrate(duration, intensity)
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }

  /**
   * Show toast message with feedback
   */
  showToast(config: ToastConfig): void {
    try {
      let message: string = config.message;
      let duration: number = config.duration || 2000;
      let type: FeedbackType = config.type || FeedbackType.INFO;
      let showIcon: boolean = config.showIcon !== undefined ? config.showIcon : true;
      
      // Provide haptic feedback for toast
      this.hapticFeedback(type);
      
      // Show toast (in real implementation, use promptAction.showToast)
      console.log(`Toast: ${message} (${type})`);
      
      // Simulated toast implementation
      // In real implementation:
      // promptAction.showToast({
      //   message: message,
      //   duration: duration
      // });
      
    } catch (error) {
      console.error('Toast display failed:', error);
    }
  }

  /**
   * Provide visual feedback for button press
   */
  buttonPressedFeedback(): void {
    this.hapticFeedback(FeedbackType.SELECTION);
  }

  /**
   * Provide feedback for successful action
   */
  successFeedback(message?: string): void {
    this.hapticFeedback(FeedbackType.SUCCESS);
    if (message) {
      this.showToast({
        message,
        type: FeedbackType.SUCCESS,
        duration: 1500
      });
    }
  }

  /**
   * Provide feedback for error
   */
  errorFeedback(message?: string): void {
    this.hapticFeedback(FeedbackType.ERROR);
    if (message) {
      this.showToast({
        message,
        type: FeedbackType.ERROR,
        duration: 3000
      });
    }
  }

  /**
   * Provide feedback for warning
   */
  warningFeedback(message?: string): void {
    this.hapticFeedback(FeedbackType.WARNING);
    if (message) {
      this.showToast({
        message,
        type: FeedbackType.WARNING,
        duration: 2500
      });
    }
  }

  /**
   * Provide feedback for loading start
   */
  loadingStartFeedback(): void {
    this.hapticFeedback(FeedbackType.IMPACT_LIGHT);
  }

  /**
   * Provide feedback for loading complete
   */
  loadingCompleteFeedback(): void {
    this.hapticFeedback(FeedbackType.IMPACT_LIGHT);
  }

  /**
   * Provide feedback for refresh action
   */
  refreshFeedback(): void {
    this.hapticFeedback(FeedbackType.IMPACT_MEDIUM);
  }

  /**
   * Provide feedback for item selection
   */
  itemSelectionFeedback(): void {
    this.hapticFeedback(FeedbackType.SELECTION);
  }

  /**
   * Get icon for feedback type
   */
  static getIconForType(type: FeedbackType): string {
    switch (type) {
      case FeedbackType.SUCCESS:
        return '✅';
      case FeedbackType.ERROR:
        return '❌';
      case FeedbackType.WARNING:
        return '⚠️';
      case FeedbackType.INFO:
        return 'ℹ️';
      default:
        return '';
    }
  }

  /**
   * Get color for feedback type
   */
  static getColorForType(type: FeedbackType): ResourceColor {
    switch (type) {
      case FeedbackType.SUCCESS:
        return $r('app.color.success_color');
      case FeedbackType.ERROR:
        return $r('app.color.error_color');
      case FeedbackType.WARNING:
        return $r('app.color.warning_color');
      case FeedbackType.INFO:
        return $r('app.color.info_color');
      default:
        return $r('app.color.text_primary');
    }
  }
}

/**
 * Utility functions for common feedback scenarios
 */
export class FeedbackUtils {
  private static feedbackManager = FeedbackManager.getInstance();

  /**
   * Handle network request start feedback
   */
  static onNetworkRequestStart(): void {
    FeedbackUtils.feedbackManager.loadingStartFeedback();
  }

  /**
   * Handle network request success feedback
   */
  static onNetworkRequestSuccess(message?: string): void {
    FeedbackUtils.feedbackManager.loadingCompleteFeedback();
    if (message) {
      FeedbackUtils.feedbackManager.successFeedback(message);
    }
  }

  /**
   * Handle network request error feedback
   */
  static onNetworkRequestError(message: string): void {
    FeedbackUtils.feedbackManager.errorFeedback(message);
  }

  /**
   * Handle refresh action feedback
   */
  static onRefreshAction(): void {
    FeedbackUtils.feedbackManager.refreshFeedback();
  }

  /**
   * Handle item click feedback
   */
  static onItemClick(): void {
    FeedbackUtils.feedbackManager.itemSelectionFeedback();
  }

  /**
   * Handle button press feedback
   */
  static onButtonPress(): void {
    FeedbackUtils.feedbackManager.buttonPressedFeedback();
  }

  /**
   * Show success message
   */
  static showSuccess(message: string): void {
    FeedbackUtils.feedbackManager.successFeedback(message);
  }

  /**
   * Show error message
   */
  static showError(message: string): void {
    FeedbackUtils.feedbackManager.errorFeedback(message);
  }

  /**
   * Show warning message
   */
  static showWarning(message: string): void {
    FeedbackUtils.feedbackManager.warningFeedback(message);
  }

  /**
   * Show info message
   */
  static showInfo(message: string): void {
    FeedbackUtils.feedbackManager.showToast({
      message,
      type: FeedbackType.INFO
    });
  }
}