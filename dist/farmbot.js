"use strict";
var mqtt_1 = require("mqtt");
var util_1 = require("./util");
var util_2 = require("./util");
exports.NULL = "null";
var Farmbot = (function () {
    function Farmbot(input) {
        this._events = {};
        this._state = util_1.assign({}, Farmbot.defaults, input);
        this._decodeThatToken();
    }
    Farmbot.prototype._decodeThatToken = function () {
        var token;
        try {
            var str = this.getState()["token"];
            var base64 = str.split(".")[1];
            var plaintext = atob(base64);
            token = JSON.parse(plaintext);
        }
        catch (e) {
            console.warn(e);
            throw new Error("Unable to parse token. Is it properly formatted?");
        }
        var mqttUrl = token.mqtt || "MQTT SERVER MISSING FROM TOKEN";
        var isSecure = location.protocol === "https:";
        var protocol = isSecure ? "wss://" : "ws://";
        var port = isSecure ? 443 : 3002;
        this.setState("mqttServer", "" + protocol + mqttUrl + ":" + port);
        this.setState("uuid", token.bot || "UUID MISSING FROM TOKEN");
    };
    Farmbot.prototype.getState = function () {
        return JSON.parse(JSON.stringify(this._state));
    };
    ;
    Farmbot.prototype.setState = function (key, val) {
        if (val !== this._state[key]) {
            var old = this._state[key];
            this._state[key] = val;
            this.emit("change", { name: key, value: val, oldValue: old });
        }
        ;
        return val;
    };
    ;
    Farmbot.prototype.installFarmware = function (url) {
        return this.send(util_1.rpcRequest([{
                kind: "install_farmware",
                args: { url: url }
            }]));
    };
    Farmbot.prototype.updateFarmware = function (pkg) {
        return this.send(util_1.rpcRequest([{
                kind: "update_farmware",
                args: { package: pkg }
            }]));
    };
    Farmbot.prototype.removeFarmware = function (pkg) {
        return this.send(util_1.rpcRequest([{
                kind: "remove_farmware",
                args: { package: pkg }
            }]));
    };
    Farmbot.prototype.powerOff = function () {
        return this.send(util_1.rpcRequest([{ kind: "power_off", args: {} }]));
    };
    Farmbot.prototype.reboot = function () {
        return this.send(util_1.rpcRequest([{ kind: "reboot", args: {} }]));
    };
    Farmbot.prototype.checkUpdates = function () {
        return this.send(util_1.rpcRequest([
            { kind: "check_updates", args: { package: "farmbot_os" } }
        ]));
    };
    // TODO: Merge this (legacy) method with #checkUpdates().
    Farmbot.prototype.checkArduinoUpdates = function () {
        return this.send(util_1.rpcRequest([
            { kind: "check_updates", args: { package: "arduino_firmware" } }
        ]));
    };
    /** THIS WILL RESET EVERYTHING! Be careful!! */
    Farmbot.prototype.factoryReset = function () {
        return this.send(util_1.rpcRequest([{ kind: "factory_reset", args: {} }]));
    };
    /** Lock the bot from moving. This also will pause running regimens and cause
     *  any running sequences to exit
     */
    Farmbot.prototype.emergencyLock = function () {
        return this.send(util_1.rpcRequest([{ kind: "emergency_lock", args: {} }]));
    };
    /** Unlock the bot when the user says it is safe. */
    Farmbot.prototype.emergencyUnlock = function () {
        return this.send(util_1.rpcRequest([{ kind: "emergency_unlock", args: {} }]));
    };
    Farmbot.prototype.execSequence = function (sequence_id) {
        return this.send(util_1.rpcRequest([{ kind: "execute", args: { sequence_id: sequence_id } }]));
    };
    Farmbot.prototype.execScript = function (/** Filename of the script */ label, 
        /** Optional ENV vars to pass the script */
        envVars) {
        return this.send(util_1.rpcRequest([
            { kind: "execute_script", args: { label: label }, body: envVars }
        ]));
    };
    Farmbot.prototype.home = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "home", args: args }]));
    };
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
    Farmbot.prototype.moveRelative = function (args) {
        var x = args.x, y = args.y, z = args.z, speed = args.speed;
        speed = speed || Farmbot.defaults.speed;
        return this.send(util_1.rpcRequest([{ kind: "move_relative", args: { x: x, y: y, z: z, speed: speed } }]));
    };
    Farmbot.prototype.writePin = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "write_pin", args: args }]));
    };
    Farmbot.prototype.togglePin = function (args) {
        return this.send(util_1.rpcRequest([{ kind: "toggle_pin", args: args }]));
    };
    Farmbot.prototype.readStatus = function (args) {
        if (args === void 0) { args = {}; }
        return this.send(util_1.rpcRequest([{ kind: "read_status", args: args }]));
    };
    Farmbot.prototype.takePhoto = function (args) {
        if (args === void 0) { args = {}; }
        return this.send(util_1.rpcRequest([{ kind: "take_photo", args: args }]));
    };
    Farmbot.prototype.sync = function (args) {
        if (args === void 0) { args = {}; }
        return this.send(util_1.rpcRequest([{ kind: "sync", args: args }]));
    };
    /** Update the arduino settings */
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
    /** Set user ENV vars (usually used by 3rd party scripts).
     * Set value to `undefined` to unset.
     */
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
    /** Update a config */
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
    /** Lets the bot know that some resources it has in cache are no longer valid.
     *
     * Hopefully, some day we will not need this. Ideally, sending this message
     * would be handled by the API, but currently the API is REST only and does
     * not support push state messaging.
     */
    Farmbot.prototype.dataUpdate = function (value, input) {
        var body = util_1.toPairs(input);
        var args = { value: value };
        // I'm using .publish() instead of .send() because confirmation requests are
        // of less importance right now - RC 2 APR 17.
        return this.publish(util_1.rpcRequest([{ kind: "data_update", body: body, args: args }]));
    };
    /** Retrieves all of the event handlers for a particular event.
     * Returns an empty array if the event did not exist.
      */
    Farmbot.prototype.event = function (name) {
        this._events[name] = this._events[name] || [];
        return this._events[name];
    };
    ;
    Farmbot.prototype.on = function (event, callback) {
        this.event(event).push(callback);
    };
    ;
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
        get: function () {
            var uuid = this.getState()["uuid"] || "lost_and_found";
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
    Farmbot.prototype.publish = function (msg) {
        if (this.client) {
            /** SEE: https://github.com/mqttjs/MQTT.js#client */
            this.client.publish(this.channel.toDevice, JSON.stringify(msg));
        }
        else {
            throw new Error("Not connected to server");
        }
    };
    ;
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
    ;
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
    ;
    Farmbot.prototype.connect = function () {
        var that = this;
        var _a = that.getState(), uuid = _a.uuid, token = _a.token, mqttServer = _a.mqttServer, timeout = _a.timeout;
        that.client = mqtt_1.connect(mqttServer, {
            username: uuid,
            password: token
        });
        that.client.subscribe(that.channel.toClient);
        that.client.subscribe(that.channel.logs);
        that.client.subscribe(that.channel.status);
        that.client.on("message", that._onmessage.bind(that));
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
    return Farmbot;
}());
Farmbot.VERSION = "3.2.0";
Farmbot.defaults = { speed: 800, timeout: 6000 };
exports.Farmbot = Farmbot;
