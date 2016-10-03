"use strict";
var fbpromise_1 = require("./fbpromise");
var mqtt_1 = require("mqtt");
var util_1 = require("./util");
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
        this.setState("mqttServer", "ws://" + mqttUrl + ":3002");
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
    Farmbot.prototype.emergencyStop = function () {
        var p = {
            method: "emergency_stop",
            params: [],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.execSequence = function (sequence) {
        var p = {
            method: "exec_sequence",
            params: [sequence],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.homeAll = function (i) {
        var p = {
            method: "home_all",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.homeX = function (i) {
        var p = {
            method: "home_x",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.homeY = function (i) {
        var p = {
            method: "home_y",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.homeZ = function (i) {
        var p = {
            method: "home_z",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.moveAbsolute = function (i) {
        var p = {
            method: "move_absolute",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.moveRelative = function (i) {
        var p = {
            method: "move_relative",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.writePin = function (i) {
        var p = {
            method: "write_pin",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.readStatus = function () {
        var p = {
            method: "read_status",
            params: [],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.syncSequence = function () {
        var p = {
            method: "sync",
            params: [],
            id: util_1.uuid()
        };
        return this.send(p);
    };
    Farmbot.prototype.updateCalibration = function (i) {
        var p = {
            method: "update_calibration",
            params: [i],
            id: util_1.uuid()
        };
        return this.send(p);
    };
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
                inbound: "bot/" + uuid + "/inbound",
                outbound: "bot/" + uuid + "/inbound"
            };
        },
        enumerable: true,
        configurable: true
    });
    Farmbot.prototype.publish = function (msg) {
        if (this.client) {
            this.client.publish(this.channel, JSON.stringify(msg));
        }
        else {
            throw new Error("Not connected to server");
        }
    };
    ;
    Farmbot.prototype.send = function (input) {
        var that = this;
        var msg = input;
        var label = msg.method + " " + JSON.stringify(msg.params);
        var time = that.getState()["timeout"];
        var p = fbpromise_1.timerDefer(time, label);
        console.log("Sent: " + msg.id);
        that.publish(msg);
        that.on(msg.id, function (response) {
            console.log("Got " + (response.id || "??"));
            if (response && response.result) {
                // Good method invocation.
                p.resolve(response);
            }
            ;
            if (response && response.error) {
                // Bad method invocation.
                p.reject(response.error);
            }
            else {
                // It's not JSONRPC.
                var e = new Error("Malformed response");
                console.error(e);
                console.dir(response);
                p.reject(e);
            }
        });
        return p.promise;
    };
    ;
    Farmbot.prototype._onmessage = function (_, buffer /*, message*/) {
        var msg = JSON.parse(buffer.toString());
        var id = (msg.id || "*");
        this.emit(id, msg);
    };
    ;
    Farmbot.prototype.connect = function () {
        var that = this;
        var _a = that.getState(), uuid = _a.uuid, token = _a.token, mqttServer = _a.mqttServer, timeout = _a.timeout;
        var p = fbpromise_1.timerDefer(timeout, "MQTT Connect Atempt");
        that.client = mqtt_1.connect(mqttServer, {
            username: uuid,
            password: token
        });
        that.client.subscribe(that.channel);
        that.client.once("connect", function () { return p.resolve(that); });
        that.client.on("message", that._onmessage.bind(that));
        return p.promise;
    };
    return Farmbot;
}());
exports.Farmbot = Farmbot;
Farmbot.VERSION = "2.0.0-rc.9";
Farmbot.defaults = { speed: 100, timeout: 6000 };
