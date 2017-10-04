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
        location: Tool | Coordinate | Point;
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
        label: string;
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
export declare type SendMessageBodyItem = Channel;
export interface SendMessage {
    kind: "send_message";
    args: {
        message: string;
        message_type: string;
    };
    comment?: string | undefined;
    body?: SendMessageBodyItem[] | undefined;
}
export interface Execute {
    kind: "execute";
    args: {
        sequence_id: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export declare type IfBodyItem = Pair;
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
    body?: IfBodyItem[] | undefined;
}
export declare type SequenceBodyItem = MoveAbsolute | MoveRelative | WritePin | ReadPin | Wait | SendMessage | Execute | If | ExecuteScript | TakePhoto | FindHome;
export interface Sequence {
    kind: "sequence";
    args: {
        version: number;
    };
    comment?: string | undefined;
    body?: SequenceBodyItem[] | undefined;
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
export interface FindHome {
    kind: "find_home";
    args: {
        speed: number;
        axis: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface Zero {
    kind: "zero";
    args: {
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
export interface Explanation {
    kind: "explanation";
    args: {
        message: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export declare type RpcRequestBodyItem = Home | EmergencyLock | EmergencyUnlock | ReadStatus | Sync | CheckUpdates | PowerOff | Reboot | TogglePin | ConfigUpdate | Calibrate | Execute | MoveAbsolute | MoveRelative | WritePin | ReadPin | SendMessage | FactoryReset | ExecuteScript | SetUserEnv | Wait | AddPoint | InstallFarmware | UpdateFarmware | Zero | RemoveFarmware | TakePhoto | DataUpdate | FindHome;
export interface RpcRequest {
    kind: "rpc_request";
    args: {
        label: string;
    };
    comment?: string | undefined;
    body?: RpcRequestBodyItem[] | undefined;
}
export interface RpcOk {
    kind: "rpc_ok";
    args: {
        label: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export declare type RpcErrorBodyItem = Explanation;
export interface RpcError {
    kind: "rpc_error";
    args: {
        label: string;
    };
    comment?: string | undefined;
    body?: RpcErrorBodyItem[] | undefined;
}
export interface Calibrate {
    kind: "calibrate";
    args: {
        axis: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface Pair {
    kind: "pair";
    args: {
        label: string;
        value: string | number | Boolean;
    };
    comment?: string | undefined;
    body?: undefined;
}
export declare type ConfigUpdateBodyItem = Pair;
export interface ConfigUpdate {
    kind: "config_update";
    args: {
        package: string;
    };
    comment?: string | undefined;
    body?: ConfigUpdateBodyItem[] | undefined;
}
export interface FactoryReset {
    kind: "factory_reset";
    args: {
        package: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export declare type ExecuteScriptBodyItem = Pair;
export interface ExecuteScript {
    kind: "execute_script";
    args: {
        label: string;
    };
    comment?: string | undefined;
    body?: ExecuteScriptBodyItem[] | undefined;
}
export declare type SetUserEnvBodyItem = Pair;
export interface SetUserEnv {
    kind: "set_user_env";
    args: {};
    comment?: string | undefined;
    body?: SetUserEnvBodyItem[] | undefined;
}
export declare type AddPointBodyItem = Pair;
export interface AddPoint {
    kind: "add_point";
    args: {
        location: Tool | Coordinate | Point;
    };
    comment?: string | undefined;
    body?: AddPointBodyItem[] | undefined;
}
export interface TakePhoto {
    kind: "take_photo";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export declare type DataUpdateBodyItem = Pair;
export interface DataUpdate {
    kind: "data_update";
    args: {
        value: string | number | Boolean;
    };
    comment?: string | undefined;
    body?: DataUpdateBodyItem[] | undefined;
}
export interface Point {
    kind: "point";
    args: {
        pointer_type: string;
        pointer_id: number;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface InstallFarmware {
    kind: "install_farmware";
    args: {
        url: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface UpdateFarmware {
    kind: "update_farmware";
    args: {
        package: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface RemoveFarmware {
    kind: "remove_farmware";
    args: {
        package: string;
    };
    comment?: string | undefined;
    body?: undefined;
}
export interface InstallFirstPartyFarmware {
    kind: "install_first_party_farmware";
    args: {};
    comment?: string | undefined;
    body?: undefined;
}
export declare type CeleryNode = Nothing | Tool | Coordinate | MoveAbsolute | MoveRelative | WritePin | ReadPin | Channel | Wait | SendMessage | Execute | If | Sequence | Home | FindHome | Zero | EmergencyLock | EmergencyUnlock | ReadStatus | Sync | CheckUpdates | PowerOff | Reboot | TogglePin | Explanation | RpcRequest | RpcOk | RpcError | Calibrate | Pair | ConfigUpdate | FactoryReset | ExecuteScript | SetUserEnv | AddPoint | TakePhoto | DataUpdate | Point | InstallFarmware | UpdateFarmware | RemoveFarmware | InstallFirstPartyFarmware;
export declare const LATEST_VERSION = 4;
export declare const DIGITAL = 0;
export declare const ANALOG = 1;
export declare type ALLOWED_PIN_MODES = 0 | 1;
export declare type ALLOWED_MESSAGE_TYPES = "success" | "busy" | "warn" | "error" | "info" | "fun";
export declare type ALLOWED_CHANNEL_NAMES = "ticker" | "toast" | "email";
export declare type ALLOWED_DATA_TYPES = "string" | "integer";
export declare type ALLOWED_OPS = "<" | ">" | "is" | "not" | "is_undefined";
export declare type ALLOWED_PACKAGES = "farmbot_os" | "arduino_firmware";
export declare type ALLOWED_AXIS = "x" | "y" | "z" | "all";
export declare type Color = "blue" | "green" | "yellow" | "orange" | "purple" | "pink" | "gray" | "red";
export declare type LegalArgString = "_else" | "_then" | "axis" | "channel_name" | "label" | "lhs" | "location" | "message" | "message_type" | "milliseconds" | "offset" | "op" | "package" | "pin_mode" | "pin_number" | "pin_value" | "pointer_id" | "pointer_type" | "radius" | "rhs" | "sequence_id" | "speed" | "tool_id" | "url" | "value" | "version" | "x" | "y" | "z";
export declare type LegalKindString = "_if" | "add_point" | "calibrate" | "channel" | "check_updates" | "config_update" | "coordinate" | "data_update" | "emergency_lock" | "emergency_unlock" | "execute" | "execute_script" | "explanation" | "factory_reset" | "find_home" | "home" | "install_farmware" | "install_first_party_farmware" | "move_absolute" | "move_relative" | "nothing" | "pair" | "point" | "power_off" | "read_pin" | "read_status" | "reboot" | "remove_farmware" | "rpc_error" | "rpc_ok" | "rpc_request" | "send_message" | "sequence" | "set_user_env" | "sync" | "take_photo" | "toggle_pin" | "tool" | "update_farmware" | "wait" | "write_pin" | "zero";
export declare type LegalSequenceKind = "_if" | "execute" | "execute_script" | "find_home" | "move_absolute" | "move_relative" | "read_pin" | "send_message" | "take_photo" | "wait" | "write_pin";
export declare type DataChangeType = "add" | "remove" | "update";
export declare type ResourceName = "images" | "plants" | "regimens" | "peripherals" | "corpuses" | "logs" | "sequences" | "farm_events" | "tool_slots" | "tools" | "points" | "tokens" | "users" | "device";
export declare type PointType = "GenericPointer" | "ToolSlot" | "Plant";
