/** Too hard to make assertions when every call to bot.send()
 * generates a non-deterministic UUID.
 *
 * Stubs out uuid() calls to always be the same. */
jest.mock("../util/uuid", () => ({ uuid: () => "FAKE_UUID" }));

import {
  fakeFarmbot,
  FAKE_TOKEN,
  fakeMqttEmission,
  expectEmitFrom
} from "../test_support";
import { stringToBuffer } from "../util";
import { FbjsEventName } from "../constants";

describe("FarmBot", () => {
  it("Instantiates a FarmBot", () => {
    const bot = fakeFarmbot();
    expect(bot.getConfig("token")).toEqual(FAKE_TOKEN);
    expect(bot.getConfig("speed")).toEqual(100);
    expect(bot.getConfig("secure")).toEqual(false);
  });

  it("subscribes to status_v8/upsert", (done) => {
    const bot = fakeFarmbot();
    const payload = { bar: "bar" };
    const chan = "FOO";
    bot.on("malformed", (x: object) => {
      expect(x).toEqual(payload);
      done();
    });
    fakeMqttEmission(bot, chan, payload);
    expectEmitFrom(bot)
      .toHaveBeenCalledWith(chan, stringToBuffer(JSON.stringify(payload)));
  });

  it("subscribes to status_v8/upsert", () => {
    const bot = fakeFarmbot();
    const payload = 23;
    const chan = "bot/device_1/status_v8/upsert/location_data/scaled_encoders/x";
    bot.emit = jest.fn();
    fakeMqttEmission(bot, chan, payload);
    const expected = {
      location_data: {
        scaled_encoders: {
          x: 23
        }
      }
    };
    expect(bot.emit).toHaveBeenCalledWith(FbjsEventName.upsert, expected);
  });

  it("subscribes to status_v8/remove", () => {
    const bot = fakeFarmbot();
    const payload = null;
    const chan = "bot/device_1/status_v8/remove/location_data/scaled_encoders/x";
    bot.emit = jest.fn();
    fakeMqttEmission(bot, chan, payload);
    expect(bot.emit).toHaveBeenCalledWith(FbjsEventName.remove, {});
  });
});
