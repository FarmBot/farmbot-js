import { Farmbot } from "../index";
import { FAKE_TOKEN } from "../test_support";

describe("FarmBot", () => {
  it("initializes", () => {
    let fb = new Farmbot({ token: FAKE_TOKEN, secure: true });
    expect(fb.client).toBeUndefined();
  });
});
