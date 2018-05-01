import * as Corpus from "./corpus";
export declare function uuid(): string;
export declare function pick<T>(target: any, value: string, fallback: T): any;
export declare function isCeleryScript(x: any): x is Corpus.CeleryNode;
export declare function coordinate(x: number, y: number, z: number): Corpus.Coordinate;
export declare function rpcRequest(body: Corpus.RpcRequestBodyItem[]): Corpus.RpcRequest;
export declare function isNode(): boolean;
