/**
 * Unit tests for StorageManager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageManager, Repository, TrendingData } from '../src/storage-manager';

// Mock KVNamespace
class MockKVNamespace implements KVNamespace {
  private store = new Map<string, { value: string; metadata?: any }>();

  async get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream'): Promise<any> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (type === 'json') {
      return JSON.parse(item.value);
    }
    return item.value;
  }

  async put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: any): Promise<void> {
    this.store.set(key, { 
      value: typeof value === 'string' ? value : value.toString(),
      metadata: options?.metadata 
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async list(options?: any): Promise<any> {
    const keys = Array.from(this.store.keys());
    return {
      keys: keys.map(name => ({ name })),
      list_complete: true,
    };
  }

  // Clear store for testing
  clear(): void {
    this.store.clear();
  }

  // Get store size for testing
  size(): number {
    return this.store.size;
  }
}

describe('StorageManager', () => {
  let mockKV: MockKVNamespace;
  let storageManager: StorageManager;
  let sampleRepositories: Repository[];

  beforeEach(() => {
    mockKV = new MockKVNamespace();
    storageManager = new StorageManager(mockKV);
    
    sampleRepositories = [
      {
        id: '1',
        name: 'awesome-project',
        fullName: 'user/awesome-project',
        description: 'An awesome project',
        url: 'https://github.com/user/awesome-project',
        stars: 1000,
        language: 'TypeScript',
        author: {
          name: 'user',
          avatar: 'https://github.com/user.avatar'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z'
      },
      {
        id: '2',
        name: 'cool-library',
        fullName: 'dev/cool-library',
        description: 'A cool library',
        url: 'https://github.com/dev/cool-library',
        stars: 500,
        language: 'JavaScript',
        author: {
          name: 'dev',
          avatar: 'https://github.com/dev.avatar'
        },
        createdAt: '2024-01-01T01:00:00Z',
        updatedAt: '2024-01-01T13:00:00Z'
      }
    ];
  });

  describe('storeTrendingData', () => {
    it('should store trending data successfully', async () => {
      const date = '2024-01-01';
      
      await storageManager.storeTrendingData(date, sampleRepositories);
      
      // Verify data was stored
      const storedData = await mockKV.get('trending:2024-01-01', 'text');
      expect(storedData).toBeTruthy();
      
      const parsedData = JSON.parse(storedData!);
      expect(parsedData.date).toBe(date);
      expect(parsedData.repositories).toHaveLength(2);
      expect(parsedData.total).toBe(2);
      expect(parsedData.updatedAt).toBeTruthy();
    });

    it('should update latest data reference', async () => {
      const date = '2024-01-01';
      
      await storageManager.storeTrendingData(date, sampleRepositories);
      
      // Verify latest data was updated
      const latestData = await mockKV.get('trending:latest', 'text');
      expect(latestData).toBeTruthy();
      
      const parsedData = JSON.parse(latestData!);
      expect(parsedData.date).toBe(date);
      expect(parsedData.repositories).toHaveLength(2);
    });

    it('should handle empty repositories array', async () => {
      const date = '2024-01-01';
      
      await storageManager.storeTrendingData(date, []);
      
      const storedData = await mockKV.get('trending:2024-01-01', 'text');
      const parsedData = JSON.parse(storedData!);
      expect(parsedData.repositories).toHaveLength(0);
      expect(parsedData.total).toBe(0);
    });

    it('should throw error on KV failure', async () => {
      // Mock KV put to throw error
      vi.spyOn(mockKV, 'put').mockRejectedValueOnce(new Error('KV Error'));
      
      await expect(
        storageManager.storeTrendingData('2024-01-01', sampleRepositories)
      ).rejects.toThrow('Failed to store trending data: KV Error');
    });
  });

  describe('getTrendingData', () => {
    beforeEach(async () => {
      // Setup test data
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
    });

    it('should retrieve trending data by date', async () => {
      const data = await storageManager.getTrendingData('2024-01-01');
      
      expect(data).toBeTruthy();
      expect(data!.date).toBe('2024-01-01');
      expect(data!.repositories).toHaveLength(2);
      expect(data!.total).toBe(2);
    });

    it('should retrieve latest data when no date specified', async () => {
      const data = await storageManager.getTrendingData();
      
      expect(data).toBeTruthy();
      expect(data!.date).toBe('2024-01-01');
      expect(data!.repositories).toHaveLength(2);
    });

    it('should return null for non-existent date', async () => {
      const data = await storageManager.getTrendingData('2024-12-31');
      
      expect(data).toBeNull();
    });

    it('should throw error on invalid JSON', async () => {
      // Store invalid JSON
      await mockKV.put('trending:invalid', 'invalid json');
      
      await expect(
        storageManager.getTrendingData('invalid')
      ).rejects.toThrow('Failed to retrieve trending data');
    });

    it('should throw error on invalid data structure', async () => {
      // Store data with missing required fields
      await mockKV.put('trending:invalid', JSON.stringify({ invalid: 'data' }));
      
      await expect(
        storageManager.getTrendingData('invalid')
      ).rejects.toThrow('Failed to retrieve trending data');
    });
  });

  describe('getAvailableDates', () => {
    beforeEach(async () => {
      // Setup multiple days of data
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
      await storageManager.storeTrendingData('2024-01-02', sampleRepositories);
      await storageManager.storeTrendingData('2024-01-03', sampleRepositories);
    });

    it('should return available dates in descending order', async () => {
      const dates = await storageManager.getAvailableDates();
      
      expect(dates).toHaveLength(3);
      expect(dates).toEqual(['2024-01-03', '2024-01-02', '2024-01-01']);
    });

    it('should return empty array when no data exists', async () => {
      mockKV.clear();
      
      const dates = await storageManager.getAvailableDates();
      
      expect(dates).toHaveLength(0);
    });

    it('should exclude latest key from dates', async () => {
      const dates = await storageManager.getAvailableDates();
      
      expect(dates).not.toContain('latest');
    });
  });

  describe('cleanupOldData', () => {
    beforeEach(async () => {
      // Setup data with different dates
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days ago
      
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 3); // 3 days ago
      
      await storageManager.storeTrendingData(oldDate.toISOString().split('T')[0], sampleRepositories);
      await storageManager.storeTrendingData(recentDate.toISOString().split('T')[0], sampleRepositories);
      await storageManager.storeTrendingData(new Date().toISOString().split('T')[0], sampleRepositories);
    });

    it('should delete old data beyond retention period', async () => {
      const deletedCount = await storageManager.cleanupOldData();
      
      expect(deletedCount).toBe(1); // Only the 10-day-old data should be deleted
      
      const dates = await storageManager.getAvailableDates();
      expect(dates).toHaveLength(2); // Recent and today's data should remain
    });

    it('should preserve latest key during cleanup', async () => {
      await storageManager.cleanupOldData();
      
      const latestData = await storageManager.getTrendingData();
      expect(latestData).toBeTruthy();
    });

    it('should return 0 when no old data to delete', async () => {
      mockKV.clear();
      await storageManager.storeTrendingData(new Date().toISOString().split('T')[0], sampleRepositories);
      
      const deletedCount = await storageManager.cleanupOldData();
      
      expect(deletedCount).toBe(0);
    });
  });

  describe('getStorageStats', () => {
    beforeEach(async () => {
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
      await storageManager.storeTrendingData('2024-01-02', sampleRepositories);
      await storageManager.storeTrendingData('2024-01-03', sampleRepositories);
    });

    it('should return correct storage statistics', async () => {
      const stats = await storageManager.getStorageStats();
      
      expect(stats.totalEntries).toBe(3);
      expect(stats.oldestDate).toBe('2024-01-01');
      expect(stats.newestDate).toBe('2024-01-03');
      expect(stats.lastCleanup).toBeTruthy();
    });

    it('should handle empty storage', async () => {
      mockKV.clear();
      
      const stats = await storageManager.getStorageStats();
      
      expect(stats.totalEntries).toBe(0);
      expect(stats.oldestDate).toBeNull();
      expect(stats.newestDate).toBeNull();
      expect(stats.lastCleanup).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle KV get failures gracefully', async () => {
      vi.spyOn(mockKV, 'get').mockRejectedValueOnce(new Error('KV Get Error'));
      
      await expect(
        storageManager.getTrendingData('2024-01-01')
      ).rejects.toThrow('Failed to retrieve trending data: KV Get Error');
    });

    it('should handle KV delete failures during cleanup', async () => {
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
      
      vi.spyOn(mockKV, 'delete').mockRejectedValueOnce(new Error('KV Delete Error'));
      
      await expect(
        storageManager.cleanupOldData()
      ).rejects.toThrow('Failed to cleanup old data: KV Delete Error');
    });
  });
});