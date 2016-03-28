/// <reference path="./fbpromise.d.ts"/>
/// <reference path="./mqttjs.d.ts"/>
/// <reference path="../typings/main.d.ts"/>

import { connect } from 'mqtt';

export class Farmbot {
    private _events: { [key: string]: any; };
    private _state: { [key: string]: any; };
    public client: MqttClient;

    constructor(input) {
        if (!(this instanceof Farmbot)) return new Farmbot(input);
        this._events = {};
        this._state = Farmbot.extend({}, [Farmbot.config.defaultOptions, input]);
        Farmbot.requireKeys(this._state, Farmbot.config.requiredOptions);
        this._decodeThatToken();
    }

    _decodeThatToken(){
      try {
        var token = JSON.parse(atob((this.getState("token").split(".")[1])))
      } catch(e) {
        console.warn(e);
        throw new Error("Unable to parse token. Is it properly formatted?");
      }
      var mqttUrl = token.mqtt || "MQTT SERVER MISSING FROM TOKEN";
      this.setState("mqttServer", `ws://${mqttUrl}:3002`);
      this.setState("uuid", token.bot || "UUID MISSING FROM TOKEN");
    }

    listState() {
        return Object.keys(this._state);
    };

    getState(key) {
        return this._state[key];
    };

    setState(key, val) {
        if (val !== this._state[key]) {
            var old = this._state[key];
            this._state[key] = val;
            this.emit("change", { name: key, value: val, oldValue: old });
        };
        return val;
    };

    emergencyStop() {
        return this.send({
            params: {},
            method: "single_command.EMERGENCY STOP"
        });
    }

    // TODO create a `sequence` constructor that validates and enforces inputs, to
    // avoid confusion.
    execSequence(sequence) {
        return this.send({
            params: sequence,
            method: "exec_sequence"
        });
    }

    homeAll(opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME ALL"
        });
    }

    homeX(opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME X"
        });
    }

    homeY(opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME Y"
        });
    }

    homeZ(opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.HOME Z"
        });
    }


    moveAbsolute(opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.MOVE ABSOLUTE"
        });
    }

    moveRelative(opts) {
        Farmbot.requireKeys(opts, ["speed"]);
        return this.send({
            params: opts,
            method: "single_command.MOVE RELATIVE"
        });
    }

    pinWrite(opts) {
        Farmbot.requireKeys(opts, ["pin", "value1", "mode"]);
        return this.send({
            params: opts,
            method: "single_command.PIN WRITE"
        });
    }

    readStatus() {
        return this.send({
            params: {},
            method: "read_status"
        });
    }

    syncSequence() {
        console.warn("Not yet implemented");
        return this.send({
            params: {},
            method: "sync_sequence"
        });
    }

    updateCalibration(params) {
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
    }

    static config = {
        requiredOptions: ["timeout", "token"],
        defaultOptions: {
            speed: 100,
            timeout: 6000
        }
    }

    event(name) {
        this._events[name] = this._events[name] || [];
        return this._events[name];
    };

    on(event, callback) {
        this.event(event).push(callback);
    };

    emit(event, data) {
        [this.event(event), this.event('*')]
            .forEach(function(handlers) {
                handlers.forEach(function(handler) {
                    try {
                        handler(data, event);
                    } catch (e) {
                        console.warn("Exception thrown while handling `" + event + "` event.");
                    }
                })
            });
    }

    buildMessage(input) {
        var msg = input || {};
        var metaData = {
            id: (msg.id || Farmbot.uuid())
        };
        Farmbot.extend(msg, [metaData]);
        Farmbot.requireKeys(msg, ["params", "method", "id"]);
        return msg;
    };

    channel(name: String): string {
      return `bot/${this.getState("uuid")}/${name}`;
    };

    send(input) {
        var that = this;
        var msg = this.buildMessage(input);
        var label = `${msg.method} ${JSON.stringify(msg.params)}`;
        var time = that.getState("timeout");
        that.client.publish(that.channel('request'), JSON.stringify(input));
        var p = Farmbot.timerDefer(time, label);
        that.on(msg.id, function(response) {
          console.log("!!!", response.id);
          var respond = ((response || {}).result) ? p.resolve : p.reject;
          respond(response);
        })
        return p;
    };

    _onmessage(channel: String, buffer: Uint8Array, message) {
      console.log(channel);
      var msg = JSON.parse(buffer.toString());
      var id = msg.id;
      // TODO: Are we actually emitting msg.name anymore?
      this.emit(id || msg.name, msg);
    };

    connect(callback) {
      var that = this;

      that.client = connect(that.getState("mqttServer"), {
        username: that.getState("uuid"),
        password: that.getState("token")
      });

      that.client.subscribe([
        that.channel("error"),
        that.channel("response"),
        that.channel("notification")
      ]);
      that.client.once("connect", callback);
      that.client.on("message", that._onmessage);
      return that;
    }

    // a convinience promise wrapper.
    static defer(label) {
        var $reject, $resolve;
        var that = new Promise(function(resolve, reject) {
            $reject = reject;
            $resolve = resolve;
        });
        that.finished = false
        that.reject = function() {
            that.finished = true;
            $reject.apply(that, arguments);
        }
        that.resolve = function() {
            that.finished = true;
            $resolve.apply(that, arguments);
        }
        that.label = label || "a promise";
        return that;
    };

    static timerDefer(timeout: Number, label: String) {
        label = label || ("promise with " + timeout + " ms timeout");
        var that = Farmbot.defer(label);
        if (!timeout) { throw new Error("No timeout value set."); };
        setTimeout(function() {
            if (!that.finished) {
                var failure = new Error("`" + label + "` did not execute in time");
                that.reject(failure);
            };
        }, timeout);
        return that;
    };

    static extend(target, mixins) {
        mixins.forEach(function(mixin) {
            var iterate = function(prop) {
                target[prop] = mixin[prop];
            };
            Object.keys(mixin).forEach(iterate);
        });
        return target;
    };


    static requireKeys(input, required) {
        required.forEach(function(prop) {
            var val = input[prop];
            if (!val && (val !== 0)) { // FarmbotJS considers 0 to be truthy.
                throw (new Error("Expected input object to have `" + prop +
                    "` property"));
            }
        });
    };

    static uuid() {
        var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        var replaceChar = function(c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        };
        return template.replace(/[xy]/g, replaceChar);
    };

    static MeshErrorResponse(input) {
        return {
            error: {
                method: "error",
                error: input || "unspecified error"
            }
        }
    }
}
