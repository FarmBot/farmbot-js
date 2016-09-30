import { JSONRPC } from "./jsonrpc";

/** Reference specification of all FarmBot RPC commands. */
export namespace BotCommand {
  /** All possible RPC parameters and their types. */
  export namespace Params {
    export interface X { x: number; }
    export interface Y { y: number; }
    export interface Z { z: number; }
    export interface PinNumber { pin_number: number; }
    export interface PinValue { pin_value: number; }
    export interface PinMode { pin_mode: number; }
    export interface Speed { speed: number; }
  }

  /** Acceptable "method" names for JSON RPC messages to the bot. */
  export type Method = "emergency_stop"
    | "exec_sequence"
    | "home_all"
    | "home_x"
    | "home_y"
    | "home_z"
    | "move_absolute"
    | "move_relative"
    | "pin_write"
    | "read_status"
    | "sync_sequence"
    | "update_calibration";

  /** A JSON RPC method invocation for one of the allowed FarmBot methods. */
  export interface Request<T extends any[]> extends JSONRPC.Request<T> {
    method: Method;
  }

  /** Sent from bot when message is received and properly formed. */
  export interface Acknowledgement extends JSONRPC.Response<["OK"]> { }

  export interface HomeAllRequest extends Request<[{}]> { }

}