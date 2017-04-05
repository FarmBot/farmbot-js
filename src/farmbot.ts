import * as Corpus from "./corpus"
import { connect } from "mqtt";
import {
  assign,
  rpcRequest,
  coordinate,
  toPairs
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
  static VERSION = "3.2.0";
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

  private _decodeThatToken() {
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

  installFarmware(url: string) {
    return this.send(rpcRequest([{
      kind: "install_farmware",
      args: { url }
    }]));
  }

  updateFarmware(pkg: string) {
    return this.send(rpcRequest([{
      kind: "update_farmware",
      args: { package: pkg }
    }]));
  }

  removeFarmware(pkg: string) {
    return this.send(rpcRequest([{
      kind: "remove_farmware",
      args: { package: pkg }
    }]));
  }

  powerOff() {
    return this.send(rpcRequest([{ kind: "power_off", args: {} }]));
  }

  reboot() {
    return this.send(rpcRequest([{ kind: "reboot", args: {} }]));
  }

  checkUpdates() {
    return this.send(rpcRequest([
      { kind: "check_updates", args: { package: "farmbot_os" } }
    ]));
  }

  // TODO: Merge this (legacy) method with #checkUpdates().
  checkArduinoUpdates() {
    return this.send(rpcRequest([
      { kind: "check_updates", args: { package: "arduino_firmware" } }
    ]));
  }

  /** THIS WILL RESET EVERYTHING! Be careful!! */
  factoryReset() {
    return this.send(rpcRequest([{ kind: "factory_reset", args: {} }]));
  }

  /** Lock the bot from moving. This also will pause running regimens and cause
   *  any running sequences to exit
   */
  emergencyLock() {
    return this.send(rpcRequest([{ kind: "emergency_lock", args: {} }]));
  }

  /** Unlock the bot when the user says it is safe. */
  emergencyUnlock() {
    return this.send(rpcRequest([{ kind: "emergency_unlock", args: {} }]));
  }

  execSequence(sequence_id: number) {
    return this.send(rpcRequest([{ kind: "execute", args: { sequence_id } }]));
  }

  execScript(/** Filename of the script */label: string,
    /** Optional ENV vars to pass the script */
    envVars?: Corpus.Pair[] | undefined) {
    return this.send(rpcRequest([
      { kind: "execute_script", args: { label }, body: envVars }
    ]));
  }

  home(args: { speed: number, axis: Corpus.ALLOWED_AXIS }) {
    return this.send(rpcRequest([{ kind: "home", args }]));
  }

  moveAbsolute(args: { x: number, y: number, z: number, speed?: number }) {
    let {x, y, z, speed} = args;
    speed = speed || Farmbot.defaults.speed;
    return this.send(rpcRequest([
      {
        kind: "move_absolute",
        args: {
          location: coordinate(x, y, z),
          offset: coordinate(0, 0, 0),
          speed
        }
      }
    ]));
  }

  moveRelative(args: { x: number, y: number, z: number, speed?: number }) {
    let {x, y, z, speed} = args;
    speed = speed || Farmbot.defaults.speed;
    return this.send(rpcRequest([{ kind: "move_relative", args: { x, y, z, speed } }]));
  }

  writePin(args: { pin_number: number; pin_value: number; pin_mode: number; }) {
    return this.send(rpcRequest([{ kind: "write_pin", args }]));
  }

  togglePin(args: { pin_number: number; }) {
    return this.send(rpcRequest([{ kind: "toggle_pin", args }]));
  }

  readStatus(args = {}) {
    return this.send(rpcRequest([{ kind: "read_status", args }]));
  }

  takePhoto(args = {}) {
    return this.send(rpcRequest([{ kind: "take_photo", args }]));
  }

  sync(args = {}) {
    return this.send(rpcRequest([{ kind: "sync", args }]));
  }

  /** Update the arduino settings */
  updateMcu(update: Partial<McuParams>) {
    let body: Corpus.RpcRequestBodyItem[] = [];
    Object
      .keys(update)
      .forEach(function (label) {
        let value = pick<Primitive>(update, label, "ERROR");
        body.push({
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
    return this.send(rpcRequest(body));
  }

  /** Set user ENV vars (usually used by 3rd party scripts).
   * Set value to `undefined` to unset.
   */
  setUserEnv(configs: Dictionary<(string | undefined)>) {
    let body = Object
      .keys(configs)
      .map(function (label): Corpus.Pair {
        return {
          kind: "pair",
          args: { label, value: (configs[label] || NULL) }
        };
      });
    return this.send(rpcRequest([{ kind: "set_user_env", args: {}, body }]));
  }

  /** Update a config */
  updateConfig(update: Partial<Configuration>) {
    let body = Object
      .keys(update)
      .map((label): Corpus.Pair => {
        let value = pick<Primitive>(update, label, "ERROR");
        return { kind: "pair", args: { value, label } };
      });

    return this.send(rpcRequest([{
      kind: "config_update",
      args: { package: "farmbot_os" },
      body
    }]));
  }

  calibrate(args: { axis: Corpus.ALLOWED_AXIS }) {
    return this.send(rpcRequest([{ kind: "calibrate", args }]));
  }

  /** Lets the bot know that some resources it has in cache are no longer valid.
   *
   * Hopefully, some day we will not need this. Ideally, sending this message
   * would be handled by the API, but currently the API is REST only and does
   * not support push state messaging.
   */
  dataUpdate(value: Corpus.DataChangeType,
    input: Partial<Record<Corpus.ResourceName, string>>) {
    let body = toPairs(input);
    let args = { value };
    // I'm using .publish() instead of .send() because confirmation requests are
    // of less importance right now - RC 2 APR 17.
    return this.publish(rpcRequest([{ kind: "data_update", body, args }]));
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
  private _onmessage(chan: string, buffer: Uint8Array) {
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
