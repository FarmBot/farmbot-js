/** Everything the farmbot knows about itself at a given moment in time. */
export interface BotStateTree {
  /** Microcontroller configuration and settings. */
  mcu_params: McuParams;
  /** Cartesian coordinates of the bot. */
  location_data: Record<LocationName, Record<Xyz, (number | undefined)>>;
  /** Lookup table, indexed by number for pin status */
  pins: Pins;
  /** User definable config settings.  */
  configuration: Configuration;
  /** READ ONLY meta data about the FarmBot device. */
  readonly informational_settings: InformationalSettings;
  /** Bag of misc. settings that any script author can use. */
  user_env: Dictionary<(string | undefined)>;
  /** When you're really curious about how a long-running
   * task (like farmware downloads) is going to take. */
  jobs: Dictionary<(JobProgress | undefined)>;
  /** List of user accessible processes running on the bot. */
  process_info: { farmwares: Dictionary<FarmwareManifest>; };
  gpio_registry: { [pin: number]: string | undefined } | undefined;
}

export type FirmwareHardware =
  | "arduino"
  | "farmduino"
  | "farmduino_k14";

export type LocationName =
  | "position"
  | "scaled_encoders"
  | "raw_encoders";

export type ProgressStatus =
  | "complete"
  | "working"
  | "error";

export type JobProgress =
  | PercentageProgress
  | BytesProgress;

export interface PercentageProgress {
  status: ProgressStatus;
  unit: "percent";
  percent: number;
}

export interface BytesProgress {
  status: ProgressStatus;
  unit: "bytes";
  bytes: number;
}

export interface FarmwareManifestMeta {
  min_os_version_major: string;
  description: string;
  language: string;
  version: string;
  author: string;
  zip: string;
}
/** Relates to form builder */
export type FarmwareConfig = Record<"name" | "label" | "value", string>;

/** The Farmware manifest is a JSON file published by farmware authors.
 * It is used by FarmBot OS to perform installation and upgrades. */
export interface FarmwareManifest {
  farmware_tools_version?: string;
  /** The thing that will run the farmware eg: `python`. */
  executable: string;
  uuid: string;
  /** Command line args passed to `executable`. */
  args: string[];
  name: string;
  url: string;
  path: string;
  meta: FarmwareManifestMeta;
  config: FarmwareConfig[];
}

export interface ProcessInfo {
  name: string;
  uuid: string;
}

export enum Encoder {
  unknown = -1,
  quadrature,
  differential
}

export type McuParamName =
  | "encoder_enabled_x"
  | "encoder_enabled_y"
  | "encoder_enabled_z"
  | "encoder_invert_x"
  | "encoder_invert_y"
  | "encoder_invert_z"
  | "encoder_missed_steps_decay_x"
  | "encoder_missed_steps_decay_y"
  | "encoder_missed_steps_decay_z"
  | "encoder_missed_steps_max_x"
  | "encoder_missed_steps_max_y"
  | "encoder_missed_steps_max_z"
  | "encoder_scaling_x"
  | "encoder_scaling_y"
  | "encoder_scaling_z"
  | "encoder_type_x"
  | "encoder_type_y"
  | "encoder_type_z"
  | "encoder_use_for_pos_x"
  | "encoder_use_for_pos_y"
  | "encoder_use_for_pos_z"
  | "movement_axis_nr_steps_x"
  | "movement_axis_nr_steps_y"
  | "movement_axis_nr_steps_z"
  | "movement_enable_endpoints_x"
  | "movement_enable_endpoints_y"
  | "movement_enable_endpoints_z"
  | "movement_home_at_boot_x"
  | "movement_home_at_boot_y"
  | "movement_home_at_boot_z"
  | "movement_home_spd_x"
  | "movement_home_spd_y"
  | "movement_home_spd_z"
  | "movement_home_up_x"
  | "movement_home_up_y"
  | "movement_home_up_z"
  | "movement_invert_2_endpoints_x"
  | "movement_invert_2_endpoints_y"
  | "movement_invert_2_endpoints_z"
  | "movement_invert_endpoints_x"
  | "movement_invert_endpoints_y"
  | "movement_invert_endpoints_z"
  | "movement_invert_motor_x"
  | "movement_invert_motor_y"
  | "movement_invert_motor_z"
  | "movement_keep_active_x"
  | "movement_keep_active_y"
  | "movement_keep_active_z"
  | "movement_max_spd_x"
  | "movement_max_spd_y"
  | "movement_max_spd_z"
  | "movement_min_spd_x"
  | "movement_min_spd_y"
  | "movement_min_spd_z"
  | "movement_secondary_motor_invert_x"
  | "movement_secondary_motor_x"
  | "movement_step_per_mm_x"
  | "movement_step_per_mm_y"
  | "movement_step_per_mm_z"
  | "movement_steps_acc_dec_x"
  | "movement_steps_acc_dec_y"
  | "movement_steps_acc_dec_z"
  | "movement_stop_at_home_x"
  | "movement_stop_at_home_y"
  | "movement_stop_at_home_z"
  | "movement_stop_at_max_x"
  | "movement_stop_at_max_y"
  | "movement_stop_at_max_z"
  | "movement_timeout_x"
  | "movement_timeout_y"
  | "movement_timeout_z"
  | "param_e_stop_on_mov_err"
  | "param_mov_nr_retry"
  | "param_version"
  | "pin_guard_1_active_state"
  | "pin_guard_1_pin_nr"
  | "pin_guard_1_time_out"
  | "pin_guard_2_active_state"
  | "pin_guard_2_pin_nr"
  | "pin_guard_2_time_out"
  | "pin_guard_3_active_state"
  | "pin_guard_3_pin_nr"
  | "pin_guard_3_time_out"
  | "pin_guard_4_active_state"
  | "pin_guard_4_pin_nr"
  | "pin_guard_4_time_out"
  | "pin_guard_5_active_state"
  | "pin_guard_5_pin_nr"
  | "pin_guard_5_time_out";

