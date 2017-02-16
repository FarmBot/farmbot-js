import * as Corpus from "./corpus"
import { connect } from "mqtt";
import {
  assign,
  rpcRequest,
  coordinate
} from "./util";
import {
  StateTree,
  MqttClient,
  Dictionary,
  ConstructorParams,
  APIToken,
  McuParams,
  Configuration
} from "./interfaces";
import { pick, isCeleryScript } from "./util";
type Primitive = string | number | boolean;
export const NULL = "null";

export class Farmbot {
  static VERSION = "3.1.9";
  static defaults = { speed: 800, timeout: 6000 };

  /** Storage area for all event handlers */
  private _events: Dictionary<Function[]>;
  private _state: StateTree;
  public client: MqttClient;

  constructor(input: ConstructorParams) {
    this._events = {};
    this._state = assign({}, Farmbot.defaults, input);
    this._decodeThatToken();
  }

  _decodeThatToken() {
    let token: APIToken;
    try {
      let str = (this.getState()["token"] as string);
      let base64 = str.split(".")[1];
      let plaintext = atob(base64);
      token = JSON.parse(plaintext);
    } catch (e) {
      console.warn(e);
      throw new Error("Unable to parse token. Is it properly formatted?");
    }
    let mqttUrl = token.mqtt || "MQTT SERVER MISSING FROM TOKEN";
    let isSecure = location.protocol === "https:";
    let protocol = isSecure ? "wss://" : "ws://";
    let port = isSecure ? 443 : 3002;
    this.setState("mqttServer", `${protocol}${mqttUrl}:${port}`);
    this.setState("uuid", token.bot || "UUID MISSING FROM TOKEN");
  }

  getState(): StateTree {
    return JSON.parse(JSON.stringify(this._state));
  };

  setState(key: string, val: string | number | boolean) {
    if (val !== this._state[key]) {
      let old = this._state[key];
      this._state[key] = val;
      this.emit("change", { name: key, value: val, oldValue: old });
    };
    return val;
  };

  powerOff() {
    let p = rpcRequest();
    p.body = [{ kind: "power_off", args: {} }];
    return this.send(p);
  }

  reboot() {
    let p = rpcRequest();
    p.body = [{ kind: "reboot", args: {} }];
    return this.send(p);
  }

  checkUpdates() {
    let p = rpcRequest();
    p.body = [{ kind: "check_updates", args: { package: "farmbot_os" } }];
    return this.send(p);
  }

  // TODO: Merge this (legacy) method with #checkUpdates().
  checkArduinoUpdates() {
    let p = rpcRequest();
    p.body = [{ kind: "check_updates", args: { package: "arduino_firmware" } }];
    return this.send(p);
  }

  /** THIS WILL RESET EVERYTHING! Be careful!! */
  factoryReset() {
    let p = rpcRequest();
    p.body = [{ kind: "factory_reset", args: {} }];
    return this.send(p);
  }

  /** Lock the bot from moving. This also will pause running regimens and cause
   *  any running sequences to exit
   */
  emergencyLock() {
    let p = rpcRequest();
    p.body = [{ kind: "emergency_lock", args: {} }];
    return this.send(p);
  }

  /** Unlock the bot when the user says it is safe. */
  emergencyUnlock() {
    let p = rpcRequest();
    p.body = [{ kind: "emergency_unlock", args: {} }];
    return this.send(p);
  }

  execSequence(sequence_id: number) {
    let p = rpcRequest();
    p.body = [{ kind: "execute", args: { sequence_id } }];
    return this.send(p);
  }

  execScript(/** Filename of the script */label: string,
    /** Optional ENV vars to pass the script */
    envVars?: Corpus.Pair[] | undefined) {
    let p = rpcRequest();
    p.body = [{ kind: "execute_script", args: { label }, body: envVars }];
    return this.send(p);
  }

  home(args: { speed: number, axis: Corpus.ALLOWED_AXIS }) {
    let p = rpcRequest();
    p.body = [{ kind: "home", args }];
    return this.send(p);
  }

  moveAbsolute(args: { x: number, y: number, z: number, speed?: number }) {
    let p = rpcRequest();
    let {x, y, z, speed} = args;
    speed = speed || Farmbot.defaults.speed;
    p.body = [
      {
        kind: "move_absolute",
        args: {
          location: coordinate(x, y, z),
          offset: coordinate(0, 0, 0),
          speed
        }
      }
    ];
    return this.send(p);
  }

  moveRelative(args: { x: number, y: number, z: number, speed?: number }) {
    let p = rpcRequest();
    let {x, y, z, speed} = args;
    speed = speed || Farmbot.defaults.speed;
    p.body = [{ kind: "move_relative", args: { x, y, z, speed } }];
    return this.send(p);
  }

  writePin(args: { pin_number: number; pin_value: number; pin_mode: number; }) {
    let p = rpcRequest();
    p.body = [{ kind: "write_pin", args }];
    return this.send(p);
  }

  togglePin(args: { pin_number: number; }) {
    let p = rpcRequest();
    p.body = [{ kind: "toggle_pin", args }];
    return this.send(p);
  }

  readStatus(args = {}) {
    let p = rpcRequest();
    p.body = [{ kind: "read_status", args }];
    return this.send(p);
  }

  takePhoto(args = {}) {
    let p = rpcRequest();
    p.body = [{ kind: "take_photo", args }];
    return this.send(p);
  }

