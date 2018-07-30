import { RpcRequestBodyItem, RpcRequest } from "..";
import { uuid } from "./uuid";

export function rpcRequest(body: RpcRequestBodyItem[]): RpcRequest {
  return {
    kind: "rpc_request",
    args: { label: uuid() },
    body
  };
}
