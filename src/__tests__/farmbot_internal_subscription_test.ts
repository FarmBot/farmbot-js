jest.mock("../util/uuid", () => ({ uuid: () => "FAKE_UUID" }));

import { fakeFarmbot } from "../test_support";

describe("FarmBot", () => {
  it("swallows errors when internal event system hits runtime error", () => {
    const bot = fakeFarmbot();
    const oldDir = console.dir;
    const oldWarn = console.warn;
    console.dir = jest.fn();
    console.warn = jest.fn();
    const error = new Error("BOOM!");
    bot.on("boom", () => { throw error });
    bot.emit("boom", { kapow: "woosh" });
    expect(console.dir).toHaveBeenCalledWith(error);
    expect(console.warn)
      .toHaveBeenCalledWith("Exception thrown while handling 'boom' event.");
    console.dir = oldDir;
    console.warn = oldWarn;
  });
});
