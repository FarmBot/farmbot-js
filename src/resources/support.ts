import { RpcResponse, ResourceName } from "./interfaces";
import { RpcError } from "..";

type OpType = "destroy" | "save";

export const outboundChanFor =
  (username: string, op: OpType, kind: ResourceName, uuid: string, id = 0): string => {
    const segments = [`bot`, username, `resources_v0`, op, kind, uuid, id];
    return segments.join("/");
  };

// Auto-reject if client is not connected yet.
export const internalError: RpcError = {
  kind: "rpc_error",
  args: { label: "BROWSER_LEVEL_FAILURE" },
  body: [
    {
      kind: "explanation",
      args: { message: "Tried to perform batch operation before connect." }
    }
  ]
};

export const resolveOrReject = (res: Function, rej: Function) => {
  return (m: RpcResponse) => (m.kind == "rpc_ok" ? res : rej)(m);
}
