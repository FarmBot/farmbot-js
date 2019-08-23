export declare const LATEST_VERSION = 20180209;
export declare const DIGITAL = 0;
export declare const ANALOG = 1;
export declare type CSBoolean = boolean;
export declare type CSFloat = number;
export declare type CSInteger = number;
export declare type CSString = string;
export declare type ALLOWED_ASSERTION_TYPES = "abort" | "abort_recover" | "continue" | "recover";
export declare type ALLOWED_AXIS = "all" | "x" | "y" | "z";
export declare type ALLOWED_CHANNEL_NAMES = "email" | "espeak" | "ticker" | "toast";
export declare type ALLOWED_MESSAGE_TYPES = "assertion" | "busy" | "debug" | "error" | "fun" | "info" | "success" | "warn";
export declare type ALLOWED_OPS = "<" | ">" | "is" | "is_undefined" | "not";
export declare type ALLOWED_PACKAGES = "arduino_firmware" | "farmbot_os";
export declare type ALLOWED_PIN_MODES = 0 | 1;
export declare type AllowedPinTypes = "BoxLed3" | "BoxLed4" | "Peripheral" | "Sensor";
export declare type Color = "blue" | "gray" | "green" | "orange" | "pink" | "purple" | "red" | "yellow";
export declare type DataChangeType = "add" | "remove" | "update";
export declare type LegalArgString = "_else" | "_then" | "assertion_type" | "axis" | "channel_name" | "data_value" | "default_value" | "label" | "lhs" | "locals" | "location" | "lua" | "message" | "message_type" | "milliseconds" | "offset" | "op" | "package" | "pin_id" | "pin_mode" | "pin_number" | "pin_type" | "pin_value" | "pointer_id" | "pointer_type" | "priority" | "radius" | "resource_id" | "resource_type" | "rhs" | "sequence_id" | "speed" | "tool_id" | "url" | "value" | "version" | "x" | "y" | "z";
export declare type LegalKindString = "Assertion" | "Calibrate" | "ChangeOwnership" | "Channel" | "CheckUpdates" | "Coordinate" | "DumpInfo" | "EmergencyLock" | "EmergencyUnlock" | "Execute" | "ExecuteScript" | "Explanation" | "FactoryReset" | "FindHome" | "FlashFirmware" | "Home" | "Identifier" | "If" | "InstallFarmware" | "InstallFirstPartyFarmware" | "InternalEntryPoint" | "InternalFarmEvent" | "InternalRegimen" | "MoveAbsolute" | "MoveRelative" | "NamedPin" | "Nothing" | "Pair" | "ParameterApplication" | "ParameterDeclaration" | "Point" | "PowerOff" | "ReadPin" | "ReadStatus" | "Reboot" | "RemoveFarmware" | "ResourceUpdate" | "RpcError" | "RpcOk" | "RpcRequest" | "ScopeDeclaration" | "SendMessage" | "Sequence" | "SetServoAngle" | "SetUserEnv" | "Sync" | "TakePhoto" | "TogglePin" | "Tool" | "UpdateFarmware" | "VariableDeclaration" | "Wait" | "WritePin" | "Zero";
export declare type LegalSequenceKind = "_if" | "assertion" | "calibrate" | "change_ownership" | "check_updates" | "dump_info" | "emergency_lock" | "emergency_unlock" | "execute" | "execute_script" | "factory_reset" | "find_home" | "flash_firmware" | "home" | "install_farmware" | "install_first_party_farmware" | "move_absolute" | "move_relative" | "power_off" | "read_pin" | "read_status" | "reboot" | "remove_farmware" | "resource_update" | "send_message" | "set_servo_angle" | "set_user_env" | "sync" | "take_photo" | "toggle_pin" | "update_farmware" | "wait" | "write_pin" | "zero";
export declare type PlantStage = "harvested" | "planned" | "planted" | "sprouted";
export declare type PointType = "GenericPointer" | "Plant" | "ToolSlot";
export declare type lhs = "pin0" | "pin1" | "pin10" | "pin11" | "pin12" | "pin13" | "pin14" | "pin15" | "pin16" | "pin17" | "pin18" | "pin19" | "pin2" | "pin20" | "pin21" | "pin22" | "pin23" | "pin24" | "pin25" | "pin26" | "pin27" | "pin28" | "pin29" | "pin3" | "pin30" | "pin31" | "pin32" | "pin33" | "pin34" | "pin35" | "pin36" | "pin37" | "pin38" | "pin39" | "pin4" | "pin40" | "pin41" | "pin42" | "pin43" | "pin44" | "pin45" | "pin46" | "pin47" | "pin48" | "pin49" | "pin5" | "pin50" | "pin51" | "pin52" | "pin53" | "pin54" | "pin55" | "pin56" | "pin57" | "pin58" | "pin59" | "pin6" | "pin60" | "pin61" | "pin62" | "pin63" | "pin64" | "pin65" | "pin66" | "pin67" | "pin68" | "pin69" | "pin7" | "pin8" | "pin9" | "x" | "y" | "z";
export declare type resource_type = "Device" | "GenericPointer" | "Plant" | "Point" | "ToolSlot";
export declare type AssertionBodyItem = never;
/** assertion

 Tag properties: *. */
