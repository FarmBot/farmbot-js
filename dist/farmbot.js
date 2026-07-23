"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farmbot = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const util_1 = require("./util");
const _1 = require(".");
const config_1 = require("./config");
const resource_adapter_1 = require("./resources/resource_adapter");
const constants_1 = require("./constants");
const is_celery_script_1 = require("./util/is_celery_script");
const time_1 = require("./util/time");
const rpc_request_1 = require("./util/rpc_request");
class Farmbot {
    constructor(input) {
        /** Get a Farmbot Constructor Parameter. */
        this.getConfig = (key) => this.config[key];
        /** Set a Farmbot Constructor Parameter. */
        this.setConfig = (key, value) => {
            this.config[key] = value;
        };
        /**
         * Installs a "Farmware" (plugin) onto the bot's SD card.
         * URL must point to a valid Farmware manifest JSON document.
         */
        this.installFarmware = (url) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "install_farmware", args: { url } }]));
        };
        /**
         * Checks for updates on a particular Farmware plugin when given the name of
         * a Farmware. `updateFarmware("take-photo")`
         */
        this.updateFarmware = (pkg) => {
            return this.send((0, util_1.rpcRequest)([{
                    kind: "update_farmware",
                    args: { package: pkg }
                }]));
        };
        /** Uninstall a Farmware plugin. */
        this.removeFarmware = (pkg) => {
            return this.send((0, util_1.rpcRequest)([{
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
        this.installFirstPartyFarmware = () => {
            return this.send((0, util_1.rpcRequest)([{
                    kind: "install_first_party_farmware",
                    args: {}
                }]));
        };
        /**
         * Deactivate FarmBot OS completely (shutdown).
         * Useful before unplugging the power.
         */
        this.powerOff = () => {
            return this.send((0, util_1.rpcRequest)([{ kind: "power_off", args: {} }]));
        };
        /** Restart FarmBot OS. */
        this.reboot = () => {
            return this.send((0, util_1.rpcRequest)([
                { kind: "reboot", args: { package: "farmbot_os" } }
            ]));
        };
        /** Reinitialize the FarmBot microcontroller firmware. */
        this.rebootFirmware = () => {
            return this.send((0, util_1.rpcRequest)([
                { kind: "reboot", args: { package: "arduino_firmware" } }
            ]));
        };
        /** Check for new versions of FarmBot OS.
         * Downloads and installs if available. */
        this.checkUpdates = () => {
            return this.send((0, util_1.rpcRequest)([
                { kind: "check_updates", args: { package: "farmbot_os" } }
            ]));
        };
        /** THIS WILL RESET THE SD CARD, deleting all non-factory data!
         * Be careful!! */
        this.resetOS = () => {
            return this.publish((0, util_1.rpcRequest)([
                { kind: "factory_reset", args: { package: "farmbot_os" } }
            ]));
        };
        /** WARNING: will reset all firmware (hardware) settings! */
        this.resetMCU = () => {
            return this.send((0, util_1.rpcRequest)([
                { kind: "factory_reset", args: { package: "arduino_firmware" } }
            ]));
        };
        this.flashFirmware = (
        /** one of: "arduino"|"express_k10"|"farmduino_k14"|"farmduino" */
        firmware_name) => {
            return this.send((0, util_1.rpcRequest)([{
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
        this.emergencyLock = () => {
            const body = [{ kind: "emergency_lock", args: {} }];
            const rpc = (0, util_1.rpcRequest)(body, rpc_request_1.Priority.HIGHEST);
            return this.send(rpc);
        };
        /** Unlock the bot when the user says it is safe. */
        this.emergencyUnlock = () => {
            const body = [{ kind: "emergency_unlock", args: {} }];
            const rpc = (0, util_1.rpcRequest)(body, rpc_request_1.Priority.HIGHEST);
            return this.send(rpc);
        };
        /** Execute a sequence by its ID on the FarmBot API. */
        this.execSequence = (sequence_id, body = []) => {
            return this.send((0, util_1.rpcRequest)([
                { kind: "execute", args: { sequence_id }, body }
            ]));
        };
        /** Run an installed Farmware plugin on the SD Card. */
        this.execScript = (
        /** Name of the Farmware. */
        label, 
        /** Optional ENV vars to pass the Farmware. */
        envVars) => {
            return this.send((0, util_1.rpcRequest)([
                { kind: "execute_script", args: { label }, body: envVars }
            ]));
        };
        /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */
        this.home = (args) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "home", args }]));
        };
        /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis
         * order. WON'T WORK WITHOUT ENCODERS OR END STOPS! A blockage or stall
         * during this command will set that position as zero. Use carefully. */
        this.findHome = (args) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "find_home", args }]));
        };
        /** Move FarmBot to an absolute point. */
        this.moveAbsolute = (args) => {
            const { x, y, z } = args;
            const speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
            return this.send((0, util_1.rpcRequest)([
                {
                    kind: "move_absolute",
                    args: {
                        location: (0, util_1.coordinate)(x, y, z),
                        offset: (0, util_1.coordinate)(0, 0, 0),
                        speed
                    }
                }
            ]));
        };
        /** Move FarmBot to position relative to its current position. */
        this.moveRelative = (args) => {
            const { x, y, z } = args;
            const speed = args.speed || config_1.CONFIG_DEFAULTS.speed;
            return this.send((0, util_1.rpcRequest)([
                { kind: "move_relative", args: { x, y, z, speed } }
            ]));
        };
        /** Set a GPIO pin to a particular value. */
        this.writePin = (args) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "write_pin", args }]));
        };
        /** Read the value of a GPIO pin. Will create a SensorReading if it's
         * a sensor. */
        this.readPin = (args) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "read_pin", args }]));
        };
        /** Reverse the value of a digital pin. */
        this.togglePin = (args) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "toggle_pin", args }]));
        };
        /** Read the status of the bot. Should not be needed unless you are first
         * logging in to the device, since the device pushes new states out on
         * every update. */
        this.readStatus = (args = {}) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "read_status", args }]));
        };
        /** Snap a photo and send to the API for post processing. */
        this.takePhoto = (args = {}) => this.send((0, util_1.rpcRequest)([{ kind: "take_photo", args }]));
        /** Download/apply all of the latest FarmBot API JSON resources (plants,
         * account info, etc.) to the device. */
        this.sync = (args = {}) => this.send((0, util_1.rpcRequest)([{ kind: "sync", args }]));
        /**
         * Set the current position of the given axis to 0.
         * Example: Sending `bot.setZero("x")` at x: 255 will translate position
         * 255 to 0, causing that position to be x: 0.
         */
        this.setZero = (axis) => {
            return this.send((0, util_1.rpcRequest)([{
                    kind: "zero",
                    args: { axis }
                }]));
        };
        /**
         * Set user ENV vars (usually used by 3rd-party Farmware plugins).
         * Set value to `undefined` to unset.
         */
        this.setUserEnv = (configs) => {
            const body = Object
                .keys(configs)
                .map(function (label) {
                return {
                    kind: "pair",
                    args: { label, value: (configs[label] || constants_1.Misc.NULL) }
                };
            });
            return this.send((0, util_1.rpcRequest)([{ kind: "set_user_env", args: {}, body }]));
        };
        this.sendMessage = (message_type, message, channels = []) => {
            this.send((0, util_1.rpcRequest)([{
                    kind: "send_message",
                    args: {
                        message_type,
                        message
                    },
                    body: channels.map(channel_name => ({
                        kind: "channel",
                        args: {
                            channel_name
                        }
                    }))
                }]));
        };
        /** Control servos on pins 4 and 5. */
        this.setServoAngle = (args) => {
            const result = this.send((0, util_1.rpcRequest)([{ kind: "set_servo_angle", args }]));
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
        this.calibrate = (args) => {
            return this.send((0, util_1.rpcRequest)([{ kind: "calibrate", args }]));
        };
        this.lua = (lua) => {
            return this.send((0, util_1.rpcRequest)([
                { kind: "lua", args: { lua } }
            ]));
        };
        /**
         * Retrieves all of the event handlers for a particular event.
         * Returns an empty array if the event did not exist.
         */
        this.event = (name) => {
            this._events[name] = this._events[name] || [];
            return this._events[name];
        };
        this.on = (event, value, once = false) => {
            this.event(event).push({ value, once, event });
        };
        this.emit = (event, data) => {
            const nextArray = [];
            this.event(event)
                .concat(this.event("*"))
                .forEach(function (handler) {
                try {
                    handler.value(data, event);
                    if (!handler.once && handler.event === event) {
                        nextArray.push(handler);
                    }
                }
                catch (e) {
                    const msg = `Exception thrown while handling '${event}' event.`;
                    console.warn(msg);
                    console.dir(e);
                }
            });
            if (nextArray.length === 0) {
                delete this._events[event];
            }
            else {
                this._events[event] = nextArray;
            }
        };
        /** Low-level means of sending MQTT packets. Does not check format. Does not
         * acknowledge confirmation. Probably not the one you want. */
        this.publish = (msg, important = true) => {
            if (this.client) {
                this.emit(constants_1.FbjsEventName.sent, msg);
                /** SEE: https://github.com/mqttjs/MQTT.js#client */
                this.client.publish(this.channel.toDevice, JSON.stringify(msg));
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
        this.send = (input) => {
            return new Promise((resolve, reject) => {
                this.publish(input);
                function handler(response) {
                    switch (response.kind) {
                        case "rpc_ok": return resolve(response);
                        case "rpc_error":
                            const reason = (response.body || [])
                                .map(x => x.args.message)
                                .join(", ");
                            return reject(new Error(reason));
                        default:
                            console.dir(response);
                            throw new Error("Got a bad CeleryScript node.");
                    }
                }
                this.on(input.args.label, handler, true);
            });
        };
        /** Main entry point for all MQTT packets. */
        this._onmessage = (chan, buffer) => {
            const original = (0, _1.bufferToString)(buffer);
            const segments = chan.split(constants_1.Misc.MQTT_DELIM);
            const { emit } = this;
            try {
                const msg = JSON.parse(original);
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
                        const ev = (0, is_celery_script_1.hasLabel)(msg) ? msg.args.label : constants_1.FbjsEventName.malformed;
                        return emit(ev, msg);
                }
            }
            catch (error) {
                console
                    .dir({ text: "Could not parse inbound message from MQTT.", error });
                emit(constants_1.FbjsEventName.malformed, original);
            }
        };
        this.ping = (timeout = 10000, now = (0, time_1.timestamp)()) => {
            this.setConfig("LAST_PING_OUT", now);
            return this.doPing(now, timeout);
        };
        // STEP 0: Subscribe to `bot/device_23/pong/#`
        // STEP 0: Send         `bot/device_23/ping/3123123`
        // STEP 0: Receive      `bot/device_23/pong/3123123`
        this.doPing = (startedAt, timeout) => {
            const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(-0), timeout));
            const pingPromise = new Promise((res, _) => {
                const ok = () => {
                    const t = (0, time_1.timestamp)();
                    this.setConfig("LAST_PING_IN", t);
                    res(t - startedAt);
                };
                this.on("" + startedAt, ok, true);
                const chan = this.channel.ping(startedAt);
                if (this.client) {
                    this.client.publish(chan, JSON.stringify(startedAt));
                }
            });
            return Promise.race([timeoutPromise, pingPromise]);
        };
        /** Bootstrap the device onto the MQTT broker. */
        this.connect = () => {
            const { mqttUsername, token, mqttServer } = this.config;
            const reconnectPeriod = constants_1.Misc.RECONNECT_THROTTLE_MS;
            const client = mqtt_1.default.connect(mqttServer, {
                clean: true,
                clientId: `FBJS-${Farmbot.VERSION}-${(0, util_1.uuid)()}`,
                password: token,
                protocolId: "MQTT",
                protocolVersion: 4,
                reconnectPeriod,
                username: mqttUsername,
            });
            this.client = client;
            this.resources = new resource_adapter_1.ResourceAdapter(this, this.config.mqttUsername);
            client.on("message", this._onmessage);
            client.on("offline", () => this.emit(constants_1.FbjsEventName.offline, {}));
            client.on("connect", () => this.emit(constants_1.FbjsEventName.online, {}));
            const channels = [
                this.channel.logs,
                this.channel.status,
                this.channel.sync,
                this.channel.toClient,
                this.channel.pong
            ];
            client.subscribe(channels);
            return new Promise((resolve, _reject) => {
                if (this.client) {
                    this.client.once("connect", () => resolve(this));
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
    /** Dictionary of all relevant MQTT channels the bot uses. */
    get channel() {
        const deviceName = this.config.mqttUsername;
        return {
            /** From the browser, usually. */
            toDevice: `bot/${deviceName}/${constants_1.MqttChanName.fromClients}`,
            /** From farmbot */
            toClient: `bot/${deviceName}/${constants_1.MqttChanName.fromDevice}`,
            status: `bot/${deviceName}/${constants_1.MqttChanName.status}`,
            logs: `bot/${deviceName}/${constants_1.MqttChanName.logs}`,
            sync: `bot/${deviceName}/${constants_1.MqttChanName.sync}/#`,
            /** Read only */
            pong: `bot/${deviceName}/pong/#`,
            /** Write only: bot/${deviceName}/ping/${timestamp} */
            ping: (tStamp) => `bot/${deviceName}/ping/${tStamp}`
        };
    }
}
exports.Farmbot = Farmbot;
Farmbot.VERSION = "15.9.7";
