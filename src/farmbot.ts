import * as Corpus from "./corpus";
import mqtt, { MqttClient } from "mqtt";
import {
  rpcRequest,
  coordinate,
  uuid as genUuid
} from "./util";
import { Dictionary, Vector3 } from "./interfaces";
import { ReadPin, WritePin, bufferToString } from ".";
import {
  FarmBotInternalConfig as Conf,
  FarmbotConstructorParams,
  generateConfig,
  CONFIG_DEFAULTS
} from "./config";
import { ResourceAdapter } from "./resources/resource_adapter";
import { MqttChanName, FbjsEventName, Misc } from "./constants";
import { hasLabel } from "./util/is_celery_script";
import { timestamp } from "./util/time";
import { Priority } from "./util/rpc_request";

type RpcResponse = Promise<Corpus.RpcOk | Corpus.RpcError>;

/*
 * Clarification for several terms used:
 *  * Farmware: Plug-ins for FarmBot OS. Sometimes referred to as `scripts`.
 *  * Microcontroller: Directly controls and interfaces with motors,
 *        peripherals, sensors, etc. May be on an Arduino or Farmduino board.
 *        Mostly referred to as `arduino`, but also `mcu`.
 */

/** Meta data that wraps an event callback */
interface CallbackWrapper {
  once: boolean;
  event: string;
  value: Function;
}

export class Farmbot {
  /** Storage area for all event handlers */
  private _events: Dictionary<CallbackWrapper[]>;
  private config: Conf;
  public client?: MqttClient;
  public resources: ResourceAdapter;
  static VERSION = "15.8.11";

  constructor(input: FarmbotConstructorParams) {
    this._events = {};
    this.config = generateConfig(input);
    this.resources = new ResourceAdapter(this, this.config.mqttUsername);
  }

  /** Get a Farmbot Constructor Parameter. */
  getConfig = <U extends keyof Conf>(key: U): Conf[U] => this.config[key];

  /** Set a Farmbot Constructor Parameter. */
  setConfig = <U extends keyof Conf>(key: U, value: Conf[U]) => {
    this.config[key] = value;
  }

  /**
   * Installs a "Farmware" (plugin) onto the bot's SD card.
   * URL must point to a valid Farmware manifest JSON document.
   */
  installFarmware = (url: string) => {
    return this.send(rpcRequest([{ kind: "install_farmware", args: { url } }]));
  }

  /**
   * Checks for updates on a particular Farmware plugin when given the name of
   * a Farmware. `updateFarmware("take-photo")`
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
      args: {
        package: pkg
      }
    }]));
  }

  /**
   * Installs "Farmware" (plugins) authored by FarmBot, Inc.
   * onto the bot's SD card.
   */
  installFirstPartyFarmware = () => {
    return this.send(rpcRequest([{
      kind: "install_first_party_farmware",
      args: {}
    }]));
  }

  /**
   * Deactivate FarmBot OS completely (shutdown).
   * Useful before unplugging the power.
   */
  powerOff = () => {
    return this.send(rpcRequest([{ kind: "power_off", args: {} }]));
  }

  /** Restart FarmBot OS. */
  reboot = () => {
    return this.send(rpcRequest([
      { kind: "reboot", args: { package: "farmbot_os" } }
    ]));
  }

  /** Reinitialize the FarmBot microcontroller firmware. */
  rebootFirmware = () => {
    return this.send(rpcRequest([
      { kind: "reboot", args: { package: "arduino_firmware" } }
    ]));
  }

  /** Check for new versions of FarmBot OS.
   * Downloads and installs if available. */
  checkUpdates = () => {
    return this.send(rpcRequest([
      { kind: "check_updates", args: { package: "farmbot_os" } }
    ]));
  }

  /** THIS WILL RESET THE SD CARD, deleting all non-factory data!
   * Be careful!! */
  resetOS = (): void => {
    return this.publish(rpcRequest([
      { kind: "factory_reset", args: { package: "farmbot_os" } }
    ]));
  }