export interface Assertion {
    comment?: string | undefined;
    kind: "assertion";
    args: {
        _then: Execute | Nothing;
        assertion_type: ALLOWED_ASSERTION_TYPES;
        lua: CSString;
    };
    body?: AssertionBodyItem[] | undefined;
}
export declare type IfBodyItem = (Pair);
/** _if

 Tag properties: *. */
export interface If {
    comment?: string | undefined;
    kind: "_if";
    args: {
        _else: Execute | Nothing;
        _then: Execute | Nothing;
        lhs: CSString | NamedPin;
        op: ALLOWED_OPS;
        rhs: CSInteger;
    };
    body?: IfBodyItem[] | undefined;
}
export declare type CalibrateBodyItem = never;
/** calibrate

 Tag properties: firmware_user, function. */
export interface Calibrate {
    comment?: string | undefined;
    kind: "calibrate";
    args: {
        axis: ALLOWED_AXIS;
    };
    body?: CalibrateBodyItem[] | undefined;
}
export declare type ChangeOwnershipBodyItem = (Pair);
/** change_ownership
Not a commonly used node. May be removed without notice.
 Tag properties: api_writer, cuts_power, disk_user, function, network_user. */
export interface ChangeOwnership {
    comment?: string | undefined;
    kind: "change_ownership";
    args: {};
    body?: ChangeOwnershipBodyItem[] | undefined;
}
export declare type ChannelBodyItem = never;
/** channel
Specifies a communication path for log messages.
 Tag properties: data. */
export interface Channel {
    comment?: string | undefined;
    kind: "channel";
    args: {
        channel_name: ALLOWED_CHANNEL_NAMES;
    };
    body?: ChannelBodyItem[] | undefined;
}
export declare type CheckUpdatesBodyItem = never;
/** check_updates

 Tag properties: cuts_power, disk_user, function, network_user. */
export interface CheckUpdates {
    comment?: string | undefined;
    kind: "check_updates";
    args: {
        package: CSString;
    };
    body?: CheckUpdatesBodyItem[] | undefined;
}
export declare type CoordinateBodyItem = never;
/** coordinate

 Tag properties: data, location_like. */
export interface Coordinate {
    comment?: string | undefined;
    kind: "coordinate";
    args: {
        x: CSInteger | CSFloat;
        y: CSInteger | CSFloat;
        z: CSInteger | CSFloat;
    };
    body?: CoordinateBodyItem[] | undefined;
}
export declare type DumpInfoBodyItem = never;
/** dump_info
Sends an info dump to server administrators for troubleshooting.
 Tag properties: api_writer, disk_user, function, network_user. */
export interface DumpInfo {
    comment?: string | undefined;
    kind: "dump_info";
    args: {};
    body?: DumpInfoBodyItem[] | undefined;
}
export declare type EmergencyLockBodyItem = never;
/** emergency_lock

 Tag properties: control_flow, firmware_user, function. */
