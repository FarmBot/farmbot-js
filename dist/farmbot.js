"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mqtt_1 = require("mqtt");
var util_1 = require("./util");
var _1 = require(".");
var config_1 = require("./config");
var resource_adapter_1 = require("./resources/resource_adapter");
var constants_1 = require("./constants");
var is_celery_script_1 = require("./util/is_celery_script");
var deep_unpack_1 = require("./util/deep_unpack");
var time_1 = require("./util/time");
var Farmbot = /** @class */ (function () {
    function Farmbot(input) {
        var _this = this;
        /** Delete this shim after FBOS v7 hits end of life. */
        this.rpcShim = function (body) {
            return util_1.rpcRequest(body, _this.getConfig("interim_flag_is_legacy_fbos"));
        };
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
            return _this.send(_this.rpcShim([{ kind: "install_farmware", args: { url: url } }]));
        };
        /**
         * Checks for updates on a particular Farmware plugin when given the name of
         * a Farmware. `updateFarmware("take-photo")`
         */
        this.updateFarmware = function (pkg) {
            return _this.send(_this.rpcShim([{
                    kind: "update_farmware",
                    args: { package: pkg }
                }]));
        };
        /** Uninstall a Farmware plugin. */
        this.removeFarmware = function (pkg) {
            return _this.send(_this.rpcShim([{
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
            return _this.send(_this.rpcShim([{
                    kind: "install_first_party_farmware",
                    args: {}
                }]));
        };
        /**
         * Deactivate FarmBot OS completely (shutdown).
         * Useful before unplugging the power.
         */
        this.powerOff = function () {
            return _this.send(_this.rpcShim([{ kind: "power_off", args: {} }]));
        };
        /** Restart FarmBot OS. */
        this.reboot = function () {
            return _this.send(_this.rpcShim([
                { kind: "reboot", args: { package: "farmbot_os" } }
            ]));
        };
        /** Reinitialize the FarmBot microcontroller firmware. */
        this.rebootFirmware = function () {
            return _this.send(_this.rpcShim([
                { kind: "reboot", args: { package: "arduino_firmware" } }
            ]));
        };
        /** Check for new versions of FarmBot OS.
         * Downloads and installs if available. */
        this.checkUpdates = function () {
            return _this.send(_this.rpcShim([
                { kind: "check_updates", args: { package: "farmbot_os" } }
            ]));
        };
        /** THIS WILL RESET THE SD CARD, deleting all non-factory data!
         * Be careful!! */
        this.resetOS = function () {
            return _this.publish(_this.rpcShim([
                { kind: "factory_reset", args: { package: "farmbot_os" } }
            ]));
        };
        /** WARNING: will reset all firmware (hardware) settings! */
        this.resetMCU = function () {
            return _this.send(_this.rpcShim([
                { kind: "factory_reset", args: { package: "arduino_firmware" } }
            ]));
        };
        this.flashFirmware = function (
        /** one of: "arduino"|"express_k10"|"farmduino_k14"|"farmduino" */
        firmware_name) {
            return _this
                .send(_this.rpcShim([{
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
            return _this.send(_this.rpcShim([{ kind: "emergency_lock", args: {} }]));
        };
        /** Unlock the bot when the user says it is safe. */
        this.emergencyUnlock = function () {
            return _this.send(_this.rpcShim([{ kind: "emergency_unlock", args: {} }]));
        };
        /** Execute a sequence by its ID on the FarmBot API. */
        this.execSequence = function (sequence_id, body) {
            if (body === void 0) { body = []; }
            return _this.send(_this.rpcShim([
                { kind: "execute", args: { sequence_id: sequence_id }, body: body }
            ]));
        };
        /** Run an installed Farmware plugin on the SD Card. */
        this.execScript = function (
        /** Name of the Farmware. */
        label, 
        /** Optional ENV vars to pass the Farmware. */
        envVars) {
            return _this.send(_this.rpcShim([
                { kind: "execute_script", args: { label: label }, body: envVars }
            ]));
        };
        /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */
        this.home = function (args) {
            return _this.send(_this.rpcShim([{ kind: "home", args: args }]));
        };
        /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis
         * order. WON'T WORK WITHOUT ENCODERS OR END STOPS! A blockage or stall
         * during this command will set that position as zero. Use carefully. */
        this.findHome = function (args) {
            return _this.send(_this.rpcShim([{ kind: "find_home", args: args }]));
        };
        /** Move FarmBot to an absolute point. */
        this.moveAbsolute = function (args) {
            var x = args.x, y = args.y, z = args.z;
            var speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
            return _this.send(_this.rpcShim([
                {
                    kind: "move_absolute",
                    args: {
                        location: util_1.coordinate(x, y, z),
                        offset: util_1.coordinate(0, 0, 0),
                        speed: speed
                    }
                }
            ]));
        };
        /** Move FarmBot to position relative to its current position. */
        this.moveRelative = function (args) {
            var x = args.x, y = args.y, z = args.z;
            var speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
            return _this.send(_this.rpcShim([
                { kind: "move_relative", args: { x: x, y: y, z: z, speed: speed } }
            ]));
        };
        /** Set a GPIO pin to a particular value. */
        this.writePin = function (args) {
            return _this.send(_this.rpcShim([{ kind: "write_pin", args: args }]));
        };
        /** Read the value of a GPIO pin. Will create a SensorReading if it's
         * a sensor. */
        this.readPin = function (args) {
            return _this.send(_this.rpcShim([{ kind: "read_pin", args: args }]));
        };
        /** Reverse the value of a digital pin. */
        this.togglePin = function (args) {
            return _this.send(_this.rpcShim([{ kind: "toggle_pin", args: args }]));
        };
        /** Read the status of the bot. Should not be needed unless you are first
         * logging in to the device, since the device pushes new states out on
         * every update. */
        this.readStatus = function (args) {
            if (args === void 0) { args = {}; }
            return _this.send(_this.rpcShim([{ kind: "read_status", args: args }]));
        };
        /** Snap a photo and send to the API for post processing. */
        this.takePhoto = function (args) {
            if (args === void 0) { args = {}; }
            return _this.send(_this.rpcShim([{ kind: "take_photo", args: args }]));
        };
        /** Download/apply all of the latest FarmBot API JSON resources (plants,
         * account info, etc.) to the device. */
        this.sync = function (args) {
            if (args === void 0) { args = {}; }
            return _this.send(_this.rpcShim([{ kind: "sync", args: args }]));
        };
        /**
         * Set the current position of the given axis to 0.
         * Example: Sending `bot.setZero("x")` at x: 255 will translate position
         * 255 to 0, causing that position to be x: 0.
         */
        this.setZero = function (axis) {
            return _this.send(_this.rpcShim([{
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
            return _this.send(_this.rpcShim([{ kind: "set_user_env", args: {}, body: body }]));
        };
        /** Control servos on pins 4 and 5. */
        this.setServoAngle = function (args) {
            var result = _this.send(_this.rpcShim([{ kind: "set_servo_angle", args: args }]));
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
            return _this.send(_this.rpcShim([{ kind: "calibrate", args: args }]));
        };
        /** Tell the bot to send diagnostic info to the API.*/
        this.dumpInfo = function () {
            return _this.send(_this.rpcShim([{
                    kind: "dump_info",
                    args: {}
                }]));
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
                    var msg = "Exception thrown while handling '" + event + "' event.";
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
                            return reject(new Error("Problem sending RPC command: " + reason));
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
            var original = _1.bufferToString(buffer);
            var segments = chan.split(constants_1.Misc.MQTT_DELIM);
            var emit = _this.emit;
            try {
                var msg = JSON.parse(original);
                if (segments[0] == constants_1.MqttChanName.publicBroadcast) {
                    return emit(constants_1.MqttChanName.publicBroadcast, msg);
                }
                switch (segments[2]) {
                    case constants_1.MqttChanName.logs:
                        return emit(constants_1.FbjsEventName.logs, msg);
                        ;
                    case constants_1.MqttChanName.legacyStatus: return emit(constants_1.FbjsEventName.legacy_status, msg);
                    case constants_1.MqttChanName.sync: return emit(constants_1.FbjsEventName.sync, msg);
                    case constants_1.MqttChanName.statusV8: return _this.statusV8(segments, msg);
                    case constants_1.MqttChanName.pong:
                        return emit(segments[3], msg);
                    default:
                        var ev = is_celery_script_1.hasLabel(msg) ? msg.args.label : constants_1.FbjsEventName.malformed;
                        return emit(ev, msg);
                }
            }
            catch (error) {
                console.warn("Could not parse inbound message from MQTT.");
                emit(constants_1.FbjsEventName.malformed, original);
            }
        };
        this.statusV8 = function (segments, msg) {
            if (_this.config.interim_flag_is_legacy_fbos) {
                _this.setConfig("interim_flag_is_legacy_fbos", false);
            }
            var path = segments.slice(4).join(constants_1.Misc.PATH_DELIM);
            switch (segments[3]) {
                case "upsert":
                    return _this.emit(constants_1.FbjsEventName.upsert, deep_unpack_1.deepUnpack(path, msg));
                case "remove":
                    return _this.emit(constants_1.FbjsEventName.remove, {});
            }
        };
        this.ping = function (timeout, now) {
            if (timeout === void 0) { timeout = 3000; }
            if (now === void 0) { now = time_1.timestamp(); }
            // if (this.getConfig("interim_flag_is_legacy_fbos")) {
            //   return this.send(this.rpcShim([]));
            // } else {
            console.log("NOT TO SELF: Uncomment legacy shim after QA");
            return _this.doPing(now, timeout);
            // }
        };
        // STEP 0: Subscribe to `bot/device_23/pong/#`
        // STEP 0: Send         `bot/device_23/ping/3123123`
        // STEP 0: Receive      `bot/device_23/pong/3123123`
        this.doPing = function (startedAt, timeout) {
            return new Promise(function (resolve, reject) {
                if (_this.client) {
                    var meta_1 = { isDone: false };
                    var maybeReject = function () {
                        if (!meta_1.isDone) {
                            meta_1.isDone = true;
                            reject(-0);
                        }
                    };
                    var maybeResolve = function () {
                        if (!meta_1.isDone) {
                            meta_1.isDone = true;
                            resolve(time_1.timestamp() - startedAt);
                        }
                    };
                    setTimeout(maybeReject, timeout);
                    _this.on("" + startedAt, maybeResolve, true);
                    _this.client.publish(_this.channel.ping(startedAt), JSON.stringify(startedAt));
                }
                else {
                    reject("Not connected");
                }
            });
        };
        /** Bootstrap the device onto the MQTT broker. */
        this.connect = function () {
            var _a = _this.config, mqttUsername = _a.mqttUsername, token = _a.token, mqttServer = _a.mqttServer;
            var reconnectPeriod = constants_1.Misc.RECONNECT_THROTTLE_MS;
            var client = mqtt_1.connect(mqttServer, {
                username: mqttUsername,
                password: token,
                clean: true,
                clientId: "FBJS-" + Farmbot.VERSION + "-" + util_1.uuid(),
                reconnectPeriod: reconnectPeriod
            });
            _this.client = client;
            _this.resources = new resource_adapter_1.ResourceAdapter(_this, _this.config.mqttUsername);
            client.on("message", _this._onmessage);
            client.on("offline", function () { return _this.emit(constants_1.FbjsEventName.offline, {}); });
            client.on("connect", function () { return _this.emit(constants_1.FbjsEventName.online, {}); });
            var channels = [
                _this.channel.logs,
                _this.channel.legacyStatus,
                _this.channel.status,
                _this.channel.sync,
                _this.channel.toClient,
                _this.channel.pong
            ];
            client.subscribe(channels);
            return new Promise(function (resolve, _reject) {
                var client = _this.client;
                if (client) {
                    client.once("connect", function () { return resolve(_this); });
                }
                else {
                    throw new Error("Please connect first.");
                }
            });
        };
        this._events = {};
        this.config = config_1.generateConfig(input);
        this.resources = new resource_adapter_1.ResourceAdapter(this, this.config.mqttUsername);
    }
    Object.defineProperty(Farmbot.prototype, "channel", {
        /** Dictionary of all relevant MQTT channels the bot uses. */
        get: function () {
            var deviceName = this.config.mqttUsername;
            return {
                /** From the browser, usually. */
                toDevice: "bot/" + deviceName + "/" + constants_1.MqttChanName.fromClients,
                /** From farmbot */
                toClient: "bot/" + deviceName + "/" + constants_1.MqttChanName.fromDevice,
                legacyStatus: "bot/" + deviceName + "/" + constants_1.MqttChanName.legacyStatus,
                logs: "bot/" + deviceName + "/" + constants_1.MqttChanName.logs,
                status: "bot/" + deviceName + "/" + constants_1.MqttChanName.statusV8 + "/#",
                sync: "bot/" + deviceName + "/" + constants_1.MqttChanName.sync + "/#",
                /** Read only */
                pong: "bot/" + deviceName + "/pong/#",
                /** Write only: bot/${deviceName}/ping/${timestamp} */
                ping: function (timestamp) { return "bot/" + deviceName + "/ping/" + timestamp; }
            };
        },
        enumerable: true,
        configurable: true
    });
    Farmbot.VERSION = "8.0.1-rc0";
    return Farmbot;
}());
exports.Farmbot = Farmbot;
