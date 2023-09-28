export interface FbosConfig {
    id: number;
    device_id: number;
    created_at: string;
    updated_at: string;
    firmware_input_log: boolean;
    firmware_output_log: boolean;
    sequence_body_log: boolean;
    sequence_complete_log: boolean;
    sequence_init_log: boolean;
    firmware_hardware?: string;
    os_auto_update: boolean;
    arduino_debug_messages: boolean;
    firmware_path?: string;
    firmware_debug_log?: boolean;
    boot_sequence_id?: number;
    update_channel?: string;
    safe_height?: number;
    soil_height?: number;
    gantry_height?: number;
}
export type NumberConfigKey = "id" | "device_id" | "safe_height" | "soil_height" | "gantry_height" | "boot_sequence_id";
export type StringConfigKey = "firmware_hardware" | "firmware_path" | "update_channel";
export type BooleanConfigKey = "arduino_debug_messages" | "firmware_debug_log" | "firmware_input_log" | "firmware_output_log" | "os_auto_update" | "sequence_body_log" | "sequence_complete_log" | "sequence_init_log";
