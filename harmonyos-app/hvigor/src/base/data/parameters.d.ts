import { CoreProperties, ParamValue } from '../internal/data/global-core-parameters.js';
export interface Parameter {
    getProperty(key: string): any | undefined;
    setProperty(key: string, value: any): void;
    getProperties(): Properties;
    getExtParam(key: string): string | undefined;
    getExtParams(): Record<string, string>;
    getStartParams(): StartParam;
    getWorkspaceDir(): string;
}
export interface ExternalStartParam {
    analyze: string | boolean;
    daemon: boolean;
    parallel: boolean;
    incremental: boolean;
    logLevel: string;
    typeCheck: boolean;
    hotCompile?: boolean;
    hotReloadBuild?: boolean;
}
export type Properties = Readonly<CoreProperties>;
export type StartParam = Readonly<ExternalStartParam>;
export declare class ExternalParameter implements Parameter {
    private logger;
    /**
     * hvigor-config-schema.json 中的 properties 字段 schema，只在 setProperty 中用来校验
     * 在第一次调用 setProperty 时才会赋值
     * @private
     */
    private propertiesSchema?;
    getExtParam(key: string): string | undefined;
    getExtParams(): Readonly<Record<string, string>>;
    getProperties(): Readonly<Record<string, ParamValue>>;
    getProperty(key: string): ParamValue;
    setProperty(key: string, value: any): void;
    private getCallerPath;
    getStartParams(): StartParam;
    getWorkspaceDir(): string;
}
