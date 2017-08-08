import * as Corpus from "./corpus";
import { connect, Client as MqttClient } from "mqtt";
import {
  assign,
  rpcRequest,
  coordinate,
  toPairs
} from "./util";
import {
  StateTree,
  Dictionary,
  ConstructorParams,
  APIToken,
  McuParams,
  Configuration
} from "./interfaces";
import { pick, isCeleryScript } from "./util";
import { isNode } from "./index";
type Primitive = string | number | boolean;
export const NULL = "null";
const ERR_MISSING_MQTT = "MQTT SERVER MISSING FROM TOKEN";
const ERR_MISSING_UUID = "MISSING_UUID";
const ERR_TOKEN_PARSE = "Unable to parse token. Is it properly formatted?";
const UUID = "uuid";
declare var atob: (i: string) => string;
declare var global: typeof window;

// Prevents our error catcher from getting overwhelmed by failed
// connection attempts
const RECONNECT_THROTTLE = 45000;

export class Farmbot {
  static VERSION = "4.3.1";
  static defaults = { speed: 800, timeout: 6000, secure: true };

  /** Storage area for all event handlers */
  private _events: Dictionary<Function[]>;
  private _state: StateTree;
  public client: MqttClient | undefined;

  constructor(input: ConstructorParams) {
    if (isNode() && !global.atob) {
      throw new Error(`NOTE TO NODEJS USERS:

      This library requires an 'atob()' function.
      Please fix this first.
      SOLUTION: https://github.com/FarmBot/farmbot-js/issues/33
      `);
    }
    this._events = {};
    this._state = assign({}, Farmbot.defaults, input);
    this._decodeThatToken();
  }

  private _decodeThatToken = () => {
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
    let isSecure = !!this._state.secure;
    let protocol: string;
    let port: number;
    if (isNode()) {
      protocol = "mqtt://";
      port = 1883;
    } else {
      protocol = isSecure ? "wss://" : "ws://";
      port = isSecure ? 443 : 3002;
    }
    this.setState("mqttServer", `${protocol}${mqttUrl}:${port}`);
    this.setState(UUID, token.bot || ERR_MISSING_UUID);
  }

  /** Returns a READ ONLY copy of the local configuration. */
  getState(): StateTree {
    return JSON.parse(JSON.stringify(this._state));
  }

  /** Write a configuration value for local use.
   * Eg: setState("timeout", 999)
   */
  setState(key: string, val: string | number | boolean) {
    if (val !== this._state[key]) {
      let old = this._state[key];
      this._state[key] = val;
      this.emit("change", { name: key, value: val, oldValue: old });
    }
    return val;
  }

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

  /** THIS WILL RESET THE SD CARD! Be careful!! */
  resetOS() {
    this.publish(rpcRequest([
      { kind: "factory_reset", args: { package: "farmbot_os" } }
    ]));
  }

  resetMCU() {
    return this.send(rpcRequest([
      { kind: "factory_reset", args: { package: "arduino_firmware" } }
    ]));
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

  /** Use end stops or encoders to figure out where 0,0,0 is.
   *  WON'T WORK WITHOUT ENCODERS OR ENDSTOPS! */
  findHome(args: { speed: number, axis: Corpus.ALLOWED_AXIS }) {
    return this.send(rpcRequest([{ kind: "find_home", args }]));
  }

  /** Move gantry to an absolute point. */
  moveAbsolute(args: { x: number, y: number, z: number, speed?: number }) {
    let { x, y, z, speed } = args;
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
    let { x, y, z, speed } = args;
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

  /** Set the position of the given axis to 0 at the current position of said
   * axis. Example: Sending bot.setZero("x") at x: 255 will translate position
   * 255 to 0. */
  setZero(axis: Corpus.ALLOWED_AXIS) {
    return this.send(rpcRequest([{
      kind: "zero",
      args: { axis }
    }]));
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
    let rpc = rpcRequest([{ kind: "data_update", body, args }]);
    // I'm using .publish() instead of .send() because confirmation requests are
    // of less importance right now - RC 2 APR 17.
    return this.publish(rpc, false);
  }

  /** Retrieves all of the event handlers for a particular event.
   * Returns an empty array if the event did not exist.
    */
  event(name: string) {
    this._events[name] = this._events[name] || [];
    return this._events[name];
  }

  on(event: string, callback: Function) {
    this.event(event).push(callback);
  }

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
  publish(msg: Corpus.RpcRequest, important = true): void {
    if (this.client) {
      /** SEE: https://github.com/mqttjs/MQTT.js#client */
      this.client.publish(this.channel.toDevice, JSON.stringify(msg));
    } else {
      if (important) {
        throw new Error("Not connected to server");
      }
    }
  }

  /** Low level means of sending MQTT RPC commands to the bot. Acknowledges
   * receipt of message, but does not check formatting. Consider using higher
   * level methods like .moveRelative(), .calibrate(), etc....
  */
  send = (input: Corpus.RpcRequest) => {
    let done = false;
    return new Promise((resolve, reject) => {
      this.publish(input);
      let label = (input.body || []).map(x => x.kind).join(", ");
      let time = this.getState()["timeout"] as number;
      setTimeout(function () {
        if (!done) {
          reject(new Error(`${label} timeout after ${time} ms.`));
        }
      }, time);

      this.on(input.args.label, function (response: Corpus.RpcOk | Corpus.RpcError) {
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
  }

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
  }

  /** Bootstrap the device onto the MQTT broker. */
  connect = () => {
    let { uuid, token, mqttServer, timeout } = this.getState();
    this.client = connect(<string>mqttServer, {
      username: <string>uuid,
      password: <string>token,
      reconnectPeriod: RECONNECT_THROTTLE
    });
    this.client.subscribe(this.channel.toClient);
    this.client.subscribe(this.channel.logs);
    this.client.subscribe(this.channel.status);
    this.client.on("message", this._onmessage.bind(this));
    this.client.on("offline", () => this.emit("offline", {}));
    this.client.on("connect", () => this.emit("online", {}));
    let done = false;
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        if (!done) {
          reject(new Error(`Failed to connect to MQTT after ${timeout} ms.`));
        }
      }, timeout);
      if (this.client) {
        this.client.once("connect", () => resolve(this));
      } else {
        throw new Error("FarmBotJS Could not find a client");
      }
    });
  }
}
