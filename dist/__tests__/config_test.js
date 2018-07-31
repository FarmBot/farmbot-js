"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var test_support_1 = require("../test_support");
describe("generateConfig", function () {
    it("crashes when given malformed token", function () {
        expect(function () { return config_1.generateConfig({ token: "no.no.no" }); })
            .toThrowError("Unable to parse token. Is it properly formatted?");
    });
    it("parses a properly formed token with default values", function () {
        var result = config_1.generateConfig({ token: test_support_1.FAKE_TOKEN });
        expect(result.speed).toEqual(config_1.CONFIG_DEFAULTS.speed);
        expect(result.token).toEqual(test_support_1.FAKE_TOKEN);
        expect(result.secure).toEqual(true);
        expect(result.LAST_PING_OUT).toEqual(0);
        expect(result.LAST_PING_IN).toEqual(0);
    });
});
