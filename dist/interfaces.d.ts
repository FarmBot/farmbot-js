/** Everything the farmbot knows about itself at a given moment in time. */
export interface BotStateTree {
    /** Microcontroller configuration and settings. */
    mcu_params: McuParams;
    /** Cartesian coordinates of the bot. */
    location_data: Record<LocationName, Vector3>;
    /** Lookup table, indexed by number for pin status */
    pins: Pins;
    /** User definable config settings.  */
    configuration: Configuration;
    /** READ ONLY meta data about the FarmBot device. */
    readonly informational_settings: InformationalSettings;
    /** Bag of misc. settings that any script author can use. */
    user_env: Dictionary<(string | undefined)>;
    /** When you're really curious about how a long-running
     * task (like farmware downloas) is going to take. */
    jobs: Dictionary<(JobProgress | undefined)>;
    /** List of user accessible processes running on the bot. */
    process_info: {
        farmwares: Dictionary<FarmwareManifest>;
    };
}
export declare type LocationName = "position" | "scaled_encoders" | "raw_encoders";
export declare type ProgressStatus = "done" | "complete" | "failed";
export interface JobProgress {
    status: ProgressStatus;
    progress: number;
}
/** Farmware  Manifest Meta data is data about the package used internally  by FBOS.*/
export interface FarmwareManifestMeta {
    /** For FBOS internal version comparison. */
    min_os_version_major: string;
    /** Description of the package. */
    description: string;
    /** Language used to develop the package. */
    language: string;
    /** Version number of the package. */
    version: string;
    /** Author of the package. */
    author: string;
    /** Url to the downloadable archive. */
    zip: string;
}
/** The Farmware manifest is a JSON file published by farmware authors.
 * It is used by FarmBot OS to perform installation and upgrades. */
export interface FarmwareManifest {
    /** The thing that will run the farmware eg: `python`. */
    executable: string;
    /** Command line args passed to `executable`. eg: `take-photo-master/take_photo.py` */
    args: string[];
    /** Name of the package. eg: `take-photo`.*/
    name: string;
    /** URL of the manifest. eg: `https://github.com/farmbot-labs/farmbot-manifests/take_photo.json` */
    url: string;
    /** Path to the executable. */
    path: string;
    /** Metadata about the Farmware. */
    meta: FarmwareManifestMeta;
}
export declare enum Encoder {
    unknown = -1,
    quadrature = 0,
    differential = 1,
}
export declare type McuParamName = "encoder_enabled_x" | "encoder_enabled_y" | "encoder_enabled_z" | "encoder_invert_x" | "encoder_invert_y" | "encoder_invert_z" | "encoder_missed_steps_decay_x" | "encoder_missed_steps_decay_y" | "encoder_missed_steps_decay_z" | "encoder_missed_steps_max_x" | "encoder_missed_steps_max_y" | "encoder_missed_steps_max_z" | "encoder_scaling_x" | "encoder_scaling_y" | "encoder_scaling_z" | "encoder_type_x" | "encoder_type_y" | "encoder_type_z" | "encoder_use_for_pos_x" | "encoder_use_for_pos_y" | "encoder_use_for_pos_z" | "movement_axis_nr_steps_x" | "movement_axis_nr_steps_y" | "movement_axis_nr_steps_z" | "movement_enable_endpoints_x" | "movement_enable_endpoints_y" | "movement_enable_endpoints_z" | "movement_home_at_boot_x" | "movement_home_at_boot_y" | "movement_home_at_boot_z" | "movement_home_up_x" | "movement_home_up_y" | "movement_home_up_z" | "movement_invert_endpoints_x" | "movement_invert_endpoints_y" | "movement_invert_endpoints_z" | "movement_invert_motor_x" | "movement_invert_motor_y" | "movement_invert_motor_z" | "movement_keep_active_x" | "movement_keep_active_y" | "movement_keep_active_z" | "movement_max_spd_x" | "movement_max_spd_y" | "movement_max_spd_z" | "movement_min_spd_x" | "movement_min_spd_y" | "movement_min_spd_z" | "movement_secondary_motor_invert_x" | "movement_secondary_motor_x" | "movement_steps_acc_dec_x" | "movement_steps_acc_dec_y" | "movement_steps_acc_dec_z" | "movement_stop_at_home_x" | "movement_stop_at_home_y" | "movement_stop_at_home_z" | "movement_stop_at_max_x" | "movement_stop_at_max_y" | "movement_stop_at_max_z" | "movement_timeout_x" | "movement_timeout_y" | "movement_timeout_z" | "param_mov_nr_retry" | "param_version";
export declare type McuParams = Partial<Record<McuParamName, (number | undefined)>>;
export declare type Xyz = "x" | "y" | "z";
/** 3 dimensional vector. */
export declare type Vector3 = Record<Xyz, number>;
export interface Pin {
    mode: number;
    value: number;
}
export declare type Pins = Dictionary<Pin | undefined>;
export declare type ConfigurationName = "os_auto_update" | "fw_auto_update" | "steps_per_mm_x" | "steps_per_mm_y" | "steps_per_mm_z";
export declare type Configuration = Partial<Record<ConfigurationName, (boolean | number | undefined)>>;
/** The possible values for the sync_msg property on informational_settings */
export declare type SyncStatus = "locked" | "maintenance" | "sync_error" | "sync_now" | "synced" | "syncing" | "unknown";
export interface InformationalSettings {
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
}
export declare type MQTTEventName = "connect" | "message";
export interface MqttClient {
    publish: (channel: string, payload: any) => void;
    subscribe: (channel: string | string[]) => void;
    on: (type: MQTTEventName, listener: any) => void;
    once: (type: MQTTEventName, listener: any) => void;
}
export interface Dictionary<T> {
    [key: string]: T;
}
export declare type StateTree = Dictionary<string | number | boolean>;
export interface ConstructorParams {
    /** API token which can be retrieved by logging into REST server or my.farmbot.io */
    token: string;
    /** Use HTTPS/SSL? */
    secure: boolean;
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