export interface EmergencyLock {
    comment?: string | undefined;
    kind: "emergency_lock";
    args: {};
    body?: EmergencyLockBodyItem[] | undefined;
}
export declare type EmergencyUnlockBodyItem = never;
/** emergency_unlock

 Tag properties: firmware_user, function. */
export interface EmergencyUnlock {
    comment?: string | undefined;
    kind: "emergency_unlock";
    args: {};
    body?: EmergencyUnlockBodyItem[] | undefined;
}
export declare type ExecuteScriptBodyItem = (Pair);
/** execute_script

 Tag properties: *. */
export interface ExecuteScript {
    comment?: string | undefined;
    kind: "execute_script";
    args: {
        label: CSString;
    };
    body?: ExecuteScriptBodyItem[] | undefined;
}
export declare type ExecuteBodyItem = (ParameterApplication);
/** execute

 Tag properties: *. */
export interface Execute {
    comment?: string | undefined;
    kind: "execute";
    args: {
        sequence_id: CSInteger;
    };
    body?: ExecuteBodyItem[] | undefined;
}
export declare type ExplanationBodyItem = never;
/** explanation

 Tag properties: data. */
export interface Explanation {
    comment?: string | undefined;
    kind: "explanation";
    args: {
        message: CSString;
    };
    body?: ExplanationBodyItem[] | undefined;
}
export declare type FactoryResetBodyItem = never;
/** factory_reset

 Tag properties: cuts_power, function. */
export interface FactoryReset {
    comment?: string | undefined;
    kind: "factory_reset";
    args: {
        package: CSString;
    };
    body?: FactoryResetBodyItem[] | undefined;
}
export declare type FindHomeBodyItem = never;
/** find_home

 Tag properties: firmware_user, function. */
export interface FindHome {
    comment?: string | undefined;
    kind: "find_home";
    args: {
        axis: ALLOWED_AXIS;
        speed: CSInteger;
    };
    body?: FindHomeBodyItem[] | undefined;
}
export declare type FlashFirmwareBodyItem = never;
/** flash_firmware

 Tag properties: api_writer, disk_user, firmware_user, function, network_user. */
export interface FlashFirmware {
    comment?: string | undefined;
    kind: "flash_firmware";
    args: {
        package: CSString;
    };
    body?: FlashFirmwareBodyItem[] | undefined;
}
export declare type HomeBodyItem = never;
/** home

 Tag properties: firmware_user, function. */
export interface Home {
    comment?: string | undefined;
    kind: "home";
    args: {
        axis: ALLOWED_AXIS;
        speed: CSInteger;
    };
    body?: HomeBodyItem[] | undefined;
}
export declare type IdentifierBodyItem = never;
/** identifier

 Tag properties: data. */
export interface Identifier {
    comment?: string | undefined;
    kind: "identifier";
    args: {
        label: CSString;
    };
    body?: IdentifierBodyItem[] | undefined;
}
export declare type InstallFarmwareBodyItem = never;
/** install_farmware

 Tag properties: api_writer, disk_user, function, network_user. */
export interface InstallFarmware {
    comment?: string | undefined;
    kind: "install_farmware";
    args: {
        url: CSString;
    };
    body?: InstallFarmwareBodyItem[] | undefined;
}
export declare type InstallFirstPartyFarmwareBodyItem = never;
/** install_first_party_farmware

 Tag properties: function, network_user. */
export interface InstallFirstPartyFarmware {
    comment?: string | undefined;
    kind: "install_first_party_farmware";
    args: {};
    body?: InstallFirstPartyFarmwareBodyItem[] | undefined;
}
export declare type InternalFarmEventBodyItem = (ParameterApplication);
/** internal_farm_event

 Tag properties: . */
export interface InternalFarmEvent {
    comment?: string | undefined;
    kind: "internal_farm_event";
    args: {};
    body?: InternalFarmEventBodyItem[] | undefined;
}
export declare type InternalRegimenBodyItem = (ParameterApplication | ParameterDeclaration | VariableDeclaration);
/** internal_regimen

 Tag properties: . */
