"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("../util/is_node", function () {
    return { isNode: function () { return true; } };
});
var config_1 = require("../config");
var test_support_1 = require("../test_support");
var is_node_1 = require("../util/is_node");
describe("generateConfig", function () {
    it("crashes when given malformed token", function () {
        console.warn = jest.fn();
        expect(function () { return (0, config_1.generateConfig)({ token: "no.no.no" }); })
            .toThrowError("Unable to parse token. Is it properly formatted?");
    });
    it("parses a properly formed token with default values", function () {
        var result = (0, config_1.generateConfig)({ token: test_support_1.FAKE_TOKEN });
        expect(result.speed).toEqual(config_1.CONFIG_DEFAULTS.speed);
        expect(result.token).toEqual(test_support_1.FAKE_TOKEN);
        expect(result.secure).toEqual(true);
        expect(result.LAST_PING_OUT).toEqual(0);
        expect(result.LAST_PING_IN).toEqual(0);
    });
    it("warns users when atob is missing", function () {
        Object.defineProperty(global, "atob", {
            value: undefined,
            writable: true,
        });
        // Just to verify mock- not part of test.
        expect((0, is_node_1.isNode)()).toBe(true);
        global.atob = undefined;
        var boom = function () { return (0, config_1.generateConfig)({ token: "{}" }); };
        // TODO
        // expect(global.atob).toBeFalsy();
        // expect(boom).toThrowError(FIX_ATOB_FIRST);
        config_1.FIX_ATOB_FIRST;
        expect(boom).toThrowError();
    });
});
