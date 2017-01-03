import * as Corpus from "./corpus";
import { Dictionary } from "./interfaces";
export declare function uuid(): string;
export declare function pick<T>(target: {
    [k: string]: T | undefined;
}, value: string, fallback: T): T;
export declare function assign(target: Dictionary<any>, ...others: Dictionary<any>[]): Dictionary<any>;
export declare function isCeleryScript(x: any): x is Corpus.CeleryNode;
export declare function coordinate(x: number, y: number, z: number): Corpus.Coordinate;
export declare function rpcRequest(): Corpus.RpcRequest;
