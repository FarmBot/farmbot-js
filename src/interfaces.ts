import { NumberConfigKey } from "./resources/configs/firmware";

export type Primitive = string | number | boolean;

/** Everything the farmbot knows about itself at a given moment in time. */
export interface BotStateTree {
  /** Microcontroller configuration and settings. */
  mcu_params: McuParams;
  /** Cartesian coordinates of the bot. */
  location_data: LocationData;
  /** Lookup table, indexed by number for pin status */
  pins: Pins;
  /** User definable config settings.  */
  configuration: Configuration;
  /** READ ONLY meta data about the FarmBot device. */
  readonly informational_settings: InformationalSettings;
  /** Bag of misc. ENV vars that any Farmware author can use. */
  user_env: Dictionary<(string | undefined)>;
  /** When you're really curious about how a long-running
   * task (like FarmBot OS update downloads) is going to take. */
  jobs: Dictionary<(JobProgress | undefined)>;
  /** List of user accessible processes running on the bot. */
  process_info: { farmwares: Dictionary<FarmwareManifest>; };
  gpio_registry: { [pin: number]: string | undefined } | undefined;
}

/** Microcontroller board. */
export type FirmwareHardware =
  | "none"
  | "arduino"
  | "express_k10"
  | "express_k11"
  | "express_k12"
  | "farmduino_k14"
  | "farmduino_k15"
  | "farmduino_k16"
  | "farmduino_k17"
  | "farmduino_k18"
  | "farmduino";

/** FarmBot motor and encoder positions. */
export type LocationName =
  | "position"
  | "scaled_encoders"
  | "raw_encoders";

export type AxisState =
  | "idle"
  | "begin"
  | "accelerate"
  | "cruise"
  | "decelerate"
  | "stop"
  | "crawl";

export interface LocationData {
  position: Record<Xyz, number | undefined>;
  scaled_encoders: Record<Xyz, number | undefined>;
  raw_encoders: Record<Xyz, number | undefined>;
  load?: Record<Xyz, number | undefined>;
  axis_states?: Record<Xyz, AxisState | undefined>;
}

/** Job progress status. */
export type ProgressStatus =
  | "complete"
  | "working"
  | "error";

export type JobProgress =
  | PercentageProgress
  | BytesProgress;

interface JobProgressBase {
  status: ProgressStatus;
  type: string;
  file_type: string;
  time: string;
  updated_at: number;
}

/** Percent job progress. */
export interface PercentageProgress extends JobProgressBase {
  unit: "percent";
  percent: number;
}

/** Bytes job progress. */
export interface BytesProgress extends JobProgressBase {
  unit: "bytes";
  bytes: number;
}

/** Identified FarmBot OS problem. */
export interface Alert {
  id?: number;
  created_at: number;
  problem_tag: string;
  priority: number;
  slug: string;
}

/**
 * Configs (inputs) requested by a Farmware.
 * Can be namespaced and supplied to a run Farmware command.
 * Also used in FarmBot Web App Farmware page form builder.
 */
export type FarmwareConfig = Record<"name" | "label" | "value", string>;

/**
 * The Farmware manifest is a JSON file published by Farmware authors.
 * It is used by FarmBot OS to perform installation and upgrades.
 */
export interface FarmwareManifest {
  /** "2.0" */
  farmware_manifest_version: string;
  /** Farmware name. */
  package: string;
  /** Farmware version. */
  package_version: string;
  /** Farmware description (optional). */
  description: string;
  /** Farmware author. */
  author: string;
  /** Farmware language, eg: `python` (optional). */
  language: string;
  /** The thing that will run the Farmware eg: `python`. */
  executable: string;
  /** Command line args (combined into a string) passed to `executable`. */
  args: string;
  /** Dictionary of `FarmwareConfig` with number (i.e., "1") keys. (optional) */
  config: Dictionary<FarmwareConfig>;
  /** Required FarmBot OS version to run the Farmware, i.e., ">=8.0.0" */
  farmbot_os_version_requirement: string;
  /** Required Farmware Tools version. Use ">=0.0.0" for latest version. */
  farmware_tools_version_requirement: string;
  /** Farmware manifest URL (optional). */
  url: string;
  /** Zipped Farmware files URL. */
  zip: string;
}

