import * as FB from "./interfaces";
export declare function uuid(): string;
export declare function pick<T>(target: {
    [k: string]: T | undefined;
}, value: string, fallback: T): T;
export declare function assign(target: FB.Dictionary<any>, ...others: FB.Dictionary<any>[]): FB.Dictionary<any>;
