import * as Corpus from "./corpus";
import {
  connect,
  Client as MqttClient
} from "mqtt";
import {
  rpcRequest,
  coordinate,
  uuid as genUuid
} from "./util";
import {
  Dictionary,
  McuParams,
  Configuration
} from "./interfaces";
import {
  pick,
  isCeleryScript
} from "./util";
import {
  ReadPin,
  WritePin
} from ".";
import {
  FarmBotInternalConfig as Conf,
  FarmbotConstructorParams,
  generateConfig,
  CONFIG_DEFAULTS
} from "./config";
import { ResourceAdapter } from "./resources/resource_adapter";
type Primitive = string | number | boolean;
export const NULL = "null";

const RECONNECT_THROTTLE = 1000;

export class Farmbot {
  /** Storage area for all event handlers */
  private _events: Dictionary<Function[]>;
  private config: Conf;
  public client?: MqttClient;
  public resources: ResourceAdapter;
  static VERSION = "6.4.2";

  constructor(input: FarmbotConstructorParams) {
    this._events = {};
    this.config = generateConfig(input);
    this.resources = new ResourceAdapter(this, this.config.mqttUsername);
  }

  getConfig = <U extends keyof Conf>(key: U): Conf[U] => this.config[key];

  setConfig = <U extends keyof Conf>(key: U, value: Conf[U]) => {
    this.config[key] = value;
  }

  /** Installs a "Farmware" (plugin) onto the bot's SD card.
   * URL must point to a valid Farmware manifest JSON document. */
  installFarmware = (url: string) => {
    return this.send(rpcRequest([{ kind: "install_farmware", args: { url } }]));
  }

  /** Checks for updates on a particular Farmware plugin when given the name of
   * a farmware. `updateFarmware("take-photo")`
   */
  updateFarmware = (pkg: string) => {
    return this.send(rpcRequest([{
      kind: "update_farmware",
      args: { package: pkg }
    }]));
  }

  /** Uninstall a Farmware plugin. */
  removeFarmware = (pkg: string) => {
    return this.send(rpcRequest([{
      kind: "remove_farmware",
      args: { package: pkg }
    }]));
  }

  /** Installs "Farmwares" (plugins) authored by FarmBot.io
 * onto the bot's SD card.
 */
  installFirstPartyFarmware = () => {
    return this.send(rpcRequest([{
      kind: "install_first_party_farmware",
      args: {}
    }]));
  }

  /** Deactivate FarmBot OS completely. */
  powerOff = () => {
    return this.send(rpcRequest([{ kind: "power_off", args: {} }]));
  }

  /** Cycle device power. */
  reboot = () => {
    const r =
      rpcRequest([{ kind: "reboot", args: { package: "farmbot_os" } }]);
    return this.send(r);
  }

  /** Check for new versions of FarmBot OS. */
  checkUpdates = () => {
    return this.send(rpcRequest([
      { kind: "check_updates", args: { package: "farmbot_os" } }
    ]));
  }

  /** THIS WILL RESET THE SD CARD! Be careful!! */
  resetOS = () => {
    return this.publish(rpcRequest([
      { kind: "factory_reset", args: { package: "farmbot_os" } }
    ]));
  }

  resetMCU = () => {
    return this.send(rpcRequest([
      { kind: "factory_reset", args: { package: "arduino_firmware" } }
    ]));
  }

  /** Lock the bot from moving. This also will pause running regimens and cause
   *  any running sequences to exit */
  emergencyLock = () => {
    return this.send(rpcRequest([{ kind: "emergency_lock", args: {} }]));
  }

  /** Unlock the bot when the user says it is safe. Currently experiencing
   * issues. Consider reboot() instead. */
  emergencyUnlock = () => {
    return this.send(rpcRequest([{ kind: "emergency_unlock", args: {} }]));
  }

  /** Execute a sequence by its ID on the API. */
  execSequence = (sequence_id: number) => {
    return this.send(rpcRequest([{ kind: "execute", args: { sequence_id } }]));
  }

  /** Run a preloaded Farmware / script on the SD Card. */
  execScript = (/** Filename of the script */label: string,
    /** Optional ENV vars to pass the script */
    envVars?: Corpus.Pair[] | undefined) => {
    return this.send(rpcRequest([
      { kind: "execute_script", args: { label }, body: envVars }
    ]));
  }

  /** Bring a particular axis (or all of them) to position 0. */
  home = (args: { speed: number, axis: Corpus.ALLOWED_AXIS }) => {
    return this.send(rpcRequest([{ kind: "home", args }]));
  }

