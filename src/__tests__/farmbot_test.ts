/** Too hard to make assertions when every call to bot.send()
 * generates a non-deterministic UUID.
 *
 * Stubs out uuid() calls to always be the same. */
jest.mock("../util/uuid", () => ({ uuid: () => "FAKE_UUID" }));

import { RpcRequestBodyItem, rpcRequest, coordinate, McuParams } from "..";
import { fakeFarmbot, FAKE_TOKEN } from "../test_support";
import { Pair, Home, WritePin, ReadPin } from "../corpus";
import { CONFIG_DEFAULTS } from "../config";
import { Misc } from "../constants";

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
        { kind: "reboot", args: { package: "farmbot_os" } }
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

    it("executes a sequence", () => {
      const sequence_id = 123;
      bot.execSequence(sequence_id);
      expectRPC({
        kind: "execute",
        args: { sequence_id },
        body: []
      });
    });

    it("executes a script", () => {
      const label = "minesweeper.exe";
      const envVars: Pair[] =
        [{ kind: "pair", args: { label: "is_pair", value: true } }];
      bot.execScript(label, envVars);
      expectRPC({ kind: "execute_script", args: { label }, body: envVars });
    });

    it("moves to home position", () => {
      const args: Home["args"] = { speed: 100, axis: "all" };
      bot.home(args as any);
      expectRPC({ kind: "home", args });
    });

    it("finds home position", () => {
      const args: Home["args"] = { speed: 100, axis: "all" };
      bot.findHome(args as any);
      expectRPC({ kind: "find_home", args });
    });

    it("Moves to an absolute coord", () => {
      const [x, y, z] = [1, 2, 3];
      bot.moveAbsolute({ x, y, z });
      expectRPC({
        kind: "move_absolute",
        args: {
          location: coordinate(x, y, z),
          offset: coordinate(0, 0, 0),
          speed: CONFIG_DEFAULTS.speed
        }
      });
    });

    it("Moves to a relative coord", () => {
      const [x, y, z] = [1, 2, 3];
      bot.moveRelative({ x, y, z });
      expectRPC({
        kind: "move_relative",
        args: { x, y, z, speed: CONFIG_DEFAULTS.speed }
      });
    });

    it("writes a pin", () => {
      const args: WritePin["args"] =
        { pin_mode: 1, pin_value: 128, pin_number: 8 };
      bot.writePin(args);
      expectRPC({ kind: "write_pin", args });
    });

    it("reads a pin", () => {
      const args: ReadPin["args"] = { pin_mode: 1, pin_number: 8, label: "X" };
      bot.readPin(args);
      expectRPC({ kind: "read_pin", args });
    });

    it("toggles a pin", () => {
      const pin_number = 13;
      const args = { pin_number }
      bot.togglePin(args);
      expectRPC({ kind: "toggle_pin", args });
    });

    it("reads the bot's status", () => {
      const args = {};
      bot.readStatus(args);
      expectRPC({ kind: "read_status", args });
    });

    it("takes a photo", () => {
      const args = {};
      bot.takePhoto(args);
      expectRPC({ kind: "take_photo", args });
    });

    it("syncs", () => {
      const args = {};
      bot.sync(args);
      expectRPC({ kind: "sync", args });
    });

    it("sets zero", () => {
      const axis = "x";
      bot.setZero(axis);
      expectRPC({
        kind: "zero",
        args: { axis }
      });
    });

    it("Updates MCU settings", () => {
      const label: keyof McuParams = "encoder_use_for_pos_x";
      const value = 1;
      const args = { [label]: value };
      bot.updateMcu(args);
      expectRPC({
        kind: "config_update",
        args: { package: "arduino_firmware" },
        body: [{ kind: "pair", args: { value, label } }]
      });
    });

    it("sets ENV vars", () => {
      const xmp = {
        foo: undefined,
        bar: "bz"
      }
      bot.setUserEnv(xmp);
      expectRPC({
        kind: "set_user_env",
        args: {},
        body: [
          { kind: "pair", args: { label: "foo", value: Misc.NULL } },
          { kind: "pair", args: { label: "bar", value: "bz" } },
        ]
      })
    });
  });
});
