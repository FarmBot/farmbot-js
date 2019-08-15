import * as Corpus from "./corpus";
import { Client as MqttClient } from "mqtt";
import { Dictionary } from "./interfaces";
import { FarmBotInternalConfig as Conf, FarmbotConstructorParams } from "./config";
import { ResourceAdapter } from "./resources/resource_adapter";
import { Priority } from "./util/rpc_request";
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
    /** Delete this shim after FBOS v7 hits end of life. */
    rpcShim: (body: (Corpus.If | Corpus.Execute | Corpus.Calibrate | Corpus.ChangeOwnership | Corpus.CheckUpdates | Corpus.DumpInfo | Corpus.EmergencyLock | Corpus.EmergencyUnlock | Corpus.ExecuteScript | Corpus.FactoryReset | Corpus.FindHome | Corpus.FlashFirmware | Corpus.Home | Corpus.InstallFarmware | Corpus.InstallFirstPartyFarmware | Corpus.MoveRelative | Corpus.PowerOff | Corpus.ReadStatus | Corpus.Reboot | Corpus.RemoveFarmware | Corpus.MoveAbsolute | Corpus.ReadPin | Corpus.ResourceUpdate | Corpus.SendMessage | Corpus.SetServoAngle | Corpus.SetUserEnv | Corpus.Sync | Corpus.TakePhoto | Corpus.TogglePin | Corpus.UpdateFarmware | Corpus.Wait | Corpus.WritePin | Corpus.Zero)[], priority?: Priority) => Corpus.RpcRequest;
    /** Get a Farmbot Constructor Parameter. */
    getConfig: <U extends "speed" | "token" | "secure" | "mqttServer" | "mqttUsername" | "LAST_PING_OUT" | "LAST_PING_IN" | "interim_flag_is_legacy_fbos">(key: U) => Conf[U];
    /** Set a Farmbot Constructor Parameter. */
    setConfig: <U extends "speed" | "token" | "secure" | "mqttServer" | "mqttUsername" | "LAST_PING_OUT" | "LAST_PING_IN" | "interim_flag_is_legacy_fbos">(key: U, value: Conf[U]) => void;
    /**
     * Installs a "Farmware" (plugin) onto the bot's SD card.
     * URL must point to a valid Farmware manifest JSON document.
     */
    installFarmware: (url: string) => Promise<unknown>;
    /**
     * Checks for updates on a particular Farmware plugin when given the name of
     * a Farmware. `updateFarmware("take-photo")`
     */
    updateFarmware: (pkg: string) => Promise<unknown>;
    /** Uninstall a Farmware plugin. */
    removeFarmware: (pkg: string) => Promise<unknown>;
    /**
     * Installs "Farmware" (plugins) authored by FarmBot, Inc.
     * onto the bot's SD card.
     */
    installFirstPartyFarmware: () => Promise<unknown>;
    /**
     * Deactivate FarmBot OS completely (shutdown).
     * Useful before unplugging the power.
     */
    powerOff: () => Promise<unknown>;
    /** Restart FarmBot OS. */
    reboot: () => Promise<unknown>;
    /** Reinitialize the FarmBot microcontroller firmware. */
    rebootFirmware: () => Promise<unknown>;
    /** Check for new versions of FarmBot OS.
     * Downloads and installs if available. */
    checkUpdates: () => Promise<unknown>;
    /** THIS WILL RESET THE SD CARD, deleting all non-factory data!
     * Be careful!! */
    resetOS: () => void;
    /** WARNING: will reset all firmware (hardware) settings! */
    resetMCU: () => Promise<unknown>;
    flashFirmware: (firmware_name: string) => Promise<unknown>;
    /**
     * Lock the bot from moving (E-STOP). Turns off peripherals and motors. This
     * also will pause running regimens and cause any running sequences to exit.
     */
    emergencyLock: () => Promise<unknown>;
    /** Unlock the bot when the user says it is safe. */
    emergencyUnlock: () => Promise<unknown>;
    /** Execute a sequence by its ID on the FarmBot API. */
    execSequence: (sequence_id: number, body?: Corpus.ParameterApplication[]) => Promise<unknown>;
    /** Run an installed Farmware plugin on the SD Card. */
    execScript: (label: string, envVars?: Corpus.Pair[] | undefined) => Promise<unknown>;
    /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */
    home: (args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }) => Promise<unknown>;
    /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis
     * order. WON'T WORK WITHOUT ENCODERS OR END STOPS! A blockage or stall
     * during this command will set that position as zero. Use carefully. */
    findHome: (args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }) => Promise<unknown>;
    /** Move FarmBot to an absolute point. */
    moveAbsolute: (args: Record<import("./interfaces").Xyz, number> & {
        speed?: number | undefined;
    }) => Promise<unknown>;
    /** Move FarmBot to position relative to its current position. */
    moveRelative: (args: Record<import("./interfaces").Xyz, number> & {
        speed?: number | undefined;
    }) => Promise<unknown>;
    /** Set a GPIO pin to a particular value. */
    writePin: (args: {
        pin_mode: Corpus.ALLOWED_PIN_MODES;
        pin_number: number | Corpus.NamedPin;
        pin_value: number;
    }) => Promise<unknown>;
    /** Read the value of a GPIO pin. Will create a SensorReading if it's
     * a sensor. */
    readPin: (args: {
        label: string;
        pin_mode: Corpus.ALLOWED_PIN_MODES;
        pin_number: number | Corpus.NamedPin;
    }) => Promise<unknown>;
    /** Reverse the value of a digital pin. */
    togglePin: (args: {
        pin_number: number;
    }) => Promise<unknown>;
    /** Read the status of the bot. Should not be needed unless you are first
     * logging in to the device, since the device pushes new states out on
     * every update. */
    readStatus: (args?: {}) => Promise<unknown>;
    /** Snap a photo and send to the API for post processing. */
    takePhoto: (args?: {}) => Promise<unknown>;
    /** Download/apply all of the latest FarmBot API JSON resources (plants,
     * account info, etc.) to the device. */
    sync: (args?: {}) => Promise<unknown>;
    /**
     * Set the current position of the given axis to 0.
     * Example: Sending `bot.setZero("x")` at x: 255 will translate position
     * 255 to 0, causing that position to be x: 0.
     */
    setZero: (axis: Corpus.ALLOWED_AXIS) => Promise<unknown>;
    /**
     * Set user ENV vars (usually used by 3rd-party Farmware plugins).
     * Set value to `undefined` to unset.
     */
    setUserEnv: (configs: Dictionary<string | undefined>) => Promise<unknown>;
    /** Control servos on pins 4 and 5. */
    setServoAngle: (args: {
        pin_number: number;
        pin_value: number;
    }) => Promise<unknown>;
    /**
     * Find the axis extents using encoder, motor, or end-stop feedback.
     * Will set a new home position and a new axis length for the given axis.
     */
    calibrate: (args: {
        axis: Corpus.ALLOWED_AXIS;
    }) => Promise<unknown>;
    /** Tell the bot to send diagnostic info to the API.*/
    dumpInfo: () => Promise<unknown>;
    /**
     * Retrieves all of the event handlers for a particular event.
     * Returns an empty array if the event did not exist.
     */
    event: (name: string) => CallbackWrapper[];
    on: (event: string, value: Function, once?: boolean) => void;
    emit: (event: string, data: {}) => void;
    /** Dictionary of all relevant MQTT channels the bot uses. */
    readonly channel: {
        /** From the browser, usually. */
        toDevice: string;
        /** From farmbot */
        toClient: string;
        legacyStatus: string;
        logs: string;
        status: string;
        sync: string;
        /** Read only */
        pong: string;
        /** Write only: bot/${deviceName}/ping/${timestamp} */
        ping: (timestamp: number) => string;
    };
    /** Low-level means of sending MQTT packets. Does not check format. Does not
     * acknowledge confirmation. Probably not the one you want. */
    publish: (msg: Corpus.RpcRequest, important?: boolean) => void;
    /** Low-level means of sending MQTT RPC commands to the bot. Acknowledges
     * receipt of message, but does not check formatting. Consider using higher
     * level methods like .moveRelative(), .calibrate(), etc....
    */
    send: (input: Corpus.RpcRequest) => Promise<unknown>;
    /** Main entry point for all MQTT packets. */
    _onmessage: (chan: string, buffer: Uint8Array) => void;
    /** Delete this after FBOS v7 deprecation. */
    private temporaryHeuristic;
    private statusV8;
    ping: (timeout?: number, now?: number) => Promise<{}>;
    tempLegacyFlag: boolean;
    private doLegacyPing;
    private doPing;
    /** Bootstrap the device onto the MQTT broker. */
    connect: () => Promise<unknown>;
}
export {};