  sync(args = {}) {
    let p = rpcRequest();
    p.body = [{ kind: "sync", args }];
    return this.send(p);
  }

  /** Update the arduino settings */
  updateMcu(update: Partial<McuParams>) {
    let p = rpcRequest();
    p.body = [];
    Object
      .keys(update)
      .forEach(function (label) {
        let value = pick<Primitive>(update, label, "ERROR");
        (p.body || []).push({
          kind: "config_update",
          args: { package: "arduino_firmware" },
          body: [
            {
              kind: "pair",
              args: { value, label }
            }
          ]
        });
      });
    return this.send(p);
  }

  /** Set user ENV vars (usually used by 3rd party scripts).
   * Set value to `undefined` to unset.
   */
  setUserEnv(configs: Dictionary<(string | undefined)>) {
    let p = rpcRequest();
    let body = Object
      .keys(configs)
      .map(function (label): Corpus.Pair {
        return {
          kind: "pair",
          args: { label, value: (configs[label] || NULL) }
        };
      });
    p.body = [{ kind: "set_user_env", args: {}, body }];
    return this.send(p);
  }

  /** Update a config */
  updateConfig(update: Partial<Configuration>) {
    let p = rpcRequest();
    p.body = [];
    Object
      .keys(update)
      .forEach(function (label) {
        let value = pick<Primitive>(update, label, "ERROR");
        (p.body || []).push({
          kind: "config_update",
          args: { package: "farmbot_os" },
          body: [
            {
              kind: "pair",
              args: { value, label }
            }
          ]
        });
      });
    return this.send(p);
  }

  calibrate(args: { axis: Corpus.ALLOWED_AXIS }) {
    let p = rpcRequest();
    p.body = [{ kind: "calibrate", args }];
    return this.send(p);
  }

  /** Retrieves all of the event handlers for a particular event.
   * Returns an empty array if the event did not exist.
    */
  event(name: string) {
    this._events[name] = this._events[name] || [];
    return this._events[name];
  };

  on(event: string, callback: Function) {
    this.event(event).push(callback);
  };

  emit(event: string, data: any) {
    [this.event(event), this.event("*")]
      .forEach(function (handlers) {
        handlers.forEach(function (handler: Function) {
          try {
            handler(data, event);
          } catch (e) {
            console.warn("Exception thrown while handling `" + event + "` event.");
          }
        });
      });
  }

  get channel() {
    let uuid = this.getState()["uuid"] || "lost_and_found";
    return {
      /** From the browser, usually. */
      toDevice: `bot/${uuid}/from_clients`,
      /** From farmbot */
      toClient: `bot/${uuid}/from_device`,
      status: `bot/${uuid}/status`,
      logs: `bot/${uuid}/logs`
    };
  }

  publish(msg: Corpus.RpcRequest): void {
    if (this.client) {
      /** SEE: https://github.com/mqttjs/MQTT.js#client */
      this.client.publish(this.channel.toDevice, JSON.stringify(msg));
    } else {
      throw new Error("Not connected to server");
    }
  };

  send(input: Corpus.RpcRequest) {
    let that = this;
    let done = false;
    return new Promise(function (resolve, reject) {
      that.publish(input);
      let label = (input.body || []).map(x => x.kind).join(", ");
      let time = that.getState()["timeout"] as number;
      setTimeout(function () {
        if (!done) {
          reject(new Error(`${label} timeout after ${time} ms.`));
        }
      }, time);

      that.on(input.args.label, function (response: Corpus.RpcOk | Corpus.RpcError) {
        done = true;
        switch (response.kind) {
          case "rpc_ok": return resolve(response);
          case "rpc_error":
            let reason = (response.body || []).map(x => x.args.message).join(", ");
            return reject(new Error("Problem sending RPC command: " + reason));
          default:
            console.dir(response);
            throw new Error("Got a bad CeleryScript node.");
        }
      });
    });
  };

  /** Main entry point for all MQTT packets. */
  _onmessage(chan: string, buffer: Uint8Array) {
    try {
      /** UNSAFE CODE: TODO: Add user defined type guards? */
      var msg = JSON.parse(buffer.toString()) as Corpus.RpcOk | Corpus.RpcError;
    } catch (error) {
      throw new Error("Could not parse inbound message from MQTT.");
    }

    switch (chan) {
      case this.channel.logs: return this.emit("logs", msg);
      case this.channel.status: return this.emit("status", msg);
      case this.channel.toClient:
        if (isCeleryScript(msg)) {
          return this.emit(msg.args.label, msg);
        } else {
          console.warn("Got malformed message. Out of date firmware?");
          return this.emit("malformed", msg);
        }
      default: throw new Error("Never should see this.");
    }
  };

  connect() {
    let that = this;
    let { uuid, token, mqttServer, timeout } = that.getState();
    that.client = connect(<string>mqttServer, {
      username: <string>uuid,
      password: <string>token
    }) as MqttClient;
    that.client.subscribe(that.channel.toClient);
    that.client.subscribe(that.channel.logs);
    that.client.subscribe(that.channel.status);
    that.client.on("message", that._onmessage.bind(that));
    let done = false;
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (!done) {
          reject(new Error(`Failed to connect to MQTT after ${timeout} ms.`));
        }
      }, timeout);
      that.client.once("connect", () => resolve(that));
    });
  }
}