export enum Encoder {
  unknown = -1,
  quadrature,
  differential
}

/** Microcontroller firmware hardware setting names. */
export type McuParamName = NumberConfigKey;

/** Microcontroller configuration and settings. */
export type McuParams = Partial<Record<McuParamName, (number | undefined)>>;

/** Bot axis names. */
export type Xyz = "x" | "y" | "z";
/** 3 dimensional vector. */
export type Vector3 = Record<Xyz, number>;

/** GPIO pin value record. */
export interface Pin {
  mode: number;
  value: number;
}

/** Lookup for pin status, indexed by pin number. */
export type Pins = Dictionary<Pin | undefined>;

/** FarmBot OS configs. */
export interface FullConfiguration {
  arduino_debug_messages: number;
  boot_sequence_id?: number;
  firmware_debug_log?: boolean;
  firmware_hardware: FirmwareHardware;
  firmware_input_log: boolean;
  firmware_output_log: boolean;
  firmware_path?: string;
  fw_auto_update: number;
  os_auto_update: number;
  sequence_body_log: boolean;
  sequence_complete_log: boolean;
  sequence_init_log: boolean;
  update_channel?: string;
  safe_height?: number;
  soil_height?: number;
  gantry_height?: number;
}

/** FarmBot OS configs. */
export type Configuration = Partial<FullConfiguration>;

/** FarmBot OS config names. */
export type ConfigurationName = keyof Configuration;

/** The possible values for the sync_status property on informational_settings */
export type SyncStatus =
  | "booting"
  | "maintenance"
  | "sync_error"
  | "sync_now"
  | "synced"
  | "syncing"
  | "unknown";

/** Various FarmBot OS status data. */
export interface InformationalSettings {
  /** System uptime in seconds. */
  uptime?: number;
  /** Percentage of disk space used. */
  disk_usage?: number;
  /** CPU utilization (percent). */
  cpu_usage?: number;
  /** Scheduler utilization (percent). */
  scheduler_usage?: number;
  /** Megabytes of RAM used. */
  memory_usage?: number;
  /** CPU Temperature (C) of the device running FBOS (RPi). */
  soc_temp?: number;
  /** WiFi signal strength (dBm). */
  wifi_level?: number;
  /** WiFi signal strength (percent). */
  wifi_level_percent?: number;
  /** FBOS commit hash. */
  controller_commit?: string;
  /** Current version of FarmBot OS. */
  controller_version?: string | undefined;
  /** Current uuid of FarmBot OS firmware. */
  controller_uuid?: string | undefined;
  /** Arduino/Farmduino firmware version. */
  firmware_version?: string | undefined;
  /** If the RPi is throttled and/or having WiFi issues. */
  throttled?: string | undefined;
  /** Farmbot's private IP address */
  private_ip?: string | undefined;
  /** The message to be displayed on the frontend for sync status. */
  sync_status?: SyncStatus | undefined;
  /** Microcontroller status (move in progress, etc.) */
  busy: boolean;
  /** Microcontroller status */
  idle?: boolean;
  /** Emergency stop status. */
  locked: boolean;
  /** FBOS commit hash. */
  commit: string;
  /** Microcontroller firmware commit hash. */
  firmware_commit: string;
  /** FBOS device type (rpi3, etc.). */
  target: string;
  /** FBOS env (prod, dev, etc.). */
  env: string;
  /** FBOS node name. */
  node_name: string;
  /** FBOS is beta? */
  currently_on_beta?: boolean;
  /** FBOS update available? */
  update_available?: boolean;
  /** CSV list of available camera device numbers (/dev/video#). */
  video_devices?: string;
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

  /** UUID of current bot, eg: "device_1". */
  bot: string;
}
