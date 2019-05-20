"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Too hard to make assertions when every call to bot.send()
 * generates a non-deterministic UUID.
 *
 * Stubs out uuid() calls to always be the same. */
jest.mock("../util/uuid", function () { return ({ uuid: function () { return "FAKE_UUID"; } }); });
var test_support_1 = require("../test_support");
var util_1 = require("../util");
var constants_1 = require("../constants");
describe("FarmBot", function () {
    it("Instantiates a FarmBot", function () {
        var bot = test_support_1.fakeFarmbot();
        expect(bot.getConfig("token")).toEqual(test_support_1.FAKE_TOKEN);
        expect(bot.getConfig("speed")).toEqual(100);
        expect(bot.getConfig("secure")).toEqual(false);
    });
    it("subscribes to status_v8/upsert", function (done) {
        var bot = test_support_1.fakeFarmbot();
        var payload = { bar: "bar" };
        var chan = "FOO";
        bot.on("malformed", function (x) {
            expect(x).toEqual(payload);
            done();
        });
        test_support_1.fakeMqttEmission(bot, chan, payload);
        test_support_1.expectEmitFrom(bot)
            .toHaveBeenCalledWith(chan, util_1.stringToBuffer(JSON.stringify(payload)));
    });
    it("subscribes to status_v8/upsert", function () {
        var bot = test_support_1.fakeFarmbot();
        var payload = 23;
        var chan = "bot/device_1/status_v8/upsert/location_data/scaled_encoders/x";
        bot.emit = jest.fn();
        test_support_1.fakeMqttEmission(bot, chan, payload);
        var expected = {
            upsert: {
                location_data: {
                    scaled_encoders: {
                        x: 23
                    }
                }
            }
        };
        expect(bot.emit).toHaveBeenCalledWith(constants_1.FbjsEventName.upsert, expected);
    });
    it("subscribes to status_v8/remove", function () {
        var bot = test_support_1.fakeFarmbot();
        var payload = null;
        var chan = "bot/device_1/status_v8/remove/location_data/scaled_encoders/x";
        bot.emit = jest.fn();
        test_support_1.fakeMqttEmission(bot, chan, payload);
        expect(bot.emit).toHaveBeenCalledWith(constants_1.FbjsEventName.remove, {});
    });
});
