export interface Nothing {
    kind: "nothing";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export interface Tool {
    kind: "tool";
    args: {
        tool_id: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface Coordinate {
    kind: "coordinate";
    args: {
        x: number;
        y: number;
        z: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface MoveAbsolute {
    kind: "move_absolute";
    args: {
        location: Tool | Coordinate;
        speed: number;
        offset: Coordinate;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface MoveRelative {
    kind: "move_relative";
    args: {
        x: number;
        y: number;
        z: number;
        speed: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface WritePin {
    kind: "write_pin";
    args: {
        pin_number: number;
        pin_value: number;
        pin_mode: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface ReadPin {
    kind: "read_pin";
    args: {
        pin_number: number;
        data_label: string;
        pin_mode: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface Channel {
    kind: "channel";
    args: {
        channel_name: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface Wait {
    kind: "wait";
    args: {
        milliseconds: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface SendMessage {
    kind: "send_message";
    args: {
        message: string;
        message_type: string;
    };
    comment?: string | undefined;
    body?: (Channel)[] | undefined;
}
export interface Execute {
    kind: "execute";
    args: {
        sub_sequence_id: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface If {
    kind: "_if";
    args: {
        lhs: string;
        op: string;
        rhs: number;
        _then: Execute | Nothing;
        _else: Execute | Nothing;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface Sequence {
    kind: "sequence";
    args: {
        version: number;
    };
    comment?: string | undefined;
    body?: (MoveAbsolute | MoveRelative | WritePin | ReadPin | Wait | SendMessage | Execute | If)[] | undefined;
}
export interface Home {
    kind: "home";
    args: {
        speed: number;
        axis: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface EmergencyLock {
    kind: "emergency_lock";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export interface EmergencyUnlock {
    kind: "emergency_unlock";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export interface ReadStatus {
    kind: "read_status";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export interface Sync {
    kind: "sync";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export interface CheckUpdates {
    kind: "check_updates";
    args: {
        package: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface PowerOff {
    kind: "power_off";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export interface Reboot {
    kind: "reboot";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export interface TogglePin {
    kind: "toggle_pin";
    args: {
        pin_number: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface StartRegimen {
    kind: "start_regimen";
    args: {
        regimen_id: number;
        data_label: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface StopRegimen {
    kind: "stop_regimen";
    args: {
        data_label: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface Explanation {
    kind: "explanation";
    args: {
        message: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface RpcRequest {
    kind: "rpc_request";
    args: {
        data_label: string;
    };
    comment?: string | undefined;
    body?: (Home | EmergencyLock | EmergencyUnlock | ReadStatus | Sync | CheckUpdates | PowerOff | Reboot | TogglePin | StartRegimen | StopRegimen | McuConfigUpdate | Calibrate | BotConfigUpdate | Execute | MoveAbsolute | MoveRelative | WritePin | ReadPin | Wait | SendMessage)[] | undefined;
}
export interface RpcOk {
    kind: "rpc_ok";
    args: {
        data_label: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface RpcError {
    kind: "rpc_error";
    args: {
        data_label: string;
    };
    comment?: string | undefined;
    body?: (Explanation)[] | undefined;
}
export interface Calibrate {
    kind: "calibrate";
    args: {
        axis: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface McuConfigUpdate {
    kind: "mcu_config_update";
    args: {
        number: number;
        data_label: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface BotConfigUpdate {
    kind: "bot_config_update";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export declare type CeleryNode = Nothing | Tool | Coordinate | MoveAbsolute | MoveRelative | WritePin | ReadPin | Channel | Wait | SendMessage | Execute | If | Sequence | Home | EmergencyLock | EmergencyUnlock | ReadStatus | Sync | CheckUpdates | PowerOff | Reboot | TogglePin | StartRegimen | StopRegimen | Explanation | RpcRequest | RpcOk | RpcError | Calibrate | McuConfigUpdate | BotConfigUpdate;
export declare const LATEST_VERSION: number;
export declare const DIGITAL: number;
export declare const ANALOG: number;
export declare type ALLOWED_PIN_MODES = 0 | 1;
export declare type ALLOWED_MESSAGE_TYPES = "success" | "busy" | "warn" | "error" | "info" | "fun";
export declare type ALLOWED_CHANNEL_NAMES = "ticker" | "toast";
export declare type ALLOWED_DATA_TYPES = "string" | "integer";
export declare type ALLOWED_OPS = "<" | ">" | "is" | "not";
export declare type ALLOWED_PACKAGES = "farmbot_os" | "arduino_firmware";
export declare type ALLOWED_AXIS = "x" | "y" | "z" | "all";
