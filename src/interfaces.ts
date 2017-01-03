/** Everything the farmbot knows about itself at a given moment in time. */
export interface BotStateTree {
  /** Microcontroller configuration and settings. */
  mcu_params: McuParams;
  /** Cartesian coordinates of the bot. */
  location: [number, number, number];
  /** Lookup table, indexed by number for pin status */
  pins: Pins;
  /** User definable config settings.  */
  configuration: Configuration;
  /** READ ONLY meta data about the FarmBot device. */
  readonly informational_settings: InformationalSettings;
  /** Status of running regimens and sequences */
  farm_scheduler: DeprecatedFarmScheduler;
};

/** Going away soon. */
export interface DeprecatedFarmScheduler {
  /** Currently alive Regimnes
   *  They can be running or paused.
   */
  process_info: DeprecatedSchedulerInfo[];
}

/** Going away soon. */
export interface DeprecatedSchedulerInfo {
  process_info: {
    regimen: {
      id?: number;
    };
    info: {
      start_time: number;
      status: "normal" | "paused" | "ready";
    };
  };
}

/** Going away soon. */
export interface DeprecatedSchedulerInfo {
  process_info: {
    regimen: {
      id?: number
    };
    info: {
      start_time: number;
      status: "normal" | "paused" | "ready";
    };
  };
}

// /** Microcontroller configuration and settings. */
export interface McuParams {
  movement_invert_motor_y?: number | undefined;
  movement_timeout_x?: number | undefined;
  movement_min_spd_x?: number | undefined;
  movement_invert_endpoints_x?: number | undefined;
  movement_axis_nr_steps_z?: number | undefined;
  movement_max_spd_z?: number | undefined;
  movement_invert_motor_x?: number | undefined;
  movement_steps_acc_dec_x?: number | undefined;
  movement_home_up_x?: number | undefined;
  movement_min_spd_z?: number | undefined;
  movement_axis_nr_steps_y?: number | undefined;
  movement_timeout_z?: number | undefined;
  movement_steps_acc_dec_y?: number | undefined;
  movement_home_up_z?: number | undefined;
  movement_max_spd_x?: number | undefined;
  movement_invert_motor_z?: number | undefined;
  movement_steps_acc_dec_z?: number | undefined;
  movement_home_up_y?: number | undefined;
  movement_max_spd_y?: number | undefined;
  movement_invert_endpoints_y?: number | undefined;
  movement_invert_endpoints_z?: number | undefined;
  movement_timeout_y?: number | undefined;
  movement_min_spd_y?: number | undefined;
  movement_axis_nr_steps_x?: number | undefined;
  param_version?: number | undefined;
  encoder_enabled_x?: number | undefined;
  encoder_enabled_y?: number | undefined;
  encoder_enabled_z?: number | undefined;
}

export interface Pin {
  mode: number;
  value: number;
}

export type Pins = Dictionary<Pin | undefined>;

export interface Configuration {
  os_auto_update?: number | undefined;
  fw_auto_update?: number | undefined;
  steps_per_mm?: number | undefined;
}

export interface InformationalSettings {
  controller_version?: string | undefined;
  throttled?: string | undefined;
  private_ip?: string | undefined;
  locked?: boolean | undefined;
}

export type MQTTEventName = "connect" | "message";

export interface MqttClient {
  publish: (channel: string, payload: any) => void;
  subscribe: (channel: string | string[]) => void;
  on: (type: MQTTEventName, listener: any) => void;
  once: (type: MQTTEventName, listener: any) => void;
}

export interface Dictionary<T> { [key: string]: T; }

export type StateTree = Dictionary<string | number | boolean>;

export interface ConstructorParams {
  /** API token which can be retrieved by logging into REST server or my.farmbot.io */
  token: string;
  /** Default time to wait (ms) before considering operation a failure. */
  timeout?: number;
  /** Default physical speed for operations. (steps/s?) */
  speed?: number;
}

export interface APIToken {
  /** URL of MQTT server. REST server is not the same as MQTT server. */
  mqtt: string;
  /** UUID of current bot. */
  bot: string;
}
