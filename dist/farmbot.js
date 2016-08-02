(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mqtt"));
	else if(typeof define === 'function' && define.amd)
		define(["mqtt"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("mqtt")) : factory(root["mqtt"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var fbpromise_1 = __webpack_require__(1);
	var connect = __webpack_require__(2).connect;
	var Farmbot = (function () {
	    function Farmbot(input) {
	        if (!(this instanceof Farmbot))
	            return new Farmbot(input);
	        this._events = {};
	        this._state = Farmbot.extend({}, [Farmbot.config.defaultOptions, input]);
	        Farmbot.requireKeys(this._state, Farmbot.config.requiredOptions);
	        this._decodeThatToken();
	    }
	    Farmbot.prototype._decodeThatToken = function () {
	        var token;
	        try {
	            token = JSON.parse(atob((this.getState("token").split(".")[1])));
	        }
	        catch (e) {
	            console.warn(e);
	            throw new Error("Unable to parse token. Is it properly formatted?");
	        }
	        var mqttUrl = token.mqtt || "MQTT SERVER MISSING FROM TOKEN";
	        this.setState("mqttServer", "ws://" + mqttUrl + ":3002");
	        this.setState("uuid", token.bot || "UUID MISSING FROM TOKEN");
	    };
	    Farmbot.prototype.getState = function (key) {
	        if (key) {
	            return this._state[key];
	        }
	        else {
	            // Create a copy of the state object to prevent accidental mutation.
	            return JSON.parse(JSON.stringify(this._state));
	        }
	        ;
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
	    // TODO create a `sequence` constructor that validates and enforces inputs, to
	    // avoid confusion.
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
	        // Valid keys for `params` object: movement_timeout_x, movement_timeout_y,
	        // movement_timeout_z, movement_invert_endpoints_x,
	        // movement_invert_endpoints_y, movement_invert_endpoints_z,
	        // movement_invert_motor_x, movement_invert_motor_y, movement_invert_motor_z,
	        // movement_steps_acc_dec_x, movement_steps_acc_dec_y,
	        // movement_steps_acc_dec_z, movement_home_up_x, movement_home_up_y,
	        // movement_home_up_z, movement_min_spd_x, movement_min_spd_y,
	        // movement_min_spd_z, movement_max_spd_x, movement_max_spd_y,
	        // movement_max_spd_z
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
	    /** Validates RPCPayloads. Also adds optional fields if missing. */
	    Farmbot.prototype.buildMessage = function (input) {
	        var msg = (input || {});
	        var metaData = {
	            id: (msg.id || Farmbot.uuid())
	        };
	        Farmbot.extend(msg, [metaData]);
	        Farmbot.requireKeys(msg, ["params", "method", "id"]);
	        return msg;
	    };
	    ;
	    Farmbot.prototype.channel = function (name) {
	        return "bot/" + this.getState("uuid") + "/" + name;
	    };
	    ;
	    Farmbot.prototype.send = function (input) {
	        var that = this;
	        var msg = this.buildMessage(input);
	        var label = msg.method + " " + JSON.stringify(msg.params);
	        var time = that.getState("timeout");
	        if (that.client) {
	            that.client.publish(that.channel("request"), JSON.stringify(input));
	        }
	        else {
	            throw new Error("Not connected to server");
	        }
	        var p = Farmbot.timerDefer(time, label);
	        console.log("Sent: " + msg.id);
	        that.on(msg.id, function (response) {
	            console.log("Got " + response.id);
	            var hasResult = !!(response || {}).result;
	            // TODO : If bot returns a status update, update bot's internal state.
	            // Probably can use a "type guard" for this sort of thing.
	            // TODO: This rejection appears to resolve strings rather than errors.
	            (hasResult) ? p.resolve(response) : p.reject(response);
	        });
	        return p.promise;
	    };
	    ;
	    Farmbot.prototype._onmessage = function (channel, buffer /*, message*/) {
	        var msg = JSON.parse(buffer.toString());
	        var id = (msg.id || "*");
	        this.emit(id, msg);
	    };
	    ;
	    Farmbot.prototype.connect = function () {
	        var that = this;
	        var p = Farmbot.timerDefer(that.getState("timeout"), "MQTT Connect Atempt");
	        that.client = connect(that.getState("mqttServer"), {
	            username: that.getState("uuid"),
	            password: that.getState("token")
	        });
	        that.client.subscribe([
	            that.channel("error"),
	            that.channel("response"),
	            that.channel("notification")
	        ]);
	        that.client.once("connect", function () { return p.resolve(that); });
	        that.client.on("message", that._onmessage.bind(that));
	        return p.promise;
	    };
	    Farmbot.timerDefer = function (timeout, label) {
	        if (label === void 0) { label = ("promise with " + timeout + " ms timeout"); }
	        var that = new fbpromise_1.FBPromise(label);
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
	        var template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
	        var replaceChar = function (c) {
	            var r = Math.random() * 16 | 0;
	            var v = c === "x" ? r : r & 0x3 | 0x8;
	            return v.toString(16);
	        };
	        return template.replace(/[xy]/g, replaceChar);
	    };
	    ;
	    Farmbot.config = {
	        requiredOptions: ["timeout", "token"],
	        defaultOptions: {
	            speed: 100,
	            timeout: 6000
	        }
	    };
	    Farmbot.VERSION = "1.3.3";
	    return Farmbot;
	}());
	exports.Farmbot = Farmbot;


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	/** ES6 Promise wrapper that adds a label and a "finished" property. */
	var FBPromise = (function () {
	    function FBPromise(label) {
	        var _this = this;
	        var $reject, $resolve;
	        this.promise = new Promise(function (res, rej) { return (_a = [rej, res], $reject = _a[0], $resolve = _a[1], _a); var _a; });
	        this.finished = false;
	        this.reject = function (error) {
	            _this.finished = true;
	            $reject.apply(_this, [error]);
	        };
	        this.resolve = function (value) {
	            _this.finished = true;
	            $resolve.apply(_this, [value]);
	        };
	        this.label = label || "a promise";
	    }
	    return FBPromise;
	}());
	exports.FBPromise = FBPromise;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;