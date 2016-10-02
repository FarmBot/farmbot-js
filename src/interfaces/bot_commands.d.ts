import { JSONRPC } from "./jsonrpc";
/** Reference specification of all FarmBot RPC commands. */
export declare namespace BotCommand {
    let JSON_RPC_VERSION: string;
    /** All possible RPC parameters and their types. */
    namespace Params {
        interface X {
            x: number;
        }
        interface Y {
            y: number;
        }
        interface Z {
            z: number;
        }
        interface PinNumber {
            pin_number: number;
        }
        interface PinValue {
            pin_value: number;
        }
        interface PinMode {
            pin_mode: number;
        }
        interface Speed {
            speed: number;
        }
        interface UpdateCalibration {
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
    type Method = "emergency_stop" | "exec_sequence" | "home_all" | "home_x" | "home_y" | "home_z" | "move_absolute" | "move_relative" | "write_pin" | "read_status" | "sync" | "update_calibration";
    /** A JSON RPC method invocation for one of the allowed FarmBot methods. */
    interface Request<T extends any[]> extends JSONRPC.Request<T> {
        method: Method;
    }
    /** Sent from bot when message is received and properly formed. */
    interface Acknowledgement extends JSONRPC.Response<["OK"]> {
    }
    interface EmergencyStopRequest extends Request<any> {
        method: "emergency_stop";
    }
    interface ExecSequenceRequest extends Request<[{
        steps: any[];
    }]> {
        method: "exec_sequence";
    }
    interface HomeAllRequest extends Request<[Params.Speed]> {
        method: "home_all";
    }
    interface HomeXRequest extends Request<[Params.Speed]> {
        method: "home_x";
    }
    interface HomeYRequest extends Request<[Params.Speed]> {
        method: "home_y";
    }
    interface HomeZRequest extends Request<[Params.Speed]> {
        method: "home_z";
    }
    interface MovementRequest extends Params.Speed, Params.X, Params.Y, Params.Z {
    }
    interface MoveAbsoluteRequest extends Request<[MovementRequest]> {
        method: "move_absolute";
    }
    interface MoveRelativeRequest extends Request<[MovementRequest]> {
        method: "move_relative";
    }
    interface WritePinParams extends Params.PinMode, Params.PinValue, Params.PinNumber {
    }
    interface WritePinRequest extends Request<[WritePinParams]> {
        method: "write_pin";
    }
    interface ReadStatusRequest extends Request<any> {
        method: "read_status";
    }
    interface SyncRequest extends Request<any> {
        method: "sync";
    }
    interface UpdateCalibrationRequest extends Request<[Params.UpdateCalibration]> {
        method: "update_calibration";
    }
}
