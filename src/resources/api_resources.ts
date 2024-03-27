import {
  ALLOWED_MESSAGE_TYPES,
  ALLOWED_CHANNEL_NAMES,
  PlantStage,
  Color,
  Sequence,
  InternalFarmEventBodyItem
} from "..";
import {
  VariableDeclaration,
  ParameterDeclaration,
  ParameterApplication
} from "../corpus";

export type TimeUnit =
  | "never"
  | "minutely"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type ExecutableType = "Sequence" | "Regimen";

export enum ToolPulloutDirection {
  NONE = 0,
  POSITIVE_X = 1,
  NEGATIVE_X = 2,
  POSITIVE_Y = 3,
  NEGATIVE_Y = 4,
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
  patch_version?: number;
  channels: ALLOWED_CHANNEL_NAMES[];
}

export interface Peripheral extends ResourceBase {
  pin: number | undefined;
  mode: number;
  label: string;
}

interface PinBindingBase extends ResourceBase { pin_num: number; }

export enum PinBindingType { special = "special", standard = "standard" }

export enum PinBindingSpecialAction {
  emergency_lock = "emergency_lock",
  emergency_unlock = "emergency_unlock",
  sync = "sync",
  reboot = "reboot",
  power_off = "power_off",
  read_status = "read_status",
  take_photo = "take_photo",
}

export interface StandardPinBinding extends PinBindingBase {
  binding_type: PinBindingType.standard;
  sequence_id: number;
}

export interface SpecialPinBinding extends PinBindingBase {
  binding_type: PinBindingType.special;
  special_action: PinBindingSpecialAction;
}

export type PinBinding = StandardPinBinding | SpecialPinBinding;

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
  x: number;
  y: number;
  z: number;
  pointer_id?: number | undefined;
  meta: { [key: string]: (string | undefined) };
  name: string;
}

export interface PlantPointer extends BasePoint {
  pointer_type: "Plant";
  openfarm_slug: string;
  planted_at?: string;
  plant_stage: PlantStage;
  radius: number;
  depth: number;
  water_curve_id?: number;
  spread_curve_id?: number;
  height_curve_id?: number;
}

export interface ToolSlotPointer extends BasePoint {
  pointer_type: "ToolSlot";
  tool_id: number | undefined;
  pullout_direction: ToolPulloutDirection;
  gantry_mounted: boolean;
}

export interface GenericPointer extends BasePoint {
  pointer_type: "GenericPointer";
  radius: number;
}

export interface WeedPointer extends BasePoint {
  pointer_type: "Weed";
  plant_stage: PlantStage;
  radius: number;
}

export type Point =
  | GenericPointer
  | PlantPointer
  | ToolSlotPointer
  | WeedPointer;

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
  body: (ParameterDeclaration | VariableDeclaration | ParameterApplication)[];
}

export interface SavedGarden extends ResourceBase {
  name?: string;
  notes?: string;
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
  read_at: string;
}

export interface Telemetry {
  id: number;
  updated_at: string;
  created_at: number;
  target: string;
  soc_temp?: number;
  throttled?: string;
  wifi_level_percent?: number;
  uptime?: number;
  memory_usage?: number;
  disk_usage?: number;
  cpu_usage?: number;
  fbos_version?: string;
  firmware_hardware?: string;
}

export interface Tool extends ResourceBase {
  name?: string;
  flow_rate_ml_per_s: number;
}

export interface WebcamFeed extends ResourceBase {
  url: string;
  name: string;
}

export interface Folder extends ResourceBase {
  color: Color;
  parent_id?: number;
  name: string;
}

export interface SequenceResource extends Sequence, ResourceBase {
  color: Color;
  name: string;
  folder_id: number | undefined;
  pinned: boolean;
  description: string;
  forked: boolean;
  sequence_version_id?: number;
  sequence_versions?: number[];
  copyright?: string;
}

export interface Curve extends ResourceBase {
  name: string;
  type: "water" | "spread" | "height";
  data: Record<number, number>;
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
  language: string;
}

export interface DeviceAccountSettings extends ResourceBase {
  name: string;
  timezone?: string | undefined;
  tz_offset_hrs: number;
  throttled_until?: string;
  throttled_at?: string;
  fbos_version?: string | undefined;
  last_saw_api?: string | undefined;
  setup_completed_at?: string | undefined;
  ota_hour?: number;
  ota_hour_utc?: number;
  mounted_tool_id?: number | undefined;
  fb_order_number?: string;
  lat: number | undefined;
  lng: number | undefined;
  indoor: boolean;
  rpi: string | undefined;
  max_log_age_in_days: number;
  max_sequence_count: number;
  max_sequence_length: number;
}

export type PointGroupSortType =
  | "random"
  | "xy_ascending"
  | "xy_descending"
  | "yx_ascending"
  | "yx_descending"
  | "xy_alternating"
  | "yx_alternating"
  | "nn";

interface PointGroupCriteria {
  day: {
    op: ">" | "<",
    days_ago: number
  };
  string_eq: Record<string, string[] | undefined>,
  number_eq: Record<string, number[] | undefined>,
  number_gt: Record<string, number | undefined>,
  number_lt: Record<string, number | undefined>,
}

export interface PointGroup extends ResourceBase {
  name: string;
  sort_type: PointGroupSortType;
  point_ids: number[];
  criteria: PointGroupCriteria;
}

export interface WizardStepResult extends ResourceBase {
  slug: string;
  answer?: boolean;
  outcome?: string;
}
