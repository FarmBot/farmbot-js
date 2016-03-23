"use strict";
var mqtt_1 = require('mqtt');
var Farmbot = (function () {
    function Farmbot(input) {
        if (!(this instanceof Farmbot))
            return new Farmbot(input);
        this._events = {};
        this._state = Farmbot.extend({}, [Farmbot.config.defaultOptions, input]);
        Farmbot.requireKeys(this._state, Farmbot.config.requiredOptions);
    }
    Farmbot.prototype.listState = function () {
        return Object.keys(this._state);
    };
    ;
    Farmbot.prototype.getState = function (key) {
        return this._state[key];
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
        return this.send({
            params: {},
            method: "single_command.EMERGENCY STOP"
        });
    };
    Farmbot.prototype.execSequence = function (sequence) {
        return this.send({
            params: sequence,
            method: "exec_sequence"
        });
    };
    Farmbot.prototype.homeAll = function (opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME ALL"
        });
    };
    Farmbot.prototype.homeX = function (opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME X"
        });
    };
    Farmbot.prototype.homeY = function (opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME Y"
        });
    };
    Farmbot.prototype.homeZ = function (opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME Z"
        });
    };
    Farmbot.prototype.moveAbsolute = function (opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.MOVE ABSOLUTE"
        });
    };
    Farmbot.prototype.moveRelative = function (opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.MOVE RELATIVE"
        });
    };
    Farmbot.prototype.pinWrite = function (opts) {
        Farmbot.requireKeys(opts, ["pin", "value1", "mode"]);
        return this.send({
            params: opts,
            method: "single_command.PIN WRITE"
        });
    };
    Farmbot.prototype.readStatus = function () {
        return this.send({
            params: {},
            method: "read_status"
        });
    };
    Farmbot.prototype.syncSequence = function () {
        console.warn("Not yet implemented");
        return this.send({
            params: {},
            method: "sync_sequence"
        });
    };
    Farmbot.prototype.updateCalibration = function (params) {
        return this.send({ params: params || {}, method: "update_calibration" });
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
        [this.event(event), this.event('*')]
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
    Farmbot.prototype.buildMessage = function (input) {
        var msg = input || {};
        var metaData = {
            id: (msg.id || Farmbot.uuid())
        };
        Farmbot.extend(msg, [metaData]);
        Farmbot.requireKeys(msg, ["params", "method", "id"]);
        return msg;
    };
    ;
    Farmbot.prototype.channel = function (name) {
        return "bot/" + this.getState("username") + "/" + name;
    };
    ;
    Farmbot.prototype.send = function (input) {
        var that = this;
        var msg = input || {};
        var label = msg.method + " " + msg.params;
        var time = that.getState("timeout");
        this.client.publish(this.channel('request'), JSON.stringify(input));
        var p = Farmbot.timerDefer(time, label);
        that.on(msg.id, function (response) {
            var respond = ((response || {}).result) ? p.resolve : p.reject;
            respond(response);
        });
        return p;
    };
    ;
    Farmbot.prototype._onmessage = function (channel, buffer, message) {
        console.log(channel);
        var msg = JSON.parse(buffer.toString());
        var id = msg.id;
        if (id) {
            this.emit(id, msg.message);
        }
        else {
            this.emit(msg.name, msg.message);
        }
        ;
    };
    ;
    Farmbot.prototype.connect = function () {
        var _this = this;
        var p = Farmbot.timerDefer(this.getState("timeout"), "connecting to MQTT");
        this.client = mqtt_1.connect(this.getState("mqttServer"), {
            username: this.getState("username"),
            password: this.getState("password")
        });
        this.client.on("connect", function () {
            if (p.finished) {
                return;
            }
            ;
            _this.client.on("message", _this._onmessage);
            _this.client.subscribe([
                _this.channel("error"),
                _this.channel("response"),
                _this.channel("notification")
            ]);
            p.resolve(_this);
        });
        return p;
    };
    Farmbot.defer = function (label) {
        var $reject, $resolve;
        var that = new Promise(function (resolve, reject) {
            $reject = reject;
            $resolve = resolve;
        });
        that.finished = false;
        that.reject = function () {
            that.finished = true;
            $reject.apply(that, arguments);
        };
        that.resolve = function () {
            that.finished = true;
            $resolve.apply(that, arguments);
        };
        that.label = label || "a promise";
        return that;
    };
    ;
    Farmbot.timerDefer = function (timeout, label) {
        label = label || ("promise with " + timeout + " ms timeout");
        var that = Farmbot.defer(label);
        if (!timeout) {
            throw new Error("No timeout value set.");
        }
        ;
        setTimeout(function () {
            if (!that.finished) {
                var failure = new Error("`" + label + "` did not execute in time");
                that.reject(failure);
            }
            ;
        }, timeout);
        return that;
    };
    ;
    Farmbot.extend = function (target, mixins) {
        mixins.forEach(function (mixin) {
            var iterate = function (prop) {
                target[prop] = mixin[prop];
            };
            Object.keys(mixin).forEach(iterate);
        });
        return target;
    };
    ;
    Farmbot.requireKeys = function (input, required) {
        required.forEach(function (prop) {
            var val = input[prop];
            if (!val && (val !== 0)) {
                throw (new Error("Expected input object to have `" + prop +
                    "` property"));
            }
        });
    };
    ;
    Farmbot.uuid = function () {
        var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        var replaceChar = function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        };
        return template.replace(/[xy]/g, replaceChar);
    };
    ;
    Farmbot.MeshErrorResponse = function (input) {
        return {
            error: {
                method: "error",
                error: input || "unspecified error"
            }
        };
    };
    Farmbot.config = {
        requiredOptions: ["mqttServer", "timeout", "username", "password"],
        defaultOptions: {
            speed: 100,
            mqttServer: 'ws://localhost:3002',
            timeout: 6000
        }
    };
    return Farmbot;
}());
exports.Farmbot = Farmbot;
//# sourceMappingURL=idea.js.map