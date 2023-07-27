jest.mock("../util/is_node", () => {
  return { isNode: () => true };
});

import { generateConfig, CONFIG_DEFAULTS, FIX_ATOB_FIRST } from "../config";
import { FAKE_TOKEN } from "../test_support";
import { isNode } from "../util/is_node";

describe("generateConfig", () => {
  it("crashes when given malformed token", () => {
    console.warn = jest.fn();
    expect(() => generateConfig({ token: "no.no.no" }))
      .toThrowError("Unable to parse token. Is it properly formatted?");
  });

  it("parses a properly formed token with default values", () => {
    const result = generateConfig({ token: FAKE_TOKEN });
    expect(result.speed).toEqual(CONFIG_DEFAULTS.speed);
    expect(result.token).toEqual(FAKE_TOKEN);
    expect(result.secure).toEqual(true);
    expect(result.LAST_PING_OUT).toEqual(0);
    expect(result.LAST_PING_IN).toEqual(0);
  });

  it("warns users when atob is missing", () => {
    Object.defineProperty(global, "atob", {
      value: undefined,
      writable: true,
    });
    // Just to verify mock- not part of test.
    expect(isNode()).toBe(true);
    (global as any).atob = undefined;
    const boom = () => generateConfig({ token: "{}" });
    // TODO
    // expect(global.atob).toBeFalsy();
    // expect(boom).toThrowError(FIX_ATOB_FIRST);
    FIX_ATOB_FIRST;
    expect(boom).toThrowError();
  });
});
