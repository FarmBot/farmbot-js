import { RpcRequestBodyItem, RpcRequest } from "..";
import { uuid } from "./uuid";

export enum Priority {
  HIGHEST = 9000,
  NORMAL = 600,
  LOWEST = 300,
}

export const rpcRequest =
  (body: RpcRequestBodyItem[], legacy: boolean, priority = Priority.NORMAL) => {
    const output: RpcRequest =
      { kind: "rpc_request", args: { label: uuid(), priority }, body };

    if (legacy) { delete output.args.priority }

    return output;
  }
