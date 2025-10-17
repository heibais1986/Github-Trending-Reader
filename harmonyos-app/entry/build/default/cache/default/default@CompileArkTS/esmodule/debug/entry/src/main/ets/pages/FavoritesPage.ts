if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FavoritesPage_Params {
    favoriteItems?: FavoriteItem[];
    isLoading?: boolean;
    isEmpty?: boolean;
    favoritesManager?;
}
import router from "@ohos:router";
import { createFavoritesManager } from "@bundle:com.github.trending/entry/ets/models/index";
import type { FavoriteItem } from "@bundle:com.github.trending/entry/ets/models/index";
import type { Repository } from '../models/Repository';
class FavoritesPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__favoriteItems = new ObservedPropertyObjectPU([], this, "favoriteItems");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__isEmpty = new ObservedPropertySimplePU(true, this, "isEmpty");
        this.favoritesManager = createFavoritesManager();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: FavoritesPage_Params) {
        if (params.favoriteItems !== undefined) {
            this.favoriteItems = params.favoriteItems;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.isEmpty !== undefined) {
            this.isEmpty = params.isEmpty;
        }
        if (params.favoritesManager !== undefined) {
            this.favoritesManager = params.favoritesManager;
        }
    }
    updateStateVars(params: FavoritesPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__favoriteItems.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isEmpty.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__favoriteItems.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__isEmpty.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __favoriteItems: ObservedPropertyObjectPU<FavoriteItem[]>;
    get favoriteItems() {
        return this.__favoriteItems.get();
    }
    set favoriteItems(newValue: FavoriteItem[]) {
        this.__favoriteItems.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __isEmpty: ObservedPropertySimplePU<boolean>;
    get isEmpty() {
        return this.__isEmpty.get();
    }
    set isEmpty(newValue: boolean) {
        this.__isEmpty.set(newValue);
    }
    private favoritesManager;
    aboutToAppear() {
        this.loadFavorites();
    }
    /**
     * 加载收藏列表
     */
    private loadFavorites() {
        this.isLoading = true;
        try {
            this.favoriteItems = this.favoritesManager.getFavorites();
            this.isEmpty = this.favoriteItems.length === 0;
            console.info('FavoritesPage', '加载收藏:', this.favoriteItems.length, '条');
        }
        catch (error) {
            console.error('FavoritesPage', '加载收藏失败:', error);
            this.isEmpty = true;
        }
        finally {
            this.isLoading = false;
        }
    }
    /**
     * 导航到仓库详情
     */
    private navigateToRepositoryDetail(repository: Repository) {
        try {
            router.pushUrl({
                url: 'pages/WebViewPage',
                params: {
                    url: repository.htmlUrl || '',
                    title: repository.name
                }
            });
        }
        catch (error) {
            console.error('FavoritesPage', '导航失败:', error);
        }
    }
    /**
     * 从收藏中移除
     */
    private removeFromFavorites(repositoryId: string) {
        this.favoritesManager.removeFromFavorites(repositoryId);
        this.loadFavorites(); // 重新加载
    }
    /**
     * 格式化日期
     */
    private formatDate(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return '今天';
        }
        else if (days === 1) {
            return '昨天';
        }
        else if (days < 7) {
            return `${days}天前`;
        }
        else {
            return date.toLocaleDateString();
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 页面标题
            Row.create();
            // 页面标题
            Row.width('100%');
            // 页面标题
            Row.height(56);
            // 页面标题
            Row.padding({ left: 16, right: 16 });
            // 页面标题
            Row.backgroundColor('#f5f5f5');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.fontSize(16);
            Button.fontColor('#333');
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                router.back();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的收藏');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333');
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        // 页面标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 内容区域
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.margin({ top: 50 });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(16);
                        Text.fontColor('#666');
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.isEmpty) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无收藏');
                        Text.fontSize(18);
                        Text.fontColor('#999');
                        Text.margin({ top: 50 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('收藏的仓库会显示在这里');
                        Text.fontSize(14);
                        Text.fontColor('#ccc');
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 收藏列表
                        List.create({ space: 8 });
                        // 收藏列表
                        List.layoutWeight(1);
                        // 收藏列表
                        List.padding(12);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.FavoriteItem.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.favoriteItems, forEachItemGenFunction, (item: FavoriteItem) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    // 收藏列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    FavoriteItem(item: FavoriteItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.shadow({ radius: 2, color: '#00000010', offsetX: 0, offsetY: 1 });
            Column.onClick(() => {
                this.navigateToRepositoryDetail(item.repository);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 仓库信息
            Column.create({ space: 4 });
            // 仓库信息
            Column.layoutWeight(1);
            // 仓库信息
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.repository.name);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.repository.owner?.login || '');
            Text.fontSize(14);
            Text.fontColor('#666');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        // 仓库信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 取消收藏按钮
            Button.createWithLabel('❤️');
            // 取消收藏按钮
            Button.fontSize(16);
            // 取消收藏按钮
            Button.fontColor('#ff4757');
            // 取消收藏按钮
            Button.backgroundColor(Color.Transparent);
            // 取消收藏按钮
            Button.width(32);
            // 取消收藏按钮
            Button.height(32);
            // 取消收藏按钮
            Button.onClick(() => {
                this.removeFromFavorites(item.repository.id);
            });
        }, Button);
        // 取消收藏按钮
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收藏时间
            Text.create(`收藏于 ${this.formatDate(item.favoritedAt)}`);
            // 收藏时间
            Text.fontSize(12);
            // 收藏时间
            Text.fontColor('#999');
            // 收藏时间
            Text.width('100%');
            // 收藏时间
            Text.textAlign(TextAlign.Start);
            // 收藏时间
            Text.margin({ top: 4 });
        }, Text);
        // 收藏时间
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 仓库描述
            if (item.repository.description) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.repository.description);
                        Text.fontSize(14);
                        Text.fontColor('#666');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.width('100%');
                        Text.textAlign(TextAlign.Start);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            // 标签
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 标签
            if (item.tags && item.tags.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 8 });
                        Row.width('100%');
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const tag = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(tag);
                                Text.fontSize(12);
                                Text.fontColor('#409eff');
                                Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
                                Text.backgroundColor('#e6f7ff');
                                Text.borderRadius(4);
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, item.tags, forEachItemGenFunction, (tag: string) => tag, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Row.pop();
                });
            }
            // 备注
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 备注
            if (item.notes && item.notes.trim() !== '') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.notes);
                        Text.fontSize(12);
                        Text.fontColor('#666');
                        Text.fontStyle(FontStyle.Italic);
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.width('100%');
                        Text.textAlign(TextAlign.Start);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            // 统计信息
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 统计信息
            Row.create({ space: 16 });
            // 统计信息
            Row.width('100%');
            // 统计信息
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⭐');
            Text.fontSize(12);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.repository.stars.toString());
            Text.fontSize(12);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (item.repository.language) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔤');
                        Text.fontSize(12);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(item.repository.language);
                        Text.fontSize(12);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 统计信息
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "FavoritesPage";
    }
}
registerNamedRoute(() => new FavoritesPage(undefined, {}), "", { bundleName: "com.github.trending", moduleName: "entry", pagePath: "pages/FavoritesPage", pageFullPath: "entry/src/main/ets/pages/FavoritesPage", integratedHsp: "false", moduleType: "followWithHap" });
