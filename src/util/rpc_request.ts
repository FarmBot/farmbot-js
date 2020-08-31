import { RpcRequestBodyItem } from "..";
import { uuid } from "./uuid";
import { RpcRequest } from "../corpus";

export enum Priority {
  HIGHEST = 9000,
  NORMAL = 600,
  LOWEST = 300,
}

export const rpcRequest =
  (body: RpcRequestBodyItem[], priority = Priority.NORMAL): RpcRequest => ({
    kind: "rpc_request",
    args: {
      label: uuid(),
      priority
    },
    body
  })
