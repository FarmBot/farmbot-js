import * as FB from "./interfaces";
import * as Corpus from "./corpus";
export declare function uuid(): string;
export declare function pick<T>(target: {
    [k: string]: T | undefined;
}, value: string, fallback: T): T;
export declare function assign(target: FB.Dictionary<any>, ...others: FB.Dictionary<any>[]): FB.Dictionary<any>;
export declare function isCeleryScript(x: any): x is Corpus.CeleryNode;
