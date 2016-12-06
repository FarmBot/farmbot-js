import * as FB from "./interfaces";
import * as JSONRPC from "./jsonrpc";
import * as BotCommand from "./bot_commands";
import { timerDefer } from "./fbpromise";
import { connect } from "mqtt";
import { uuid, assign } from "./util";

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
    let p: BotCommand.PoweroffRequest = {
      method: "power_off",
      params: [],
      id: uuid()
    };
    return this.send(p);
  }

  reboot() {
    let p: BotCommand.RebootRequest = {
      method: "reboot",
      params: [],
      id: uuid()
    };
    return this.send(p);
  }

  checkUpdates() {
    let p: BotCommand.CheckUpdatesRequest = {
      method: "check_updates",
      params: [],
      id: uuid()
    };
    return this.send(p);
  }

  checkArduinoUpdates() {
    let p: BotCommand.CheckArduinoUpdatesRequest = {
      method: "check_arduino_updates",
      params: [],
      id: uuid()
    };
    return this.send(p);
  }

  /** Lock the bot from moving. This also will pause running regimens and cause
   *  any running sequences to exit
   */
  emergencyLock() {
    let p: BotCommand.EmergencyLockRequest = {
      method: "emergency_lock",
      params: [],
      id: uuid()
    };

    return this.send(p);
  }

  /** Unlock the bot when the user says it is safe. */
  emergencyUnlock() {
    let p: BotCommand.EmergencyUnlockRequest = {
      method: "emergency_unlock",
      params: [],
      id: uuid()
    };

    return this.send(p);
  }

  execSequence(sequence: FB.Sequence) {
    let p: BotCommand.ExecSequenceRequest = {
      method: "exec_sequence",
      params: [sequence],
      id: uuid()
    };

    return this.send(p);
  }

  homeAll(i: BotCommand.Params.Speed) {
    let p: BotCommand.HomeAllRequest = {
      method: "home_all",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  homeX(i: BotCommand.Params.Speed) {
    let p: BotCommand.HomeXRequest = {
      method: "home_x",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  homeY(i: BotCommand.Params.Speed) {
    let p: BotCommand.HomeYRequest = {
      method: "home_y",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  homeZ(i: BotCommand.Params.Speed) {
    let p: BotCommand.HomeZRequest = {
      method: "home_z",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }


  moveAbsolute(i: BotCommand.MovementRequest) {
    let p: BotCommand.MoveAbsoluteRequest = {
      method: "move_absolute",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  moveRelative(i: BotCommand.MovementRequest) {
    let p: BotCommand.MoveRelativeRequest = {
      method: "move_relative",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  writePin(i: BotCommand.WritePinParams) {
    let p: BotCommand.WritePinRequest = {
      method: "write_pin",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  togglePin(i: BotCommand.TogglePinParams) {
    let p: BotCommand.TogglePinRequest = {
      method: "toggle_pin",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }


  readStatus() {
    let p: BotCommand.ReadStatusRequest = {
      method: "read_status",
      params: [],
      id: uuid()
    };

    return this.send(p);
  }

  sync() {
    let p: BotCommand.SyncRequest = {
      method: "sync",
      params: [],
      id: uuid()
    };

    return this.send(p);
  }

  /** Update the arduino settings */
  updateMcu(i: BotCommand.Params.McuConfigUpdate) {
    let p: BotCommand.McuConfigUpdateRequest = {
      method: "mcu_config_update",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  /** Update a config */
  updateConfig(i: BotCommand.Params.BotConfigUpdate) {
    let p: BotCommand.BotConfigUpdateRequest = {
      method: "bot_config_update",
      params: [i],
      id: uuid()
    };

    return this.send(p);
  }

  startRegimen(id: number) {
    let p: BotCommand.StartRegimenRequest = {
      method: "start_regimen",
      params: [{ regimen_id: id }],
      id: uuid()
    };

    return this.send(p);
  }

  stopRegimen(id: number) {
    let p: BotCommand.StopRegimenRequest = {
      method: "stop_regimen",
      params: [{ regimen_id: id }],
      id: uuid()
    };

    return this.send(p);
  }

  calibrate(target: BotCommand.CalibrationTarget) {
    let p: BotCommand.CalibrationRequest = {
      method: "calibrate",
      params: [{ target }],
      id: uuid()
    };

    return this.send(p);
  }

  logDump() {
    let p: BotCommand.LogDumpRequest = {
      method: "log_dump",
      params: [{}],
      id: uuid()
    };

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
      toClient: `bot/${uuid}/from_device`
    };
  }

  publish(msg: JSONRPC.Request<any> | JSONRPC.Notification<any>): void {
    if (this.client) {
      this.client.publish(this.channel.toDevice, JSON.stringify(msg));
    } else {
      throw new Error("Not connected to server");
    }
  };

  send<T extends Array<any>>(input: BotCommand.Request<T>) {
    let that = this;
    let msg = input;
    let label = `${msg.method} ${JSON.stringify(msg.params)}`;
    let time = that.getState()["timeout"] as number;
    let p = timerDefer(time, label);
    console.log(`Sent: ${msg.id}`);
    that.publish(msg);
    that.on(msg.id, function (response: JSONRPC.Uncategorized) {
      console.log(`Got ${response.id || "??"}`);
      if (response && response.result) {
        // Good method invocation.
        p.resolve(response);
        return;
      }

      if (response && response.error) {
        // Bad method invocation.
        p.reject(response.error);
        return;
      }

      // It's not JSONRPC.
      let e = new Error("Malformed response");
      console.error(e);
      console.dir(response);
      p.reject(e);
    });
    return p.promise;
  };

  _onmessage(_: string, buffer: Uint8Array /*, message*/) {
    try {
      var msg = JSON.parse(buffer.toString());
    } catch (error) {
      throw new Error("Could not parse inbound message from MQTT.");
    }

    if (msg && (msg.method && msg.params && (msg.id === null))) {
      console.log("Notification");
      this.emit("notification", msg);
      return;
    }

    if (msg && (msg.id)) {
      this.emit(msg.id, msg);
      return;
    }

    throw new Error("Not a JSONRPC Compliant message");
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
    that.client.once("connect", () => p.resolve(that));
    that.client.on("message", that._onmessage.bind(that));
    return p.promise;
  }

}
