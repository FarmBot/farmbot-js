import { isCeleryScript } from "../is_celery_script";

describe("isCeleryScript", () => {
  it("detects CS nodes", () => {
    const result = isCeleryScript({ kind: "wait", args: { milliseconds: 1 } });
    expect(result).toBe(true);
  });
});
