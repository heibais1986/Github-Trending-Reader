if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WebViewPage_Params {
    url?: string;
    title?: string;
    loading?: boolean;
    error?: string | null;
    isFavorited?: boolean;
    repository?: Repository | null;
    retryCount?: number;
    maxRetries?: number;
    webviewController?: webview.WebviewController;
    context?: common.UIAbilityContext;
    favoritesManager?;
}
import webview from "@ohos:web.webview";
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import { LoadingIndicator, LoadingType, LoadingSize } from "@bundle:com.github.trending/entry/ets/components/LoadingIndicator";
import { FeedbackUtils } from "@bundle:com.github.trending/entry/ets/utils/FeedbackManager";
import { createFavoritesManager, createRepository, createRepositoryOwner } from "@bundle:com.github.trending/entry/ets/models/index";
import type { Repository } from "@bundle:com.github.trending/entry/ets/models/index";
class WebViewPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__url = new ObservedPropertySimplePU('', this, "url");
        this.__title = new ObservedPropertySimplePU('网页浏览', this, "title");
        this.__loading = new ObservedPropertySimplePU(true, this, "loading");
        this.__error = new ObservedPropertyObjectPU(null, this, "error");
        this.__isFavorited = new ObservedPropertySimplePU(false, this, "isFavorited");
        this.__repository = new ObservedPropertyObjectPU(null, this, "repository");
        this.__retryCount = new ObservedPropertySimplePU(0, this, "retryCount");
        this.maxRetries = 2;
        this.webviewController = new webview.WebviewController();
        this.context = getContext(this) as common.UIAbilityContext;
        this.favoritesManager = createFavoritesManager();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WebViewPage_Params) {
        if (params.url !== undefined) {
            this.url = params.url;
        }
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.loading !== undefined) {
            this.loading = params.loading;
        }
        if (params.error !== undefined) {
            this.error = params.error;
        }
        if (params.isFavorited !== undefined) {
            this.isFavorited = params.isFavorited;
        }
        if (params.repository !== undefined) {
            this.repository = params.repository;
        }
        if (params.retryCount !== undefined) {
            this.retryCount = params.retryCount;
        }
        if (params.maxRetries !== undefined) {
            this.maxRetries = params.maxRetries;
        }
        if (params.webviewController !== undefined) {
            this.webviewController = params.webviewController;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.favoritesManager !== undefined) {
            this.favoritesManager = params.favoritesManager;
        }
    }
    updateStateVars(params: WebViewPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__url.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__error.purgeDependencyOnElmtId(rmElmtId);
        this.__isFavorited.purgeDependencyOnElmtId(rmElmtId);
        this.__repository.purgeDependencyOnElmtId(rmElmtId);
        this.__retryCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__url.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__error.aboutToBeDeleted();
        this.__isFavorited.aboutToBeDeleted();
        this.__repository.aboutToBeDeleted();
        this.__retryCount.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __url: ObservedPropertySimplePU<string>;
    get url() {
        return this.__url.get();
    }
    set url(newValue: string) {
        this.__url.set(newValue);
    }
    private __title: ObservedPropertySimplePU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __loading: ObservedPropertySimplePU<boolean>;
    get loading() {
        return this.__loading.get();
    }
    set loading(newValue: boolean) {
        this.__loading.set(newValue);
    }
    private __error: ObservedPropertyObjectPU<string | null>;
    get error() {
        return this.__error.get();
    }
    set error(newValue: string | null) {
        this.__error.set(newValue);
    }
    private __isFavorited: ObservedPropertySimplePU<boolean>;
    get isFavorited() {
        return this.__isFavorited.get();
    }
    set isFavorited(newValue: boolean) {
        this.__isFavorited.set(newValue);
    }
    private __repository: ObservedPropertyObjectPU<Repository | null>;
    get repository() {
        return this.__repository.get();
    }
    set repository(newValue: Repository | null) {
        this.__repository.set(newValue);
    }
    private __retryCount: ObservedPropertySimplePU<number>;
    get retryCount() {
        return this.__retryCount.get();
    }
    set retryCount(newValue: number) {
        this.__retryCount.set(newValue);
    }
    private maxRetries: number;
    private webviewController: webview.WebviewController;
    private context: common.UIAbilityContext;
    private favoritesManager;
    aboutToAppear() {
        // Get URL and title from router parameters
        const routerParams: Object | undefined = router.getParams();
        if (routerParams) {
            const params = routerParams as Object;
            this.url = (params as Record<string, string>)['url'] || '';
            this.title = (params as Record<string, string>)['title'] || '网页浏览';
        }
        // 重置状态
        this.loading = true;
        this.error = null;
        this.retryCount = 0;
        // 初始化仓库对象和收藏状态
        this.repository = this.createRepositoryFromUrl(this.url, this.title);
        this.checkFavoriteStatus();
    }
    /**
     * Handle page start loading
     */
    private onPageStart() {
        this.loading = true;
        this.error = null;
    }
    /**
     * Handle page finish loading
     */
    private onPageFinish() {
        this.loading = false;
    }
    /**
     * Handle page error
     */
    private onErrorReceived(errorInfo: Object) {
        this.loading = false;
        // 检查是否是网络超时错误
        const error = errorInfo as Record<string, Object>;
        const errorCode = error.errorCode || 0;
        if (errorCode === -7) { // ERR_TIMED_OUT
            this.error = '网页加载超时，请检查网络连接';
        }
        else {
            this.error = '加载网页时发生错误';
        }
        console.error('WebView error:', errorInfo);
        // 根据错误类型显示不同的提示
        if (errorCode === -7) { // ERR_TIMED_OUT
            FeedbackUtils.showError('网页加载超时，请检查网络连接');
        }
        else {
            FeedbackUtils.showError('网页加载失败');
        }
    }
    /**
     * Handle navigation back
     */
    private goBack() {
        if (this.webviewController) {
            this.webviewController.backward();
        }
    }
    /**
     * Handle navigation forward
     */
    private goForward() {
        if (this.webviewController) {
            this.webviewController.forward();
        }
    }
    /**
     * Reload current page
     */
    private reload() {
        if (this.webviewController) {
            this.loading = true;
            this.error = null;
            this.retryCount = 0; // 重置重试计数
            this.webviewController.refresh();
        }
    }
    /**
     * Close webview and go back
     */
    private close() {
        this.retryCount = 0; // 重置重试计数
        router.back();
    }
    /**
     * Toggle favorite status
     */
    private toggleFavorite() {
        if (!this.repository) {
            // 如果没有仓库信息，尝试从URL创建一个简单的仓库对象
            this.repository = this.createRepositoryFromUrl(this.url, this.title);
        }
        if (this.repository) {
            if (this.isFavorited) {
                // 取消收藏
                const success = this.favoritesManager.removeFromFavorites(this.repository.id);
                if (success) {
                    this.isFavorited = false;
                    FeedbackUtils.showSuccess('已取消收藏');
                }
            }
            else {
                // 添加收藏
                const success = this.favoritesManager.addToFavorites(this.repository);
                if (success) {
                    this.isFavorited = true;
                    FeedbackUtils.showSuccess('已添加到收藏');
                }
            }
        }
    }
    /**
     * Check if current repository is favorited
     */
    private checkFavoriteStatus() {
        if (this.repository) {
            this.isFavorited = this.favoritesManager.isFavorited(this.repository.id);
        }
    }
    /**
     * Create repository from URL
     */
    private createRepositoryFromUrl(url: string, title: string): Repository | null {
        try {
            // 尝试从URL解析GitHub仓库信息
            const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (githubMatch) {
                const owner = githubMatch[1];
                const name = githubMatch[2];
                return createRepository({
                    id: `repo_${owner}_${name}`,
                    name: name,
                    fullName: `${owner}/${name}`,
                    description: title,
                    owner: createRepositoryOwner({
                        login: owner,
                        avatarUrl: ''
                    }),
                    url: url,
                    stars: 0,
                    language: ''
                });
            }
            // 如果不是GitHub仓库，创建一个通用的仓库对象
            return createRepository({
                id: `repo_${Date.now()}`,
                name: title || 'Unknown',
                fullName: title || 'Unknown',
                description: title,
                owner: createRepositoryOwner({
                    login: 'Unknown',
                    avatarUrl: ''
                }),
                url: url,
                stars: 0,
                language: ''
            });
        }
        catch (error) {
            console.error('WebViewPage', '创建仓库对象失败:', error);
            return null;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header with navigation controls
            Row.create();
            // Header with navigation controls
            Row.width('100%');
            // Header with navigation controls
            Row.height(56);
            // Header with navigation controls
            Row.padding({ left: 16, right: 16 });
            // Header with navigation controls
            Row.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Header with navigation controls
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Back button
            Button.createWithLabel('←');
            // Back button
            Button.fontSize(16);
            // Back button
            Button.fontColor({ "id": 16777257, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Back button
            Button.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Back button
            Button.borderRadius(8);
            // Back button
            Button.width(40);
            // Back button
            Button.height(40);
            // Back button
            Button.margin({ right: 8 });
            // Back button
            Button.onClick(() => {
                if (this.webviewController && this.webviewController.accessBackward()) {
                    this.webviewController.backward();
                }
                else {
                    this.close();
                }
            });
        }, Button);
        // Back button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Title
            Text.create(this.title);
            // Title
            Text.fontSize(16);
            // Title
            Text.fontWeight(FontWeight.Medium);
            // Title
            Text.fontColor({ "id": 16777257, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Title
            Text.layoutWeight(1);
            // Title
            Text.maxLines(1);
            // Title
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        // Title
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Favorite button
            Button.createWithLabel(this.isFavorited ? '❤️' : '🤍');
            // Favorite button
            Button.fontSize(16);
            // Favorite button
            Button.fontColor(this.isFavorited ? '#ff4757' : { "id": 16777257, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Favorite button
            Button.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Favorite button
            Button.borderRadius(8);
            // Favorite button
            Button.width(40);
            // Favorite button
            Button.height(40);
            // Favorite button
            Button.margin({ right: 8 });
            // Favorite button
            Button.onClick(() => {
                this.toggleFavorite();
            });
        }, Button);
        // Favorite button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Reload button
            Button.createWithLabel('↻');
            // Reload button
            Button.fontSize(16);
            // Reload button
            Button.fontColor({ "id": 16777257, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Reload button
            Button.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Reload button
            Button.borderRadius(8);
            // Reload button
            Button.width(40);
            // Reload button
            Button.height(40);
            // Reload button
            Button.margin({ right: 8 });
            // Reload button
            Button.onClick(() => {
                this.reload();
            });
        }, Button);
        // Reload button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Close button
            Button.createWithLabel('✕');
            // Close button
            Button.fontSize(16);
            // Close button
            Button.fontColor({ "id": 16777257, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Close button
            Button.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Close button
            Button.borderRadius(8);
            // Close button
            Button.width(40);
            // Close button
            Button.height(40);
            // Close button
            Button.onClick(() => {
                this.close();
            });
        }, Button);
        // Close button
        Button.pop();
        // Header with navigation controls
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Progress bar when loading
            if (this.loading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.color({ "id": 16777253, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
                        Divider.strokeWidth(2);
                        Divider.width('30%');
                        Divider.alignSelf(ItemAlign.Start);
                    }, Divider);
                });
            }
            // WebView content
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // WebView content
            Stack.create();
            // WebView content
            Stack.layoutWeight(1);
            // WebView content
            Stack.width('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // WebView component
            Web.create({
                controller: this.webviewController,
                src: this.url
            });
            // WebView component
            Web.onPageBegin((event) => {
                this.onPageStart();
            });
            // WebView component
            Web.onPageEnd((event) => {
                this.onPageFinish();
            });
            // WebView component
            Web.onErrorReceive((event) => {
                this.onErrorReceived(ObservedObject.GetRawObject(event.error));
            });
            // WebView component
            Web.layoutWeight(1);
            // WebView component
            Web.width('100%');
            // WebView component
            Web.height('100%');
        }, Web);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Loading indicator
            if (this.loading && !this.error) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor('#FFFFFF');
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoadingIndicator(this, {
                                    type: LoadingType.SPINNER,
                                    indicatorSize: LoadingSize.LARGE,
                                    message: '正在加载网页...',
                                    showMessage: true
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/WebViewPage.ets", line: 315, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        type: LoadingType.SPINNER,
                                        indicatorSize: LoadingSize.LARGE,
                                        message: '正在加载网页...',
                                        showMessage: true
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    type: LoadingType.SPINNER,
                                    indicatorSize: LoadingSize.LARGE,
                                    message: '正在加载网页...',
                                    showMessage: true
                                });
                            }
                        }, { name: "LoadingIndicator" });
                    }
                    Column.pop();
                });
            }
            // Error view
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Error view
            if (this.error) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor('#FFFFFF');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.error);
                        Text.fontSize(14);
                        Text.fontColor({ "id": 16777234, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
                        Text.textAlign(TextAlign.Center);
                        Text.padding(24);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('重新加载');
                        Button.fontSize(14);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": 16777253, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
                        Button.borderRadius(8);
                        Button.padding({ left: 24, right: 24, top: 12, bottom: 12 });
                        Button.onClick(() => {
                            this.reload();
                        });
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // WebView content
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WebViewPage";
    }
}
registerNamedRoute(() => new WebViewPage(undefined, {}), "", { bundleName: "com.github.trending", moduleName: "entry", pagePath: "pages/WebViewPage", pageFullPath: "entry/src/main/ets/pages/WebViewPage", integratedHsp: "false", moduleType: "followWithHap" });
