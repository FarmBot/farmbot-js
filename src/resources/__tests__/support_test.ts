import { internalError, resolveOrReject } from "../support";
import { RpcError, RpcOk } from "../../corpus";
import { rejectRpc } from "../reject_rpc";

describe("resolveOrReject", () => {
  const resolve = jest.fn();
  const reject = jest.fn();

  const ok: RpcOk = { kind: "rpc_ok", args: { label: "OK" } };
  const no: RpcError = { kind: "rpc_error", args: { label: "NO" } };

  it("resolves", async () => {
    jest.clearAllMocks();
    const fn = resolveOrReject(resolve, reject);
    await fn(ok);
    expect(resolve).toHaveBeenCalled();
  });

  it("rejects", async () => {
    jest.clearAllMocks();
    const fn = resolveOrReject(resolve, reject);
    await fn(no);
    expect(reject).toHaveBeenCalled();
  });
});

describe("rejectRPC", () => {
  it("always rejects RPCs", () => {
    const x = (e: RpcError) => expect(e).toEqual(internalError);
    rejectRpc().catch(x);
  });
});
