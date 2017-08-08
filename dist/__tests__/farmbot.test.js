"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
var test_support_1 = require("../test_support");
describe("FarmBot", function () {
    it("initializes", function () {
        var fb = new index_1.Farmbot({ token: test_support_1.FAKE_TOKEN, secure: true });
        expect(fb.client).toBeUndefined();
    });
});
