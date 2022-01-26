"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("../util/uuid", function () { return ({ uuid: function () { return "FAKE_UUID"; } }); });
var test_support_1 = require("../test_support");
describe("FarmBot", function () {
    it("swallows errors when internal event system hits runtime error", function () {
        var bot = (0, test_support_1.fakeFarmbot)();
        var oldDir = console.dir;
        var oldWarn = console.warn;
        console.dir = jest.fn();
        console.warn = jest.fn();
        var error = new Error("BOOM!");
        bot.on("boom", function () { throw error; });
        bot.emit("boom", { kapow: "woosh" });
        expect(console.dir).toHaveBeenCalledWith(error);
        expect(console.warn)
            .toHaveBeenCalledWith("Exception thrown while handling 'boom' event.");
        console.dir = oldDir;
        console.warn = oldWarn;
    });
});
