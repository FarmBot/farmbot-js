import * as JSONRPC from "./jsonrpc";

/** Reference specification of all FarmBot RPC commands. */

  export let JSON_RPC_VERSION = "1.0";
  /** All possible RPC parameters and their types. */
  export namespace Params {
    export interface X { x: number; }
    export interface Y { y: number; }
    export interface Z { z: number; }
    export interface PinNumber { pin_number: number; }
    export interface PinValue { pin_value: number; }
    export interface PinMode { pin_mode: number; }
    export interface Speed { speed: number; }
    export interface UpdateCalibration {
      movement_timeout_x?: number;
      movement_timeout_y?: number;
      movement_timeout_z?: number;
      movement_invert_endpoints_x?: number;
      movement_invert_endpoints_y?: number;
      movement_invert_endpoints_z?: number;
      movement_invert_motor_x?: number;
      movement_invert_motor_y?: number;
      movement_invert_motor_z?: number;
      movement_steps_acc_dec_x?: number;
      movement_steps_acc_dec_y?: number;
      movement_steps_acc_dec_z?: number;
      movement_home_up_x?: number;
      movement_home_up_y?: number;
      movement_home_up_z?: number;
      movement_min_spd_x?: number;
      movement_min_spd_y?: number;
      movement_min_spd_z?: number;
      movement_max_spd_x?: number;
      movement_max_spd_y?: number;
      movement_max_spd_z?: number;
    }
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
    | "write_pin"
    | "read_status"
    | "sync"
    | "update_calibration";

  /** A JSON RPC method invocation for one of the allowed FarmBot methods. */
  export interface Request<T extends any[]> extends JSONRPC.Request<T> { method: Method; }

  /** Sent from bot when message is received and properly formed. */
  export interface Acknowledgement extends JSONRPC.Response<["OK"]> { }


  
  export interface EmergencyStopRequest extends Request<any> {  method: "emergency_stop"; }
  // TODO: Change this to accept an array of steps as its only argument.
  // For now, leaving it as {steps: any[]} for legacy reasons.
  export interface ExecSequenceRequest extends Request<[{steps: any[]}]>{ method: "exec_sequence"; }
  export interface HomeAllRequest extends Request<[Params.Speed]> { method: "home_all"; }
  export interface HomeXRequest extends Request<[Params.Speed]>{ method: "home_x"; }
  export interface HomeYRequest extends Request<[Params.Speed]>{ method: "home_y"; }
  export interface HomeZRequest extends Request<[Params.Speed]>{ method: "home_z"; }
  export interface MovementRequest extends Params.Speed, Params.X, Params.Y, Params.Z { }
  export interface MoveAbsoluteRequest extends Request<[MovementRequest]>{ method: "move_absolute"; }
  export interface MoveRelativeRequest extends Request<[MovementRequest]>{ method: "move_relative"; }
  export interface WritePinParams extends Params.PinMode, Params.PinValue, Params.PinNumber {}
  export interface WritePinRequest extends Request<[WritePinParams]>{ method: "write_pin"; }
  export interface ReadStatusRequest extends Request<any>{ method: "read_status"; }
  export interface SyncRequest extends Request<any>{ method: "sync"; }
  export interface UpdateCalibrationRequest extends Request<[Params.UpdateCalibration]>{ method: "update_calibration"; }
