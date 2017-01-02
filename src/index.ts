import * as FB from "./interfaces";
import * as Corpus from "./corpus"
import { timerDefer } from "./fbpromise";
import { connect } from "mqtt";
import { uuid, assign } from "./util";
import { McuParams, Configuration, Partial } from "./interfaces";
import { pick } from "./util";

function coordinate(x: number, y: number, z: number): Corpus.Coordinate {
  return { kind: "coordinate", args: { x, y, z } };
}

function rpcRequest(): Corpus.RpcRequest {
  return { kind: "rpc_request", args: { data_label: uuid() } };
}
export class Farmbot {
  static VERSION = "2.0.0-rc.9";
  static defaults = { speed: 100, timeout: 6000 };

  private _events: FB.Dictionary<Function[]>;
  private _state: FB.StateTree;
  public client: FB.MqttClient;

  constructor(input: FB.ConstructorParams) {
    this._events = {};
    this._state = assign({}, Farmbot.defaults, input);
    this._decodeThatToken();
  }

  _decodeThatToken() {
    let token: FB.APIToken;
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

  getState(): FB.StateTree {
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

  execSequence(sub_sequence_id: number) {
    let p = rpcRequest();
    p.body = [{ kind: "execute", args: { sub_sequence_id } }];
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
    speed = speed || 100;
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
    speed = speed || 100;
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
      .forEach(function (key) {
        (p.body || []).push({
          kind: "mcu_config_update",
          args: { number: pick(update, key, 0), data_label: key }
        });
      });
    return this.send(p);
  }

  /** Update a config */
  updateConfig(update: Partial<Configuration>) {
    let p = rpcRequest();
    p.body = [];
    Object
      .keys(update)
      .forEach(function (key) {
        (p.body || []).push({
          kind: "bot_config_update",
          args: { number: pick(update, key, 0), data_label: key }
        });
      });
    return this.send(p);
  }

  startRegimen(args: { regimen_id: number }) {
    let p = rpcRequest();
    p.body = [
      {
        kind: "start_regimen",
        args: {
          regimen_id: args.regimen_id,
          data_label: uuid()
        }
      }
    ];
    return this.send(p);
  }

  stopRegimen(args: { regimen_id: number }) {
    let p = rpcRequest();
    p.body = [
      {
        kind: "stop_regimen",
        args: {
          // HACK: The way start/stop regimen works right now is actually broke.
          //       We don't want to fix until the JSON RPC upgrade is complete.
          data_label: args.regimen_id.toString()
        }
      }
    ];
    return this.send(p);
  }

  calibrate(args: { axis: Corpus.ALLOWED_AXIS }) {
    let p = rpcRequest();
    p.body = [{ kind: "calibrate", args }];
    return this.send(p);
  }

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
      toDevice: `bot/${uuid}/from_clients`,
      toClient: `bot/${uuid}/from_device`,
      status: `bot/${uuid}/status`,
      logs: `bot/${uuid}/logs`
    };
  }

  publish(msg: Corpus.RpcRequest): void {
    if (this.client) {
      this.client.publish(this.channel.toDevice, JSON.stringify(msg));
    } else {
      throw new Error("Not connected to server");
    }
  };

  send(input: Corpus.RpcRequest) {
    let that = this;
    let msg = input;
    let rpcs = (input.body || []).map(x => x.kind).join(", ");
    let label = `${rpcs} ${JSON.stringify(input.body || [])}`;
    let time = that.getState()["timeout"] as number;
    let p = timerDefer(time, label);
    console.log(`Sent: ${msg.args.data_label}`);
    that.publish(msg);
    that.on(msg.args.data_label, function (response: Corpus.RpcOk | Corpus.RpcError) {
      console.log(`Got ${response.args.data_label || "??"}`);
      switch (response.kind) {
        case "rpc_ok": return p.resolve(response);
        case "rpc_error":
          let reason = (response.body || []).map(x => x.args.message).join(", ");
          return p.reject(new Error("Problem sending RPC command: " + reason));
        default:
          console.dir(response);
          throw new Error("Got a bad CeleryScript node.");
      }
    });

    return p.promise;
  };

  _onmessage(chan: string, buffer: Uint8Array /*, message*/) {
    try {
      /** UNSAFE CODE: TODO: Add user defined type guards? */
      var msg = JSON.parse(buffer.toString()) as Corpus.RpcOk | Corpus.RpcError;
    } catch (error) {
      throw new Error("Could not parse inbound message from MQTT.");
    }
    switch (chan) {
      case this.channel.logs: return this.emit("logs", msg);
      case this.channel.status: return this.emit("status", msg);
      case this.channel.toClient: return this.emit(msg.args.data_label, msg);
      default: throw new Error("Never should see this.");
    }
  };

  connect() {
    let that = this;
    let { uuid, token, mqttServer, timeout } = that.getState();
    let p = timerDefer<Farmbot>(<number>timeout, "MQTT Connect Atempt");
    that.client = connect(<string>mqttServer, {
      username: <string>uuid,
      password: <string>token
    }) as FB.MqttClient;
    that.client.subscribe(that.channel.toClient);
    that.client.subscribe(that.channel.logs);
    that.client.subscribe(that.channel.status);
    that.client.once("connect", () => p.resolve(that));
    that.client.on("message", that._onmessage.bind(that));
    return p.promise;
  }
}