// /** Microcontroller configuration and settings. */
export type McuParams = Partial<Record<McuParamName, (number | undefined)>>;

export type Xyz = "x" | "y" | "z";
/** 3 dimensional vector. */
export type Vector3 = Record<Xyz, number>;

export interface Pin {
  mode: number;
  value: number;
}

export type Pins = Dictionary<Pin | undefined>;

export interface FullConfiguration {
  arduino_debug_messages: number;
  auto_sync: boolean;
  beta_opt_in: boolean;
  disable_factory_reset: boolean;
  firmware_hardware: FirmwareHardware;
  firmware_input_log: boolean;
  firmware_output_log: boolean;
  fw_auto_update: number;
  network_not_found_timer: number;
  os_auto_update: number;
  sequence_body_log: boolean;
  sequence_complete_log: boolean;
  sequence_init_log: boolean;
  steps_per_mm_x: number;
  steps_per_mm_y: number;
  steps_per_mm_z: number;
}

export type Configuration = Partial<FullConfiguration>;

export type ConfigurationName = keyof Configuration;

/** The possible values for the sync_msg property on informational_settings */
export type SyncStatus =
  | "booting"
  | "maintenance"
  | "sync_error"
  | "sync_now"
  | "synced"
  | "syncing"
  | "unknown";

export interface InformationalSettings {
  /** CPU Temperature of the Pi */
  soc_temp?: number;
  /** Wifi strength (dbm) */
  wifi_level?: number;
  /** Current version of Farmbot OS */
  controller_version?: string | undefined;
  /** Arduino firmware version. */
  firmware_version?: string | undefined;
  /** If the rpi is throttled. (and having wifi issues) */
  throttled?: string | undefined;
  /** Farmbot's private Ip address */
  private_ip?: string | undefined;
  /** The message to be displayed on the frontend for sync status. */
  sync_status?: SyncStatus | undefined;
  busy: boolean;
  locked: boolean;
  /**  FBOS commit hash */
  commit: string;
  firmware_commit: string;
  target: string;
  env: string;
  node_name: string;
}

export type MQTTEventName = "connect" | "message";

export interface Dictionary<T> { [key: string]: T; }

export interface APIToken {
  /** LEGACY ISSUES AHEAD: PLEASE READ:
   * This is the *host* of MQTT server. A host is *not* the same thing as
   * a URL. This property is only useful for NodeJS users.*/
  mqtt: string;

  /** Fully formed URL (port, protocol, host) pointing to the MQTT
   * websocket server. */
  mqtt_ws: string;

  /** UUID of current bot. */
  bot: string;
}
