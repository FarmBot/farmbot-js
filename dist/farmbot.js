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
	var mqtt_1 = __webpack_require__(2);
	var util_1 = __webpack_require__(3);
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
	        get: function () { return "bot/" + (this.getState()["uuid"] || "lost_and_found") + "/rpc"; },
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
	    Farmbot.VERSION = "2.0.0-rc.1";
	    Farmbot.defaults = { speed: 100, timeout: 6000 };
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
	function timerDefer(timeout, label) {
	    if (label === void 0) { label = ("promise with " + timeout + " ms timeout"); }
	    var that = new FBPromise(label);
	    setTimeout(function () {
	        if (!that.finished) {
	            var failure = new Error("`" + label + "` did not execute in time");
	            that.reject(failure);
	        }
	        ;
	    }, timeout);
	    return that;
	}
	exports.timerDefer = timerDefer;
	;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function uuid() {
	    var template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
	    var replaceChar = function (c) {
	        var r = Math.random() * 16 | 0;
	        var v = c === "x" ? r : r & 0x3 | 0x8;
	        return v.toString(16);
	    };
	    return template.replace(/[xy]/g, replaceChar);
	}
	exports.uuid = uuid;
	;
	function assign(target) {
	    var others = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        others[_i - 1] = arguments[_i];
	    }
	    others.forEach(function (key, value) { return target[key] = value; });
	    return target;
	}
	exports.assign = assign;


/***/ }
/******/ ])
});
;