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
}
export declare type NumberConfigKey = "id" | "device_id" | "network_not_found_timer";
export declare type StringConfigKey = "firmware_hardware";
export declare type BooleanConfigKey = "auto_sync" | "beta_opt_in" | "disable_factory_reset" | "firmware_input_log" | "firmware_output_log" | "sequence_body_log" | "sequence_complete_log" | "sequence_init_log" | "api_migrated" | "os_auto_update" | "arduino_debug_messages";
