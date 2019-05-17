"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Too hard to make assertions when every call to bot.send()
 * generates a non-deterministic UUID.
 *
 * Stubs out uuid() calls to always be the same. */
jest.mock("../util/uuid", function () { return ({ uuid: function () { return "FAKE_UUID"; } }); });
var test_support_1 = require("../test_support");
describe("FarmBot", function () {
    it("Instantiates a FarmBot", function () {
        var bot = test_support_1.fakeFarmbot();
        expect(bot.getConfig("token")).toEqual(test_support_1.FAKE_TOKEN);
        expect(bot.getConfig("speed")).toEqual(100);
        expect(bot.getConfig("secure")).toEqual(false);
    });
    it("subscribes to status_v8/upsert", function (done) {
        var bot = test_support_1.fakeFarmbot();
        var bar = new Uint8Array([70, 70]);
        var foo = "FOO";
        bot.on("malformed", function (x) {
            expect(x).toEqual("70,70");
            done();
        });
        test_support_1.fakeEmit(bot, foo, bar);
        test_support_1.expectEmitFrom(bot).toHaveBeenCalledWith(foo, bar);
    });
    test.todo("subscribes to status_v8/delete");
});
