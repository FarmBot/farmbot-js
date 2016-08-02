import { FB } from "./interfaces/interfaces";
import { FBPromise } from "./fbpromise";

declare var require: any;
var connect = require("mqtt").connect;

export class Farmbot {
  private _events: FB.Dictionary<Function[]>;
  private _state: FB.Dictionary<any>;
  public client: FB.MqttClient;

  constructor(input: FB.ConstructorParams) {
    if (!(this instanceof Farmbot)) return new Farmbot(input);
    this._events = {};
    this._state = Farmbot.extend({}, [Farmbot.config.defaultOptions, input]);
    Farmbot.requireKeys(this._state, Farmbot.config.requiredOptions);
    this._decodeThatToken();
  }

  _decodeThatToken() {
    let token: FB.APIToken;
    try {
      token = JSON.parse(atob((this.getState("token").split(".")[1])));
    } catch (e) {
      console.warn(e);
      throw new Error("Unable to parse token. Is it properly formatted?");
    }
    let mqttUrl = token.mqtt || "MQTT SERVER MISSING FROM TOKEN";
    this.setState("mqttServer", `ws://${mqttUrl}:3002`);
    this.setState("uuid", token.bot || "UUID MISSING FROM TOKEN");
  }

  getState(key?: string) {
    if (key) {
      return this._state[key];
    } else {
      // Create a copy of the state object to prevent accidental mutation.
      return JSON.parse(JSON.stringify(this._state));
    };
  };

  setState(key: string, val: string|number|boolean) {
    if (val !== this._state[key]) {
      let old = this._state[key];
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
  execSequence(sequence: FB.Sequence) {
    return this.send({
      params: sequence,
      method: "exec_sequence"
    });
  }

  homeAll(opts: FB.CommandOptions) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME ALL"
    });
  }

  homeX(opts: FB.CommandOptions) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME X"
    });
  }

  homeY(opts: FB.CommandOptions) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME Y"
    });
  }

  homeZ(opts: FB.CommandOptions) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.HOME Z"
    });
  }


  moveAbsolute(opts: FB.CommandOptions) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.MOVE ABSOLUTE"
    });
  }

  moveRelative(opts: FB.CommandOptions) {
    Farmbot.requireKeys(opts, ["speed"]);
    return this.send({
      params: opts,
      method: "single_command.MOVE RELATIVE"
    });
  }

  pinWrite(opts: FB.CommandOptions) {
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

  updateCalibration(params: FB.CalibrationParams) {
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
  };

  event(name: string) {
    this._events[name] = this._events[name] || [];
    return this._events[name];
  };

  on(event: string, callback: Function) {
    this.event(event).push(callback);
  };

  emit(event: string, data: any) {
    [this.event(event), this.event("*")]
      .forEach(function(handlers) {
        handlers.forEach(function(handler) {
          try {
            handler(data, event);
          } catch (e) {
            console.warn("Exception thrown while handling `" + event + "` event.");
          }
        });
      });
  }
  /** Validates RPCPayloads. Also adds optional fields if missing. */
  buildMessage(input: FB.RPCPayload): FB.RPCMessage {
    let msg = (input || {}) as FB.RPCMessage;
    let metaData = {
      id: (msg.id || Farmbot.uuid())
    };
    Farmbot.extend(msg, [metaData]);
    Farmbot.requireKeys(msg, ["params", "method", "id"]);
    return msg;
  };

  channel(name: string): string {
    return `bot/${this.getState("uuid")}/${name}`;
  };

  send(input: FB.RPCPayload) {
    let that = this;
    let msg = this.buildMessage(input);
    let label = `${msg.method} ${JSON.stringify(msg.params)}`;
    let time = that.getState("timeout");
    if (that.client) {
      that.client.publish(that.channel("request"), JSON.stringify(input));
    } else {
      throw new Error("Not connected to server");
    }
    let p = Farmbot.timerDefer(time, label);
    console.log(`Sent: ${msg.id}`);
    that.on(msg.id, function(response?: any) {
      console.log(`Got ${response.id}`);
      let hasResult = !!(response || {}).result;
      // TODO : If bot returns a status update, update bot's internal state.
      // Probably can use a "type guard" for this sort of thing.
      // TODO: This rejection appears to resolve strings rather than errors.
      (hasResult) ? p.resolve(response) : p.reject(response);
    });
    return p.promise;
  };

  _onmessage(channel: string, buffer: Uint8Array /*, message*/) {
    let msg = JSON.parse(buffer.toString());
    let id = (msg.id || "*");
    this.emit(id , msg);
  };

  connect() {
    let that = this;
    let p = Farmbot.timerDefer<Farmbot>(that.getState("timeout"), "MQTT Connect Atempt");

    that.client = connect(that.getState("mqttServer"), {
      username: that.getState("uuid"),
      password: that.getState("token")
    }) as FB.MqttClient;
    that.client.subscribe([
      that.channel("error"),
      that.channel("response"),
      that.channel("notification")
    ]);
    that.client.once("connect", () => p.resolve(that));
    that.client.on("message", that._onmessage.bind(that));
    return p.promise;
  }

  static timerDefer<T>(timeout: Number,
                       label: string = ("promise with " + timeout + " ms timeout")) {
    let that = new FBPromise<T>(label);
    setTimeout(function() {
      if (!that.finished) {
        let failure = new Error("`" + label + "` did not execute in time");
        that.reject(failure);
      };
    }, timeout);
    return that;
  };

  static extend(target: any, mixins: any[]) {
    mixins.forEach(function(mixin) {
      let iterate = function(prop: any) {
        target[prop] = mixin[prop];
      };
      Object.keys(mixin).forEach(iterate);
    });
    return target;
  };


  static requireKeys(input: any, required: string[]) {
    required.forEach(function(prop) {
      let val = input[prop];
      if (!val && (val !== 0)) { // FarmbotJS considers 0 to be truthy.
        throw (new Error("Expected input object to have `" + prop +
          "` property"));
      }
    });
  };

  static uuid() {
    let template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let replaceChar = function(c: string) {
      let r = Math.random() * 16 | 0;
      let v = c === "x" ? r : r & 0x3 | 0x8;
      return v.toString(16);
    };
    return template.replace(/[xy]/g, replaceChar);
  };

  static VERSION = "1.3.4";
}