  /** WARNING: will reset all firmware (hardware) settings! */
  resetMCU = () => {
    return this.send(rpcRequest([
      { kind: "factory_reset", args: { package: "arduino_firmware" } }
    ]));
  }

  flashFirmware = (
    /** one of: "arduino"|"express_k10"|"farmduino_k14"|"farmduino" */
    firmware_name: string) => {
    return this.send(rpcRequest([{
      kind: "flash_firmware",
      args: {
        package: firmware_name
      }
    }]));
  }

  /**
   * Lock the bot from moving (E-STOP). Turns off peripherals and motors. This
   * also will pause running regimens and cause any running sequences to exit.
   */
  emergencyLock = () => {
    const body: Corpus.RpcRequestBodyItem[] =
      [{ kind: "emergency_lock", args: {} }];
    const rpc = rpcRequest(body, Priority.HIGHEST);

    return this.send(rpc);
  }

  /** Unlock the bot when the user says it is safe. */
  emergencyUnlock = () => {
    const body: Corpus.RpcRequestBodyItem[] =
      [{ kind: "emergency_unlock", args: {} }];
    const rpc = rpcRequest(body, Priority.HIGHEST);

    return this.send(rpc);
  }
  /** Execute a sequence by its ID on the FarmBot API. */
  execSequence =
    (sequence_id: number, body: Corpus.ParameterApplication[] = []) => {
      return this.send(rpcRequest([
        { kind: "execute", args: { sequence_id }, body }
      ]));
    }

  /** Run an installed Farmware plugin on the SD Card. */
  execScript = (
    /** Name of the Farmware. */
    label: string,
    /** Optional ENV vars to pass the Farmware. */
    envVars?: Corpus.Pair[] | undefined) => {
    return this.send(rpcRequest([
      { kind: "execute_script", args: { label }, body: envVars }
    ]));
  }

  /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */
  home = (args: { speed: number, axis: Corpus.ALLOWED_AXIS }) => {
    return this.send(rpcRequest([{ kind: "home", args }]));
  }

  /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis
   * order. WON'T WORK WITHOUT ENCODERS OR END STOPS! A blockage or stall
   * during this command will set that position as zero. Use carefully. */
  findHome = (args: { speed: number, axis: Corpus.ALLOWED_AXIS }) => {
    return this.send(rpcRequest([{ kind: "find_home", args }]));
  }

