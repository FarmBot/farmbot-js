const mockUuid = "123-456";

jest.mock("../../util/uuid", () => ({ uuid: () => mockUuid }));
jest.mock("../reject_rpc", () => ({
  rejectRpc: jest.fn(() => Promise.reject({
    kind: "rpc_error",
    args: { label: "BROWSER_LEVEL_FAILURE" },
    body: [
      {
        kind: "explanation",
        args: { message: "Tried to perform batch operation before connect." }
      }
    ]
  }))
}));

import { fakeFarmbotLike } from "../../test_support";
import { ResourceAdapter } from "../resource_adapter";
import { DeletionRequest } from "../interfaces";
import { outboundChanFor } from "../support";
import { rejectRpc } from "../reject_rpc";

describe("resourceAdapter", () => {
  const username = "device_87";

  it("destroys all", () => {
    const fakeFb = fakeFarmbotLike();
    const ra = new ResourceAdapter(fakeFb, username);
    const requests: DeletionRequest[] =
      [{ kind: "Point", id: 4 }, { kind: "Sequence", id: 4 }];
    ra.destroyAll(requests).then(() => { }, () => { });
    requests.map((req) => {
      const { client } = fakeFb;
      const expectedArgs = [outboundChanFor(username, "destroy", req.kind, mockUuid, req.id), ""];
      expect(client && client.publish).toHaveBeenCalledWith(...expectedArgs);
    });
  });

  it("handles a missing `client`", () => {
    const fakeFb = fakeFarmbotLike();
    fakeFb.client = undefined;
    const ra = new ResourceAdapter(fakeFb, username);
    ra.destroy({ kind: "Point", id: 4 }).then(() => { }, () => { });
    expect(rejectRpc).toHaveBeenCalled();
  });
});
