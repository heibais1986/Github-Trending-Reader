import { Obfuscation } from '@ohos/hvigor-arkts-compose';
import { AotCompileModeEnum } from '../../enum/aot-compile-mode-enum.js';
import { RuntimeOnlyObj } from './build-opt.js';
export type ModuleOhosConfig = {
    overrides?: Overrides;
};
export type HapOhosConfig = ModuleOhosConfig;
export type HspOhosConfig = ModuleOhosConfig;
export type HarOhosConfig = ModuleOhosConfig;
export type Overrides = {
    buildOption?: BuildOption;
};
export type BuildOption = {
    resOptions?: ResOptions;
    externalNativeOptions?: ExternalNativeOptions;
    sourceOption?: SourceOption;
    napiLibFilterOption?: NapiLibFilterOption;
    arkOptions?: ArkOptionsOpt;
    nativeLib?: NativeLib;
};
export type ResOptions = {
    [name: string]: [value: any];
};
export type ExternalNativeOptions = {
    path?: string;
    arguments?: string;
    abiFilters?: string[];
    cppFlags?: string;
    cFlags?: string;
    targets?: string[];
};
export type SourceOption = {
    workers?: string[];
};
export type NapiLibFilterOption = {
    excludes?: string[];
    pickFirsts?: string[];
    pickLasts?: string[];
    enableOverride?: boolean;
};
export type ArkOptionsOpt = {
    aotCompileMode?: AotCompileModeEnum;
    apPath?: string;
    hostPGO?: boolean;
    types?: string[];
    compilePluginFile?: string;
    obfuscation?: Obfuscation;
    buildProfileFields?: object;
    runtimeOnly?: RuntimeOnlyObj;
    transformLib?: string;
};
export type NativeLib = {
    packOptions?: PackOpt;
};
export type PackOpt = {
    buildAppSkipSignHap?: boolean;
};
