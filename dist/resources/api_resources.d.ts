import { ALLOWED_MESSAGE_TYPES, ALLOWED_CHANNEL_NAMES, PlantStage, Color, Sequence } from "..";
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
    id?: number;
    created_at?: string;
    updated_at?: string;
}
export interface FarmEvent extends ResourceBase {
    start_time: string;
    end_time?: string | undefined;
    repeat?: number | undefined;
    time_unit: TimeUnit;
    executable_id: number;
    executable_type: ExecutableType;
}
export interface FarmwareInstallation extends ResourceBase {
    url: string;
}
export interface Image extends ResourceBase {
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
export interface Log extends ResourceBase {
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
    in_use?: boolean;
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
    in_use?: boolean;
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
export interface FbosConfig extends ResourceBase {
    id: number;
    device_id: number;
    auto_sync: boolean;
    beta_opt_in: boolean;
    disable_factory_reset: boolean;
    firmware_input_log: boolean;
    firmware_output_log: boolean;
    sequence_body_log: boolean;
    sequence_complete_log: boolean;
    sequence_init_log: boolean;
    network_not_found_timer: number;
    firmware_hardware: string;
    api_migrated: boolean;
    os_auto_update: boolean;
    arduino_debug_messages: boolean;
}
export interface FirmwareConfig extends ResourceBase {
    id: number;
    api_migrated: boolean;
    device_id: number;
    encoder_enabled_x: number;
    encoder_enabled_y: number;
    encoder_enabled_z: number;
    encoder_invert_x: number;
    encoder_invert_y: number;
    encoder_invert_z: number;
    encoder_missed_steps_decay_x: number;
    encoder_missed_steps_decay_y: number;
    encoder_missed_steps_decay_z: number;
    encoder_missed_steps_max_x: number;
    encoder_missed_steps_max_y: number;
    encoder_missed_steps_max_z: number;
    encoder_scaling_x: number;
    encoder_scaling_y: number;
    encoder_scaling_z: number;
    encoder_type_x: number;
    encoder_type_y: number;
    encoder_type_z: number;
    encoder_use_for_pos_x: number;
    encoder_use_for_pos_y: number;
    encoder_use_for_pos_z: number;
    movement_axis_nr_steps_x: number;
    movement_axis_nr_steps_y: number;
    movement_axis_nr_steps_z: number;
    movement_enable_endpoints_x: number;
    movement_enable_endpoints_y: number;
    movement_enable_endpoints_z: number;
    movement_home_at_boot_x: number;
    movement_home_at_boot_y: number;
    movement_home_at_boot_z: number;
    movement_home_spd_x: number;
    movement_home_spd_y: number;
    movement_home_spd_z: number;
    movement_home_up_x: number;
    movement_home_up_y: number;
    movement_home_up_z: number;
    movement_invert_2_endpoints_x: number;
    movement_invert_2_endpoints_y: number;
    movement_invert_2_endpoints_z: number;
    movement_invert_endpoints_x: number;
    movement_invert_endpoints_y: number;
    movement_invert_endpoints_z: number;
    movement_invert_motor_x: number;
    movement_invert_motor_y: number;
    movement_invert_motor_z: number;
    movement_keep_active_x: number;
    movement_keep_active_y: number;
    movement_keep_active_z: number;
    movement_max_spd_x: number;
    movement_max_spd_y: number;
    movement_max_spd_z: number;
    movement_min_spd_x: number;
    movement_min_spd_y: number;
    movement_min_spd_z: number;
    movement_secondary_motor_invert_x: number;
    movement_secondary_motor_x: number;
    movement_step_per_mm_x: number;
    movement_step_per_mm_y: number;
    movement_step_per_mm_z: number;
    movement_steps_acc_dec_x: number;
    movement_steps_acc_dec_y: number;
    movement_steps_acc_dec_z: number;
    movement_stop_at_home_x: number;
    movement_stop_at_home_y: number;
    movement_stop_at_home_z: number;
    movement_stop_at_max_x: number;
    movement_stop_at_max_y: number;
    movement_stop_at_max_z: number;
    movement_timeout_x: number;
    movement_timeout_y: number;
    movement_timeout_z: number;
    param_config_ok: number;
    param_e_stop_on_mov_err: number;
    param_mov_nr_retry: number;
    param_test: number;
    param_use_eeprom: number;
    param_version: number;
    pin_guard_1_active_state: number;
    pin_guard_1_pin_nr: number;
    pin_guard_1_time_out: number;
    pin_guard_2_active_state: number;
    pin_guard_2_pin_nr: number;
    pin_guard_2_time_out: number;
    pin_guard_3_active_state: number;
    pin_guard_3_pin_nr: number;
    pin_guard_3_time_out: number;
    pin_guard_4_active_state: number;
    pin_guard_4_pin_nr: number;
    pin_guard_4_time_out: number;
    pin_guard_5_active_state: number;
    pin_guard_5_pin_nr: number;
    pin_guard_5_time_out: number;
}
export interface WebAppConfig {
    id: number;
    bot_origin_quadrant: number;
    busy_log: number;
    confirm_step_deletion: boolean;
    debug_log: number;
    device_id: number;
    disable_animations: boolean;
    disable_i18n: boolean;
    discard_unsaved: boolean;
    display_trail: boolean;
    dynamic_map: boolean;
    enable_browser_speak: boolean;
    encoder_figure: boolean;
    error_log: number;
    fun_log: number;
    hide_webcam_widget: boolean;
    home_button_homing: boolean;
    info_log: number;
    legend_menu_open: boolean;
    map_xl: boolean;
    photo_filter_begin: string;
    photo_filter_end: string;
    raw_encoders: boolean;
    scaled_encoders: boolean;
    show_farmbot: boolean;
    show_first_party_farmware: boolean;
    show_images: boolean;
    show_plants: boolean;
    show_points: boolean;
    show_spread: boolean;
    stub_config: boolean;
    success_log: number;
    warn_log: number;
    xy_swap: boolean;
    x_axis_inverted: boolean;
    y_axis_inverted: boolean;
    z_axis_inverted: boolean;
    zoom_level: number;
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