  /** Use end stops or encoders to figure out where 0,0,0 is.
   *  WON'T WORK WITHOUT ENCODERS OR END STOPS! */
  findHome = (args: { speed: number, axis: Corpus.ALLOWED_AXIS }) => {
    return this.send(rpcRequest([{ kind: "find_home", args }]));
  }

  /** Move gantry to an absolute point. */
  moveAbsolute = (args: { x: number, y: number, z: number, speed?: number }) => {
    const { x, y, z } = args;
    const speed = args.speed || CONFIG_DEFAULTS.speed;
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
  moveRelative = (args: { x: number, y: number, z: number, speed?: number }) => {
    const { x, y, z } = args;
    const speed = args.speed || CONFIG_DEFAULTS.speed;
    return this.send(rpcRequest([{ kind: "move_relative", args: { x, y, z, speed } }]));
  }

  /** Set a GPIO pin to a particular value. */
  writePin = (args: WritePin["args"]) => {
    return this.send(rpcRequest([{ kind: "write_pin", args }]));
  }

  /** Set a GPIO pin to a particular value. */
  readPin = (args: ReadPin["args"]) => {
    return this.send(rpcRequest([{ kind: "read_pin", args }]));
  }

  /** Reverse the value of a digital pin. */
  togglePin = (args: { pin_number: number; }) => {
    return this.send(rpcRequest([{ kind: "toggle_pin", args }]));
  }

  /** Read the status of the bot. Should not be needed unless you are first
   * logging in to the device, since the device pushes new states out on
   * every update. */
  readStatus = (args = {}) => {
    return this.send(rpcRequest([{ kind: "read_status", args }]));
  }

  /** Snap a photo and send to the API for post processing. */
  takePhoto =
    (args = {}) => this.send(rpcRequest([{ kind: "take_photo", args }]));

  /** Force device to download all of the latest JSON resources (plants,
   * account info, etc.) from the FarmBot API. */
  sync = (args = {}) => this.send(rpcRequest([{ kind: "sync", args }]));

  /** Set the position of the given axis to 0 at the current position of said
   * axis. Example: Sending bot.setZero("x") at x: 255 will translate position
   * 255 to 0. */
  setZero = (axis: Corpus.ALLOWED_AXIS) => {
    return this.send(rpcRequest([{
      kind: "zero",
      args: { axis }
    }]));
  }

  /** Update the Arduino settings */
  updateMcu = (update: Partial<McuParams>) => {
    const body: Corpus.RpcRequestBodyItem[] = [];
    Object
      .keys(update)
      .forEach(function (label) {
        const value = pick<Primitive>(update, label, "ERROR");
        body.push({
          kind: "config_update",
          args: { package: "arduino_firmware" },
          body: [{ kind: "pair", args: { value, label } }]
        });
      });
    return this.send(rpcRequest(body));
  }

  /** Set user ENV vars (usually used by 3rd party Farmware scripts).
   * Set value to `undefined` to unset. */
  setUserEnv = (configs: Dictionary<(string | undefined)>) => {
    const body = Object
      .keys(configs)
      .map(function (label): Corpus.Pair {
        return {
          kind: "pair",
          args: { label, value: (configs[label] || NULL) }
        };
      });
    return this.send(rpcRequest([{ kind: "set_user_env", args: {}, body }]));
  }

  registerGpio = (input: { pin_number: number, sequence_id: number }) => {
    const { sequence_id, pin_number } = input;
    const rpc = rpcRequest([{
      kind: "register_gpio",
      args: { sequence_id, pin_number }
    }]);
    return this.send(rpc);
  }

  unregisterGpio = (input: { pin_number: number }) => {
    const { pin_number } = input;
    const rpc = rpcRequest([{
      kind: "unregister_gpio",
      args: { pin_number }
    }]);
    return this.send(rpc);
  }


  setServoAngle = (args: { pin_number: number; pin_value: number; }) => {
    const result = this.send(rpcRequest([{ kind: "set_servo_angle", args }]));

    // Celery script can't validate `pin_number` and `pin_value` the way we need
    // for `set_servo_angle`. We will send the RPC command off, but also
    // crash the client to aid debugging.
    if (![4, 5].includes(args.pin_number)) {
      throw new Error("Servos only work on pins 4 and 5");
    }

    if (args.pin_value > 360 || args.pin_value < 0) {
      throw new Error("Pin value outside of 0...360 range");
    }

    return result;
  }

  /** Update a config option for FarmBot OS. */
  updateConfig = (update: Partial<Configuration>) => {
    const body = Object
      .keys(update)
      .map((label): Corpus.Pair => {
        const value = pick<Primitive>(update, label, "ERROR");
        return { kind: "pair", args: { value, label } };
      });

    return this.send(rpcRequest([{
      kind: "config_update",
      args: { package: "farmbot_os" },
      body
    }]));
  }

  calibrate = (args: { axis: Corpus.ALLOWED_AXIS }) => {
    return this.send(rpcRequest([{ kind: "calibrate", args }]));
  }

  /** Tell the bot to send diagnostic info to the API.*/
  dumpInfo = () => {
    return this.send(rpcRequest([{
      kind: "dump_info",
      args: {}
    }]));
  }

  reinitFirmware() {
    const r =
      rpcRequest([{ kind: "reboot", args: { package: "arduino_firmware" } }]);
    return this.send(r);
  }

  /** Retrieves all of the event handlers for a particular event.
   * Returns an empty array if the event did not exist.
    */
  event = (name: string) => {
    this._events[name] = this._events[name] || [];
    return this._events[name];
  }

  on = (event: string, callback: Function) => this.event(event).push(callback);

  emit = (event: string, data: {}) => {
    [this.event(event), this.event("*")]
      .forEach(function (handlers) {
        handlers.forEach(function (handler: Function) {
          try {
            handler(data, event);
          } catch (e) {
            console.warn("Exception thrown while handling `" + event + "` event.");
            console.dir(e);
          }
        });
      });
  }

  /** Dictionary of all relevant MQTT channels the bot uses. */
  get channel() {
    const deviceName = this.config.mqttUsername;
    return {
      /** From the browser, usually. */
      toDevice: `bot/${deviceName}/from_clients`,
      /** From farmbot */
      toClient: `bot/${deviceName}/from_device`,
      status: `bot/${deviceName}/status`,
      logs: `bot/${deviceName}/logs`,
      sync: `bot/${deviceName}/sync/#`,
      fromAPI: `bot/${deviceName}/from_api`,
    };
  }

  /** Low level means of sending MQTT packets. Does not check format. Does not
   * acknowledge confirmation. Probably not the one you want. */
  publish = (msg: Corpus.RpcRequest, important = true): void => {
    if (this.client) {
      this.emit("sent", msg);
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
    return new Promise((resolve, reject) => {

      this.publish(input);

      this.on(input.args.label, function (response: Corpus.RpcOk | Corpus.RpcError) {
        switch (response.kind) {
          case "rpc_ok": return resolve(response);
          case "rpc_error":
            const reason = (response.body || []).map(x => x.args.message).join(", ");
            return reject(new Error("Problem sending RPC command: " + reason));
          default:
            console.dir(response);
            throw new Error("Got a bad CeleryScript node.");
        }
      });
    });
  }

  /** Main entry point for all MQTT packets. */
  private _onmessage = (chan: string, buffer: Uint8Array) => {
    try {
      /** UNSAFE CODE: TODO: Add user defined type guards? */
      const msg = JSON.parse(buffer.toString()) as Corpus.RpcOk | Corpus.RpcError;
      switch (chan) {
        case this.channel.logs: return this.emit("logs", msg);
        case this.channel.status: return this.emit("status", msg);
        case this.channel.toClient:
        case this.channel.fromAPI:
        default:
          // Did it come from the auto_sync channel? Process it as such.
          if (chan.includes("sync")) {
            return this.emit("sync", msg);
          }

          // Is it valid CS? Probably a batch resource or RPC operation.
          if (isCeleryScript(msg)) {
            return this.emit(msg.args.label, msg);
          }

          // Still nothing? Emit "malformed", but don't crash incase we're
          // getting outdated messages from a legacy bot.
          console.warn(`Unhandled inbound message from ${chan}`);
          this.emit("malformed", msg);
      }
    } catch (error) {
      console.warn("Could not parse inbound message from MQTT.");
      this.emit("malformed", buffer.toString());
    }
  }

  /** Bootstrap the device onto the MQTT broker. */
  connect = () => {
    const { mqttUsername, token, mqttServer } = this.config;
    const client = connect(mqttServer, {
      username: mqttUsername,
      password: token,
      clean: true,
      clientId: `FBJS-${Farmbot.VERSION}-${genUuid()}`,
      reconnectPeriod: RECONNECT_THROTTLE
    });
    this.client = client;
    this.resources = new ResourceAdapter(this, this.config.mqttUsername);
    client.on("message", this._onmessage);
    client.on("offline", () => this.emit("offline", {}));
    client.on("connect", () => this.emit("online", {}));
    const channels = [
      this.channel.fromAPI,
      this.channel.logs,
      this.channel.status,
      this.channel.sync,
      this.channel.toClient,
    ];
    client.subscribe(channels);
    return new Promise((resolve, _reject) => {
      const { client } = this;
      if (client) {
        client.once("connect", () => resolve(this));
      } else {
        throw new Error("Please connect first.");
      }
    });
  }
}
