import { ALLOWED_MESSAGE_TYPES, ALLOWED_CHANNEL_NAMES, PlantStage, Color, Sequence, InternalFarmEventBodyItem } from "..";
import { VariableDeclaration } from "../corpus";
export declare type TimeUnit = "never" | "minutely" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";
export declare type ExecutableType = "Sequence" | "Regimen";
export declare enum ToolPulloutDirection {
    NONE = 0,
    POSITIVE_X = 1,
    NEGATIVE_X = 2,
    POSITIVE_Y = 3,
    NEGATIVE_Y = 4
}
export interface ResourceBase {
    id?: number | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}
export interface FarmEvent extends ResourceBase {
    start_time: string;
    end_time?: string | undefined;
    repeat?: number | undefined;
    time_unit: TimeUnit;
    executable_id: number;
    executable_type: ExecutableType;
    body?: InternalFarmEventBodyItem[];
}
export interface FarmwareInstallation extends ResourceBase {
    url: string;
    package: string | undefined;
    package_error: string | undefined;
}
export interface Image {
    id?: number | undefined;
    created_at: string;
    updated_at: string;
    device_id: number;
    attachment_processed_at: string | undefined;
    attachment_url: string;
    meta: {
        x: number | undefined;
        y: number | undefined;
        z: number | undefined;
        name?: string;
    };
}
export interface Log {
    id?: number;
    updated_at?: string;
    created_at?: number;
    message: string;
    type: ALLOWED_MESSAGE_TYPES;
    x?: number;
    y?: number;
    z?: number;
    verbosity?: number;
    major_version?: number;
    minor_version?: number;
    channels: ALLOWED_CHANNEL_NAMES[];
}
export interface Peripheral extends ResourceBase {
    pin: number | undefined;
    label: string;
}
interface PinBindingBase extends ResourceBase {
    pin_num: number;
}
export declare enum PinBindingType {
    special = "special",
    standard = "standard"
}
export declare enum PinBindingSpecialAction {
    emergency_lock = "emergency_lock",
    emergency_unlock = "emergency_unlock",
    sync = "sync",
    reboot = "reboot",
    power_off = "power_off",
    dump_info = "dump_info",
    read_status = "read_status",
    take_photo = "take_photo"
}
export interface StandardPinBinding extends PinBindingBase {
    binding_type: PinBindingType.standard;
    sequence_id: number;
}
export interface SpecialPinBinding extends PinBindingBase {
    binding_type: PinBindingType.special;
    special_action: PinBindingSpecialAction;
}
export declare type PinBinding = StandardPinBinding | SpecialPinBinding;
export interface PlantTemplate extends ResourceBase {
    saved_garden_id: number;
    radius: number;
    x: number;
    y: number;
    z: number;
    name: string;
    openfarm_slug: string;
}
interface BasePoint extends ResourceBase {
    discarded_at?: string | undefined;
    radius: number;
    x: number;
    y: number;
    z: number;
    pointer_id?: number | undefined;
    meta: {
        [key: string]: (string | undefined);
    };
    name: string;
}
export interface PlantPointer extends BasePoint {
    openfarm_slug: string;
    pointer_type: "Plant";
    planted_at?: string;
    plant_stage: PlantStage;
}
export interface ToolSlotPointer extends BasePoint {
    tool_id: number | undefined;
    pointer_type: "ToolSlot";
    pullout_direction: ToolPulloutDirection;
}
export interface GenericPointer extends BasePoint {
    pointer_type: "GenericPointer";
}
export declare type Point = GenericPointer | ToolSlotPointer | PlantPointer;
/** Individual step that a regimen will execute at a point in time. */
export interface RegimenItem {
    id?: number;
    sequence_id: number;
    regimen_id?: number;
    /** Time (in milliseconds) to wait before executing the sequence */
    time_offset: number;
}
/** A list of "Sequence" scheduled after a starting point (epoch). */
export interface Regimen extends ResourceBase {
    /** Friendly identifier for humans to easily identify regimens. */
    name: string;
    color: Color;
    regimen_items: RegimenItem[];
    body: VariableDeclaration[];
}
export interface SavedGarden extends ResourceBase {
    name?: string;
}
export interface Sensor extends ResourceBase {
    pin: number | undefined;
    mode: number;
    label: string;
}
export interface SensorReading extends ResourceBase {
    x: number | undefined;
    y: number | undefined;
    z: number | undefined;
    value: number;
    mode: number;
    pin: number;
}
export interface Tool extends ResourceBase {
    name?: string;
    status?: string | undefined;
}
export interface WebcamFeed extends ResourceBase {
    url: string;
    name: string;
}
export interface SequenceResource extends Sequence, ResourceBase {
    color: Color;
    name: string;
}
export interface Crop extends ResourceBase {
    svg_icon?: string | undefined;
    spread?: number | undefined;
    slug: string;
}
export interface FarmwareEnv extends ResourceBase {
    key: string;
    value: string | number | boolean;
}
export interface User extends ResourceBase {
    name: string;
    email: string;
}
export interface DeviceAccountSettings extends ResourceBase {
    name: string;
    timezone?: string | undefined;
    tz_offset_hrs: number;
    throttled_until?: string;
    throttled_at?: string;
    fbos_version?: string | undefined;
    last_saw_api?: string | undefined;
    last_saw_mq?: string | undefined;
}
export {};
