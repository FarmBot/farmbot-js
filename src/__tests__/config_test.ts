import { generateConfig, CONFIG_DEFAULTS } from "../config";
import { FAKE_TOKEN } from "../test_support";

describe("generateConfig", () => {
  it("crashes when given malformed token", () => {
    expect(() => generateConfig({ token: "no.no.no" }))
      .toThrowError("Unable to parse token. Is it properly formatted?")
  });

  it("parses a properly formed token with default values", () => {
    const result = generateConfig({ token: FAKE_TOKEN });
    expect(result.speed).toEqual(CONFIG_DEFAULTS.speed);
    expect(result.token).toEqual(FAKE_TOKEN);
    expect(result.secure).toEqual(true);
    expect(result.LAST_PING_OUT).toEqual(0);
    expect(result.LAST_PING_IN).toEqual(0);
  });
});