export interface InternalRegimen {
    comment?: string | undefined;
    kind: "internal_regimen";
    args: {};
    body?: InternalRegimenBodyItem[] | undefined;
}
export declare type MoveRelativeBodyItem = never;
/** move_relative

 Tag properties: firmware_user, function. */
export interface MoveRelative {
    comment?: string | undefined;
    kind: "move_relative";
    args: {
        speed: CSInteger;
        x: CSInteger | CSFloat;
        y: CSInteger | CSFloat;
        z: CSInteger | CSFloat;
    };
    body?: MoveRelativeBodyItem[] | undefined;
}
export declare type NothingBodyItem = never;
/** nothing

 Tag properties: data, function. */
export interface Nothing {
    comment?: string | undefined;
    kind: "nothing";
    args: {};
    body?: NothingBodyItem[] | undefined;
}
export declare type PairBodyItem = never;
/** pair

 Tag properties: data. */
export interface Pair {
    comment?: string | undefined;
    kind: "pair";
    args: {
        label: CSString;
        value: CSString | CSInteger | CSBoolean;
    };
    body?: PairBodyItem[] | undefined;
}
export declare type ParameterApplicationBodyItem = never;
/** parameter_application

 Tag properties: control_flow, function, scope_writer. */
export interface ParameterApplication {
    comment?: string | undefined;
    kind: "parameter_application";
    args: {
        data_value: Tool | Coordinate | Point | Identifier;
        label: CSString;
    };
    body?: ParameterApplicationBodyItem[] | undefined;
}
export declare type ParameterDeclarationBodyItem = never;
/** parameter_declaration

 Tag properties: scope_writer. */
export interface ParameterDeclaration {
    comment?: string | undefined;
    kind: "parameter_declaration";
    args: {
        default_value: Tool | Coordinate | Point | Identifier;
        label: CSString;
    };
    body?: ParameterDeclarationBodyItem[] | undefined;
}
export declare type PointBodyItem = never;
/** point

 Tag properties: data, location_like. */
export interface Point {
    comment?: string | undefined;
    kind: "point";
    args: {
        pointer_id: CSInteger;
        pointer_type: PointType;
    };
    body?: PointBodyItem[] | undefined;
}
export declare type PowerOffBodyItem = never;
/** power_off

 Tag properties: cuts_power, function. */
export interface PowerOff {
    comment?: string | undefined;
    kind: "power_off";
    args: {};
    body?: PowerOffBodyItem[] | undefined;
}
export declare type ReadStatusBodyItem = never;
/** read_status

 Tag properties: function. */
export interface ReadStatus {
    comment?: string | undefined;
    kind: "read_status";
    args: {};
    body?: ReadStatusBodyItem[] | undefined;
}
export declare type RebootBodyItem = never;
/** reboot

 Tag properties: cuts_power, firmware_user, function. */
export interface Reboot {
    comment?: string | undefined;
    kind: "reboot";
    args: {
        package: CSString;
    };
    body?: RebootBodyItem[] | undefined;
}
export declare type RemoveFarmwareBodyItem = never;
/** remove_farmware

 Tag properties: function. */
export interface RemoveFarmware {
    comment?: string | undefined;
    kind: "remove_farmware";
    args: {
        package: CSString;
    };
    body?: RemoveFarmwareBodyItem[] | undefined;
}
export declare type RpcErrorBodyItem = (Explanation);
/** rpc_error

 Tag properties: data. */
export interface RpcError {
    comment?: string | undefined;
    kind: "rpc_error";
    args: {
        label: CSString;
    };
    body?: RpcErrorBodyItem[] | undefined;
}
export declare type RpcOkBodyItem = never;
/** rpc_ok

 Tag properties: data. */
export interface RpcOk {
    comment?: string | undefined;
    kind: "rpc_ok";
    args: {
        label: CSString;
    };
    body?: RpcOkBodyItem[] | undefined;
}
export declare type RpcRequestBodyItem = (If | Assertion | Calibrate | ChangeOwnership | CheckUpdates | DumpInfo | EmergencyLock | EmergencyUnlock | Execute | ExecuteScript | FactoryReset | FindHome | FlashFirmware | Home | InstallFarmware | InstallFirstPartyFarmware | MoveAbsolute | MoveRelative | PowerOff | ReadPin | ReadStatus | Reboot | RemoveFarmware | ResourceUpdate | SendMessage | SetServoAngle | SetUserEnv | Sync | TakePhoto | TogglePin | UpdateFarmware | Wait | WritePin | Zero);
/** rpc_request

 Tag properties: *. */
