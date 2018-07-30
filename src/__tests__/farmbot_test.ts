/** Too hard to make assertions when every call to bot.send()
 * generates a non-deterministic UUID.
 *
 * Stubs out uuid() calls to always be the same. */
jest.mock("../util/uuid", () => ({ uuid: () => "FAKE_UUID" }));

import { RpcRequestBodyItem, rpcRequest } from "..";
import { FAKE_TOKEN } from "../../dist/test_support";
import { fakeFarmbot } from "../test_support";

describe("FarmBot", () => {
  const token = FAKE_TOKEN;
  it("Instantiates a FarmBot", () => {
    const bot = fakeFarmbot();
    expect(bot.getConfig("token")).toEqual(token);
    expect(bot.getConfig("speed")).toEqual(100);
    expect(bot.getConfig("secure")).toEqual(false);
  });

  it("uses the bot object to *BROADCAST* simple RPCs", () => {
    const bot = fakeFarmbot();
    const fakeSender = jest.fn();
    bot.publish = fakeSender;

    const expectations: [Function, RpcRequestBodyItem][] = [
      [
        bot.resetOS,
        { kind: "factory_reset", args: { package: "farmbot_os" } }
      ],
      [
        bot.resetMCU,
        { kind: "factory_reset", args: { package: "arduino_firmware" } }
      ]
    ];
    expectations.map(([rpc, xpectArgs]) => {
      fakeSender.mockClear();
      rpc(false);
      expect(fakeSender).toHaveBeenCalledWith(rpcRequest([xpectArgs]));
    })
  });

  it("uses the bot object to *SEND* simple RPCs", () => {
    const bot = fakeFarmbot();
    const fakeSender = jest.fn();
    bot.publish = fakeSender;

    const expectations: [Function, RpcRequestBodyItem][] = [
      [
        bot.installFirstPartyFarmware,
        { kind: "install_first_party_farmware", args: {} }
      ],
      [
        bot.checkUpdates,
        { kind: "check_updates", args: { package: "farmbot_os" } }
      ],
      [
        bot.powerOff,
        { kind: "power_off", args: {} }
      ],
      [
        bot.reboot,
        { kind: "reboot", args: {} }
      ],
      [
        bot.emergencyLock,
        { kind: "emergency_lock", args: {} }
      ],
      [
        bot.emergencyUnlock,
        { kind: "emergency_unlock", args: {} }
      ],
      [
        bot.dumpInfo,
        { kind: "dump_info", args: {} }
      ]
    ];
    expectations.map(([rpc, xpectArgs]) => {
      fakeSender.mockClear();
      rpc(false);
      expect(fakeSender).toHaveBeenCalledWith(rpcRequest([xpectArgs]));
    })
  });

  describe("configurable RPC logic", () => {
    const bot = fakeFarmbot();
    const fakeSender = jest.fn();
    bot.publish = fakeSender;

    beforeEach(() => fakeSender.mockClear());
    function expectRPC(item: RpcRequestBodyItem) {
      expect(fakeSender).toHaveBeenCalledWith(rpcRequest([item]));
    }

    it("installs Farmware", () => {
      const url = "foo.bar/manifest.json";
      bot.installFarmware(url);
      expectRPC({ kind: "install_farmware", args: { url } });
    });

    it("updates Farmware", () => {
      const pkg = "a package";
      bot.updateFarmware(pkg);
      expectRPC({ kind: "update_farmware", args: { package: pkg } });
    });

    it("removes Farmware", () => {
      const pkg = "a package";
      bot.removeFarmware(pkg);
      expectRPC({ kind: "remove_farmware", args: { package: pkg } });
    });

  });
});