  /** Move FarmBot to an absolute point. */
  moveAbsolute = (args: Vector3 & { speed?: number }) => {
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

  /** Move FarmBot to position relative to its current position. */
  moveRelative = (args: Vector3 & { speed?: number }) => {
    const { x, y, z } = args;
    const speed = args.speed || CONFIG_DEFAULTS.speed;
    return this.send(rpcRequest([
      { kind: "move_relative", args: { x, y, z, speed } }
    ]));
  }

  /** Set a GPIO pin to a particular value. */
  writePin = (args: WritePin["args"]) => {
    return this.send(rpcRequest([{ kind: "write_pin", args }]));
  }

  /** Read the value of a GPIO pin. Will create a SensorReading if it's
   * a sensor. */
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
    (args = {}) => this.send(rpcRequest([{ kind: "take_photo", args }]))

  /** Download/apply all of the latest FarmBot API JSON resources (plants,
   * account info, etc.) to the device. */
  sync = (args = {}) => this.send(rpcRequest([{ kind: "sync", args }]));

  /**
   * Set the current position of the given axis to 0.
   * Example: Sending `bot.setZero("x")` at x: 255 will translate position
   * 255 to 0, causing that position to be x: 0.
   */
  setZero = (axis: Corpus.ALLOWED_AXIS) => {
    return this.send(rpcRequest([{
      kind: "zero",
      args: { axis }
    }]));
  }

  /**
   * Set user ENV vars (usually used by 3rd-party Farmware plugins).
   * Set value to `undefined` to unset.
   */
  setUserEnv = (configs: Dictionary<(string | undefined)>) => {
    const body = Object
      .keys(configs)
      .map(function (label): Corpus.Pair {
        return {
          kind: "pair",
          args: { label, value: (configs[label] || Misc.NULL) }
        };
      });
    return this.send(rpcRequest([{ kind: "set_user_env", args: {}, body }]));
  }

  sendMessage = (message_type: Corpus.ALLOWED_MESSAGE_TYPES,
    message: string,
    channels: Corpus.ALLOWED_CHANNEL_NAMES[] = []) => {
    this.send(rpcRequest([{
      kind: "send_message",
      args: {
        message_type,
        message
      },
      body: channels.map(channel_name => ({
        kind: "channel",
        args: {
          channel_name
        }
      }))
    }]));
  }

  /** Control servos on pins 4 and 5. */
  setServoAngle = (args: { pin_number: number; pin_value: number; }) => {
    const result = this.send(rpcRequest([{ kind: "set_servo_angle", args }]));

    // Celery script can't validate `pin_number` and `pin_value` the way we need
    // for `set_servo_angle`. We will send the RPC command off, but also
    // crash the client to aid debugging.
    if (![4, 5, 6, 11].includes(args.pin_number)) {
      throw new Error("Servos only work on pins 4 and 5");
    }

    if (args.pin_value > 180 || args.pin_value < 0) {
      throw new Error("Pin value outside of 0...180 range");
    }

    return result;
  }

  /**
   * Find the axis extents using encoder, motor, or end-stop feedback.
   * Will set a new home position and a new axis length for the given axis.
   */
  calibrate = (args: { axis: Corpus.ALLOWED_AXIS }) => {
    return this.send(rpcRequest([{ kind: "calibrate", args }]));
  }

  lua = (lua: string) => {
    return this.send(rpcRequest([
      { kind: "lua", args: { lua } }
    ]));
  }
  /**
   * Retrieves all of the event handlers for a particular event.
   * Returns an empty array if the event did not exist.
   */
  event = (name: string) => {
    this._events[name] = this._events[name] || [];
    return this._events[name];
  }

  on = (event: string, value: Function, once = false) => {
    this.event(event).push({ value, once, event });
  }

  emit = (event: string, data: {}) => {
    const nextArray: CallbackWrapper[] = [];

    this.event(event)
      .concat(this.event("*"))
      .forEach(function (handler) {
        try {
          handler.value(data, event);
          if (!handler.once && handler.event === event) {
            nextArray.push(handler);
          }
        } catch (e) {
          const msg = `Exception thrown while handling '${event}' event.`;
          console.warn(msg);
          console.dir(e);
        }
      });

    if (nextArray.length === 0) {
      delete this._events[event];
    } else {
      this._events[event] = nextArray;
    }
  }

  /** Dictionary of all relevant MQTT channels the bot uses. */
  get channel() {
    const deviceName = this.config.mqttUsername;
    return {
      /** From the browser, usually. */
      toDevice: `bot/${deviceName}/${MqttChanName.fromClients}`,
      /** From farmbot */
      toClient: `bot/${deviceName}/${MqttChanName.fromDevice}`,
      status: `bot/${deviceName}/${MqttChanName.status}`,
      logs: `bot/${deviceName}/${MqttChanName.logs}`,
      sync: `bot/${deviceName}/${MqttChanName.sync}/#`,
      /** Read only */
      pong: `bot/${deviceName}/pong/#`,
      /** Write only: bot/${deviceName}/ping/${timestamp} */
      ping: (tStamp: number) => `bot/${deviceName}/ping/${tStamp}`
    };
  }

  /** Low-level means of sending MQTT packets. Does not check format. Does not
   * acknowledge confirmation. Probably not the one you want. */
  publish = (msg: Corpus.RpcRequest, important = true): void => {
    if (this.client) {
      this.emit(FbjsEventName.sent, msg);
      /** SEE: https://github.com/mqttjs/MQTT.js#client */
      this.client.publish(this.channel.toDevice, JSON.stringify(msg));
    } else {
      if (important) {
        throw new Error("Not connected to server");
      }
    }
  }

  /** Low-level means of sending MQTT RPC commands to the bot. Acknowledges
   * receipt of message, but does not check formatting. Consider using higher
   * level methods like .moveRelative(), .calibrate(), etc....
  */
  send = (input: Corpus.RpcRequest): RpcResponse => {
    return new Promise((resolve, reject) => {

      this.publish(input);

      function handler(response: Corpus.RpcOk | Corpus.RpcError) {
        switch (response.kind) {
          case "rpc_ok": return resolve(response);
          case "rpc_error":
            const reason = (response.body || [])
              .map(x => x.args.message)
              .join(", ");
            return reject(new Error(reason));
          default:
            console.dir(response);
            throw new Error("Got a bad CeleryScript node.");
        }
      }

      this.on(input.args.label, handler, true);
    });
  }

  /** Main entry point for all MQTT packets. */
  _onmessage = (chan: string, buffer: Uint8Array) => {
    const original = bufferToString(buffer);
    const segments = chan.split(Misc.MQTT_DELIM);
    const { emit } = this;

    try {
      const msg = JSON.parse(original);

      if (segments[0] == MqttChanName.publicBroadcast) {
        return emit(MqttChanName.publicBroadcast, msg);
      }

      switch (segments[2]) {
        case MqttChanName.logs: return emit(FbjsEventName.logs, msg);
        case MqttChanName.status: return emit(FbjsEventName.status, msg);
        case MqttChanName.sync: return emit(FbjsEventName.sync, msg);
        case MqttChanName.pong:
          return emit(segments[3], msg);
        default:
          const ev = hasLabel(msg) ? msg.args.label : FbjsEventName.malformed;
          return emit(ev, msg);
      }
    } catch (error) {
      console
        .dir({ text: "Could not parse inbound message from MQTT.", error });
      emit(FbjsEventName.malformed, original);
    }
  }

  ping = (timeout = 10000, now = timestamp()): Promise<number> => {
    this.setConfig("LAST_PING_OUT", now);
    return this.doPing(now, timeout);
  }

  // STEP 0: Subscribe to `bot/device_23/pong/#`
  // STEP 0: Send         `bot/device_23/ping/3123123`
  // STEP 0: Receive      `bot/device_23/pong/3123123`
  private doPing = (startedAt: number, timeout: number): Promise<number> => {
    const timeoutPromise =
      new Promise<number>((_, rej) => setTimeout(() => rej(-0), timeout));
    const pingPromise = new Promise<number>((res, _) => {
      const ok = () => {
        const t = timestamp();
        this.setConfig("LAST_PING_IN", t);
        res(t - startedAt);
      };
      this.on("" + startedAt, ok, true);
      const chan = this.channel.ping(startedAt);
      if (this.client) {
        this.client.publish(chan, JSON.stringify(startedAt));
      }
    });

    return Promise.race([timeoutPromise, pingPromise]);
  }

  /** Bootstrap the device onto the MQTT broker. */
  connect = () => {
    const { mqttUsername, token, mqttServer } = this.config;
    const reconnectPeriod: number = Misc.RECONNECT_THROTTLE_MS;
    const client = mqtt.connect(mqttServer, {
      clean: true,
      clientId: `FBJS-${Farmbot.VERSION}-${genUuid()}`,
      password: token,
      protocolId: "MQTT",
      protocolVersion: 4,
      reconnectPeriod,
      username: mqttUsername,
    });
    this.client = client;
    this.resources = new ResourceAdapter(this, this.config.mqttUsername);
    client.on("message", this._onmessage);
    client.on("offline", () => this.emit(FbjsEventName.offline, {}));
    client.on("connect", () => this.emit(FbjsEventName.online, {}));
    const channels = [
      this.channel.logs,
      this.channel.status,
      this.channel.sync,
      this.channel.toClient,
      this.channel.pong
    ];
    client.subscribe(channels);
    return new Promise((resolve, _reject) => {
      if (this.client) {
        this.client.once("connect", () => resolve(this));
      } else {
        throw new Error("Please connect first.");
      }
    });
  }
}
