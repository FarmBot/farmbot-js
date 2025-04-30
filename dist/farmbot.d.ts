import * as Corpus from "./corpus";
import { MqttClient } from "mqtt";
import { Dictionary, Vector3 } from "./interfaces";
import { ReadPin, WritePin } from ".";
import { FarmBotInternalConfig as Conf, FarmbotConstructorParams } from "./config";
import { ResourceAdapter } from "./resources/resource_adapter";
type RpcResponse = Promise<Corpus.RpcOk | Corpus.RpcError>;
/** Meta data that wraps an event callback */
interface CallbackWrapper {
    once: boolean;
    event: string;
    value: Function;
}
export declare class Farmbot {
    /** Storage area for all event handlers */
    private _events;
    private config;
    client?: MqttClient;
    resources: ResourceAdapter;
    static VERSION: string;
    constructor(input: FarmbotConstructorParams);
    /** Get a Farmbot Constructor Parameter. */
    getConfig: <U extends keyof Conf>(key: U) => Conf[U];
    /** Set a Farmbot Constructor Parameter. */
    setConfig: <U extends keyof Conf>(key: U, value: Conf[U]) => void;
    /**
     * Installs a "Farmware" (plugin) onto the bot's SD card.
     * URL must point to a valid Farmware manifest JSON document.
     */
    installFarmware: (url: string) => RpcResponse;
    /**
     * Checks for updates on a particular Farmware plugin when given the name of
     * a Farmware. `updateFarmware("take-photo")`
     */
    updateFarmware: (pkg: string) => RpcResponse;
    /** Uninstall a Farmware plugin. */
    removeFarmware: (pkg: string) => RpcResponse;
    /**
     * Installs "Farmware" (plugins) authored by FarmBot, Inc.
     * onto the bot's SD card.
     */
    installFirstPartyFarmware: () => RpcResponse;
    /**
     * Deactivate FarmBot OS completely (shutdown).
     * Useful before unplugging the power.
     */
    powerOff: () => RpcResponse;
    /** Restart FarmBot OS. */
    reboot: () => RpcResponse;
    /** Reinitialize the FarmBot microcontroller firmware. */
    rebootFirmware: () => RpcResponse;
    /** Check for new versions of FarmBot OS.
     * Downloads and installs if available. */
    checkUpdates: () => RpcResponse;
    /** THIS WILL RESET THE SD CARD, deleting all non-factory data!
     * Be careful!! */
    resetOS: () => void;
    /** WARNING: will reset all firmware (hardware) settings! */
    resetMCU: () => RpcResponse;
    flashFirmware: (
    /** one of: "arduino"|"express_k10"|"farmduino_k14"|"farmduino" */
    firmware_name: string) => RpcResponse;
    /**
     * Lock the bot from moving (E-STOP). Turns off peripherals and motors. This
     * also will pause running regimens and cause any running sequences to exit.
     */
    emergencyLock: () => RpcResponse;
    /** Unlock the bot when the user says it is safe. */
    emergencyUnlock: () => RpcResponse;
    /** Execute a sequence by its ID on the FarmBot API. */
    execSequence: (sequence_id: number, body?: Corpus.ParameterApplication[]) => RpcResponse;
    /** Run an installed Farmware plugin on the SD Card. */
    execScript: (
    /** Name of the Farmware. */
    label: string, 
    /** Optional ENV vars to pass the Farmware. */
    envVars?: Corpus.Pair[] | undefined) => RpcResponse;
    /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */
    home: (args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }) => RpcResponse;
    /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis
     * order. WON'T WORK WITHOUT ENCODERS OR END STOPS! A blockage or stall
     * during this command will set that position as zero. Use carefully. */
    findHome: (args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }) => RpcResponse;
    /** Move FarmBot to an absolute point. */
    moveAbsolute: (args: Vector3 & {
        speed?: number;
    }) => RpcResponse;
    /** Move FarmBot to position relative to its current position. */
    moveRelative: (args: Vector3 & {
        speed?: number;
    }) => RpcResponse;
    /** Set a GPIO pin to a particular value. */
    writePin: (args: WritePin["args"]) => RpcResponse;
    /** Read the value of a GPIO pin. Will create a SensorReading if it's
     * a sensor. */
    readPin: (args: ReadPin["args"]) => RpcResponse;
    /** Reverse the value of a digital pin. */
    togglePin: (args: {
        pin_number: number;
    }) => RpcResponse;
    /** Read the status of the bot. Should not be needed unless you are first
     * logging in to the device, since the device pushes new states out on
     * every update. */
    readStatus: (args?: {}) => RpcResponse;
    /** Snap a photo and send to the API for post processing. */
    takePhoto: (args?: {}) => RpcResponse;
    /** Download/apply all of the latest FarmBot API JSON resources (plants,
     * account info, etc.) to the device. */
    sync: (args?: {}) => RpcResponse;
    /**
     * Set the current position of the given axis to 0.
     * Example: Sending `bot.setZero("x")` at x: 255 will translate position
     * 255 to 0, causing that position to be x: 0.
     */
    setZero: (axis: Corpus.ALLOWED_AXIS) => RpcResponse;
    /**
     * Set user ENV vars (usually used by 3rd-party Farmware plugins).
     * Set value to `undefined` to unset.
     */
    setUserEnv: (configs: Dictionary<(string | undefined)>) => RpcResponse;
    sendMessage: (message_type: Corpus.ALLOWED_MESSAGE_TYPES, message: string, channels?: Corpus.ALLOWED_CHANNEL_NAMES[]) => void;
    /** Control servos on pins 4 and 5. */
    setServoAngle: (args: {
        pin_number: number;
        pin_value: number;
    }) => RpcResponse;
    /**
     * Find the axis extents using encoder, motor, or end-stop feedback.
     * Will set a new home position and a new axis length for the given axis.
     */
    calibrate: (args: {
        axis: Corpus.ALLOWED_AXIS;
    }) => RpcResponse;
    lua: (lua: string) => RpcResponse;
    /**
     * Retrieves all of the event handlers for a particular event.
     * Returns an empty array if the event did not exist.
     */
    event: (name: string) => CallbackWrapper[];
    on: (event: string, value: Function, once?: boolean) => void;
    emit: (event: string, data: {}) => void;
    /** Dictionary of all relevant MQTT channels the bot uses. */
    get channel(): {
        /** From the browser, usually. */
        toDevice: string;
        /** From farmbot */
        toClient: string;
        status: string;
        logs: string;
        sync: string;
        /** Read only */
        pong: string;
        /** Write only: bot/${deviceName}/ping/${timestamp} */
        ping: (tStamp: number) => string;
    };
    /** Low-level means of sending MQTT packets. Does not check format. Does not
     * acknowledge confirmation. Probably not the one you want. */
    publish: (msg: Corpus.RpcRequest, important?: boolean) => void;
    /** Low-level means of sending MQTT RPC commands to the bot. Acknowledges
     * receipt of message, but does not check formatting. Consider using higher
     * level methods like .moveRelative(), .calibrate(), etc....
    */
    send: (input: Corpus.RpcRequest) => RpcResponse;
    /** Main entry point for all MQTT packets. */
    _onmessage: (chan: string, buffer: Uint8Array) => void;
    ping: (timeout?: number, now?: number) => Promise<number>;
    private doPing;
    /** Bootstrap the device onto the MQTT broker. */
    connect: () => Promise<unknown>;
}
export {};
