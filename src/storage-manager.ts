/**
 * Cloudflare KV Storage Manager
 * Handles all KV storage operations with serialization and data lifecycle management
 */

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TrendingData {
  date: string;
  repositories: Repository[];
  updatedAt: string;
  total: number;
}

export interface StorageMetadata {
  version: string;
  lastCleanup: string;
  dataKeys: string[];
  totalDataSize: number;
  createdAt: string;
  lastUpdated: string;
}

export interface DataLifecyclePolicy {
  retentionDays: number;
  maxEntries: number;
  autoCleanup: boolean;
  compressionEnabled: boolean;
}

export interface DataVersion {
  version: string;
  timestamp: string;
  checksum: string;
  size: number;
}

export class StorageManager {
  private kv: KVNamespace;
  private readonly DATA_PREFIX = 'trending:';
  private readonly LATEST_KEY = 'trending:latest';
  private readonly METADATA_KEY = 'storage:metadata';
  private readonly VERSION_KEY = 'storage:version';
  private readonly POLICY_KEY = 'storage:policy';
  private readonly DATA_RETENTION_DAYS = 7;
  private readonly CURRENT_VERSION = '1.0.0';
  private readonly MAX_ENTRIES_DEFAULT = 30;
  
  private lifecyclePolicy: DataLifecyclePolicy;

  constructor(kvNamespace: KVNamespace, policy?: Partial<DataLifecyclePolicy>) {
    this.kv = kvNamespace;
    this.lifecyclePolicy = {
      retentionDays: policy?.retentionDays ?? this.DATA_RETENTION_DAYS,
      maxEntries: policy?.maxEntries ?? this.MAX_ENTRIES_DEFAULT,
      autoCleanup: policy?.autoCleanup ?? true,
      compressionEnabled: policy?.compressionEnabled ?? false,
    };
  }

