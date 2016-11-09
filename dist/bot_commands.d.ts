import * as JSONRPC from "./jsonrpc";
import { McuParams, Configuration } from "./interfaces";
/** All possible RPC parameters and their types. */
export declare namespace Params {
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
    interface McuConfigUpdate extends McuParams {
    }
    interface BotConfigUpdate extends Configuration {
    }
    interface RegimenStartStop {
        regimen_id: number;
    }
}
/** Acceptable "method" names for JSON RPC messages to the bot. */
export declare type Method = "emergency_lock" | "emergency_unlock" | "exec_sequence" | "home_all" | "home_x" | "home_y" | "home_z" | "move_absolute" | "move_relative" | "write_pin" | "read_status" | "sync" | "mcu_config_update" | "bot_config_update" | "status_update" | "check_updates" | "check_arduino_updates" | "power_off" | "reboot" | "toggle_pin" | "start_regimen" | "stop_regimen";
/** A JSON RPC method invocation for one of the allowed FarmBot methods. */
export interface Request<T extends any[]> extends JSONRPC.Request<T> {
    method: Method;
}
/** Sent from bot when message is received and properly formed. */
export interface Acknowledgement extends JSONRPC.Response<["OK"]> {
}
export interface EmergencyLockRequest extends Request<any> {
    method: "emergency_lock";
}
export interface EmergencyUnlockRequest extends Request<any> {
    method: "emergency_unlock";
}
export interface ExecSequenceRequest extends Request<[{
    steps: any[];
}]> {
    method: "exec_sequence";
}
export interface HomeAllRequest extends Request<[Params.Speed]> {
    method: "home_all";
}
export interface HomeXRequest extends Request<[Params.Speed]> {
    method: "home_x";
}
export interface HomeYRequest extends Request<[Params.Speed]> {
    method: "home_y";
}
export interface HomeZRequest extends Request<[Params.Speed]> {
    method: "home_z";
}
export interface WritePinParams extends Params.PinMode, Params.PinValue, Params.PinNumber {
}
export interface TogglePinParams extends Params.PinNumber {
}
export interface RegimenParams extends Params.RegimenStartStop {
}
export interface WritePinRequest extends Request<[WritePinParams]> {
    method: "write_pin";
}
export interface TogglePinRequest extends Request<[TogglePinParams]> {
    method: "toggle_pin";
}
export interface StartRegimenRequest extends Request<[RegimenParams]> {
    method: "start_regimen";
}
export interface StopRegimenRequest extends Request<[RegimenParams]> {
    method: "stop_regimen";
}
export interface ReadStatusRequest extends Request<any> {
    method: "read_status";
}
export interface SyncRequest extends Request<any> {
    method: "sync";
}
export interface McuConfigUpdateRequest extends Request<[Params.McuConfigUpdate]> {
    method: "mcu_config_update";
}
export interface BotConfigUpdateRequest extends Request<[Params.BotConfigUpdate]> {
    method: "bot_config_update";
}
export interface MovementRequest extends Params.Speed, Params.X, Params.Y, Params.Z {
}
export interface MoveAbsoluteRequest extends Request<[MovementRequest]> {
    method: "move_absolute";
}
export interface MoveRelativeRequest extends Request<[MovementRequest]> {
    method: "move_relative";
}
export interface PoweroffRequest extends Request<any> {
    method: "power_off";
}
export interface RebootRequest extends Request<any> {
    method: "reboot";
}
export interface CheckUpdatesRequest extends Request<any> {
    method: "check_updates";
}
export interface CheckArduinoUpdatesRequest extends Request<any> {
    method: "check_arduino_updates";
}
