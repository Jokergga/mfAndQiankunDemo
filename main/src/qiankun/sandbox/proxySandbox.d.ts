/**
 * @author Kuitos
 * @since 2020-3-31
 */
import type { SandBox } from '../interfaces';
import { SandBoxType } from '../interfaces';
declare const globalVariableWhiteList: string[];
/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox implements SandBox {
    /** window 值变更记录 */
    private updatedValueSet;
    name: string;
    type: SandBoxType;
    proxy: WindowProxy;
    sandboxRunning: boolean;
    latestSetProp: PropertyKey | null;
    globalWhitelistPrevDescriptor: {
        [p in typeof globalVariableWhiteList[number]]: PropertyDescriptor | undefined;
    };
    active(): void;
    inactive(): void;
    globalContext: typeof window;
    constructor(name: string, globalContext?: Window & typeof globalThis);
    private registerRunningApp;
}
export {};
