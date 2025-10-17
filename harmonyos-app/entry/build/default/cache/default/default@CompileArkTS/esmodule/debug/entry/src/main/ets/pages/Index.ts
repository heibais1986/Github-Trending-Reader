if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentTabIndex?: number;
    zReadPageViewModel?;
    zReadUiState?: TrendingUiState;
    gitHubPageViewModel?;
    gitHubUiState?: GitHubTrendingUiState;
    browsingHistoryCount?: number;
    favoritesCount?: number;
    appVersion?: string;
    browsingHistoryManager?;
    favoritesManager?;
}
import router from "@ohos:router";
import { createTrendingViewModel, TrendingUiState, createGitHubTrendingViewModel, GitHubTrendingUiState } from "@bundle:com.github.trending/entry/ets/viewmodels/index";
import { createBrowsingHistoryManager, createFavoritesManager } from "@bundle:com.github.trending/entry/ets/models/index";
import type { Repository } from "@bundle:com.github.trending/entry/ets/models/index";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
        this.zReadPageViewModel = createTrendingViewModel();
        this.__zReadUiState = new ObservedPropertyObjectPU(new TrendingUiState(), this, "zReadUiState");
        this.gitHubPageViewModel = createGitHubTrendingViewModel();
        this.__gitHubUiState = new ObservedPropertyObjectPU(new GitHubTrendingUiState(), this, "gitHubUiState");
        this.__browsingHistoryCount = new ObservedPropertySimplePU(0, this, "browsingHistoryCount");
        this.__favoritesCount = new ObservedPropertySimplePU(0, this, "favoritesCount");
        this.__appVersion = new ObservedPropertySimplePU('2.0.0', this, "appVersion");
        this.browsingHistoryManager = createBrowsingHistoryManager();
        this.favoritesManager = createFavoritesManager();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentTabIndex !== undefined) {
            this.currentTabIndex = params.currentTabIndex;
        }
        if (params.zReadPageViewModel !== undefined) {
            this.zReadPageViewModel = params.zReadPageViewModel;
        }
        if (params.zReadUiState !== undefined) {
            this.zReadUiState = params.zReadUiState;
        }
        if (params.gitHubPageViewModel !== undefined) {
            this.gitHubPageViewModel = params.gitHubPageViewModel;
        }
        if (params.gitHubUiState !== undefined) {
            this.gitHubUiState = params.gitHubUiState;
        }
        if (params.browsingHistoryCount !== undefined) {
            this.browsingHistoryCount = params.browsingHistoryCount;
        }
        if (params.favoritesCount !== undefined) {
            this.favoritesCount = params.favoritesCount;
        }
        if (params.appVersion !== undefined) {
            this.appVersion = params.appVersion;
        }
        if (params.browsingHistoryManager !== undefined) {
            this.browsingHistoryManager = params.browsingHistoryManager;
        }
        if (params.favoritesManager !== undefined) {
            this.favoritesManager = params.favoritesManager;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__zReadUiState.purgeDependencyOnElmtId(rmElmtId);
        this.__gitHubUiState.purgeDependencyOnElmtId(rmElmtId);
        this.__browsingHistoryCount.purgeDependencyOnElmtId(rmElmtId);
        this.__favoritesCount.purgeDependencyOnElmtId(rmElmtId);
        this.__appVersion.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTabIndex.aboutToBeDeleted();
        this.__zReadUiState.aboutToBeDeleted();
        this.__gitHubUiState.aboutToBeDeleted();
        this.__browsingHistoryCount.aboutToBeDeleted();
        this.__favoritesCount.aboutToBeDeleted();
        this.__appVersion.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTabIndex: ObservedPropertySimplePU<number>;
    get currentTabIndex() {
        return this.__currentTabIndex.get();
    }
    set currentTabIndex(newValue: number) {
        this.__currentTabIndex.set(newValue);
    }
    private zReadPageViewModel;
    private __zReadUiState: ObservedPropertyObjectPU<TrendingUiState>;
    get zReadUiState() {
        return this.__zReadUiState.get();
    }
    set zReadUiState(newValue: TrendingUiState) {
        this.__zReadUiState.set(newValue);
    }
    private gitHubPageViewModel;
    private __gitHubUiState: ObservedPropertyObjectPU<GitHubTrendingUiState>;
    get gitHubUiState() {
        return this.__gitHubUiState.get();
    }
    set gitHubUiState(newValue: GitHubTrendingUiState) {
        this.__gitHubUiState.set(newValue);
    }
    // "我的"页面的状态
    private __browsingHistoryCount: ObservedPropertySimplePU<number>;
    get browsingHistoryCount() {
        return this.__browsingHistoryCount.get();
    }
    set browsingHistoryCount(newValue: number) {
        this.__browsingHistoryCount.set(newValue);
    }
    private __favoritesCount: ObservedPropertySimplePU<number>;
    get favoritesCount() {
        return this.__favoritesCount.get();
    }
    set favoritesCount(newValue: number) {
        this.__favoritesCount.set(newValue);
    }
    private __appVersion: ObservedPropertySimplePU<string>;
    get appVersion() {
        return this.__appVersion.get();
    }
    set appVersion(newValue: string) {
        this.__appVersion.set(newValue);
    }
    // 数据管理器
    private browsingHistoryManager;
    private favoritesManager;
    aboutToAppear() {
        // 监听ZRead页面ViewModel状态变化
        this.zReadPageViewModel.addStateChangeListener((state: TrendingUiState) => {
            this.zReadUiState.isLoading = state.isLoading;
            this.zReadUiState.isRefreshing = state.isRefreshing;
            this.zReadUiState.repositories = state.repositories.slice();
            this.zReadUiState.error = state.error;
            this.zReadUiState.openBrowserEvent = state.openBrowserEvent;
            // 处理打开浏览器事件
            if (state.openBrowserEvent && state.openBrowserEvent.repository) {
                this.navigateToRepositoryDetail(state.openBrowserEvent.repository);
            }
        });
        // 监听GitHub页面ViewModel状态变化
        this.gitHubPageViewModel.addStateChangeListener((state: GitHubTrendingUiState) => {
            this.gitHubUiState.isLoading = state.isLoading;
            this.gitHubUiState.isRefreshing = state.isRefreshing;
            this.gitHubUiState.repositories = state.repositories.slice();
            this.gitHubUiState.error = state.error;
            this.gitHubUiState.openBrowserEvent = state.openBrowserEvent;
            // 处理打开浏览器事件
            if (state.openBrowserEvent && state.openBrowserEvent.repository) {
                this.navigateToRepositoryDetail(state.openBrowserEvent.repository);
            }
        });
        // 加载浏览历史和收藏数据
        this.loadUserData();
    }
    /**
     * 加载用户数据
     */
    private loadUserData() {
        try {
            this.browsingHistoryCount = this.browsingHistoryManager.getHistoryCount();
            this.favoritesCount = this.favoritesManager.getFavoritesCount();
            console.info('Index', '加载用户数据完成:', {
                browsingHistoryCount: this.browsingHistoryCount,
                favoritesCount: this.favoritesCount
            });
        }
        catch (error) {
            console.error('Index', '加载用户数据失败:', error);
        }
    }
    aboutToDisappear() {
        // 清理资源
        this.zReadPageViewModel.destroy();
        this.gitHubPageViewModel.destroy();
    }
    /**
     * 导航到仓库详情页面
     * @param url - 仓库URL
     */
    private navigateToRepositoryDetail(repository: Repository) {
        try {
            router.pushUrl({
                url: 'pages/WebViewPage',
                params: {
                    url: repository.htmlUrl || repository.url,
                    title: repository.name
                }
            });
        }
        catch (error) {
            console.error('Index', '导航到仓库详情页面失败:', error);
        }
    }
    ZReadTrendingContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 20, right: 20, bottom: 60 });
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('GitHub趋势仓库 (ZRead)');
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
            // 加载状态
            if (this.zReadUiState.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.margin({ top: 20 });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(16);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                });
            }
            // 错误状态
            else if (this.zReadUiState.error) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.padding(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载失败');
                        Text.fontSize(18);
                        Text.fontColor('#f56c6c');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.zReadUiState.error);
                        Text.fontSize(14);
                        Text.fontColor('#999');
                        Text.textAlign(TextAlign.Center);
                        Text.maxLines(3);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重试');
                        Button.backgroundColor('#409eff');
                        Button.fontColor(Color.White);
                        Button.onClick(() => {
                            this.zReadPageViewModel.retry();
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            // 数据展示
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 刷新控制
                        Row.create({ space: 10 });
                        // 刷新控制
                        Row.margin({ bottom: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`共 ${this.zReadUiState.repositories.length} 个仓库`);
                        Text.fontSize(14);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('刷新');
                        Button.backgroundColor(this.zReadUiState.isRefreshing ? '#ccc' : '#67c23a');
                        Button.fontColor(Color.White);
                        Button.enabled(!this.zReadUiState.isRefreshing);
                        Button.onClick(() => {
                            this.zReadPageViewModel.onRefresh();
                        });
                    }, Button);
                    Button.pop();
                    // 刷新控制
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 仓库列表
                        List.create({ space: 10 });
                        // 仓库列表
                        List.layoutWeight(1);
                        // 仓库列表
                        List.padding(10);
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
                        this.forEachUpdateFunction(elmtId, this.zReadUiState.repositories, forEachItemGenFunction, (item: Repository) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    // 仓库列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    GitHubTrendingContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.width('100%');
            Column.height('100%');
            Column.padding({ left: 20, right: 20, bottom: 60 });
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('GitHub趋势仓库');
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
            // 加载状态
            if (this.gitHubUiState.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.margin({ top: 20 });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(16);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                });
            }
            // 错误状态
            else if (this.gitHubUiState.error) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.padding(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载失败');
                        Text.fontSize(18);
                        Text.fontColor('#f56c6c');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.gitHubUiState.error);
                        Text.fontSize(14);
                        Text.fontColor('#999');
                        Text.textAlign(TextAlign.Center);
                        Text.maxLines(3);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重试');
                        Button.backgroundColor('#409eff');
                        Button.fontColor(Color.White);
                        Button.onClick(() => {
                            this.gitHubPageViewModel.retry();
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            // 数据展示
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 刷新控制
                        Row.create({ space: 10 });
                        // 刷新控制
                        Row.margin({ bottom: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`共 ${this.gitHubUiState.repositories.length} 个仓库`);
                        Text.fontSize(14);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('刷新');
                        Button.backgroundColor(this.gitHubUiState.isRefreshing ? '#ccc' : '#67c23a');
                        Button.fontColor(Color.White);
                        Button.enabled(!this.gitHubUiState.isRefreshing);
                        Button.onClick(() => {
                            this.gitHubPageViewModel.onRefresh();
                        });
                    }, Button);
                    Button.pop();
                    // 刷新控制
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 仓库列表
                        List.create({ space: 10 });
                        // 仓库列表
                        List.layoutWeight(1);
                        // 仓库列表
                        List.padding(10);
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
                        this.forEachUpdateFunction(elmtId, this.gitHubUiState.repositories, forEachItemGenFunction, (item: Repository) => item.id, false, false);
                    }, ForEach);
                    ForEach.pop();
                    // 仓库列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    MyPageContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5FAFB');
            Column.padding({ bottom: 60 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 页面标题
            Text.create('我的');
            // 页面标题
            Text.fontSize(24);
            // 页面标题
            Text.fontWeight(FontWeight.Bold);
            // 页面标题
            Text.fontColor('#333333');
            // 页面标题
            Text.margin({ top: 20, bottom: 10 });
            // 页面标题
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 页面标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能卡片列表
            Column.create({ space: 12 });
            // 功能卡片列表
            Column.padding({ left: 16, right: 16 });
            // 功能卡片列表
            Column.layoutWeight(1);
        }, Column);
        // 我的卡片
        this.MenuCard.bind(this)('👤', '我的', '管理你的浏览记录和收藏', () => {
            // 可以跳转到个人信息页面
        });
        // 浏览历史卡片
        this.MenuCard.bind(this)('🕐', '浏览历史', `${this.browsingHistoryCount} 个仓库`, () => {
            // 跳转到浏览历史页面
            try {
                router.pushUrl({
                    url: 'pages/BrowsingHistoryPage'
                });
            }
            catch (error) {
                console.error('Index', '跳转到浏览历史页面失败:', error);
            }
        });
        // 我的收藏卡片
        this.MenuCard.bind(this)('❤️', '我的收藏', `${this.favoritesCount} 个仓库`, () => {
            // 跳转到收藏页面
            try {
                router.pushUrl({
                    url: 'pages/FavoritesPage'
                });
            }
            catch (error) {
                console.error('Index', '跳转到收藏页面失败:', error);
            }
        });
        // 关于卡片
        this.MenuCard.bind(this)('ℹ️', '关于', `版本 ${this.appVersion}`, () => {
            // 可以跳转到关于页面
        });
        // 功能卡片列表
        Column.pop();
        Column.pop();
    }
    MenuCard(icon: string, title: string, subtitle: string, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.padding({ left: 16, right: 16 });
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius(12);
            Row.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.onClick(() => {
                onClick();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧图标
            Text.create(icon);
            // 左侧图标
            Text.fontSize(24);
            // 左侧图标
            Text.width(40);
            // 左侧图标
            Text.height(40);
            // 左侧图标
            Text.textAlign(TextAlign.Center);
        }, Text);
        // 左侧图标
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 中间标题和副标题
            Column.create({ space: 4 });
            // 中间标题和副标题
            Column.layoutWeight(1);
            // 中间标题和副标题
            Column.alignItems(HorizontalAlign.Start);
            // 中间标题和副标题
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(subtitle);
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        // 中间标题和副标题
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧箭头
            Text.create('>');
            // 右侧箭头
            Text.fontSize(16);
            // 右侧箭头
            Text.fontColor('#999999');
            // 右侧箭头
            Text.margin({ right: 8 });
        }, Text);
        // 右侧箭头
        Text.pop();
        Row.pop();
    }
    RepositoryItem(repo: Repository, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.padding(15);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            Column.onClick(() => {
                // 添加到浏览历史
                try {
                    this.browsingHistoryManager.addToHistory(repo);
                    // 强制更新计数，确保UI刷新
                    this.browsingHistoryCount = 0;
                    setTimeout(() => {
                        this.browsingHistoryCount = this.browsingHistoryManager.getHistoryCount();
                    }, 0);
                }
                catch (error) {
                    console.error('Index', '添加浏览历史失败:', error);
                }
                // 处理页面导航
                if (this.currentTabIndex === 0) {
                    this.zReadPageViewModel.onRepositoryClick(repo);
                }
                else if (this.currentTabIndex === 1) {
                    this.gitHubPageViewModel.onRepositoryClick(repo);
                }
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Tabs.create({ barPosition: BarPosition.End, index: this.currentTabIndex });
            // 内容区域
            Tabs.barHeight(50);
            // 内容区域
            Tabs.animationDuration(300);
            // 内容区域
            Tabs.onChange((index: number) => {
                this.currentTabIndex = index;
            });
            // 内容区域
            Tabs.backgroundColor('#f5f5f5');
            // 内容区域
            Tabs.layoutWeight(1);
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.ZReadTrendingContent.bind(this)();
            });
            TabContent.tabBar('ZRead');
            TabContent.backgroundColor('#f5f5f5');
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.GitHubTrendingContent.bind(this)();
            });
            TabContent.tabBar('GitHub');
            TabContent.backgroundColor('#f5f5f5');
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.MyPageContent.bind(this)();
            });
            TabContent.tabBar('我的');
            TabContent.backgroundColor('#f5f5f5');
        }, TabContent);
        TabContent.pop();
        // 内容区域
        Tabs.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.github.trending", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
