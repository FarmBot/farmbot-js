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
export declare type ALLOWED_PIN_IO_MODES = "input" | "input_pullup" | "output";
export declare type ALLOWED_PIN_MODES = 0 | 1;
export declare type ALLOWED_SPECIAL_VALUE = "current_location" | "safe_height" | "soil_height";
export declare type AllowedPinTypes = "BoxLed3" | "BoxLed4" | "Peripheral" | "Sensor";
export declare type Color = "blue" | "gray" | "green" | "orange" | "pink" | "purple" | "red" | "yellow";
export declare type DataChangeType = "add" | "remove" | "update";
export declare type LegalArgString = "_else" | "_then" | "assertion_type" | "axis" | "axis_operand" | "channel_name" | "data_value" | "default_value" | "label" | "lhs" | "locals" | "location" | "lua" | "message" | "message_type" | "milliseconds" | "number" | "offset" | "op" | "package" | "pin_id" | "pin_io_mode" | "pin_mode" | "pin_number" | "pin_type" | "pin_value" | "point_group_id" | "pointer_id" | "pointer_type" | "priority" | "radius" | "resource" | "resource_id" | "resource_type" | "rhs" | "sequence_id" | "speed" | "speed_setting" | "string" | "tool_id" | "url" | "value" | "variance" | "version" | "x" | "y" | "z";
export declare type LegalKindString = "Assertion" | "AxisAddition" | "AxisOverwrite" | "Calibrate" | "ChangeOwnership" | "Channel" | "CheckUpdates" | "Coordinate" | "EmergencyLock" | "EmergencyUnlock" | "Execute" | "ExecuteScript" | "Explanation" | "FactoryReset" | "FindHome" | "FlashFirmware" | "Home" | "Identifier" | "If" | "InstallFarmware" | "InstallFirstPartyFarmware" | "InternalEntryPoint" | "InternalFarmEvent" | "InternalRegimen" | "LocationPlaceholder" | "Lua" | "Move" | "MoveAbsolute" | "MoveRelative" | "NamedPin" | "Nothing" | "NumberPlaceholder" | "Numeric" | "Pair" | "ParameterApplication" | "ParameterDeclaration" | "Point" | "PointGroup" | "PowerOff" | "Random" | "ReadPin" | "ReadStatus" | "Reboot" | "RemoveFarmware" | "Resource" | "ResourcePlaceholder" | "ResourceUpdate" | "RpcError" | "RpcOk" | "RpcRequest" | "SafeZ" | "ScopeDeclaration" | "SendMessage" | "Sequence" | "SetPinIoMode" | "SetServoAngle" | "SetUserEnv" | "SpecialValue" | "SpeedOverwrite" | "Sync" | "TakePhoto" | "Text" | "TextPlaceholder" | "TogglePin" | "Tool" | "UpdateFarmware" | "UpdateResource" | "VariableDeclaration" | "Wait" | "WritePin" | "Zero";
export declare type LegalSequenceKind = "_if" | "assertion" | "calibrate" | "change_ownership" | "check_updates" | "emergency_lock" | "emergency_unlock" | "execute" | "execute_script" | "factory_reset" | "find_home" | "flash_firmware" | "home" | "install_farmware" | "install_first_party_farmware" | "lua" | "move" | "move_absolute" | "move_relative" | "power_off" | "read_pin" | "read_status" | "reboot" | "remove_farmware" | "send_message" | "set_pin_io_mode" | "set_servo_angle" | "set_user_env" | "sync" | "take_photo" | "toggle_pin" | "update_farmware" | "update_resource" | "wait" | "write_pin" | "zero";
export declare type PlantStage = "active" | "harvested" | "pending" | "planned" | "planted" | "removed" | "sprouted";
export declare type PointType = "GenericPointer" | "Plant" | "ToolSlot" | "Weed";
export declare type lhs = "pin0" | "pin1" | "pin10" | "pin11" | "pin12" | "pin13" | "pin14" | "pin15" | "pin16" | "pin17" | "pin18" | "pin19" | "pin2" | "pin20" | "pin21" | "pin22" | "pin23" | "pin24" | "pin25" | "pin26" | "pin27" | "pin28" | "pin29" | "pin3" | "pin30" | "pin31" | "pin32" | "pin33" | "pin34" | "pin35" | "pin36" | "pin37" | "pin38" | "pin39" | "pin4" | "pin40" | "pin41" | "pin42" | "pin43" | "pin44" | "pin45" | "pin46" | "pin47" | "pin48" | "pin49" | "pin5" | "pin50" | "pin51" | "pin52" | "pin53" | "pin54" | "pin55" | "pin56" | "pin57" | "pin58" | "pin59" | "pin6" | "pin60" | "pin61" | "pin62" | "pin63" | "pin64" | "pin65" | "pin66" | "pin67" | "pin68" | "pin69" | "pin7" | "pin8" | "pin9" | "x" | "y" | "z";
export declare type resource_type = "Device" | "GenericPointer" | "Peripheral" | "Plant" | "Point" | "Sensor" | "Sequence" | "ToolSlot" | "Weed";
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
        data_value: Coordinate | Identifier | LocationPlaceholder | NumberPlaceholder | Numeric | Point | Resource | ResourcePlaceholder | Text | TextPlaceholder | Tool | PointGroup;
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
        default_value: Coordinate | Identifier | LocationPlaceholder | NumberPlaceholder | Numeric | Point | Resource | ResourcePlaceholder | Text | TextPlaceholder | Tool;
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
export declare type RpcRequestBodyItem = (If | Assertion | Calibrate | ChangeOwnership | CheckUpdates | EmergencyLock | EmergencyUnlock | Execute | ExecuteScript | FactoryReset | FindHome | FlashFirmware | Home | InstallFarmware | InstallFirstPartyFarmware | Lua | Move | MoveAbsolute | MoveRelative | PowerOff | ReadPin | ReadStatus | Reboot | RemoveFarmware | SendMessage | SetPinIoMode | SetServoAngle | SetUserEnv | Sync | TakePhoto | TogglePin | UpdateFarmware | UpdateResource | Wait | WritePin | Zero);
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
export declare type SequenceBodyItem = (If | Assertion | Calibrate | ChangeOwnership | CheckUpdates | EmergencyLock | EmergencyUnlock | Execute | ExecuteScript | FactoryReset | FindHome | FlashFirmware | Home | InstallFarmware | InstallFirstPartyFarmware | Lua | Move | MoveAbsolute | MoveRelative | PowerOff | ReadPin | ReadStatus | Reboot | RemoveFarmware | SendMessage | SetPinIoMode | SetServoAngle | SetUserEnv | Sync | TakePhoto | TogglePin | UpdateFarmware | UpdateResource | Wait | WritePin | Zero);
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
export declare type SetPinIoModeBodyItem = never;
/** set_pin_io_mode

 Tag properties: firmware_user, function. */
