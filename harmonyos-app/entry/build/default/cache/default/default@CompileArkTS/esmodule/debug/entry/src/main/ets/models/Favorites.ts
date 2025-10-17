import type { Repository } from './Repository';
export interface FavoriteItem {
    id: string;
    repository: Repository;
    favoritedAt: Date;
    tags?: string[]; // 用户可以为收藏添加标签
    notes?: string; // 用户可以为收藏添加备注
}
export class FavoritesManager {
    private static instance: FavoritesManager;
    private favoriteItems: FavoriteItem[] = [];
    private constructor() {
        this.loadFavorites();
    }
    static getInstance(): FavoritesManager {
        if (!FavoritesManager.instance) {
            FavoritesManager.instance = new FavoritesManager();
        }
        return FavoritesManager.instance;
    }
    /**
     * 添加到收藏
     */
    addToFavorites(repository: Repository, tags?: string[], notes?: string): boolean {
        const existingItem = this.favoriteItems.find(item => item.repository.id === repository.id);
        if (existingItem) {
            console.warn('FavoritesManager', '仓库已在收藏中:', repository.name);
            return false;
        }
        const newItem: FavoriteItem = {
            id: `favorite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            repository: repository,
            favoritedAt: new Date(),
            tags: tags || [],
            notes: notes || ''
        };
        this.favoriteItems.unshift(newItem);
        this.saveFavorites();
        console.info('FavoritesManager', '添加收藏成功:', repository.name);
        return true;
    }
    /**
     * 从收藏中移除
     */
    removeFromFavorites(repositoryId: string): boolean {
        const initialLength = this.favoriteItems.length;
        this.favoriteItems = this.favoriteItems.filter(item => item.repository.id !== repositoryId);
        if (this.favoriteItems.length < initialLength) {
            this.saveFavorites();
            console.info('FavoritesManager', '移除收藏成功');
            return true;
        }
        console.warn('FavoritesManager', '仓库不在收藏中');
        return false;
    }
    /**
     * 检查是否已收藏
     */
    isFavorited(repositoryId: string): boolean {
        return this.favoriteItems.some(item => item.repository.id === repositoryId);
    }
    /**
     * 获取所有收藏
     */
    getFavorites(): FavoriteItem[] {
        return this.favoriteItems.sort((a, b) => b.favoritedAt.getTime() - a.favoritedAt.getTime());
    }
    /**
     * 获取收藏数量
     */
    getFavoritesCount(): number {
        return this.favoriteItems.length;
    }
    /**
     * 根据标签获取收藏
     */
    getFavoritesByTag(tag: string): FavoriteItem[] {
        return this.favoriteItems.filter(item => item.tags?.includes(tag));
    }
    /**
     * 更新收藏的标签和备注
     */
    updateFavorite(repositoryId: string, tags?: string[], notes?: string): boolean {
        const item = this.favoriteItems.find(item => item.repository.id === repositoryId);
        if (item) {
            if (tags !== undefined) {
                item.tags = tags;
            }
            if (notes !== undefined) {
                item.notes = notes;
            }
            this.saveFavorites();
            console.info('FavoritesManager', '更新收藏成功:', item.repository.name);
            return true;
        }
        console.warn('FavoritesManager', '仓库不在收藏中');
        return false;
    }
    /**
     * 从本地存储加载收藏
     */
    private loadFavorites(): void {
        try {
            // 这里应该从本地存储加载数据
            // 暂时返回空数组
            this.favoriteItems = [];
        }
        catch (error) {
            console.error('FavoritesManager', '加载收藏失败:', error);
            this.favoriteItems = [];
        }
    }
    /**
     * 保存收藏到本地存储
     */
    private saveFavorites(): void {
        try {
            // 这里应该保存到本地存储
            console.info('FavoritesManager', '保存收藏:', this.favoriteItems.length, '条记录');
        }
        catch (error) {
            console.error('FavoritesManager', '保存收藏失败:', error);
        }
    }
}
export function createFavoritesManager(): FavoritesManager {
    return FavoritesManager.getInstance();
}
