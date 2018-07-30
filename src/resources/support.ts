import { BatchDestroyRequest } from "./interfaces";
import { RpcError } from "..";

export const outboundChanFor =
  (username: string, req: BatchDestroyRequest, uuid_: string): string => [
    `bot`,
    username,
    `resources_v0`,
    `destroy`,
    `${req.name}`,
    `${req.id}`,
    `${uuid_}`,
  ].join("/");

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
