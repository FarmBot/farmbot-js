"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_celery_script_1 = require("../is_celery_script");
describe("isCeleryScript", function () {
    it("detects CS nodes", function () {
        var result = is_celery_script_1.isCeleryScript({ kind: "wait", args: { milliseconds: 1 } });
        expect(result).toBe(true);
    });
});
