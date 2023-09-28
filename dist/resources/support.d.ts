import { RpcResponse, ResourceName } from "./interfaces";
import { RpcError } from "..";
type OpType = "destroy" | "save";
export declare const outboundChanFor: (username: string, op: OpType, kind: ResourceName, uuid: string, id?: number) => string;
export declare const internalError: RpcError;
export declare const resolveOrReject: (res: Function, rej: Function) => (m: RpcResponse) => any;
export {};