export interface RpcRequest {
    comment?: string | undefined;
    kind: "rpc_request";
    args: {
        label: CSString;
        priority: CSInteger;
    };
    body?: RpcRequestBodyItem[] | undefined;
}
export declare type ScopeDeclarationBodyItem = (ParameterDeclaration | VariableDeclaration);
/** scope_declaration

 Tag properties: scope_writer. */
export interface ScopeDeclaration {
    comment?: string | undefined;
    kind: "scope_declaration";
    args: {};
    body?: ScopeDeclarationBodyItem[] | undefined;
}
export declare type SendMessageBodyItem = (Channel);
/** send_message

 Tag properties: function. */
export interface SendMessage {
    comment?: string | undefined;
    kind: "send_message";
    args: {
        message: CSString;
        message_type: ALLOWED_MESSAGE_TYPES;
    };
    body?: SendMessageBodyItem[] | undefined;
}
export declare type SequenceBodyItem = (If | Assertion | Calibrate | ChangeOwnership | CheckUpdates | DumpInfo | EmergencyLock | EmergencyUnlock | Execute | ExecuteScript | FactoryReset | FindHome | FlashFirmware | Home | InstallFarmware | InstallFirstPartyFarmware | MoveAbsolute | MoveRelative | PowerOff | ReadPin | ReadStatus | Reboot | RemoveFarmware | ResourceUpdate | SendMessage | SetServoAngle | SetUserEnv | Sync | TakePhoto | TogglePin | UpdateFarmware | Wait | WritePin | Zero);
/** sequence

 Tag properties: *. */
export interface Sequence {
    comment?: string | undefined;
    kind: "sequence";
    args: {
        locals: ScopeDeclaration;
        version: CSInteger;
    };
    body?: SequenceBodyItem[] | undefined;
}
export declare type SetServoAngleBodyItem = never;
/** set_servo_angle

 Tag properties: firmware_user, function. */
export interface SetServoAngle {
    comment?: string | undefined;
    kind: "set_servo_angle";
    args: {
        pin_number: CSInteger | NamedPin;
        pin_value: CSInteger;
    };
    body?: SetServoAngleBodyItem[] | undefined;
}
export declare type SetUserEnvBodyItem = (Pair);
/** set_user_env

 Tag properties: disk_user, function. */
export interface SetUserEnv {
    comment?: string | undefined;
    kind: "set_user_env";
    args: {};
    body?: SetUserEnvBodyItem[] | undefined;
}
export declare type SyncBodyItem = never;
/** sync

 Tag properties: disk_user, function, network_user. */
export interface Sync {
    comment?: string | undefined;
    kind: "sync";
    args: {};
    body?: SyncBodyItem[] | undefined;
}
export declare type TakePhotoBodyItem = never;
/** take_photo

 Tag properties: disk_user, function. */
export interface TakePhoto {
    comment?: string | undefined;
    kind: "take_photo";
    args: {};
    body?: TakePhotoBodyItem[] | undefined;
}
export declare type TogglePinBodyItem = never;
/** toggle_pin

 Tag properties: firmware_user, function. */
export interface TogglePin {
    comment?: string | undefined;
    kind: "toggle_pin";
    args: {
        pin_number: CSInteger | NamedPin;
    };
    body?: TogglePinBodyItem[] | undefined;
}
export declare type ToolBodyItem = never;
/** tool

 Tag properties: api_validated, data, location_like. */
export interface Tool {
    comment?: string | undefined;
    kind: "tool";
    args: {
        tool_id: CSInteger;
    };
    body?: ToolBodyItem[] | undefined;
}
export declare type UpdateFarmwareBodyItem = never;
/** update_farmware

 Tag properties: api_validated, function, network_user. */
