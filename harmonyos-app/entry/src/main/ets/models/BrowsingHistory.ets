/**
 * Browsing history data model
 */

import { Repository } from './Repository';

export interface BrowsingHistoryItem {
  id: string;
  repository: Repository;
  visitedAt: Date;
  visitDuration: number; // 访问时长（秒）
}

export class BrowsingHistoryManager {
  private static instance: BrowsingHistoryManager;
  private historyItems: BrowsingHistoryItem[] = [];

  private constructor() {
    this.loadHistory();
  }

  static getInstance(): BrowsingHistoryManager {
    if (!BrowsingHistoryManager.instance) {
      BrowsingHistoryManager.instance = new BrowsingHistoryManager();
    }
    return BrowsingHistoryManager.instance;
  }

  /**
   * 添加浏览历史记录
   */
  addToHistory(repository: Repository): void {
    const existingItem = this.historyItems.find(item => item.repository.id === repository.id);
    
    if (existingItem) {
      // 如果已存在，更新访问时间
      existingItem.visitedAt = new Date();
    } else {
      // 如果不存在，创建新记录
      const newItem: BrowsingHistoryItem = {
        id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        repository: repository,
        visitedAt: new Date(),
        visitDuration: 0
      };
      this.historyItems.unshift(newItem);
    }
    
    this.saveHistory();
  }

  /**
   * 获取所有浏览历史
   */
  getHistory(): BrowsingHistoryItem[] {
    return this.historyItems.sort((a, b) => b.visitedAt.getTime() - a.visitedAt.getTime());
  }

  /**
   * 获取浏览历史数量
   */
  getHistoryCount(): number {
    return this.historyItems.length;
  }

  /**
   * 删除浏览历史记录
   */
  removeFromHistory(repositoryId: string): void {
    this.historyItems = this.historyItems.filter(item => item.repository.id !== repositoryId);
    this.saveHistory();
  }

  /**
   * 清空所有浏览历史
   */
  clearHistory(): void {
    this.historyItems = [];
    this.saveHistory();
  }

  /**
   * 从本地存储加载浏览历史
   */
  /**
   * 创建浏览历史项
   */
  private createHistoryItem(repository: Repository): BrowsingHistoryItem {
    return {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      repository: repository,
      visitedAt: new Date(),
      visitDuration: 0
    };
  }

  private loadHistory(): void {
    try {
      // 从本地存储加载数据
      const historyData = AppStorage.Get<string>('browse_history');
      if (historyData) {
        const repositories: Repository[] = JSON.parse(historyData);
        this.historyItems = repositories.map(repo => this.createHistoryItem(repo));
      } else {
        this.historyItems = [];
      }
    } catch (error) {
      console.error('BrowsingHistoryManager', '加载浏览历史失败:', error);
      this.historyItems = [];
    }
  }

  /**
   * 保存浏览历史到本地存储
   */
  private saveHistory(): void {
    try {
      // 保存到本地存储
      const repositories = this.historyItems.map(item => item.repository);
      AppStorage.Set('browse_history', JSON.stringify(repositories));
      console.info('BrowsingHistoryManager', '保存浏览历史:', this.historyItems.length, '条记录');
    } catch (error) {
      console.error('BrowsingHistoryManager', '保存浏览历史失败:', error);
    }
  }
}

export function createBrowsingHistoryManager(): BrowsingHistoryManager {
  return BrowsingHistoryManager.getInstance();
}