// TODO: Remove this and use interface in `@types/promise`.
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

export interface Dictionary<T> {
  [key: string]: T;
}

export type StateTree = Dictionary<string | number | boolean>;

export type userVariables = "x"
  | "y"
  | "z"
  | "s"
  | "busy"
  | "last"
  | "pins"
  | "param_version"
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

/** Names for a single step within a sequence.
 *  Not to be confused with the names of JSON RPC commands.
 * This is different. These names are only related to 
 * the individual steps of a sequence object. */
export type stepType = "emergency_stop"
  | "home_all"
  | "home_x"
  | "home_y"
  | "home_z"
  | "move_absolute"
  | "move_relative"
  | "write_pin"
  | "read_parameter"
  | "read_status"
  | "write_parameter"
  | "wait"
  | "send_message"
  | "if_statement"
  | "read_pin"
  | "execute";

/** Color choices for sequence tiles. */
export type Color = "blue"
  | "green"
  | "yellow"
  | "orange"
  | "purple"
  | "pink"
  | "gray"
  | "red";

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
  // TODO: Is this correct?
  message_type: stepType;
  position?: number;
  id?: number;
  command: StepCommand;
};

/** One step in a larger "Sequence". */
export interface Step extends UnplacedStep {
  position: number;
};

/** One step in a larger "Sequence". */
export interface Step extends UnplacedStep {
  position: number;
};

export interface Sequence {
  id?: number;
  color: Color;
  name: string;
  steps: Step[];
  dirty?: Boolean;
}

export type CalibrationParams = Dictionary<any>;

export interface ConstructorParams {
  /** API token which can be retrieved by logging into REST server or my.farmbot.io */
  token: string;
  /** Default time to wait (ms) before considering operation a failure. */
  timeout?: number;
  /** Default physical speed for operations. (steps/s?) */
  speed?: number;
}

export interface APIToken {
  /** URL of MQTT server. REST server is not the same as MQTT server. */
  mqtt: string;
  /** UUID of current bot. */
  bot: string;
}

export type configKey = "speed"
  | "x"
  | "y"
  | "z"
  | "movement_axis_nr_steps_x"
  | "movement_axis_nr_steps_y"
  | "movement_axis_nr_steps_z"
  | "movement_home_up_x"
  | "movement_home_up_y"
  | "movement_home_up_z"
  | "movement_invert_endpoints_x"
  | "movement_invert_endpoints_y"
  | "movement_invert_endpoints_z"
  | "movement_invert_motor_x"
  | "movement_invert_motor_y"
  | "movement_invert_motor_z"
  | "movement_max_spd_x"
  | "movement_max_spd_y"
  | "movement_max_spd_z"
  | "movement_min_spd_x"
  | "movement_min_spd_y"
  | "movement_min_spd_z"
  | "movement_steps_acc_dec_x"
  | "movement_steps_acc_dec_y"
  | "movement_steps_acc_dec_z"
  | "movement_timeout_x"
  | "movement_timeout_y"
  | "movement_timeout_z"
  | "param_version"
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

/** Status registers for the bot's status */
export interface HardwareState {
  speed?: number;
  x?: number;
  y?: number;
  z?: number;
  movement_axis_nr_steps_x?: number;
  movement_axis_nr_steps_y?: number;
  movement_axis_nr_steps_z?: number;
  movement_home_up_x?: number;
  movement_home_up_y?: number;
  movement_home_up_z?: number;
  movement_invert_endpoints_x?: number;
  movement_invert_endpoints_y?: number;
  movement_invert_endpoints_z?: number;
  movement_invert_motor_x?: number;
  movement_invert_motor_y?: number;
  movement_invert_motor_z?: number;
  movement_max_spd_x?: number;
  movement_max_spd_y?: number;
  movement_max_spd_z?: number;
  movement_min_spd_x?: number;
  movement_min_spd_y?: number;
  movement_min_spd_z?: number;
  movement_steps_acc_dec_x?: number;
  movement_steps_acc_dec_y?: number;
  movement_steps_acc_dec_z?: number;
  movement_timeout_x?: number;
  movement_timeout_y?: number;
  movement_timeout_z?: number;
  param_version?: number;
  pin0?: number;
  pin1?: number;
  pin2?: number;
  pin3?: number;
  pin4?: number;
  pin5?: number;
  pin6?: number;
  pin7?: number;
  pin8?: number;
  pin9?: number;
  pin10?: number;
  pin11?: number;
  pin12?: number;
  pin13?: number;
}
