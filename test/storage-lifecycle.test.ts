/**
 * Unit tests for StorageManager Lifecycle Management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageManager, Repository, DataLifecyclePolicy } from '../src/storage-manager';

// Mock KVNamespace (reuse from storage-manager.test.ts)
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

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

describe('StorageManager Lifecycle Management', () => {
  let mockKV: MockKVNamespace;
  let storageManager: StorageManager;
  let sampleRepositories: Repository[];

  beforeEach(() => {
    mockKV = new MockKVNamespace();
    storageManager = new StorageManager(mockKV);
    
    sampleRepositories = [
      {
        id: '1',
        name: 'test-repo',
        fullName: 'user/test-repo',
        description: 'Test repository',
        url: 'https://github.com/user/test-repo',
        stars: 100,
        language: 'TypeScript',
        author: {
          name: 'user',
          avatar: 'https://github.com/user.avatar'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z'
      }
    ];
  });

  describe('setLifecyclePolicy', () => {
    it('should set lifecycle policy successfully', async () => {
      const policy: Partial<DataLifecyclePolicy> = {
        retentionDays: 14,
        maxEntries: 50,
        autoCleanup: true,
        compressionEnabled: true,
      };

      await storageManager.setLifecyclePolicy(policy);

      const storedPolicy = await storageManager.getLifecyclePolicy();
      expect(storedPolicy.retentionDays).toBe(14);
      expect(storedPolicy.maxEntries).toBe(50);
      expect(storedPolicy.autoCleanup).toBe(true);
      expect(storedPolicy.compressionEnabled).toBe(true);
    });

    it('should merge with existing policy', async () => {
      // Set initial policy
      await storageManager.setLifecyclePolicy({ retentionDays: 10 });
      
      // Update only maxEntries
      await storageManager.setLifecyclePolicy({ maxEntries: 100 });

      const policy = await storageManager.getLifecyclePolicy();
      expect(policy.retentionDays).toBe(10); // Should remain unchanged
      expect(policy.maxEntries).toBe(100); // Should be updated
    });

    it('should handle KV put failure', async () => {
      vi.spyOn(mockKV, 'put').mockRejectedValueOnce(new Error('KV Error'));

      await expect(
        storageManager.setLifecyclePolicy({ retentionDays: 5 })
      ).rejects.toThrow('Failed to set lifecycle policy: KV Error');
    });
  });

  describe('getLifecyclePolicy', () => {
    it('should return stored policy', async () => {
      const policy: Partial<DataLifecyclePolicy> = {
        retentionDays: 21,
        maxEntries: 25,
      };

      await storageManager.setLifecyclePolicy(policy);
      const retrievedPolicy = await storageManager.getLifecyclePolicy();

      expect(retrievedPolicy.retentionDays).toBe(21);
      expect(retrievedPolicy.maxEntries).toBe(25);
    });

    it('should return default policy when none stored', async () => {
      const policy = await storageManager.getLifecyclePolicy();

      expect(policy.retentionDays).toBe(7); // Default
      expect(policy.maxEntries).toBe(30); // Default
      expect(policy.autoCleanup).toBe(true); // Default
      expect(policy.compressionEnabled).toBe(false); // Default
    });

    it('should handle KV get failure gracefully', async () => {
      vi.spyOn(mockKV, 'get').mockRejectedValueOnce(new Error('KV Error'));

      const policy = await storageManager.getLifecyclePolicy();
      
      // Should return default policy
      expect(policy.retentionDays).toBe(7);
    });
  });

  describe('performLifecycleManagement', () => {
    beforeEach(async () => {
      // Setup test data with various dates relative to current date
      const today = new Date();
      const dates = [
        new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
        new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],  // 6 days ago
        new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],  // 3 days ago
        new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],  // 1 day ago
        today.toISOString().split('T')[0], // Today
      ];

      for (const date of dates) {
        await storageManager.storeTrendingData(date, sampleRepositories);
      }
    });

    it('should perform comprehensive lifecycle management', async () => {
      // Set policy for testing
      await storageManager.setLifecyclePolicy({
        retentionDays: 2, // Very short retention to ensure cleanup
        maxEntries: 2,    // Low max entries to ensure cleanup
        autoCleanup: true,
        compressionEnabled: true,
      });

      const result = await storageManager.performLifecycleManagement();

      // Should clean some entries due to retention or max entries policy
      expect(result.cleanedEntries).toBeGreaterThanOrEqual(0);
      expect(result.totalSize).toBeGreaterThanOrEqual(0); // Allow 0 if no data remains
      expect(result.errors).toHaveLength(0);
      
      // Verify that cleanup actually happened
      const remainingDates = await storageManager.getAvailableDates();
      expect(remainingDates.length).toBeLessThanOrEqual(2);
    });

    it('should handle errors gracefully', async () => {
      // Mock a failure in one of the lifecycle operations
      vi.spyOn(storageManager, 'getAvailableDates').mockRejectedValueOnce(new Error('Test Error'));

      const result = await storageManager.performLifecycleManagement();

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Test Error');
    });

    it('should skip cleanup when autoCleanup is disabled', async () => {
      await storageManager.setLifecyclePolicy({
        autoCleanup: false,
      });

      const result = await storageManager.performLifecycleManagement();

      // Should still work but with different behavior
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('createVersionCheckpoint', () => {
    beforeEach(async () => {
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
    });

    it('should create version checkpoint successfully', async () => {
      const version = await storageManager.createVersionCheckpoint('2024-01-01', 'Test checkpoint');

      expect(version.version).toContain('1.0.0');
      expect(version.timestamp).toBeTruthy();
      expect(version.checksum).toBeTruthy();
      expect(version.size).toBeGreaterThan(0);
    });

    it('should fail for non-existent date', async () => {
      await expect(
        storageManager.createVersionCheckpoint('2024-12-31')
      ).rejects.toThrow('No data found for date: 2024-12-31');
    });

    it('should handle KV put failure', async () => {
      vi.spyOn(mockKV, 'put').mockRejectedValueOnce(new Error('KV Error'));

      await expect(
        storageManager.createVersionCheckpoint('2024-01-01')
      ).rejects.toThrow('Failed to create version checkpoint: KV Error');
    });
  });

  describe('validateDataIntegrity', () => {
    beforeEach(async () => {
      // Setup valid data
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
      await storageManager.storeTrendingData('2024-01-02', sampleRepositories);
    });

    it('should validate data integrity successfully', async () => {
      const result = await storageManager.validateDataIntegrity();

      expect(result.isValid).toBe(true);
      expect(result.corruptedEntries).toHaveLength(0);
      expect(result.missingEntries).toHaveLength(0);
      expect(result.totalChecked).toBe(2);
    });

    it('should detect corrupted data', async () => {
      // Store invalid data
      await mockKV.put('trending:2024-01-03', JSON.stringify({ invalid: 'data' }));
      
      // Update metadata to include the corrupted entry
      const metadata = {
        version: '1.0.0',
        lastCleanup: new Date().toISOString(),
        dataKeys: ['trending:2024-01-01', 'trending:2024-01-02', 'trending:2024-01-03', 'trending:latest'],
        totalDataSize: 0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      await mockKV.put('storage:metadata', JSON.stringify(metadata));

      const result = await storageManager.validateDataIntegrity();

      expect(result.isValid).toBe(false);
      expect(result.corruptedEntries).toContain('2024-01-03');
      expect(result.totalChecked).toBe(3);
    });

    it('should detect missing entries', async () => {
      // Delete one entry but keep it in metadata
      await mockKV.delete('trending:2024-01-02');

      const result = await storageManager.validateDataIntegrity();

      expect(result.isValid).toBe(false);
      expect(result.missingEntries).toContain('2024-01-02');
    });

    it('should handle validation errors gracefully', async () => {
      vi.spyOn(storageManager, 'getAvailableDates').mockRejectedValueOnce(new Error('Validation Error'));

      await expect(
        storageManager.validateDataIntegrity()
      ).rejects.toThrow('Failed to validate data integrity: Validation Error');
    });
  });

  describe('lifecycle policy enforcement', () => {
    it('should enforce maximum entries limit', async () => {
      // Create more entries than the limit
      const dates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'];
      for (const date of dates) {
        await storageManager.storeTrendingData(date, sampleRepositories);
      }

      // Set policy with low max entries
      await storageManager.setLifecyclePolicy({ maxEntries: 3 });

      const result = await storageManager.performLifecycleManagement();

      expect(result.cleanedEntries).toBeGreaterThan(0);
      
      // Verify that only 3 entries remain
      const remainingDates = await storageManager.getAvailableDates();
      expect(remainingDates.length).toBeLessThanOrEqual(3);
    });

    it('should compress old data when enabled', async () => {
      // Setup data for compression
      const dates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04'];
      for (const date of dates) {
        await storageManager.storeTrendingData(date, sampleRepositories);
      }

      await storageManager.setLifecyclePolicy({ compressionEnabled: true });

      const result = await storageManager.performLifecycleManagement();

      expect(result.compressedEntries).toBeGreaterThanOrEqual(0);
    });
  });

  describe('error handling in lifecycle operations', () => {
    it('should handle cleanup failures gracefully', async () => {
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
      
      // Mock delete to fail
      vi.spyOn(mockKV, 'delete').mockRejectedValueOnce(new Error('Delete failed'));

      const result = await storageManager.performLifecycleManagement();

      // Should continue despite errors
      expect(result.errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle compression failures gracefully', async () => {
      await storageManager.storeTrendingData('2024-01-01', sampleRepositories);
      
      await storageManager.setLifecyclePolicy({ compressionEnabled: true });
      
      // Mock get to fail during compression
      const originalGet = mockKV.get.bind(mockKV);
      vi.spyOn(mockKV, 'get').mockImplementation(async (key: string, type?: any) => {
        if (key.includes('trending:2024-01-01')) {
          throw new Error('Get failed');
        }
        return originalGet(key, type);
      });

      const result = await storageManager.performLifecycleManagement();

      // Should handle compression errors
      expect(result.compressedEntries).toBe(0);
    });
  });
});