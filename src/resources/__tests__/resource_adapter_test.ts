const mockUuid = "123-456";

jest.mock("../../util/uuid", () => ({ uuid: () => mockUuid }));

import { fakeFarmbotLike } from "../../test_support";
import { ResourceAdapter } from "../resource_adapter";
import { BatchDestroyRequest } from "../interfaces";
import { outboundChanFor } from "../support";

describe("resourceAdapter", () => {
  const username = "device_87";
  it("destroys all", () => {
    const fakeFb = fakeFarmbotLike();
    const ra = new ResourceAdapter(fakeFb, username);
    const requests: BatchDestroyRequest[] =
      [{ name: "Point", id: 4 }, { name: "Sequence", id: 4 }];
    ra.destroyAll(requests);
    requests.map((req) => {
      const { client } = fakeFb;
      const expectedArgs = [outboundChanFor(username, req, mockUuid), ""];
      expect(client && client.publish).toHaveBeenCalledWith(...expectedArgs);
    });
  });
});