export interface UpdateFarmware {
    comment?: string | undefined;
    kind: "update_farmware";
    args: {
        package: CSString;
    };
    body?: UpdateFarmwareBodyItem[] | undefined;
}
export declare type VariableDeclarationBodyItem = never;
/** variable_declaration

 Tag properties: function, scope_writer. */
export interface VariableDeclaration {
    comment?: string | undefined;
    kind: "variable_declaration";
    args: {
        data_value: Tool | Coordinate | Point | Identifier;
        label: CSString;
    };
    body?: VariableDeclarationBodyItem[] | undefined;
}
export declare type WaitBodyItem = never;
/** wait

 Tag properties: function. */
export interface Wait {
    comment?: string | undefined;
    kind: "wait";
    args: {
        milliseconds: CSInteger;
    };
    body?: WaitBodyItem[] | undefined;
}
export declare type ZeroBodyItem = never;
/** zero

 Tag properties: firmware_user, function. */
export interface Zero {
    comment?: string | undefined;
    kind: "zero";
    args: {
        axis: ALLOWED_AXIS;
    };
    body?: ZeroBodyItem[] | undefined;
}
export declare type NamedPinBodyItem = never;
/** named_pin

 Tag properties: api_validated, data, firmware_user, function, rpi_user. */
export interface NamedPin {
    comment?: string | undefined;
    kind: "named_pin";
    args: {
        pin_id: CSInteger;
        pin_type: AllowedPinTypes;
    };
    body?: NamedPinBodyItem[] | undefined;
}
export declare type MoveAbsoluteBodyItem = never;
/** move_absolute

 Tag properties: firmware_user, function. */
export interface MoveAbsolute {
    comment?: string | undefined;
    kind: "move_absolute";
    args: {
        location: Tool | Coordinate | Point | Identifier;
        offset: Coordinate;
        speed: CSInteger;
    };
    body?: MoveAbsoluteBodyItem[] | undefined;
}
export declare type WritePinBodyItem = never;
/** write_pin

 Tag properties: firmware_user, function, rpi_user. */
export interface WritePin {
    comment?: string | undefined;
    kind: "write_pin";
    args: {
        pin_mode: ALLOWED_PIN_MODES;
        pin_number: CSInteger | NamedPin;
        pin_value: CSInteger;
    };
    body?: WritePinBodyItem[] | undefined;
}
export declare type ReadPinBodyItem = never;
/** read_pin

 Tag properties: firmware_user, function, rpi_user. */
export interface ReadPin {
    comment?: string | undefined;
    kind: "read_pin";
    args: {
        label: CSString;
        pin_mode: ALLOWED_PIN_MODES;
        pin_number: CSInteger | NamedPin;
    };
    body?: ReadPinBodyItem[] | undefined;
}
export declare type ResourceUpdateBodyItem = never;
/** resource_update

 Tag properties: api_writer, function, network_user. */
export interface ResourceUpdate {
    comment?: string | undefined;
    kind: "resource_update";
    args: {
        label: CSString;
        resource_id: CSInteger;
        resource_type: resource_type;
        value: CSString | CSInteger | CSBoolean;
    };
    body?: ResourceUpdateBodyItem[] | undefined;
}
export declare type CeleryNode = Assertion | Calibrate | ChangeOwnership | Channel | CheckUpdates | Coordinate | DumpInfo | EmergencyLock | EmergencyUnlock | Execute | ExecuteScript | Explanation | FactoryReset | FindHome | FlashFirmware | Home | Identifier | If | InstallFarmware | InstallFirstPartyFarmware | InternalFarmEvent | InternalRegimen | MoveAbsolute | MoveRelative | NamedPin | Nothing | Pair | ParameterApplication | ParameterDeclaration | Point | PowerOff | ReadPin | ReadStatus | Reboot | RemoveFarmware | ResourceUpdate | RpcError | RpcOk | RpcRequest | ScopeDeclaration | SendMessage | Sequence | SetServoAngle | SetUserEnv | Sync | TakePhoto | TogglePin | Tool | UpdateFarmware | VariableDeclaration | Wait | WritePin | Zero;
