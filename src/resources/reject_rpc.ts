import { internalError } from "./support";
import { RpcError } from "../corpus";

export const rejectRpc = (): Promise<RpcError> => Promise.reject(internalError);
