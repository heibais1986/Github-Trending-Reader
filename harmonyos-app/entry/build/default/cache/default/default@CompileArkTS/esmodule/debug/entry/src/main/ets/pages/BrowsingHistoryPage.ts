if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BrowsingHistoryPage_Params {
    historyItems?: BrowsingHistoryItem[];
    isLoading?: boolean;
    isEmpty?: boolean;
    browsingHistoryManager?;
}
import router from "@ohos:router";
import { createBrowsingHistoryManager } from "@bundle:com.github.trending/entry/ets/models/index";
import type { BrowsingHistoryItem } from "@bundle:com.github.trending/entry/ets/models/index";
import type { Repository } from '../models/Repository';
class BrowsingHistoryPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__historyItems = new ObservedPropertyObjectPU([], this, "historyItems");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__isEmpty = new ObservedPropertySimplePU(true, this, "isEmpty");
        this.browsingHistoryManager = createBrowsingHistoryManager();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BrowsingHistoryPage_Params) {
        if (params.historyItems !== undefined) {
            this.historyItems = params.historyItems;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.isEmpty !== undefined) {
            this.isEmpty = params.isEmpty;
        }
        if (params.browsingHistoryManager !== undefined) {
            this.browsingHistoryManager = params.browsingHistoryManager;
        }
    }
    updateStateVars(params: BrowsingHistoryPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__historyItems.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isEmpty.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__historyItems.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__isEmpty.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __historyItems: ObservedPropertyObjectPU<BrowsingHistoryItem[]>;
    get historyItems() {
        return this.__historyItems.get();
    }
    set historyItems(newValue: BrowsingHistoryItem[]) {
        this.__historyItems.set(newValue);
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
    private browsingHistoryManager;
    aboutToAppear() {
        this.loadHistory();
    }
    /**
     * 加载浏览历史
     */
    private loadHistory() {
        this.isLoading = true;
        try {
            this.historyItems = this.browsingHistoryManager.getHistory();
            this.isEmpty = this.historyItems.length === 0;
            console.info('BrowsingHistoryPage', '加载历史记录:', this.historyItems.length, '条');
        }
        catch (error) {
            console.error('BrowsingHistoryPage', '加载历史记录失败:', error);
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
            console.error('BrowsingHistoryPage', '导航失败:', error);
        }
    }
    /**
     * 删除历史记录
     */
    private removeFromHistory(repositoryId: string) {
        this.browsingHistoryManager.removeFromHistory(repositoryId);
        this.loadHistory(); // 重新加载
    }
    /**
     * 清空所有历史记录
     */
    private clearAllHistory() {
        this.browsingHistoryManager.clearHistory();
        this.loadHistory(); // 重新加载
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
            Text.create('浏览历史');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333');
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isEmpty && !this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('清空');
                        Button.fontSize(14);
                        Button.fontColor('#ff4757');
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.clearAllHistory();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
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
                        Text.create('暂无浏览历史');
                        Text.fontSize(18);
                        Text.fontColor('#999');
                        Text.margin({ top: 50 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('浏览过的仓库会显示在这里');
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
                        // 历史记录列表
                        List.create({ space: 8 });
                        // 历史记录列表
                        List.layoutWeight(1);
                        // 历史记录列表
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
                                    this.HistoryItem.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.historyItems, forEachItemGenFunction, (item: BrowsingHistoryItem) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    // 历史记录列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    HistoryItem(item: BrowsingHistoryItem, parent = null) {
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
            // 删除按钮
            Button.createWithLabel('×');
            // 删除按钮
            Button.fontSize(16);
            // 删除按钮
            Button.fontColor('#999');
            // 删除按钮
            Button.backgroundColor(Color.Transparent);
            // 删除按钮
            Button.width(32);
            // 删除按钮
            Button.height(32);
            // 删除按钮
            Button.onClick(() => {
                this.removeFromHistory(item.repository.id);
            });
        }, Button);
        // 删除按钮
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 访问时间和描述
            Row.create({ space: 8 });
            // 访问时间和描述
            Row.width('100%');
            // 访问时间和描述
            Row.margin({ top: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatDate(item.visitedAt));
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('•');
            Text.fontSize(12);
            Text.fontColor('#ddd');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${item.visitDuration}秒`);
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        // 访问时间和描述
        Row.pop();
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
        return "BrowsingHistoryPage";
    }
}
registerNamedRoute(() => new BrowsingHistoryPage(undefined, {}), "", { bundleName: "com.github.trending", moduleName: "entry", pagePath: "pages/BrowsingHistoryPage", pageFullPath: "entry/src/main/ets/pages/BrowsingHistoryPage", integratedHsp: "false", moduleType: "followWithHap" });