  /**
   * Store trending data for a specific date
   */
  async storeTrendingData(date: string, repositories: Repository[]): Promise<void> {
    const trendingData: TrendingData = {
      date,
      repositories,
      updatedAt: new Date().toISOString(),
      total: repositories.length,
    };

    const key = this.getDateKey(date);
    
    try {
      // Store the data
      await this.kv.put(key, JSON.stringify(trendingData), {
        metadata: { 
          version: this.CURRENT_VERSION,
          date,
          type: 'trending_data'
        }
      });

      // Update latest data reference
      await this.kv.put(this.LATEST_KEY, JSON.stringify(trendingData), {
        metadata: { 
          version: this.CURRENT_VERSION,
          date,
          type: 'latest_data'
        }
      });

      // Update metadata
      await this.updateStorageMetadata(key);
      
    } catch (error) {
      throw new Error(`Failed to store trending data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve trending data for a specific date
   */
  async getTrendingData(date?: string): Promise<TrendingData | null> {
    try {
      const key = date ? this.getDateKey(date) : this.LATEST_KEY;
      const result = await this.kv.get(key, 'text');
      
      if (!result) {
        return null;
      }

      const data = this.deserializeTrendingData(result);
      return data;
      
    } catch (error) {
      throw new Error(`Failed to retrieve trending data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available dates with data
   */
  async getAvailableDates(): Promise<string[]> {
    try {
      const metadata = await this.getStorageMetadata();
      if (!metadata) {
        return [];
      }

      // Extract dates from data keys
      const dates = metadata.dataKeys
        .filter(key => key.startsWith(this.DATA_PREFIX) && key !== this.LATEST_KEY)
        .map(key => key.replace(this.DATA_PREFIX, ''))
        .sort()
        .reverse(); // Most recent first

      return dates;
      
    } catch (error) {
      throw new Error(`Failed to get available dates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean up old data beyond retention period
   */
  async cleanupOldData(): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.DATA_RETENTION_DAYS);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

      const metadata = await this.getStorageMetadata();
      if (!metadata) {
        return 0;
      }

      let deletedCount = 0;
      const remainingKeys: string[] = [];

      for (const key of metadata.dataKeys) {
        if (key === this.LATEST_KEY) {
          remainingKeys.push(key);
          continue;
        }

        const dateStr = key.replace(this.DATA_PREFIX, '');
        if (dateStr < cutoffDateStr) {
          await this.kv.delete(key);
          deletedCount++;
        } else {
          remainingKeys.push(key);
        }
      }

      // Update metadata with remaining keys
      if (deletedCount > 0) {
        const updatedMetadata: StorageMetadata = {
          ...metadata,
          dataKeys: remainingKeys,
          lastCleanup: new Date().toISOString(),
        };

        await this.kv.put(this.METADATA_KEY, JSON.stringify(updatedMetadata));
      }

      return deletedCount;
      
    } catch (error) {
      throw new Error(`Failed to cleanup old data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalEntries: number;
    oldestDate: string | null;
    newestDate: string | null;
    lastCleanup: string | null;
  }> {
    try {
      const dates = await this.getAvailableDates();
      const metadata = await this.getStorageMetadata();

      return {
        totalEntries: dates.length,
        oldestDate: dates.length > 0 ? dates[dates.length - 1] : null,
        newestDate: dates.length > 0 ? dates[0] : null,
        lastCleanup: metadata?.lastCleanup || null,
      };
      
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Data Lifecycle Management Methods
   */

  /**
   * Set or update data lifecycle policy
   */
  async setLifecyclePolicy(policy: Partial<DataLifecyclePolicy>): Promise<void> {
    try {
      this.lifecyclePolicy = { ...this.lifecyclePolicy, ...policy };
      
      await this.kv.put(this.POLICY_KEY, JSON.stringify(this.lifecyclePolicy), {
        metadata: { 
          version: this.CURRENT_VERSION,
          type: 'lifecycle_policy',
          updatedAt: new Date().toISOString()
        }
      });
      
    } catch (error) {
      throw new Error(`Failed to set lifecycle policy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current lifecycle policy
   */
  async getLifecyclePolicy(): Promise<DataLifecyclePolicy> {
    try {
      const result = await this.kv.get(this.POLICY_KEY, 'text');
      if (result) {
        return JSON.parse(result) as DataLifecyclePolicy;
      }
      return this.lifecyclePolicy;
      
    } catch (error) {
      return this.lifecyclePolicy;
    }
  }

  /**
   * Perform comprehensive data lifecycle management
   */
  async performLifecycleManagement(): Promise<{
    cleanedEntries: number;
    compressedEntries: number;
    totalSize: number;
    errors: string[];
  }> {
    const result = {
      cleanedEntries: 0,
      compressedEntries: 0,
      totalSize: 0,
      errors: [] as string[],
    };

    try {
      // Load current policy
      const policy = await this.getLifecyclePolicy();
      
      // 1. Clean up old data based on retention policy
      if (policy.autoCleanup) {
        try {
          result.cleanedEntries = await this.cleanupByRetentionPolicy(policy);
        } catch (error) {
          result.errors.push(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // 2. Enforce maximum entries limit
      try {
        const additionalCleaned = await this.enforceMaxEntries(policy);
        result.cleanedEntries += additionalCleaned;
      } catch (error) {
        result.errors.push(`Max entries enforcement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // 3. Compress data if enabled
      if (policy.compressionEnabled) {
        try {
          result.compressedEntries = await this.compressOldData();
        } catch (error) {
          result.errors.push(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // 4. Update storage statistics
      try {
        result.totalSize = await this.calculateTotalStorageSize();
        await this.updateStorageStatistics(result);
      } catch (error) {
        result.errors.push(`Statistics update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      return result;
      
    } catch (error) {
      result.errors.push(`Lifecycle management failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Create data version checkpoint
   */
  async createVersionCheckpoint(date: string, description?: string): Promise<DataVersion> {
    try {
      const data = await this.getTrendingData(date);
      if (!data) {
        throw new Error(`No data found for date: ${date}`);
      }

      const dataString = JSON.stringify(data);
      const checksum = await this.calculateChecksum(dataString);
      
      const version: DataVersion = {
        version: `${this.CURRENT_VERSION}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        checksum,
        size: dataString.length,
      };

      const versionKey = `${this.VERSION_KEY}:${date}:${version.version}`;
      await this.kv.put(versionKey, JSON.stringify({
        ...version,
        description: description || `Checkpoint for ${date}`,
        data: dataString,
      }), {
        metadata: { 
          type: 'version_checkpoint',
          date,
          version: version.version
        }
      });

      return version;
      
    } catch (error) {
      throw new Error(`Failed to create version checkpoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate data integrity
   */
  async validateDataIntegrity(): Promise<{
    isValid: boolean;
    corruptedEntries: string[];
    missingEntries: string[];
    totalChecked: number;
  }> {
    const result = {
      isValid: true,
      corruptedEntries: [] as string[],
      missingEntries: [] as string[],
      totalChecked: 0,
    };

    try {
      const dates = await this.getAvailableDates();
      
      for (const date of dates) {
        result.totalChecked++;
        
        try {
          const data = await this.getTrendingData(date);
          if (!data) {
            result.missingEntries.push(date);
            result.isValid = false;
            continue;
          }

          // Validate data structure
          if (!this.validateTrendingDataStructure(data)) {
            result.corruptedEntries.push(date);
            result.isValid = false;
          }
          
        } catch (error) {
          result.corruptedEntries.push(date);
          result.isValid = false;
        }
      }

      return result;
      
    } catch (error) {
      throw new Error(`Failed to validate data integrity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Private lifecycle helper methods
   */
  private async cleanupByRetentionPolicy(policy: DataLifecyclePolicy): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    const metadata = await this.getStorageMetadata();
    if (!metadata) return 0;

    let deletedCount = 0;
    const remainingKeys: string[] = [];

    for (const key of metadata.dataKeys) {
      if (key === this.LATEST_KEY) {
        remainingKeys.push(key);
        continue;
      }

      const dateStr = key.replace(this.DATA_PREFIX, '');
      if (dateStr < cutoffDateStr) {
        await this.kv.delete(key);
        deletedCount++;
      } else {
        remainingKeys.push(key);
      }
    }

    if (deletedCount > 0) {
      await this.updateMetadataKeys(remainingKeys);
    }

    return deletedCount;
  }

  private async enforceMaxEntries(policy: DataLifecyclePolicy): Promise<number> {
    const dates = await this.getAvailableDates();
    
    if (dates.length <= policy.maxEntries) {
      return 0;
    }

    // Keep the most recent entries, delete the oldest
    const entriesToDelete = dates.length - policy.maxEntries;
    const oldestDates = dates.slice(-entriesToDelete);

    let deletedCount = 0;
    for (const date of oldestDates) {
      try {
        await this.kv.delete(this.getDateKey(date));
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete entry for date ${date}:`, error);
      }
    }

    return deletedCount;
  }

  private async compressOldData(): Promise<number> {
    // Simple compression simulation - in real implementation, 
    // you might use actual compression algorithms
    const dates = await this.getAvailableDates();
    const oldDates = dates.slice(3); // Compress data older than 3 days
    
    let compressedCount = 0;
    
    for (const date of oldDates) {
      try {
        const data = await this.getTrendingData(date);
        if (data) {
          // Simulate compression by removing less critical fields
          const compressedData = {
            ...data,
            repositories: data.repositories.map(repo => ({
              id: repo.id,
              name: repo.name,
              fullName: repo.fullName,
              url: repo.url,
              stars: repo.stars,
              language: repo.language,
              // Remove description and author details for compression
            }))
          };
          
          await this.kv.put(this.getDateKey(date), JSON.stringify(compressedData), {
            metadata: { 
              version: this.CURRENT_VERSION,
              date,
              type: 'compressed_data',
              compressed: true
            }
          });
          
          compressedCount++;
        }
      } catch (error) {
        console.error(`Failed to compress data for date ${date}:`, error);
      }
    }
    
    return compressedCount;
  }

  private async calculateTotalStorageSize(): Promise<number> {
    // This is a simulation - actual KV doesn't provide size info directly
    const dates = await this.getAvailableDates();
    let totalSize = 0;
    
    for (const date of dates) {
      try {
        const data = await this.getTrendingData(date);
        if (data) {
          totalSize += JSON.stringify(data).length;
        }
      } catch (error) {
        // Continue with other entries
      }
    }
    
    return totalSize;
  }

  private async updateStorageStatistics(lifecycleResult: any): Promise<void> {
    const metadata = await this.getStorageMetadata();
    if (metadata) {
      const updatedMetadata: StorageMetadata = {
        ...metadata,
        totalDataSize: lifecycleResult.totalSize,
        lastUpdated: new Date().toISOString(),
      };
      
      await this.kv.put(this.METADATA_KEY, JSON.stringify(updatedMetadata));
    }
  }

  private async calculateChecksum(data: string): Promise<string> {
    // Simple checksum calculation - in production, use crypto.subtle
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private validateTrendingDataStructure(data: TrendingData): boolean {
    if (!data.date || !Array.isArray(data.repositories) || typeof data.total !== 'number') {
      return false;
    }
    
    // Validate each repository structure
    for (const repo of data.repositories) {
      if (!repo.id || !repo.name || !repo.url || typeof repo.stars !== 'number') {
        return false;
      }
    }
    
    return true;
  }

  private async updateMetadataKeys(keys: string[]): Promise<void> {
    const metadata = await this.getStorageMetadata();
    if (metadata) {
      const updatedMetadata: StorageMetadata = {
        ...metadata,
        dataKeys: keys,
        lastCleanup: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      
      await this.kv.put(this.METADATA_KEY, JSON.stringify(updatedMetadata));
    }
  }

  /**
   * Private helper methods
   */
  private getDateKey(date: string): string {
    return `${this.DATA_PREFIX}${date}`;
  }

  private deserializeTrendingData(jsonString: string): TrendingData {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      if (!data.date || !Array.isArray(data.repositories)) {
        throw new Error('Invalid data structure');
      }

      return data as TrendingData;
      
    } catch (error) {
      throw new Error(`Failed to deserialize trending data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getStorageMetadata(): Promise<StorageMetadata | null> {
    try {
      const result = await this.kv.get(this.METADATA_KEY, 'text');
      if (!result) {
        return null;
      }

      return JSON.parse(result) as StorageMetadata;
      
    } catch (error) {
      return null;
    }
  }

  private async updateStorageMetadata(newKey: string): Promise<void> {
    try {
      let metadata = await this.getStorageMetadata();
      
      if (!metadata) {
        metadata = {
          version: this.CURRENT_VERSION,
          lastCleanup: new Date().toISOString(),
          dataKeys: [],
          totalDataSize: 0,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
      }

      // Add new key if not already present
      if (!metadata.dataKeys.includes(newKey)) {
        metadata.dataKeys.push(newKey);
      }

      // Ensure latest key is always included
      if (!metadata.dataKeys.includes(this.LATEST_KEY)) {
        metadata.dataKeys.push(this.LATEST_KEY);
      }

      await this.kv.put(this.METADATA_KEY, JSON.stringify(metadata));
      
    } catch (error) {
      // Non-critical error, log but don't throw
      console.error('Failed to update storage metadata:', error);
    }
  }
}