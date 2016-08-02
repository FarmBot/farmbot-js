import "./fb_promise";

export namespace FB {

  // SORY FOR THE MESS LOL. -RC
  // http://stackoverflow.com/a/38731120/1064917
  export interface Thenable<T> {
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
  }

  export type MQTTEventName = "connect" | "message";

  export interface MqttClient {
    publish: (channel: string, payload: any) => void;
    subscribe: (channel: string | string[]) => void;
    on: (type: MQTTEventName, listener: any) => void;
    once: (type: MQTTEventName, listener: any) => void;
  }

  export type userVariables = "x"
    | "y"
    | "z"
    | "s"
    | "busy"
    | "last"
    | "pins"
    | "unknown_parameter_busy"
    | "unknown_parameter_last"
    | "param_version"
    | "unknown_parameter_unknown_parameter_1"
    | "movement_timeout_x"
    | "movement_timeout_y"
    | "movement_timeout_z"
    | "movement_invert_endpoints_x"
    | "movement_invert_endpoints_y"
    | "movement_invert_endpoints_z"
    | "movement_invert_motor_x"
    | "movement_invert_motor_y"
    | "movement_invert_motor_z"
    | "movement_steps_acc_dec_x"
    | "movement_steps_acc_dec_y"
    | "movement_steps_acc_dec_z"
    | "movement_home_up_x"
    | "movement_home_up_y"
    | "movement_home_up_z"
    | "movement_min_spd_x"
    | "movement_min_spd_y"
    | "movement_min_spd_z"
    | "movement_max_spd_x"
    | "movement_max_spd_y"
    | "movement_max_spd_z"
    | "unknown_parameter_1"
    | "time"
    | "pin0"
    | "pin1"
    | "pin2"
    | "pin3"
    | "pin4"
    | "pin5"
    | "pin6"
    | "pin7"
    | "pin8"
    | "pin9"
    | "pin10"
    | "pin11"
    | "pin12"
    | "pin13";

  export type messageType = "emergency_stop"
    | "home_all"
    | "home_x"
    | "home_y"
    | "home_z"
    | "move_absolute"
    | "move_relative"
    | "pin_write"
    | "read_parameter"
    | "read_status"
    | "write_parameter"
    | "wait"
    | "send_message"
    | "if_statement"
    | "read_pin"
    | "execute";

  export interface StepCommand {
    x?: number;
    y?: number;
    z?: number;
    speed?: number;
    delay?: number;
    pin?: number;
    mode?: number;
    position?: number;
    value?: string;
    operator?: ">" | "<" | "!=" | "==";
    variable?: userVariables;
    sub_sequence_id?: string;
  }

  /** Similar to "Step", but "position" isnt mandatory. */
  export interface UnplacedStep {
    message_type: messageType;
    position?: number;
    _id?: string;
    command: StepCommand;
  };

  /** One step in a larger "Sequence". */
  export interface Step extends UnplacedStep {
    position: number;
  };
  /** Color choices for sequence tiles. */
  export type Color = "blue" | "green" | "yellow" | "orange" | "purple" | "pink" | "gray" | "red";

  export interface Sequence {
    _id?: string;
    color: Color;
    name: String;
    steps: Step[];
    dirty?: Boolean;
  }

  export interface CalibrationParams {
    [key: string]: any;
  }


  export interface Dictionary<T> {
    [key: string]: T;
  }

  export interface ConstructorParams {
    /** API token which can be retrieved by logging into REST server or my.farmbot.io */
    token: string;
    /** Default time to wait (ms) before considering operation a failure. */
    timeout?: number;
    /** Default physical speed for operations. (steps/s?) */
    speed?: number;
    /** DEPRECATED. This information is now encoded into `token`. */
    meshServer?: string;
  }

  export interface APIToken {
    /** URL of MQTT server. REST server is not the same as MQTT server. */
    mqtt: string;
    /** UUID of current bot. */
    bot: string;
  }

  export type RPCMethod = "single_command.EMERGENCY STOP"
    | "exec_sequence"
    | "single_command.HOME ALL"
    | "single_command.HOME X"
    | "single_command.HOME Y"
    | "single_command.HOME Z"
    | "single_command.MOVE ABSOLUTE"
    | "single_command.MOVE RELATIVE"
    | "single_command.PIN WRITE"
    | "read_status"
    | "sync_sequence"
    | "update_calibration";

  export interface RPCPayload {
    params: {};
    method: RPCMethod;
  }

  export interface RPCMessage extends RPCPayload {
    id: string;
  }

  export interface CommandOptions {
    x?: number;
    y?: number;
    z?: number;
    pin?: number;
    value?: string;
    speed?: number;
    mode?: number;
    message_type?: string;
    value1?: number;
  };
};
