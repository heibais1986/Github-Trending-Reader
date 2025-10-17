if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ArticleDetailPage_Params {
    url?: string;
    title?: string;
    loading?: boolean;
    error?: string | null;
    webviewController?: webview.WebviewController;
    context?: common.UIAbilityContext;
}
import webview from "@ohos:web.webview";
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import { LoadingIndicator, LoadingType, LoadingSize } from "@bundle:com.github.trending/entry/ets/components/LoadingIndicator";
import { FeedbackUtils } from "@bundle:com.github.trending/entry/ets/utils/FeedbackManager";
class ArticleDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__url = new ObservedPropertySimplePU('', this, "url");
        this.__title = new ObservedPropertySimplePU('文章详情', this, "title");
        this.__loading = new ObservedPropertySimplePU(true, this, "loading");
        this.__error = new ObservedPropertyObjectPU(null, this, "error");
        this.webviewController = new webview.WebviewController();
        this.context = getContext(this) as common.UIAbilityContext;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ArticleDetailPage_Params) {
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
        if (params.webviewController !== undefined) {
            this.webviewController = params.webviewController;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
    }
    updateStateVars(params: ArticleDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__url.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__loading.purgeDependencyOnElmtId(rmElmtId);
        this.__error.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__url.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__loading.aboutToBeDeleted();
        this.__error.aboutToBeDeleted();
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
    private webviewController: webview.WebviewController;
    private context: common.UIAbilityContext;
    aboutToAppear() {
        // Get URL and title from router parameters
        const routerParams: Object | undefined = router.getParams();
        if (routerParams) {
            const params = routerParams as Object;
            this.url = (params as Record<string, string>)['url'] || '';
            this.title = (params as Record<string, string>)['title'] || '文章详情';
        }
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
        // Inject JavaScript to extract only the article content
        const jsCode = `
      (function() {
        // Try to find the article content
        const article = document.querySelector('article') || 
                      document.querySelector('.article-content') || 
                      document.querySelector('.post-content') ||
                      document.querySelector('.content');
        
        if (article) {
          // Hide all other elements
          const body = document.body;
          const children = Array.from(body.children);
          children.forEach(child => {
            if (child !== article) {
              child.style.display = 'none';
            }
          });
          
          // Style the article for better reading
          article.style.maxWidth = '100%';
          article.style.padding = '16px';
          article.style.margin = '0 auto';
        }
      })();
    `;
        this.webviewController.runJavaScript(jsCode);
    }
    /**
     * Handle page error
     */
    private onErrorReceived(errorInfo: Object) {
        this.loading = false;
        this.error = '加载文章时发生错误';
        console.error('Article detail error:', errorInfo);
        FeedbackUtils.showError('文章加载失败');
    }
    /**
     * Close article detail and go back
     */
    private close() {
        router.back();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777231, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header with title and close button
            Row.create();
            // Header with title and close button
            Row.width('100%');
            // Header with title and close button
            Row.height(56);
            // Header with title and close button
            Row.padding({ left: 16, right: 16 });
            // Header with title and close button
            Row.backgroundColor({ "id": 16777232, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Header with title and close button
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
                this.close();
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
        // Header with title and close button
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
            // Article content
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Article content
            Stack.create();
            // Article content
            Stack.layoutWeight(1);
            // Article content
            Stack.width('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // WebView component for article content
            Web.create({
                controller: this.webviewController,
                src: this.url
            });
            // WebView component for article content
            Web.onPageBegin((event) => {
                this.onPageStart();
            });
            // WebView component for article content
            Web.onPageEnd((event) => {
                this.onPageFinish();
            });
            // WebView component for article content
            Web.onErrorReceive((event) => {
                this.onErrorReceived(ObservedObject.GetRawObject(event.error));
            });
            // WebView component for article content
            Web.layoutWeight(1);
            // WebView component for article content
            Web.width('100%');
            // WebView component for article content
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
                                    message: '正在加载文章...',
                                    showMessage: true
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ArticleDetailPage.ets", line: 171, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        type: LoadingType.SPINNER,
                                        indicatorSize: LoadingSize.LARGE,
                                        message: '正在加载文章...',
                                        showMessage: true
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    type: LoadingType.SPINNER,
                                    indicatorSize: LoadingSize.LARGE,
                                    message: '正在加载文章...',
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
                            this.webviewController.refresh();
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
        // Article content
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ArticleDetailPage";
    }
}
registerNamedRoute(() => new ArticleDetailPage(undefined, {}), "", { bundleName: "com.github.trending", moduleName: "entry", pagePath: "pages/ArticleDetailPage", pageFullPath: "entry/src/main/ets/pages/ArticleDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
