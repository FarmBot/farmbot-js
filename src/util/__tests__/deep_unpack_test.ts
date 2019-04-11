import { deepUnpack } from "../deep_unpack";

describe("deepUnpack()", () => {
  const fooBar =
    (baz: number | boolean | string | undefined) => ({ foo: { bar: { baz } } });
  it("unpacks 'dot properties'", () => {
    expect(deepUnpack("foo.bar.baz", 1)).toEqual(fooBar(1));
    expect(deepUnpack("foo.bar.baz", true)).toEqual(fooBar(true));
    expect(deepUnpack("foo.bar.baz", "string")).toEqual(fooBar("string"));
    expect(deepUnpack("foo.bar.baz", undefined)).toEqual(fooBar(undefined));
    expect(deepUnpack("foo", 1)).toEqual({ foo: 1 });
    expect(deepUnpack("foo", false)).toEqual({ foo: false });
    expect(deepUnpack("foo", "string")).toEqual({ foo: "string" });
    expect(deepUnpack("foo", undefined)).toEqual({ foo: undefined });
    expect(deepUnpack("", "edge case")).toEqual({ [""]: "edge case" });
  });
});
