if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MyPage_Params {
    currentTab?: number;
    browseHistory?: Repository[];
    favorites?: Repository[];
    aboutDialogVisible?: boolean;
}
import type { Repository } from '../models/Repository';
import router from "@ohos:router";
// 本地存储键名
const BROWSE_HISTORY_KEY = 'browse_history';
const FAVORITES_KEY = 'favorites';
export class MyPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTab = new ObservedPropertySimplePU(0, this, "currentTab");
        this.__browseHistory = new ObservedPropertyObjectPU([], this, "browseHistory");
        this.__favorites = new ObservedPropertyObjectPU([], this, "favorites");
        this.__aboutDialogVisible = new ObservedPropertySimplePU(false, this, "aboutDialogVisible");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MyPage_Params) {
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.browseHistory !== undefined) {
            this.browseHistory = params.browseHistory;
        }
        if (params.favorites !== undefined) {
            this.favorites = params.favorites;
        }
        if (params.aboutDialogVisible !== undefined) {
            this.aboutDialogVisible = params.aboutDialogVisible;
        }
    }
    updateStateVars(params: MyPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
        this.__browseHistory.purgeDependencyOnElmtId(rmElmtId);
        this.__favorites.purgeDependencyOnElmtId(rmElmtId);
        this.__aboutDialogVisible.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTab.aboutToBeDeleted();
        this.__browseHistory.aboutToBeDeleted();
        this.__favorites.aboutToBeDeleted();
        this.__aboutDialogVisible.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTab: ObservedPropertySimplePU<number>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: number) {
        this.__currentTab.set(newValue);
    }
    private __browseHistory: ObservedPropertyObjectPU<Repository[]>;
    get browseHistory() {
        return this.__browseHistory.get();
    }
    set browseHistory(newValue: Repository[]) {
        this.__browseHistory.set(newValue);
    }
    private __favorites: ObservedPropertyObjectPU<Repository[]>;
    get favorites() {
        return this.__favorites.get();
    }
    set favorites(newValue: Repository[]) {
        this.__favorites.set(newValue);
    }
    private __aboutDialogVisible: ObservedPropertySimplePU<boolean>;
    get aboutDialogVisible() {
        return this.__aboutDialogVisible.get();
    }
    set aboutDialogVisible(newValue: boolean) {
        this.__aboutDialogVisible.set(newValue);
    }
    aboutToAppear() {
        this.loadLocalData();
    }
    // 加载本地存储的数据
    loadLocalData() {
        this.loadBrowseHistory();
        this.loadFavorites();
    }
    // 加载浏览历史
    loadBrowseHistory() {
        try {
            const historyData = AppStorage.Get<string>(BROWSE_HISTORY_KEY);
            if (historyData) {
                this.browseHistory = JSON.parse(historyData) as Repository[];
            }
        }
        catch (error) {
            console.error('MyPage', '加载浏览历史失败', error);
        }
    }
    // 加载收藏列表
    loadFavorites() {
        try {
            const favoritesData = AppStorage.Get<string>(FAVORITES_KEY);
            if (favoritesData) {
                this.favorites = JSON.parse(favoritesData) as Repository[];
            }
        }
        catch (error) {
            console.error('MyPage', '加载收藏列表失败', error);
        }
    }
    // 清空浏览历史
    clearBrowseHistory() {
        this.browseHistory = [];
        AppStorage.Set(BROWSE_HISTORY_KEY, '');
    }
    // 清空收藏
    clearFavorites() {
        this.favorites = [];
        AppStorage.Set(FAVORITES_KEY, '');
    }
    // 获取应用版本信息
    getAppVersion(): string {
        return '1.0.0';
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 20, right: 20, bottom: 60 });
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('我的');
            // 标题
            Text.fontSize(24);
            // 标题
            Text.fontWeight(FontWeight.Bold);
            // 标题
            Text.margin({ top: 20, bottom: 10 });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 内容区域
            if (this.currentTab === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    // 主页
                    this.HomePage.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 历史和收藏
                        Tabs.create({ barPosition: BarPosition.Start });
                        // 历史和收藏
                        Tabs.layoutWeight(1);
                        // 历史和收藏
                        Tabs.width('100%');
                    }, Tabs);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.BrowseHistoryTab.bind(this)();
                        });
                        TabContent.tabBar('浏览历史');
                    }, TabContent);
                    TabContent.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TabContent.create(() => {
                            this.FavoritesTab.bind(this)();
                        });
                        TabContent.tabBar('收藏');
                    }, TabContent);
                    TabContent.pop();
                    // 历史和收藏
                    Tabs.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    HomePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.layoutWeight(1);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能按钮
            Row.create({ space: 20 });
            // 功能按钮
            Row.width('100%');
            // 功能按钮
            Row.margin({ top: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('浏览历史');
            Button.backgroundColor('#409eff');
            Button.fontColor(Color.White);
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                this.currentTab = 1;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('收藏');
            Button.backgroundColor('#67c23a');
            Button.fontColor(Color.White);
            Button.width('45%');
            Button.height(50);
            Button.onClick(() => {
                this.currentTab = 1;
            });
        }, Button);
        Button.pop();
        // 功能按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 关于按钮
            Button.createWithLabel('关于');
            // 关于按钮
            Button.backgroundColor('#909399');
            // 关于按钮
            Button.fontColor(Color.White);
            // 关于按钮
            Button.width('100%');
            // 关于按钮
            Button.height(50);
            // 关于按钮
            Button.onClick(() => {
                this.aboutDialogVisible = true;
            });
        }, Button);
        // 关于按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 统计信息
            Column.create({ space: 10 });
            // 统计信息
            Column.width('100%');
            // 统计信息
            Column.padding(20);
            // 统计信息
            Column.backgroundColor(Color.White);
            // 统计信息
            Column.borderRadius(8);
            // 统计信息
            Column.margin({ top: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('统计信息');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 20 });
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`浏览历史: ${this.browseHistory.length}`);
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`收藏: ${this.favorites.length}`);
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
        // 统计信息
        Column.pop();
        Column.pop();
    }
    BrowseHistoryTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.width('100%');
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题和清空按钮
            Row.create({ space: 10 });
            // 标题和清空按钮
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('浏览历史');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.browseHistory.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('清空');
                        Button.backgroundColor('#f56c6c');
                        Button.fontColor(Color.White);
                        Button.fontSize(12);
                        Button.height(30);
                        Button.onClick(() => {
                            this.clearBrowseHistory();
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
        // 标题和清空按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 历史列表
            if (this.browseHistory.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无浏览历史');
                        Text.fontSize(14);
                        Text.fontColor('#999');
                        Text.margin({ top: 50 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 10 });
                        List.layoutWeight(1);
                        List.width('100%');
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
                                    this.RepositoryItem.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.browseHistory, forEachItemGenFunction, (item: Repository) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    FavoritesTab(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.width('100%');
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题和清空按钮
            Row.create({ space: 10 });
            // 标题和清空按钮
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收藏');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.favorites.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('清空');
                        Button.backgroundColor('#f56c6c');
                        Button.fontColor(Color.White);
                        Button.fontSize(12);
                        Button.height(30);
                        Button.onClick(() => {
                            this.clearFavorites();
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
        // 标题和清空按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 收藏列表
            if (this.favorites.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无收藏');
                        Text.fontSize(14);
                        Text.fontColor('#999');
                        Text.margin({ top: 50 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 10 });
                        List.layoutWeight(1);
                        List.width('100%');
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
                                    this.RepositoryItem.bind(this)(item);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.favorites, forEachItemGenFunction, (item: Repository) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    RepositoryItem(repo: Repository, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.padding(15);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            Column.onClick(() => {
                // 打开仓库详情页面
                router.pushUrl({
                    url: 'pages/ArticleDetailPage',
                    params: {
                        repository: repo
                    }
                }, (err: Error) => {
                    if (err) {
                        console.error('MyPage', '路由跳转失败', err);
                    }
                });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 仓库名称和作者
            Row.create({ space: 10 });
            // 仓库名称和作者
            Row.width('100%');
            // 仓库名称和作者
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(repo.name);
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(repo.owner.login || '');
            Text.fontSize(14);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        // 仓库名称和作者
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 描述
            if (repo.description) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(repo.description);
                        Text.fontSize(14);
                        Text.fontColor('#666');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.width('100%');
                        Text.textAlign(TextAlign.Start);
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
            Row.create({ space: 20 });
            // 统计信息
            Row.width('100%');
            // 统计信息
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 5 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777266, "type": 20000, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            Image.width(16);
            Image.height(16);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(repo.stars.toString());
            Text.fontSize(12);
            Text.fontColor('#666');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (repo.language) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 5 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777264, "type": 20000, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
                        Image.width(16);
                        Image.height(16);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(repo.language);
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
    // 关于对话框
    AboutDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.aboutDialogVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Panel.create(this.aboutDialogVisible);
                        Panel.mode(PanelMode.Half);
                        Panel.dragBar(true);
                        Panel.onChange((width: number, height: number, mode: PanelMode) => {
                            if (width === 0 || height === 0) {
                                this.aboutDialogVisible = false;
                            }
                        });
                    }, Panel);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 20 });
                        Column.width('100%');
                        Column.padding(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('关于应用');
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ top: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`GitHub趋势阅读器`);
                        Text.fontSize(16);
                        Text.fontColor('#333');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`版本: ${this.getAppVersion()}`);
                        Text.fontSize(14);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('一个简洁的GitHub趋势项目阅读应用');
                        Text.fontSize(14);
                        Text.fontColor('#666');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('关闭');
                        Button.fontSize(16);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor('#007AFF');
                        Button.width('100%');
                        Button.onClick(() => {
                            this.aboutDialogVisible = false;
                        });
                        Button.margin({ top: 20, bottom: 20 });
                    }, Button);
                    Button.pop();
                    Column.pop();
                    Panel.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
