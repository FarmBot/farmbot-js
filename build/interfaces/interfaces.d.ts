export declare namespace FB {
    let _: string;
    interface Thenable<T> {
        then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
        then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
        catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    }
    type MQTTEventName = "connect" | "message";
    interface MqttClient {
        publish: (channel: string, payload: any) => void;
        subscribe: (channel: string | string[]) => void;
        on: (type: MQTTEventName, listener: any) => void;
        once: (type: MQTTEventName, listener: any) => void;
    }
    interface Dictionary<T> {
        [key: string]: T;
    }
    type StateTree = Dictionary<string | number | boolean>;
    type userVariables = "x" | "y" | "z" | "s" | "busy" | "last" | "pins" | "param_version" | "movement_timeout_x" | "movement_timeout_y" | "movement_timeout_z" | "movement_invert_endpoints_x" | "movement_invert_endpoints_y" | "movement_invert_endpoints_z" | "movement_invert_motor_x" | "movement_invert_motor_y" | "movement_invert_motor_z" | "movement_steps_acc_dec_x" | "movement_steps_acc_dec_y" | "movement_steps_acc_dec_z" | "movement_home_up_x" | "movement_home_up_y" | "movement_home_up_z" | "movement_min_spd_x" | "movement_min_spd_y" | "movement_min_spd_z" | "movement_max_spd_x" | "movement_max_spd_y" | "movement_max_spd_z" | "time" | "pin0" | "pin1" | "pin2" | "pin3" | "pin4" | "pin5" | "pin6" | "pin7" | "pin8" | "pin9" | "pin10" | "pin11" | "pin12" | "pin13";
    /** Names for a single step within a sequence. */
    type stepType = "emergency_stop" | "home_all" | "home_x" | "home_y" | "home_z" | "move_absolute" | "move_relative" | "pin_write" | "read_parameter" | "read_status" | "write_parameter" | "wait" | "send_message" | "if_statement" | "read_pin" | "execute";
    /** Color choices for sequence tiles. */
    type Color = "blue" | "green" | "yellow" | "orange" | "purple" | "pink" | "gray" | "red";
    interface StepCommand {
        x?: number;
        y?: number;
        z?: number;
        speed?: number;
        delay?: number;
        pin?: number;
        mode?: number;
        position?: number;
        value?: string;
        operator?: ">" | "<" | "!=" | "==";
        variable?: userVariables;
        sub_sequence_id?: string;
    }
    /** Similar to "Step", but "position" isnt mandatory. */
    interface UnplacedStep {
        message_type: stepType;
        position?: number;
        _id?: string;
        command: StepCommand;
    }
    /** One step in a larger "Sequence". */
    interface Step extends UnplacedStep {
        position: number;
    }
    interface Sequence {
        _id?: string;
        color: Color;
        name: String;
        steps: Step[];
        dirty?: Boolean;
    }
    type CalibrationParams = Dictionary<any>;
    interface ConstructorParams {
        /** API token which can be retrieved by logging into REST server or my.farmbot.io */
        token: string;
        /** Default time to wait (ms) before considering operation a failure. */
        timeout?: number;
        /** Default physical speed for operations. (steps/s?) */
        speed?: number;
    }
    interface APIToken {
        /** URL of MQTT server. REST server is not the same as MQTT server. */
        mqtt: string;
        /** UUID of current bot. */
        bot: string;
    }
}
