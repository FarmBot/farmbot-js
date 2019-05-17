import { RpcRequestBodyItem, RpcRequest } from "..";
import { uuid } from "./uuid";

export function rpcRequest(body: RpcRequestBodyItem[], legacy = true): RpcRequest {
  const output: RpcRequest = {
    kind: "rpc_request",
    args: { label: uuid(), priority: 0 },
    body
  };

  if (legacy) {
    delete output.args.priority
  }

  return output;
}
