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
        var bot = (0, test_support_1.fakeFarmbot)();
        expect(bot.getConfig("token")).toEqual(test_support_1.FAKE_TOKEN);
        expect(bot.getConfig("speed")).toEqual(100);
        expect(bot.getConfig("secure")).toEqual(false);
    });
});
