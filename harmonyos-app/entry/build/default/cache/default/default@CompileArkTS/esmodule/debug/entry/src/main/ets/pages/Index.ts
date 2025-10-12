if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    uiState?: TrendingUiState;
    viewModel?;
}
import { createTrendingViewModel, TrendingUiState } from "@bundle:com.github.trending/entry/ets/viewmodels/index";
import type { Repository } from '../models/Repository';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__uiState = new ObservedPropertyObjectPU(new TrendingUiState(), this, "uiState");
        this.viewModel = createTrendingViewModel();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.uiState !== undefined) {
            this.uiState = params.uiState;
        }
        if (params.viewModel !== undefined) {
            this.viewModel = params.viewModel;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__uiState.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__uiState.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __uiState: ObservedPropertyObjectPU<TrendingUiState>;
    get uiState() {
        return this.__uiState.get();
    }
    set uiState(newValue: TrendingUiState) {
        this.__uiState.set(newValue);
    }
    private viewModel;
    aboutToAppear() {
        // 监听ViewModel状态变化
        this.viewModel.addStateChangeListener((state: TrendingUiState) => {
            this.uiState.isLoading = state.isLoading;
            this.uiState.isRefreshing = state.isRefreshing;
            this.uiState.repositories = state.repositories.slice();
            this.uiState.error = state.error;
            this.uiState.openBrowserEvent = state.openBrowserEvent;
        });
    }
    aboutToDisappear() {
        // 清理资源
        this.viewModel.destroy();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.width('100%');
            Column.height('100%');
            Column.padding(20);
            Column.backgroundColor('#f5f5f5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('GitHub趋势仓库');
            // 标题
            Text.fontSize(30);
            // 标题
            Text.fontWeight(FontWeight.Bold);
            // 标题
            Text.margin({ top: 50 });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 加载状态
            if (this.uiState.isLoading) {
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
            else if (this.uiState.error) {
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
                        Text.create(this.uiState.error);
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
                            this.viewModel.retry();
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
                        Text.create(`共 ${this.uiState.repositories.length} 个仓库`);
                        Text.fontSize(14);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('刷新');
                        Button.backgroundColor(this.uiState.isRefreshing ? '#ccc' : '#67c23a');
                        Button.fontColor(Color.White);
                        Button.enabled(!this.uiState.isRefreshing);
                        Button.onClick(() => {
                            this.viewModel.onRefresh();
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
                        this.forEachUpdateFunction(elmtId, this.uiState.repositories, forEachItemGenFunction, (item: Repository) => item.id, false, false);
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
    RepositoryItem(repo: Repository, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.padding(15);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.shadow({ radius: 4, color: '#00000010', offsetX: 0, offsetY: 2 });
            Column.onClick(() => {
                this.viewModel.onRepositoryClick(repo);
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
            Image.create({ "id": 16777258, "type": 20000, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
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
                        Image.create({ "id": 16777257, "type": 20000, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
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
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.github.trending", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
