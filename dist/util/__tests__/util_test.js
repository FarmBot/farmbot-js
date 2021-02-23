"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
describe("Utility functionality", function () {
    it("generates a UUID", function () {
        var tpl = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
        var actual = util_1.uuid();
        expect(actual.length).toBe(tpl.length);
        [8, 13, 14, 18, 23]
            .map(function (i) { return expect(actual[i]).toBe(tpl[i]); });
    });
});
