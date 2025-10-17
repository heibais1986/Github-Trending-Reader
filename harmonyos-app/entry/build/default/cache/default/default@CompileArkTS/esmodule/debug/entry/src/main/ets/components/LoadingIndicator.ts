if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoadingIndicator_Params {
    type?: LoadingType;
    indicatorSize?: LoadingSize;
    message?: string;
    color?: ResourceColor;
    bgColor?: ResourceColor;
    showMessage?: boolean;
}
/**
 * Enhanced loading indicator component with different styles and animations
 */
/**
 * Loading indicator type enumeration
 */
export enum LoadingType {
    SPINNER = "SPINNER",
    DOTS = "DOTS",
    PULSE = "PULSE",
    SKELETON = "SKELETON"
}
/**
 * Loading indicator size enumeration
 */
export enum LoadingSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE"
}
/**
 * Loading indicator size dimensions interface
 */
export interface LoadingDimensions {
    width: number;
    height: number;
    fontSize: number;
}
/**
 * Loading indicator component properties
 */
export interface LoadingIndicatorProps {
    type?: LoadingType;
    size?: LoadingSize;
    message?: string;
    color?: ResourceColor;
    backgroundColor?: ResourceColor;
    showMessage?: boolean;
}
export class LoadingIndicator extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__type = new SynchedPropertySimpleOneWayPU(params.type, this, "type");
        this.__indicatorSize = new SynchedPropertySimpleOneWayPU(params.indicatorSize, this, "indicatorSize");
        this.__message = new SynchedPropertySimpleOneWayPU(params.message, this, "message");
        this.__color = new SynchedPropertyObjectOneWayPU(params.color, this, "color");
        this.__bgColor = new SynchedPropertyObjectOneWayPU(params.bgColor, this, "bgColor");
        this.__showMessage = new SynchedPropertySimpleOneWayPU(params.showMessage, this, "showMessage");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoadingIndicator_Params) {
        if (params.type === undefined) {
            this.__type.set(LoadingType.SPINNER);
        }
        if (params.indicatorSize === undefined) {
            this.__indicatorSize.set(LoadingSize.MEDIUM);
        }
        if (params.message === undefined) {
            this.__message.set('正在加载...');
        }
        if (params.color === undefined) {
            this.__color.set({ "id": 16777253, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
        }
        if (params.bgColor === undefined) {
            this.__bgColor.set(Color.Transparent);
        }
        if (params.showMessage === undefined) {
            this.__showMessage.set(true);
        }
    }
    updateStateVars(params: LoadingIndicator_Params) {
        this.__type.reset(params.type);
        this.__indicatorSize.reset(params.indicatorSize);
        this.__message.reset(params.message);
        this.__color.reset(params.color);
        this.__bgColor.reset(params.bgColor);
        this.__showMessage.reset(params.showMessage);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__type.purgeDependencyOnElmtId(rmElmtId);
        this.__indicatorSize.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__color.purgeDependencyOnElmtId(rmElmtId);
        this.__bgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__showMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__type.aboutToBeDeleted();
        this.__indicatorSize.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__color.aboutToBeDeleted();
        this.__bgColor.aboutToBeDeleted();
        this.__showMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __type: SynchedPropertySimpleOneWayPU<LoadingType>;
    get type() {
        return this.__type.get();
    }
    set type(newValue: LoadingType) {
        this.__type.set(newValue);
    }
    private __indicatorSize: SynchedPropertySimpleOneWayPU<LoadingSize>;
    get indicatorSize() {
        return this.__indicatorSize.get();
    }
    set indicatorSize(newValue: LoadingSize) {
        this.__indicatorSize.set(newValue);
    }
    private __message: SynchedPropertySimpleOneWayPU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __color: SynchedPropertySimpleOneWayPU<ResourceColor>;
    get color() {
        return this.__color.get();
    }
    set color(newValue: ResourceColor) {
        this.__color.set(newValue);
    }
    private __bgColor: SynchedPropertySimpleOneWayPU<ResourceColor>;
    get bgColor() {
        return this.__bgColor.get();
    }
    set bgColor(newValue: ResourceColor) {
        this.__bgColor.set(newValue);
    }
    private __showMessage: SynchedPropertySimpleOneWayPU<boolean>;
    get showMessage() {
        return this.__showMessage.get();
    }
    set showMessage(newValue: boolean) {
        this.__showMessage.set(newValue);
    }
    /**
     * Get size dimensions based on size prop
     */
    private getSizeDimensions(): LoadingDimensions {
        switch (this.indicatorSize) {
            case LoadingSize.SMALL:
                return { width: 24, height: 24, fontSize: 12 };
            case LoadingSize.LARGE:
                return { width: 60, height: 60, fontSize: 18 };
            default:
                return { width: 40, height: 40, fontSize: 16 };
        }
    }
    /**
     * Build spinner loading indicator
     */
    buildSpinner(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            LoadingProgress.create();
            LoadingProgress.width(40);
            LoadingProgress.height(40);
            LoadingProgress.color(ObservedObject.GetRawObject(this.color));
        }, LoadingProgress);
    }
    /**
     * Build dots loading indicator
     */
    buildDots(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const index = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Context.animation({
                        duration: 600,
                        delay: index * 200,
                        iterations: -1,
                        playMode: PlayMode.Alternate
                    });
                    Circle.width(8);
                    Circle.height(8);
                    Circle.fill(ObservedObject.GetRawObject(this.color));
                    Context.animation(null);
                }, Circle);
            };
            this.forEachUpdateFunction(elmtId, [0, 1, 2], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    /**
     * Build pulse loading indicator
     */
    buildPulse(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Context.animation({
                duration: 1000,
                iterations: -1,
                playMode: PlayMode.Alternate
            });
            Circle.width(40);
            Circle.height(40);
            Circle.fill(ObservedObject.GetRawObject(this.color));
            Context.animation(null);
        }, Circle);
    }
    /**
     * Build skeleton loading indicator
     */
    buildSkeleton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.padding(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Title skeleton
            Row.create();
            Context.animation({
                duration: 1500,
                iterations: -1,
                playMode: PlayMode.Alternate
            });
            // Title skeleton
            Row.width('80%');
            // Title skeleton
            Row.height(16);
            // Title skeleton
            Row.backgroundColor({ "id": 16777254, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
            // Title skeleton
            Row.borderRadius(4);
            Context.animation(null);
        }, Row);
        // Title skeleton
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Content skeleton lines
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const index = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Context.animation({
                        duration: 1500,
                        delay: index * 100,
                        iterations: -1,
                        playMode: PlayMode.Alternate
                    });
                    Row.width(index === 2 ? '60%' : '100%');
                    Row.height(12);
                    Row.backgroundColor({ "id": 16777254, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
                    Row.borderRadius(4);
                    Context.animation(null);
                }, Row);
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, [0, 1, 2], forEachItemGenFunction);
        }, ForEach);
        // Content skeleton lines
        ForEach.pop();
        Column.pop();
    }
    /**
     * Build loading content based on type
     */
    buildLoadingContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.type === LoadingType.DOTS) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildDots.bind(this)();
                });
            }
            else if (this.type === LoadingType.PULSE) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildPulse.bind(this)();
                });
            }
            else if (this.type === LoadingType.SKELETON) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.buildSkeleton.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.buildSpinner.bind(this)();
                });
            }
        }, If);
        If.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor(ObservedObject.GetRawObject(this.bgColor));
            Column.padding(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.type !== LoadingType.SKELETON) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildLoadingContent.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showMessage && this.message) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.message);
                                    Text.fontSize(this.getSizeDimensions().fontSize);
                                    Text.fontColor({ "id": 16777258, "type": 10001, params: [], "bundleName": "com.github.trending", "moduleName": "entry" });
                                    Text.margin({ top: 16 });
                                    Text.textAlign(TextAlign.Center);
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildLoadingContent.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
