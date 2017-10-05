"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mqtt_1 = require("mqtt");
var util_1 = require("./util");
var util_2 = require("./util");
var index_1 = require("./index");
exports.NULL = "null";
var ERR_MISSING_MQTT = "MQTT SERVER MISSING FROM TOKEN";
var ERR_MISSING_UUID = "MISSING_UUID";
var ERR_TOKEN_PARSE = "Unable to parse token. Is it properly formatted?";
var UUID = "uuid";
// Prevents our error catcher from getting overwhelmed by failed
// connection attempts
var RECONNECT_THROTTLE = 45000;
var Farmbot = (function () {
    function Farmbot(input) {
        var _this = this;
        this._decodeThatToken = function () {
            var token;
            try {
                var str = _this.getState()["token"];
                var base64 = str.split(".")[1];
                var plaintext = atob(base64);
                token = JSON.parse(plaintext);
            }
            catch (e) {
                console.warn(e);
                throw new Error(ERR_TOKEN_PARSE);
            }
            var mqttUrl = token.mqtt || ERR_MISSING_MQTT;
            var isSecure = !!_this._state.secure;
            var protocol;
            var port;
            if (index_1.isNode()) {
                protocol = "mqtt://";
                port = 1883;
            }
            else {
                protocol = isSecure ? "wss://" : "ws://";
                console.log(isSecure ?
                    "UNSTABLE" : "Need to change port 3002 for non-https self hosters");
                port = isSecure ? 443 : 3002;
            }
            _this.setState("mqttServer", "" + protocol + mqttUrl + ":" + port + "/ws/mqtt");
            _this.setState(UUID, token.bot || ERR_MISSING_UUID);
        };
        if (index_1.isNode() && !global.atob) {
            throw new Error("NOTE TO NODEJS USERS:\n\n      This library requires an 'atob()' function.\n      Please fix this first.\n      SOLUTION: https://github.com/FarmBot/farmbot-js/issues/33\n      ");
        }
        this._events = {};
        this._state = util_1.assign({}, Farmbot.defaults, input);
        this._decodeThatToken();
    }
    /** Returns a READ ONLY copy of the local configuration. */
    Farmbot.prototype.getState = function () {
        return JSON.parse(JSON.stringify(this._state));
    };
    /** Write a configuration value for local use.
     * Eg: setState("timeout", 999)
     */
    Farmbot.prototype.setState = function (key, val) {
        if (val !== this._state[key]) {
            var old = this._state[key];
            this._state[key] = val;
            this.emit("change", { name: key, value: val, oldValue: old });
        }
        return val;
    };
    /** Installs a "Farmware" (plugin) onto the bot's SD card.
     * URL must point to a valid Farmware manifest JSON document.
     */
    Farmbot.prototype.installFarmware = function (url) {
        return this.send(util_1.rpcRequest([{
                kind: "install_farmware",
                args: { url: url }
            }]));
    };
    /** Checks for updates on a particular Farmware plugin when given the name of
     * a farmware. `updateFarmware("take-photo")`
     */
    Farmbot.prototype.updateFarmware = function (pkg) {
        return this.send(util_1.rpcRequest([{
                kind: "update_farmware",
                args: { package: pkg }
            }]));
    };
    /** Uninstall a Farmware plugin. */
    Farmbot.prototype.removeFarmware = function (pkg) {
        return this.send(util_1.rpcRequest([{
                kind: "remove_farmware",
                args: { package: pkg }
            }]));
    };
    /** Deactivate FarmBot OS completely. */
    Farmbot.prototype.powerOff = function () {
        return this.send(util_1.rpcRequest([{ kind: "power_off", args: {} }]));
    };
    /** Cycle device power. */
    Farmbot.prototype.reboot = function () {
        return this.send(util_1.rpcRequest([{ kind: "reboot", args: {} }]));
    };
    /** Check for new versions of FarmBot OS. */
    Farmbot.prototype.checkUpdates = function () {
        return this.send(util_1.rpcRequest([
            { kind: "check_updates", args: { package: "farmbot_os" } }
        ]));
    };
    /** THIS WILL RESET THE SD CARD! Be careful!! */
    Farmbot.prototype.resetOS = function () {
        this.publish(util_1.rpcRequest([
            { kind: "factory_reset", args: { package: "farmbot_os" } }
        ]));
    };
    Farmbot.prototype.resetMCU = function () {
        return this.send(util_1.rpcRequest([
            { kind: "factory_reset", args: { package: "arduino_firmware" } }
        ]));
    };
    /** Lock the bot from moving. This also will pause running regimens and cause
     *  any running sequences to exit */
    Farmbot.prototype.emergencyLock = function () {
        return this.send(util_1.rpcRequest([{ kind: "emergency_lock", args: {} }]));
    };
    /** Unlock the bot when the user says it is safe. Currently experiencing
     * issues. Consider reboot() instead. */
    Farmbot.prototype.emergencyUnlock = function () {
        return this.send(util_1.rpcRequest([{ kind: "emergency_unlock", args: {} }]));
    };
    /** Execute a sequence by its ID on the API. */
    Farmbot.prototype.execSequence = function (sequence_id) {
        return this.send(util_1.rpcRequest([{ kind: "execute", args: { sequence_id: sequence_id } }]));
    };
    /** Run a preloaded Farmware / script on the SD Card. */
    Farmbot.prototype.execScript = function (/** Filename of the script */ label, 
        /** Optional ENV vars to pass the script */
        envVars) {
        return this.send(util_1.rpcRequest([
            { kind: "execute_script", args: { label: label }, body: envVars }
        ]));
    };
    /** Bring a particular axis (or all of them) to position 0. */
    Farmbot.prototype.home = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "home", args: args }]));
    };
    /** Use end stops or encoders to figure out where 0,0,0 is.
     *  WON'T WORK WITHOUT ENCODERS OR ENDSTOPS! */
    Farmbot.prototype.findHome = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "find_home", args: args }]));
    };
    /** Move gantry to an absolute point. */
    Farmbot.prototype.moveAbsolute = function (args) {
        var x = args.x, y = args.y, z = args.z, speed = args.speed;
        speed = speed || Farmbot.defaults.speed;
        return this.send(util_1.rpcRequest([
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
    /** Move gantry to position relative to its current position. */
    Farmbot.prototype.moveRelative = function (args) {
        var x = args.x, y = args.y, z = args.z, speed = args.speed;
        speed = speed || Farmbot.defaults.speed;
        return this.send(util_1.rpcRequest([{ kind: "move_relative", args: { x: x, y: y, z: z, speed: speed } }]));
    };
    /** Set a GPIO pin to a particular value. */
    Farmbot.prototype.writePin = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "write_pin", args: args }]));
    };
    /** Reverse the value of a digital pin. */
    Farmbot.prototype.togglePin = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "toggle_pin", args: args }]));
    };
    /** Read the status of the bot. Should not be needed unless you are first
     * logging in to the device, since the device pushes new states out on
     * every update. */
    Farmbot.prototype.readStatus = function (args) {
        if (args === void 0) { args = {}; }
        return this.send(util_1.rpcRequest([{ kind: "read_status", args: args }]));
    };
    /** Snap a photo and send to the API for post processing. */
    Farmbot.prototype.takePhoto = function (args) {
        if (args === void 0) { args = {}; }
        return this.send(util_1.rpcRequest([{ kind: "take_photo", args: args }]));
    };
    /** Download all of the latest JSON resources (plants, account info...)
     * from the FarmBot API. */
    Farmbot.prototype.sync = function (args) {
        if (args === void 0) { args = {}; }
        return this.send(util_1.rpcRequest([{ kind: "sync", args: args }]));
    };
    /** Set the position of the given axis to 0 at the current position of said
     * axis. Example: Sending bot.setZero("x") at x: 255 will translate position
     * 255 to 0. */
    Farmbot.prototype.setZero = function (axis) {
        return this.send(util_1.rpcRequest([{
                kind: "zero",
                args: { axis: axis }
            }]));
    };
    /** Update the Arduino settings */
    Farmbot.prototype.updateMcu = function (update) {
        var body = [];
        Object
            .keys(update)
            .forEach(function (label) {
            var value = util_2.pick(update, label, "ERROR");
            body.push({
                kind: "config_update",
                args: { package: "arduino_firmware" },
                body: [
                    {
                        kind: "pair",
                        args: { value: value, label: label }
                    }
                ]
            });
        });
        return this.send(util_1.rpcRequest(body));
    };
    /** Set user ENV vars (usually used by 3rd party Farmware scripts).
     * Set value to `undefined` to unset. */
    Farmbot.prototype.setUserEnv = function (configs) {
        var body = Object
            .keys(configs)
            .map(function (label) {
            return {
                kind: "pair",
                args: { label: label, value: (configs[label] || exports.NULL) }
            };
        });
        return this.send(util_1.rpcRequest([{ kind: "set_user_env", args: {}, body: body }]));
    };
    /** Update a config option for FarmBot OS. */
    Farmbot.prototype.updateConfig = function (update) {
        var body = Object
            .keys(update)
            .map(function (label) {
            var value = util_2.pick(update, label, "ERROR");
            return { kind: "pair", args: { value: value, label: label } };
        });
        return this.send(util_1.rpcRequest([{
                kind: "config_update",
                args: { package: "farmbot_os" },
                body: body
            }]));
    };
    Farmbot.prototype.calibrate = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "calibrate", args: args }]));
    };
    /** Let the bot know that some resources it has in cache are no longer valid.
     *
     * Hopefully, some day we will not need this. Ideally, sending this message
     * would be handled by the API, but currently the API is REST only and does
     * not support push state messaging.
     */
    Farmbot.prototype.dataUpdate = function (value, input) {
        var body = util_1.toPairs(input);
        var args = { value: value };
        var rpc = util_1.rpcRequest([{ kind: "data_update", body: body, args: args }]);
        // I'm using .publish() instead of .send() because confirmation requests are
        // of less importance right now - RC 2 APR 17.
        return this.publish(rpc, false);
    };
    /** Retrieves all of the event handlers for a particular event.
     * Returns an empty array if the event did not exist.
      */
    Farmbot.prototype.event = function (name) {
        this._events[name] = this._events[name] || [];
        return this._events[name];
    };
    Farmbot.prototype.on = function (event, callback) {
        this.event(event).push(callback);
    };
    Farmbot.prototype.emit = function (event, data) {
        [this.event(event), this.event("*")]
            .forEach(function (handlers) {
            handlers.forEach(function (handler) {
                try {
                    handler(data, event);
                }
                catch (e) {
                    console.warn("Exception thrown while handling `" + event + "` event.");
                }
            });
        });
    };
    Object.defineProperty(Farmbot.prototype, "channel", {
        /** Dictionary of all relevant MQTT channels the bot uses. */
        get: function () {
            var uuid = this.getState()[UUID] || ERR_MISSING_UUID;
            return {
                /** From the browser, usually. */
                toDevice: "bot/" + uuid + "/from_clients",
                /** From farmbot */
                toClient: "bot/" + uuid + "/from_device",
                status: "bot/" + uuid + "/status",
                logs: "bot/" + uuid + "/logs"
            };
        },
        enumerable: true,
        configurable: true
    });
    /** Low level means of sending MQTT packets. Does not check format. Does not
     * acknowledge confirmation. Probably not the one you want. */
    Farmbot.prototype.publish = function (msg, important) {
        if (important === void 0) { important = true; }
        if (this.client) {
            /** SEE: https://github.com/mqttjs/MQTT.js#client */
            this.client.publish(this.channel.toDevice, JSON.stringify(msg));
        }
        else {
            if (important) {
                throw new Error("Not connected to server");
            }
        }
    };
    /** Low level means of sending MQTT RPC commands to the bot. Acknowledges
     * receipt of message, but does not check formatting. Consider using higher
     * level methods like .moveRelative(), .calibrate(), etc....
    */
    Farmbot.prototype.send = function (input) {
        var that = this;
        var done = false;
        return new Promise(function (resolve, reject) {
            that.publish(input);
            var label = (input.body || []).map(function (x) { return x.kind; }).join(", ");
            var time = that.getState()["timeout"];
            setTimeout(function () {
                if (!done) {
                    reject(new Error(label + " timeout after " + time + " ms."));
                }
            }, time);
            that.on(input.args.label, function (response) {
                done = true;
                switch (response.kind) {
                    case "rpc_ok": return resolve(response);
                    case "rpc_error":
                        var reason = (response.body || []).map(function (x) { return x.args.message; }).join(", ");
                        return reject(new Error("Problem sending RPC command: " + reason));
                    default:
                        console.dir(response);
                        throw new Error("Got a bad CeleryScript node.");
                }
            });
        });
    };
    /** Main entry point for all MQTT packets. */
    Farmbot.prototype._onmessage = function (chan, buffer) {
        try {
            /** UNSAFE CODE: TODO: Add user defined type guards? */
            var msg = JSON.parse(buffer.toString());
        }
        catch (error) {
            throw new Error("Could not parse inbound message from MQTT.");
        }
        switch (chan) {
            case this.channel.logs: return this.emit("logs", msg);
            case this.channel.status: return this.emit("status", msg);
            case this.channel.toClient:
                if (util_2.isCeleryScript(msg)) {
                    return this.emit(msg.args.label, msg);
                }
                else {
                    console.warn("Got malformed message. Out of date firmware?");
                    return this.emit("malformed", msg);
                }
            default: throw new Error("Never should see this.");
        }
    };
    /** Bootstrap the device onto the MQTT broker. */
    Farmbot.prototype.connect = function () {
        var _this = this;
        var that = this;
        var _a = that.getState(), uuid = _a.uuid, token = _a.token, mqttServer = _a.mqttServer, timeout = _a.timeout;
        that.client = mqtt_1.connect(mqttServer, {
            username: uuid,
            password: token,
            reconnectPeriod: RECONNECT_THROTTLE
        });
        that.client.subscribe(that.channel.toClient);
        that.client.subscribe(that.channel.logs);
        that.client.subscribe(that.channel.status);
        that.client.on("message", that._onmessage.bind(that));
        that.client.on("offline", function () { return _this.emit("offline", {}); });
        that.client.on("connect", function () { return _this.emit("online", {}); });
        var done = false;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (!done) {
                    reject(new Error("Failed to connect to MQTT after " + timeout + " ms."));
                }
            }, timeout);
            that.client.once("connect", function () { return resolve(that); });
        });
    };
    Farmbot.VERSION = "5.0.1-rc6";
    Farmbot.defaults = { speed: 800, timeout: 15000, secure: true };
    return Farmbot;
}());
exports.Farmbot = Farmbot;
