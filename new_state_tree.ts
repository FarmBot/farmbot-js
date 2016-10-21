/** Everything the farmbot knows about itself at a given moment in time. */
interface BotStateTree {
    /** Microcontroller settings. */
    firmware_params: FirmwareParams;
    /** Cartesian coordinates of the bot. */
    location: Location;
    /** Lookup table, indexed by number for pin status */
    pins: Pins;
    /** User definable config settings.  */
    configuration: Configuration;
    /** READ ONLY meta data about the FarmBot device. */
    readonly informational_settings: InformationalSettings;
}

interface FirmwareParams {
    movement_invert_motor_y: number;
    movement_timeout_x: number;
    movement_min_spd_x: number;
    movement_invert_endpoints_x: number;
    movement_axis_nr_steps_z: number;
    movement_max_spd_z: number;
    movement_invert_motor_x: number;
    movement_steps_acc_dec_x: number;
    movement_home_up_x: number;
    movement_min_spd_z: number;
    movement_axis_nr_steps_y: number;
    movement_timeout_z: number;
    movement_steps_acc_dec_y: number;
    movement_home_up_z: number;
    movement_max_spd_x: number;
    movement_invert_motor_z: number;
    movement_steps_acc_dec_z: number;
    movement_home_up_y: number;
    movement_max_spd_y: number;
    movement_invert_endpoints_y: number;
    movement_invert_endpoints_z: number;
    movement_timeout_y: number;
    movement_min_spd_y: number;
    movement_axis_nr_steps_x: number;
    param_version: number;
}

interface Location {
    x: number;
    y: number;
    z: number;
}

interface Pin {
    mode: number;
    value: number;
}

type Pins = { [num: string]: Pin | undefined };

interface Configuration {
    os_auto_update: boolean;
    fw_auto_update: boolean;
}

interface InformationalSettings {
    controller_version: string;
}
