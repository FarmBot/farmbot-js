"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farmbot = void 0;
var mqtt_1 = require("mqtt");
var util_1 = require("./util");
var _1 = require(".");
var config_1 = require("./config");
var resource_adapter_1 = require("./resources/resource_adapter");
var constants_1 = require("./constants");
var is_celery_script_1 = require("./util/is_celery_script");
var time_1 = require("./util/time");
var rpc_request_1 = require("./util/rpc_request");
var Farmbot = /** @class */ (function () {
    function Farmbot(input) {
        var _this = this;
        /** Get a Farmbot Constructor Parameter. */
        this.getConfig = function (key) { return _this.config[key]; };
        /** Set a Farmbot Constructor Parameter. */
        this.setConfig = function (key, value) {
            _this.config[key] = value;
        };
        /**
         * Installs a "Farmware" (plugin) onto the bot's SD card.
         * URL must point to a valid Farmware manifest JSON document.
         */
        this.installFarmware = function (url) {
            return _this.send((0, util_1.rpcRequest)([{ kind: "install_farmware", args: { url: url } }]));
        };
        /**
         * Checks for updates on a particular Farmware plugin when given the name of
         * a Farmware. `updateFarmware("take-photo")`
         */
        this.updateFarmware = function (pkg) {
            return _this.send((0, util_1.rpcRequest)([{
                    kind: "update_farmware",
                    args: { package: pkg }
                }]));
        };
        /** Uninstall a Farmware plugin. */
        this.removeFarmware = function (pkg) {
            return _this.send((0, util_1.rpcRequest)([{
                    kind: "remove_farmware",
                    args: {
                        package: pkg
                    }
                }]));
        };
        /**
         * Installs "Farmware" (plugins) authored by FarmBot, Inc.
         * onto the bot's SD card.
         */
        this.installFirstPartyFarmware = function () {
            return _this.send((0, util_1.rpcRequest)([{
                    kind: "install_first_party_farmware",
                    args: {}
                }]));
        };
        /**
         * Deactivate FarmBot OS completely (shutdown).
         * Useful before unplugging the power.
         */
        this.powerOff = function () {
            return _this.send((0, util_1.rpcRequest)([{ kind: "power_off", args: {} }]));
        };
        /** Restart FarmBot OS. */
        this.reboot = function () {
            return _this.send((0, util_1.rpcRequest)([
                { kind: "reboot", args: { package: "farmbot_os" } }
            ]));
        };
        /** Reinitialize the FarmBot microcontroller firmware. */
        this.rebootFirmware = function () {
            return _this.send((0, util_1.rpcRequest)([
                { kind: "reboot", args: { package: "arduino_firmware" } }
            ]));
        };
        /** Check for new versions of FarmBot OS.
         * Downloads and installs if available. */
        this.checkUpdates = function () {
            return _this.send((0, util_1.rpcRequest)([
                { kind: "check_updates", args: { package: "farmbot_os" } }
            ]));
        };
        /** THIS WILL RESET THE SD CARD, deleting all non-factory data!
         * Be careful!! */
        this.resetOS = function () {
            return _this.publish((0, util_1.rpcRequest)([
                { kind: "factory_reset", args: { package: "farmbot_os" } }
            ]));
        };
        /** WARNING: will reset all firmware (hardware) settings! */
        this.resetMCU = function () {
            return _this.send((0, util_1.rpcRequest)([
                { kind: "factory_reset", args: { package: "arduino_firmware" } }
            ]));
        };
        this.flashFirmware = function (
        /** one of: "arduino"|"express_k10"|"farmduino_k14"|"farmduino" */
        firmware_name) {
            return _this.send((0, util_1.rpcRequest)([{
                    kind: "flash_firmware",
                    args: {
                        package: firmware_name
                    }
                }]));
        };
        /**
         * Lock the bot from moving (E-STOP). Turns off peripherals and motors. This
         * also will pause running regimens and cause any running sequences to exit.
         */
        this.emergencyLock = function () {
            var body = [{ kind: "emergency_lock", args: {} }];
            var rpc = (0, util_1.rpcRequest)(body, rpc_request_1.Priority.HIGHEST);
            return _this.send(rpc);
        };
        /** Unlock the bot when the user says it is safe. */
        this.emergencyUnlock = function () {
            var body = [{ kind: "emergency_unlock", args: {} }];
            var rpc = (0, util_1.rpcRequest)(body, rpc_request_1.Priority.HIGHEST);
            return _this.send(rpc);
        };
        /** Execute a sequence by its ID on the FarmBot API. */
        this.execSequence = function (sequence_id, body) {
            if (body === void 0) { body = []; }
            return _this.send((0, util_1.rpcRequest)([
                { kind: "execute", args: { sequence_id: sequence_id }, body: body }
            ]));
        };
        /** Run an installed Farmware plugin on the SD Card. */
        this.execScript = function (
        /** Name of the Farmware. */
        label, 
        /** Optional ENV vars to pass the Farmware. */
        envVars) {
            return _this.send((0, util_1.rpcRequest)([
                { kind: "execute_script", args: { label: label }, body: envVars }
            ]));
        };
        /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */
        this.home = function (args) {
            return _this.send((0, util_1.rpcRequest)([{ kind: "home", args: args }]));
        };
        /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis
         * order. WON'T WORK WITHOUT ENCODERS OR END STOPS! A blockage or stall
         * during this command will set that position as zero. Use carefully. */
        this.findHome = function (args) {
            return _this.send((0, util_1.rpcRequest)([{ kind: "find_home", args: args }]));
        };
        /** Move FarmBot to an absolute point. */
        this.moveAbsolute = function (args) {
            var x = args.x, y = args.y, z = args.z;
            var speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
            return _this.send((0, util_1.rpcRequest)([
                {
                    kind: "move_absolute",
                    args: {
                        location: (0, util_1.coordinate)(x, y, z),
                        offset: (0, util_1.coordinate)(0, 0, 0),
                        speed: speed
                    }
                }
            ]));
        };
        /** Move FarmBot to position relative to its current position. */
        this.moveRelative = function (args) {
            var x = args.x, y = args.y, z = args.z;
            var speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
            return _this.send((0, util_1.rpcRequest)([
                { kind: "move_relative", args: { x: x, y: y, z: z, speed: speed } }
            ]));
        };
        /** Set a GPIO pin to a particular value. */
        this.writePin = function (args) {
            return _this.send((0, util_1.rpcRequest)([{ kind: "write_pin", args: args }]));
        };
        /** Read the value of a GPIO pin. Will create a SensorReading if it's
         * a sensor. */
        this.readPin = function (args) {
            return _this.send((0, util_1.rpcRequest)([{ kind: "read_pin", args: args }]));
        };
        /** Reverse the value of a digital pin. */
        this.togglePin = function (args) {
            return _this.send((0, util_1.rpcRequest)([{ kind: "toggle_pin", args: args }]));
        };
        /** Read the status of the bot. Should not be needed unless you are first
         * logging in to the device, since the device pushes new states out on
         * every update. */
        this.readStatus = function (args) {
            if (args === void 0) { args = {}; }
            return _this.send((0, util_1.rpcRequest)([{ kind: "read_status", args: args }]));
        };
        /** Snap a photo and send to the API for post processing. */
        this.takePhoto = function (args) {
            if (args === void 0) { args = {}; }
            return _this.send((0, util_1.rpcRequest)([{ kind: "take_photo", args: args }]));
        };
        /** Download/apply all of the latest FarmBot API JSON resources (plants,
         * account info, etc.) to the device. */
        this.sync = function (args) {
            if (args === void 0) { args = {}; }
            return _this.send((0, util_1.rpcRequest)([{ kind: "sync", args: args }]));
        };
        /**
         * Set the current position of the given axis to 0.
         * Example: Sending `bot.setZero("x")` at x: 255 will translate position
         * 255 to 0, causing that position to be x: 0.
         */
        this.setZero = function (axis) {
            return _this.send((0, util_1.rpcRequest)([{
                    kind: "zero",
                    args: { axis: axis }
                }]));
        };
        /**
         * Set user ENV vars (usually used by 3rd-party Farmware plugins).
         * Set value to `undefined` to unset.
         */
        this.setUserEnv = function (configs) {
            var body = Object
                .keys(configs)
                .map(function (label) {
                return {
                    kind: "pair",
                    args: { label: label, value: (configs[label] || constants_1.Misc.NULL) }
                };
            });
            return _this.send((0, util_1.rpcRequest)([{ kind: "set_user_env", args: {}, body: body }]));
        };
        this.sendMessage = function (message_type, message, channels) {
            if (channels === void 0) { channels = []; }
            _this.send((0, util_1.rpcRequest)([{
                    kind: "send_message",
                    args: {
                        message_type: message_type,
                        message: message
                    },
                    body: channels.map(function (channel_name) { return ({
                        kind: "channel",
                        args: {
                            channel_name: channel_name
                        }
                    }); })
                }]));
        };
        /** Control servos on pins 4 and 5. */
        this.setServoAngle = function (args) {
            var result = _this.send((0, util_1.rpcRequest)([{ kind: "set_servo_angle", args: args }]));
            // Celery script can't validate `pin_number` and `pin_value` the way we need
            // for `set_servo_angle`. We will send the RPC command off, but also
            // crash the client to aid debugging.
            if (![4, 5, 6, 11].includes(args.pin_number)) {
                throw new Error("Servos only work on pins 4 and 5");
            }
            if (args.pin_value > 180 || args.pin_value < 0) {
                throw new Error("Pin value outside of 0...180 range");
            }
            return result;
        };
        /**
         * Find the axis extents using encoder, motor, or end-stop feedback.
         * Will set a new home position and a new axis length for the given axis.
         */
        this.calibrate = function (args) {
            return _this.send((0, util_1.rpcRequest)([{ kind: "calibrate", args: args }]));
        };
        this.lua = function (lua) {
            return _this.send((0, util_1.rpcRequest)([
                { kind: "lua", args: { lua: lua } }
            ]));
        };
        /**
         * Retrieves all of the event handlers for a particular event.
         * Returns an empty array if the event did not exist.
         */
        this.event = function (name) {
            _this._events[name] = _this._events[name] || [];
            return _this._events[name];
        };
        this.on = function (event, value, once) {
            if (once === void 0) { once = false; }
            _this.event(event).push({ value: value, once: once, event: event });
        };
        this.emit = function (event, data) {
            var nextArray = [];
            _this.event(event)
                .concat(_this.event("*"))
                .forEach(function (handler) {
                try {
                    handler.value(data, event);
                    if (!handler.once && handler.event === event) {
                        nextArray.push(handler);
                    }
                }
                catch (e) {
                    var msg = "Exception thrown while handling '".concat(event, "' event.");
                    console.warn(msg);
                    console.dir(e);
                }
            });
            if (nextArray.length === 0) {
                delete _this._events[event];
            }
            else {
                _this._events[event] = nextArray;
            }
        };
        /** Low-level means of sending MQTT packets. Does not check format. Does not
         * acknowledge confirmation. Probably not the one you want. */
        this.publish = function (msg, important) {
            if (important === void 0) { important = true; }
            if (_this.client) {
                _this.emit(constants_1.FbjsEventName.sent, msg);
                /** SEE: https://github.com/mqttjs/MQTT.js#client */
                _this.client.publish(_this.channel.toDevice, JSON.stringify(msg));
            }
            else {
                if (important) {
                    throw new Error("Not connected to server");
                }
            }
        };
        /** Low-level means of sending MQTT RPC commands to the bot. Acknowledges
         * receipt of message, but does not check formatting. Consider using higher
         * level methods like .moveRelative(), .calibrate(), etc....
        */
        this.send = function (input) {
            return new Promise(function (resolve, reject) {
                _this.publish(input);
                function handler(response) {
                    switch (response.kind) {
                        case "rpc_ok": return resolve(response);
                        case "rpc_error":
                            var reason = (response.body || [])
                                .map(function (x) { return x.args.message; })
                                .join(", ");
                            return reject(new Error(reason));
                        default:
                            console.dir(response);
                            throw new Error("Got a bad CeleryScript node.");
                    }
                }
                _this.on(input.args.label, handler, true);
            });
        };
        /** Main entry point for all MQTT packets. */
        this._onmessage = function (chan, buffer) {
            var original = (0, _1.bufferToString)(buffer);
            var segments = chan.split(constants_1.Misc.MQTT_DELIM);
            var emit = _this.emit;
            try {
                var msg = JSON.parse(original);
                if (segments[0] == constants_1.MqttChanName.publicBroadcast) {
                    return emit(constants_1.MqttChanName.publicBroadcast, msg);
                }
                switch (segments[2]) {
                    case constants_1.MqttChanName.logs: return emit(constants_1.FbjsEventName.logs, msg);
                    case constants_1.MqttChanName.status: return emit(constants_1.FbjsEventName.status, msg);
                    case constants_1.MqttChanName.sync: return emit(constants_1.FbjsEventName.sync, msg);
                    case constants_1.MqttChanName.pong:
                        return emit(segments[3], msg);
                    default:
                        var ev = (0, is_celery_script_1.hasLabel)(msg) ? msg.args.label : constants_1.FbjsEventName.malformed;
                        return emit(ev, msg);
                }
            }
            catch (error) {
                console
                    .dir({ text: "Could not parse inbound message from MQTT.", error: error });
                emit(constants_1.FbjsEventName.malformed, original);
            }
        };
        this.ping = function (timeout, now) {
            if (timeout === void 0) { timeout = 10000; }
            if (now === void 0) { now = (0, time_1.timestamp)(); }
            _this.setConfig("LAST_PING_OUT", now);
            return _this.doPing(now, timeout);
        };
        // STEP 0: Subscribe to `bot/device_23/pong/#`
        // STEP 0: Send         `bot/device_23/ping/3123123`
        // STEP 0: Receive      `bot/device_23/pong/3123123`
        this.doPing = function (startedAt, timeout) {
            var timeoutPromise = new Promise(function (_, rej) { return setTimeout(function () { return rej(-0); }, timeout); });
            var pingPromise = new Promise(function (res, _) {
                var ok = function () {
                    var t = (0, time_1.timestamp)();
                    _this.setConfig("LAST_PING_IN", t);
                    res(t - startedAt);
                };
                _this.on("" + startedAt, ok, true);
                var chan = _this.channel.ping(startedAt);
                if (_this.client) {
                    _this.client.publish(chan, JSON.stringify(startedAt));
                }
            });
            return Promise.race([timeoutPromise, pingPromise]);
        };
        /** Bootstrap the device onto the MQTT broker. */
        this.connect = function () {
            var _a = _this.config, mqttUsername = _a.mqttUsername, token = _a.token, mqttServer = _a.mqttServer;
            var reconnectPeriod = constants_1.Misc.RECONNECT_THROTTLE_MS;
            var client = mqtt_1.default.connect(mqttServer, {
                clean: true,
                clientId: "FBJS-".concat(Farmbot.VERSION, "-").concat((0, util_1.uuid)()),
                password: token,
                protocolId: "MQTT",
                protocolVersion: 4,
                reconnectPeriod: reconnectPeriod,
                username: mqttUsername,
            });
            _this.client = client;
            _this.resources = new resource_adapter_1.ResourceAdapter(_this, _this.config.mqttUsername);
            client.on("message", _this._onmessage);
            client.on("offline", function () { return _this.emit(constants_1.FbjsEventName.offline, {}); });
            client.on("connect", function () { return _this.emit(constants_1.FbjsEventName.online, {}); });
            var channels = [
                _this.channel.logs,
                _this.channel.status,
                _this.channel.sync,
                _this.channel.toClient,
                _this.channel.pong
            ];
            client.subscribe(channels);
            return new Promise(function (resolve, _reject) {
                if (_this.client) {
                    _this.client.once("connect", function () { return resolve(_this); });
                }
                else {
                    throw new Error("Please connect first.");
                }
            });
        };
        this._events = {};
        this.config = (0, config_1.generateConfig)(input);
        this.resources = new resource_adapter_1.ResourceAdapter(this, this.config.mqttUsername);
    }
    Object.defineProperty(Farmbot.prototype, "channel", {
        /** Dictionary of all relevant MQTT channels the bot uses. */
        get: function () {
            var deviceName = this.config.mqttUsername;
            return {
                /** From the browser, usually. */
                toDevice: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.fromClients),
                /** From farmbot */
                toClient: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.fromDevice),
                status: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.status),
                logs: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.logs),
                sync: "bot/".concat(deviceName, "/").concat(constants_1.MqttChanName.sync, "/#"),
                /** Read only */
                pong: "bot/".concat(deviceName, "/pong/#"),
                /** Write only: bot/${deviceName}/ping/${timestamp} */
                ping: function (tStamp) { return "bot/".concat(deviceName, "/ping/").concat(tStamp); }
            };
        },
        enumerable: false,
        configurable: true
    });
    Farmbot.VERSION = "15.8.11";
    return Farmbot;
}());
exports.Farmbot = Farmbot;
