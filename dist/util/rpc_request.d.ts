import { RpcRequestBodyItem, RpcRequest } from "..";
export declare enum Priority {
    HIGHEST = 9000,
    NORMAL = 600,
    LOWEST = 300
}
export declare const rpcRequest: (body: RpcRequestBodyItem[], legacy: boolean, priority?: Priority) => RpcRequest;
