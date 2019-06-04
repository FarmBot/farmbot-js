"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deep_unpack_1 = require("../deep_unpack");
describe("deepUnpack()", function () {
    var fooBar = function (baz) { return ({ foo: { bar: { baz: baz } } }); };
    it("unpacks Vector3", function () {
        /** NOTE: This is a test to ensure that
         *  objects such as a vec3 can still be
         *  unpacked. FBOS occasionally needs to send
         *  fully-formed objects. */
        var vec3 = { x: -1, y: 2, z: 9 };
        var x = deep_unpack_1.deepUnpack("foo.bar.baz", vec3);
        expect(x.foo.bar.baz).toEqual(vec3);
    });
    it("unpacks 'dot properties'", function () {
        var _a;
        expect(deep_unpack_1.deepUnpack("foo.bar.baz", 1)).toEqual(fooBar(1));
        expect(deep_unpack_1.deepUnpack("foo.bar.baz", true)).toEqual(fooBar(true));
        expect(deep_unpack_1.deepUnpack("foo.bar.baz", "string")).toEqual(fooBar("string"));
        expect(deep_unpack_1.deepUnpack("foo.bar.baz", undefined)).toEqual(fooBar(undefined));
        expect(deep_unpack_1.deepUnpack("foo", 1)).toEqual({ foo: 1 });
        expect(deep_unpack_1.deepUnpack("foo", false)).toEqual({ foo: false });
        expect(deep_unpack_1.deepUnpack("foo", "string")).toEqual({ foo: "string" });
        expect(deep_unpack_1.deepUnpack("foo", undefined)).toEqual({ foo: undefined });
        expect(deep_unpack_1.deepUnpack("", "edge case")).toEqual((_a = {}, _a[""] = "edge case", _a));
    });
});
