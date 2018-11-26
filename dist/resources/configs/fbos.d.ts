export interface FbosConfig {
    id: number;
    device_id: number;
    created_at: string;
    updated_at: string;
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
    firmware_path?: string;
    firmware_debug_log?: boolean;
}
export declare type NumberConfigKey = "id" | "device_id" | "network_not_found_timer";
export declare type StringConfigKey = "firmware_hardware" | "firmware_path";
export declare type BooleanConfigKey = "auto_sync" | "api_migrated" | "arduino_debug_messages" | "beta_opt_in" | "disable_factory_reset" | "firmware_debug_log" | "firmware_input_log" | "firmware_output_log" | "os_auto_update" | "sequence_body_log" | "sequence_complete_log" | "sequence_init_log";
