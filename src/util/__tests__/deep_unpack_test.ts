import { deepUnpack } from "../deep_unpack";
import { Vector3 } from "../../interfaces";

describe("deepUnpack()", () => {
  const fooBar =
    (baz: number | boolean | string | undefined) => ({ foo: { bar: { baz } } });

  it("unpacks Vector3", () => {
    /** NOTE: This is a test to ensure that
     *  objects such as a vec3 can still be
     *  unpacked. FBOS occasionally needs to send
     *  fully-formed objects. */
    const vec3: Vector3 = { x: -1, y: 2, z: 9 };
    const x: any = deepUnpack("foo.bar.baz", vec3 as any);
    expect(x.foo.bar.baz).toEqual(vec3);
  });

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
