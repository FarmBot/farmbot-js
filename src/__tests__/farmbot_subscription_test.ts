/** Too hard to make assertions when every call to bot.send()
 * generates a non-deterministic UUID.
 *
 * Stubs out uuid() calls to always be the same. */
jest.mock("../util/uuid", () => ({ uuid: () => "FAKE_UUID" }));

import {
  fakeFarmbot,
  FAKE_TOKEN,
  fakeEmit,
  expectEmitFrom
} from "../test_support";
import { stringToBuffer } from "../util";

describe("FarmBot", () => {
  it("Instantiates a FarmBot", () => {
    const bot = fakeFarmbot();
    expect(bot.getConfig("token")).toEqual(FAKE_TOKEN);
    expect(bot.getConfig("speed")).toEqual(100);
    expect(bot.getConfig("secure")).toEqual(false);
  });

  it("subscribes to status_v8/upsert", (done) => {
    const bot = fakeFarmbot();
    const bar = { bar: "bar" };
    const foo = "FOO";
    bot.on("malformed", (x: object) => {
      expect(x).toEqual(bar);
      done();
    });
    fakeEmit(bot, foo, bar);
    expectEmitFrom(bot)
      .toHaveBeenCalledWith(foo, stringToBuffer(JSON.stringify(bar)));
  });

  // it("subscribes to status_v8/upsert");
  // it("subscribes to status_v8/delete");
});
