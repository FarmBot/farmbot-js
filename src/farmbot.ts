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
const ERR_MISSING_MQTT = "MQTT SERVER MISSING FROM TOKEN";
const ERR_MISSING_UUID = "MISSING_UUID";
const ERR_TOKEN_PARSE = "Unable to parse token. Is it properly formatted?";
const UUID = "uuid";

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
      throw new Error(ERR_TOKEN_PARSE);
    }
    let mqttUrl = token.mqtt || ERR_MISSING_MQTT;
    let isSecure = location.protocol === "https:";
    let protocol = isSecure ? "wss://" : "ws://";
    let port = isSecure ? 443 : 3002;
    this.setState("mqttServer", `${protocol}${mqttUrl}:${port}`);
    this.setState(UUID, token.bot || ERR_MISSING_UUID);
  }

  /** Returns a READ ONLY copy of the local configuration. */
  getState(): StateTree {
    return JSON.parse(JSON.stringify(this._state));
  };

  /** Write a configuration value for local use.
   * Eg: setState("timeout", 999)
   */
  setState(key: string, val: string | number | boolean) {
    if (val !== this._state[key]) {
      let old = this._state[key];
      this._state[key] = val;
      this.emit("change", { name: key, value: val, oldValue: old });
    };
    return val;
  };

  /** Installs a "Farmware" (plugin) onto the bot's SD card.
   * URL must point to a valid Farmware manifest JSON document.
   */
  installFarmware(url: string) {
    return this.send(rpcRequest([{
      kind: "install_farmware",
      args: { url }
    }]));
  }

  /** Checks for updates on a particular Farmware plugin when given the name of
   * a farmware. `updateFarmware("take-photo")`
   */
  updateFarmware(pkg: string) {
    return this.send(rpcRequest([{
      kind: "update_farmware",
      args: { package: pkg }
    }]));
  }

  /** Uninstall a Farmware plugin. */
  removeFarmware(pkg: string) {
    return this.send(rpcRequest([{
      kind: "remove_farmware",
      args: { package: pkg }
    }]));
  }

  /** Deactivate FarmBot OS completely. */
  powerOff() {
    return this.send(rpcRequest([{ kind: "power_off", args: {} }]));
  }

  /** Cycle device power. */
  reboot() {
    return this.send(rpcRequest([{ kind: "reboot", args: {} }]));
  }

  /** Check for new versions of FarmBot OS. */
  checkUpdates() {
    return this.send(rpcRequest([
      { kind: "check_updates", args: { package: "farmbot_os" } }
    ]));
  }

  /** @deprecated
   * No longer required, as FarmBot OS and Firmware are now bundled. */
  checkArduinoUpdates() {
    return this.send(rpcRequest([
      { kind: "check_updates", args: { package: "arduino_firmware" } }
    ]));
  }

  /** THIS WILL RESET THE SD CARD! Be careful!! */
  factoryReset() {
    return this.send(rpcRequest([{ kind: "factory_reset", args: {} }]));
  }

  /** Lock the bot from moving. This also will pause running regimens and cause
   *  any running sequences to exit */
  emergencyLock() {
    return this.send(rpcRequest([{ kind: "emergency_lock", args: {} }]));
  }

  /** Unlock the bot when the user says it is safe. Currently experiencing
   * issues. Consider reboot() instead. */
  emergencyUnlock() {
    return this.send(rpcRequest([{ kind: "emergency_unlock", args: {} }]));
  }

  /** Execute a sequence by its ID on the API. */
  execSequence(sequence_id: number) {
    return this.send(rpcRequest([{ kind: "execute", args: { sequence_id } }]));
  }

  /** Run a preloaded Farmware / script on the SD Card. */
  execScript(/** Filename of the script */label: string,
    /** Optional ENV vars to pass the script */
    envVars?: Corpus.Pair[] | undefined) {
    return this.send(rpcRequest([
      { kind: "execute_script", args: { label }, body: envVars }
    ]));
  }

  /** Bring a particular axis (or all of them) to position 0. */
  home(args: { speed: number, axis: Corpus.ALLOWED_AXIS }) {
    return this.send(rpcRequest([{ kind: "home", args }]));
  }

  /** Move gantry to an absolute point. */
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

  /** Move gantry to position relative to its current position. */
  moveRelative(args: { x: number, y: number, z: number, speed?: number }) {
    let {x, y, z, speed} = args;
    speed = speed || Farmbot.defaults.speed;
    return this.send(rpcRequest([{ kind: "move_relative", args: { x, y, z, speed } }]));
  }

  /** Set a GPIO pin to a particular value. */
  writePin(args: { pin_number: number; pin_value: number; pin_mode: number; }) {
    return this.send(rpcRequest([{ kind: "write_pin", args }]));
  }

  /** Reverse the value of a digital pin. */
  togglePin(args: { pin_number: number; }) {
    return this.send(rpcRequest([{ kind: "toggle_pin", args }]));
  }

  /** Read the status of the bot. Should not be needed unless you are first
   * logging in to the device, since the device pushes new states out on
   * every update. */
  readStatus(args = {}) {
    return this.send(rpcRequest([{ kind: "read_status", args }]));
  }

  /** Snap a photo and send to the API for post processing. */
  takePhoto(args = {}) {
    return this.send(rpcRequest([{ kind: "take_photo", args }]));
  }

  /** Download all of the latest JSON resources (plants, account info...)
   * from the FarmBot API. */
  sync(args = {}) {
    return this.send(rpcRequest([{ kind: "sync", args }]));
  }

  /** Update the Arduino settings */
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

  /** Set user ENV vars (usually used by 3rd party Farmware scripts).
   * Set value to `undefined` to unset. */
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

  /** Update a config option for FarmBot OS. */
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

  /** (under development April 2017) Calibrate device length. */
  calibrate(args: { axis: Corpus.ALLOWED_AXIS }) {
    return this.send(rpcRequest([{ kind: "calibrate", args }]));
  }

  /** Let the bot know that some resources it has in cache are no longer valid.
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

  /** Dictionary of all relevant MQTT channels the bot uses. */
  get channel() {
    let uuid = this.getState()[UUID] || ERR_MISSING_UUID;
    return {
      /** From the browser, usually. */
      toDevice: `bot/${uuid}/from_clients`,
      /** From farmbot */
      toClient: `bot/${uuid}/from_device`,
      status: `bot/${uuid}/status`,
      logs: `bot/${uuid}/logs`
    };
  }

  /** Low level means of sending MQTT packets. Does not check format. Does not
   * acknowledge confirmation. Probably not the one you want. */
  publish(msg: Corpus.RpcRequest): void {
    if (this.client) {
      /** SEE: https://github.com/mqttjs/MQTT.js#client */
      this.client.publish(this.channel.toDevice, JSON.stringify(msg));
    } else {
      throw new Error("Not connected to server");
    }
  };

  /** Low level means of sending MQTT RPC commands to the bot. Acknowledges
   * receipt of message, but does not check formatting. Consider using higher
   * level methods like .moveRelative(), .calibrate(), etc....
  */
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

  /** Bootstrap the device onto the MQTT broker. */
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