export interface SetPinIoMode {
    comment?: string | undefined;
    kind: "set_pin_io_mode";
    args: {
        pin_io_mode: ALLOWED_PIN_IO_MODES;
        pin_number: CSInteger | NamedPin;
    };
    body?: SetPinIoModeBodyItem[] | undefined;
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
export declare type TextBodyItem = never;
/** text

 Tag properties: . */
export interface Text {
    comment?: string | undefined;
    kind: "text";
    args: {
        string: CSString;
    };
    body?: TextBodyItem[] | undefined;
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
        data_value: Coordinate | Identifier | LocationPlaceholder | NumberPlaceholder | Numeric | Point | Resource | ResourcePlaceholder | Text | TextPlaceholder | Tool | PointGroup;
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
export declare type ResourceBodyItem = never;
/** resource

 Tag properties: network_user. */
export interface Resource {
    comment?: string | undefined;
    kind: "resource";
    args: {
        resource_id: CSInteger;
        resource_type: resource_type;
    };
    body?: ResourceBodyItem[] | undefined;
}
export declare type ResourcePlaceholderBodyItem = never;
/** resource_placeholder

 Tag properties: . */
export interface ResourcePlaceholder {
    comment?: string | undefined;
    kind: "resource_placeholder";
    args: {
        resource_type: resource_type;
    };
    body?: ResourcePlaceholderBodyItem[] | undefined;
}
export declare type NumberPlaceholderBodyItem = never;
/** number_placeholder

 Tag properties: . */
export interface NumberPlaceholder {
    comment?: string | undefined;
    kind: "number_placeholder";
    args: {};
    body?: NumberPlaceholderBodyItem[] | undefined;
}
export declare type TextPlaceholderBodyItem = never;
/** text_placeholder

 Tag properties: . */
export interface TextPlaceholder {
    comment?: string | undefined;
    kind: "text_placeholder";
    args: {};
    body?: TextPlaceholderBodyItem[] | undefined;
}
export declare type LocationPlaceholderBodyItem = never;
/** location_placeholder

 Tag properties: . */
export interface LocationPlaceholder {
    comment?: string | undefined;
    kind: "location_placeholder";
    args: {};
    body?: LocationPlaceholderBodyItem[] | undefined;
}
export declare type UpdateResourceBodyItem = (Pair);
/** update_resource

 Tag properties: api_writer, function, network_user. */
export interface UpdateResource {
    comment?: string | undefined;
    kind: "update_resource";
    args: {
        resource: Identifier | Resource | Point;
    };
    body?: UpdateResourceBodyItem[] | undefined;
}
export declare type PointGroupBodyItem = never;
/** point_group

 Tag properties: data, list_like. */
export interface PointGroup {
    comment?: string | undefined;
    kind: "point_group";
    args: {
        point_group_id: CSInteger;
    };
    body?: PointGroupBodyItem[] | undefined;
}
export declare type NumericBodyItem = never;
/** numeric

 Tag properties: data. */
export interface Numeric {
    comment?: string | undefined;
    kind: "numeric";
    args: {
        number: CSInteger;
    };
    body?: NumericBodyItem[] | undefined;
}
export declare type LuaBodyItem = never;
/** lua

 Tag properties: *. */
export interface Lua {
    comment?: string | undefined;
    kind: "lua";
    args: {
        lua: CSString;
    };
    body?: LuaBodyItem[] | undefined;
}
export declare type SpecialValueBodyItem = never;
/** special_value

 Tag properties: data. */
export interface SpecialValue {
    comment?: string | undefined;
    kind: "special_value";
    args: {
        label: CSString;
    };
    body?: SpecialValueBodyItem[] | undefined;
}
export declare type AxisOverwriteBodyItem = never;
/** axis_overwrite

 Tag properties: data. */
export interface AxisOverwrite {
    comment?: string | undefined;
    kind: "axis_overwrite";
    args: {
        axis: ALLOWED_AXIS;
        axis_operand: Coordinate | Identifier | Lua | Numeric | Point | Random | SpecialValue | Tool;
    };
    body?: AxisOverwriteBodyItem[] | undefined;
}
export declare type AxisAdditionBodyItem = never;
/** axis_addition

 Tag properties: data. */
export interface AxisAddition {
    comment?: string | undefined;
    kind: "axis_addition";
    args: {
        axis: ALLOWED_AXIS;
        axis_operand: Coordinate | Identifier | Lua | Numeric | Point | Random | SpecialValue | Tool;
    };
    body?: AxisAdditionBodyItem[] | undefined;
}
export declare type SpeedOverwriteBodyItem = never;
/** speed_overwrite

 Tag properties: data. */
export interface SpeedOverwrite {
    comment?: string | undefined;
    kind: "speed_overwrite";
    args: {
        axis: ALLOWED_AXIS;
        speed_setting: Lua | Numeric;
    };
    body?: SpeedOverwriteBodyItem[] | undefined;
}
export declare type SafeZBodyItem = never;
/** safe_z

 Tag properties: data. */
export interface SafeZ {
    comment?: string | undefined;
    kind: "safe_z";
    args: {};
    body?: SafeZBodyItem[] | undefined;
}
export declare type RandomBodyItem = never;
/** random

 Tag properties: data. */
export interface Random {
    comment?: string | undefined;
    kind: "random";
    args: {
        variance: CSInteger;
    };
    body?: RandomBodyItem[] | undefined;
}
export declare type MoveBodyItem = (AxisAddition | AxisOverwrite | SafeZ | SpeedOverwrite);
/** move

 Tag properties: firmware_user, function. */
export interface Move {
    comment?: string | undefined;
    kind: "move";
    args: {};
    body?: MoveBodyItem[] | undefined;
}
export declare type CeleryNode = Assertion | AxisAddition | AxisOverwrite | Calibrate | ChangeOwnership | Channel | CheckUpdates | Coordinate | EmergencyLock | EmergencyUnlock | Execute | ExecuteScript | Explanation | FactoryReset | FindHome | FlashFirmware | Home | Identifier | If | InstallFarmware | InstallFirstPartyFarmware | InternalFarmEvent | InternalRegimen | LocationPlaceholder | Lua | Move | MoveAbsolute | MoveRelative | NamedPin | Nothing | NumberPlaceholder | Numeric | Pair | ParameterApplication | ParameterDeclaration | Point | PointGroup | PowerOff | Random | ReadPin | ReadStatus | Reboot | RemoveFarmware | Resource | ResourcePlaceholder | ResourceUpdate | RpcError | RpcOk | RpcRequest | SafeZ | ScopeDeclaration | SendMessage | Sequence | SetPinIoMode | SetServoAngle | SetUserEnv | SpecialValue | SpeedOverwrite | Sync | TakePhoto | Text | TextPlaceholder | TogglePin | Tool | UpdateFarmware | UpdateResource | VariableDeclaration | Wait | WritePin | Zero;
