"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Too hard to make assertions when every call to bot.send()
 * generates a non-deterministic UUID.
 *
 * Stubs out uuid() calls to always be the same. */
jest.mock("../util/uuid", function () { return ({ uuid: function () { return "FAKE_UUID"; } }); });
var __1 = require("..");
var test_support_1 = require("../test_support");
var config_1 = require("../config");
describe("FarmBot", function () {
    var token = test_support_1.FAKE_TOKEN;
    it("Instantiates a FarmBot", function () {
        var bot = test_support_1.fakeFarmbot();
        expect(bot.getConfig("token")).toEqual(token);
        expect(bot.getConfig("speed")).toEqual(100);
        expect(bot.getConfig("secure")).toEqual(false);
    });
    it("uses the bot object to *BROADCAST* simple RPCs", function () {
        var bot = test_support_1.fakeFarmbot();
        var fakeSender = jest.fn();
        bot.publish = fakeSender;
        var expectations = [
            [
                bot.resetOS,
                { kind: "factory_reset", args: { package: "farmbot_os" } }
            ],
            [
                bot.resetMCU,
                { kind: "factory_reset", args: { package: "arduino_firmware" } }
            ]
        ];
        expectations.map(function (_a) {
            var rpc = _a[0], xpectArgs = _a[1];
            fakeSender.mockClear();
            rpc(false);
            expect(fakeSender).toHaveBeenCalledWith(__1.rpcRequest([xpectArgs]));
        });
    });
    it("uses the bot object to *SEND* simple RPCs", function () {
        var bot = test_support_1.fakeFarmbot();
        var fakeSender = jest.fn();
        bot.publish = fakeSender;
        var expectations = [
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
        expectations.map(function (_a) {
            var rpc = _a[0], xpectArgs = _a[1];
            fakeSender.mockClear();
            rpc(false);
            expect(fakeSender).toHaveBeenCalledWith(__1.rpcRequest([xpectArgs]));
        });
    });
    describe("configurable RPC logic", function () {
        var bot = test_support_1.fakeFarmbot();
        var fakeSender = jest.fn();
        bot.publish = fakeSender;
        beforeEach(function () { return fakeSender.mockClear(); });
        function expectRPC(item) {
            expect(fakeSender).toHaveBeenCalledWith(__1.rpcRequest([item]));
        }
        it("installs Farmware", function () {
            var url = "foo.bar/manifest.json";
            bot.installFarmware(url);
            expectRPC({ kind: "install_farmware", args: { url: url } });
        });
        it("updates Farmware", function () {
            var pkg = "a package";
            bot.updateFarmware(pkg);
            expectRPC({ kind: "update_farmware", args: { package: pkg } });
        });
        it("removes Farmware", function () {
            var pkg = "a package";
            bot.removeFarmware(pkg);
            expectRPC({ kind: "remove_farmware", args: { package: pkg } });
        });
        it("executes a sequence", function () {
            var sequence_id = 123;
            bot.execSequence(sequence_id);
            expectRPC({ kind: "execute", args: { sequence_id: sequence_id } });
        });
        it("executes a script", function () {
            var label = "minesweeper.exe";
            var envVars = [{ kind: "pair", args: { label: "is_pair", value: true } }];
            bot.execScript(label, envVars);
            expectRPC({ kind: "execute_script", args: { label: label }, body: envVars });
        });
        it("moves to home position", function () {
            var args = { speed: 100, axis: "all" };
            bot.home(args);
            expectRPC({ kind: "home", args: args });
        });
        it("finds home position", function () {
            var args = { speed: 100, axis: "all" };
            bot.findHome(args);
            expectRPC({ kind: "find_home", args: args });
        });
        it("Moves to an absolute coord", function () {
            var _a = [1, 2, 3], x = _a[0], y = _a[1], z = _a[2];
            bot.moveAbsolute({ x: x, y: y, z: z });
            expectRPC({
                kind: "move_absolute",
                args: {
                    location: __1.coordinate(x, y, z),
                    offset: __1.coordinate(0, 0, 0),
                    speed: config_1.CONFIG_DEFAULTS.speed
                }
            });
        });
        it("Moves to a relative coord", function () {
            var _a = [1, 2, 3], x = _a[0], y = _a[1], z = _a[2];
            bot.moveRelative({ x: x, y: y, z: z });
            expectRPC({
                kind: "move_relative",
                args: { x: x, y: y, z: z, speed: config_1.CONFIG_DEFAULTS.speed }
            });
        });
        it("writes a pin", function () {
            var args = { pin_mode: 1, pin_value: 128, pin_number: 8 };
            bot.writePin(args);
            expectRPC({ kind: "write_pin", args: args });
        });
        it("reads a pin", function () {
            var args = { pin_mode: 1, pin_number: 8, label: "X" };
            bot.readPin(args);
            expectRPC({ kind: "read_pin", args: args });
        });
        it("toggles a pin", function () {
            var pin_number = 13;
            var args = { pin_number: pin_number };
            bot.togglePin(args);
            expectRPC({ kind: "toggle_pin", args: args });
        });
        it("reads the bot's status", function () {
            var args = {};
            bot.readStatus(args);
            expectRPC({ kind: "read_status", args: args });
        });
        it("takes a photo", function () {
            var args = {};
            bot.takePhoto(args);
            expectRPC({ kind: "take_photo", args: args });
        });
        it("syncs", function () {
            var args = {};
            bot.sync(args);
            expectRPC({ kind: "sync", args: args });
        });
        it("sets zero", function () {
            var axis = "x";
            bot.setZero(axis);
            expectRPC({
                kind: "zero",
                args: { axis: axis }
            });
        });
        it("Updates MCU settings", function () {
            var _a;
            var label = "encoder_use_for_pos_x";
            var value = 1;
            var args = (_a = {}, _a[label] = value, _a);
            bot.updateMcu(args);
            expectRPC({
                kind: "config_update",
                args: { package: "arduino_firmware" },
                body: [{ kind: "pair", args: { value: value, label: label } }]
            });
        });
        it("sets ENV vars", function () {
            var xmp = {
                foo: undefined,
                bar: "bz"
            };
            bot.setUserEnv(xmp);
            expectRPC({
                kind: "set_user_env",
                args: {},
                body: [
                    { kind: "pair", args: { label: "foo", value: __1.NULL } },
                    { kind: "pair", args: { label: "bar", value: "bz" } },
                ]
            });
        });
    });
});
