import { RpcRequestBodyItem } from "..";
import { RpcRequest } from "../corpus";
export declare enum Priority {
    HIGHEST = 9000,
    NORMAL = 600,
    LOWEST = 300
}
export declare const rpcRequest: (body: RpcRequestBodyItem[], priority?: Priority) => RpcRequest;
