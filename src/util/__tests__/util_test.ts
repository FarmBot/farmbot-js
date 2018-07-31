import { uuid } from "../../util";

describe("Utility functionality", () => {
  it("generates a UUID", () => {
    const tpl = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    const actual = uuid();
    expect(actual.length).toBe(tpl.length);
    [8, 13, 14, 18, 23]
      .map(i => expect(actual[i]).toBe(tpl[i]));
  });
});
