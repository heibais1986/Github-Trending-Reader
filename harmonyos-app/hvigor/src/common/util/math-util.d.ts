/**
 * 生成唯一的id
 *
 * @since 2022/8/12
 */
export declare function generateId(): string;
export declare function getModuleIndex(modulePath: string, isWidget?: boolean): number;
export declare function getWorkerIdWithModule(modulePath: string, isWidget?: boolean): number | undefined;
export declare function setWorkerIdWithModule(modulePath: string, workerId: number, isWidget?: boolean): void;
