import * as Corpus from "./corpus";
import { Client as MqttClient } from "mqtt";
import { Dictionary } from "./interfaces";
import { FarmBotInternalConfig as Conf, FarmbotConstructorParams } from "./config";
import { ResourceAdapter } from "./resources/resource_adapter";
export declare const NULL = "null";
export declare class Farmbot {
    /** Storage area for all event handlers */
    private _events;
    private config;
    client?: MqttClient;
    resources: ResourceAdapter;
    static VERSION: string;
    constructor(input: FarmbotConstructorParams);
    /** Get a Farmbot Constructor Parameter. */
    getConfig: <U extends "speed" | "token" | "secure" | "mqttServer" | "mqttUsername" | "LAST_PING_OUT" | "LAST_PING_IN">(key: U) => Conf[U];
    /** Set a Farmbot Constructor Parameter. */
    setConfig: <U extends "speed" | "token" | "secure" | "mqttServer" | "mqttUsername" | "LAST_PING_OUT" | "LAST_PING_IN">(key: U, value: Conf[U]) => void;
    /**
     * Installs a "Farmware" (plugin) onto the bot's SD card.
     * URL must point to a valid Farmware manifest JSON document.
     */
    installFarmware: (url: string) => Promise<{}>;
    /**
     * Checks for updates on a particular Farmware plugin when given the name of
     * a Farmware. `updateFarmware("take-photo")`
     */
    updateFarmware: (pkg: string) => Promise<{}>;
    /** Uninstall a Farmware plugin. */
    removeFarmware: (pkg: string) => Promise<{}>;
    /**
     * Installs "Farmware" (plugins) authored by FarmBot, Inc.
     * onto the bot's SD card.
     */
    installFirstPartyFarmware: () => Promise<{}>;
    /**
     * Deactivate FarmBot OS completely (shutdown).
     * Useful before unplugging the power.
     */
    powerOff: () => Promise<{}>;
    /** Restart FarmBot OS. */
    reboot: () => Promise<{}>;
    /** Reinitialize the FarmBot microcontroller firmware. */
    rebootFirmware: () => Promise<{}>;
    /** Check for new versions of FarmBot OS. Downloads and installs if available. */
    checkUpdates: () => Promise<{}>;
    /** THIS WILL RESET THE SD CARD, deleting all non-factory data! Be careful!! */
    resetOS: () => void;
    /** WARNING: will reset all firmware (hardware) settings! */
    resetMCU: () => Promise<{}>;
    /**
     * Lock the bot from moving (E-STOP). Turns off peripherals and motors.
     * This also will pause running regimens and cause any running sequences to exit.
     */
    emergencyLock: () => Promise<{}>;
    /** Unlock the bot when the user says it is safe. */
    emergencyUnlock: () => Promise<{}>;
    /** Execute a sequence by its ID on the FarmBot API. */
    execSequence: (sequence_id: number, body?: Corpus.VariableDeclaration[]) => Promise<{}>;
    /** Run an installed Farmware plugin on the SD Card. */
    execScript: (label: string, envVars?: Corpus.Pair[] | undefined) => Promise<{}>;
    /** Bring a particular axis (or all of them) to position 0 in Z Y X order. */
    home: (args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }) => Promise<{}>;
    /** Use end stops or encoders to figure out where 0,0,0 is in Z Y X axis order.
     *  WON'T WORK WITHOUT ENCODERS OR END STOPS!
     * A blockage or stall during this command will set that position as zero.
     * Use carefully. */
    findHome: (args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }) => Promise<{}>;
    /** Move FarmBot to an absolute point. */
    moveAbsolute: (args: {
        x: number;
        y: number;
        z: number;
        speed?: number | undefined;
    }) => Promise<{}>;
    /** Move FarmBot to position relative to its current position. */
    moveRelative: (args: {
        x: number;
        y: number;
        z: number;
        speed?: number | undefined;
    }) => Promise<{}>;
    /** Set a GPIO pin to a particular value. */
    writePin: (args: {
        pin_number: number | Corpus.NamedPin;
        pin_value: number;
        pin_mode: number;
    }) => Promise<{}>;
    /** Read the value of a GPIO pin. Will create a SensorReading if it's a sensor. */
    readPin: (args: {
        pin_number: number | Corpus.NamedPin;
        label: string;
        pin_mode: number;
    }) => Promise<{}>;
    /** Reverse the value of a digital pin. */
    togglePin: (args: {
        pin_number: number;
    }) => Promise<{}>;
    /** Read the status of the bot. Should not be needed unless you are first
     * logging in to the device, since the device pushes new states out on
     * every update. */
    readStatus: (args?: {}) => Promise<{}>;
    /** Snap a photo and send to the API for post processing. */
    takePhoto: (args?: {}) => Promise<{}>;
    /** Download/apply all of the latest FarmBot API JSON resources (plants,
     * account info, etc.) to the device. */
    sync: (args?: {}) => Promise<{}>;
    /**
     * Set the current position of the given axis to 0.
     * Example: Sending `bot.setZero("x")` at x: 255 will translate position
     * 255 to 0, causing that position to be x: 0.
     */
    setZero: (axis: Corpus.ALLOWED_AXIS) => Promise<{}>;
    /** Update FarmBot microcontroller settings. */
    updateMcu: (update: Partial<Partial<Record<import("./interfaces").McuParamName, number | undefined>>>) => Promise<{}>;
    /**
     * Set user ENV vars (usually used by 3rd-party Farmware plugins).
     * Set value to `undefined` to unset.
     */
    setUserEnv: (configs: Dictionary<string | undefined>) => Promise<{}>;
    /** Control servos on pins 4 and 5. */
    setServoAngle: (args: {
        pin_number: number;
        pin_value: number;
    }) => Promise<{}>;
    /** Update a config option (setting) for FarmBot OS. */
    updateConfig: (update: Partial<Partial<import("./interfaces").FullConfiguration>>) => Promise<{}>;
    /**
     * Find the axis extents using encoder, motor, or end-stop feedback.
     * Will set a new home position and a new axis length for the given axis.
     */
    calibrate: (args: {
        axis: Corpus.ALLOWED_AXIS;
    }) => Promise<{}>;
    /** Tell the bot to send diagnostic info to the API.*/
    dumpInfo: () => Promise<{}>;
    /**
     * Retrieves all of the event handlers for a particular event.
     * Returns an empty array if the event did not exist.
     */
    event: (name: string) => Function[];
    on: (event: string, callback: Function) => number;
    emit: (event: string, data: {}) => void;
    /** Dictionary of all relevant MQTT channels the bot uses. */
    readonly channel: {
        /** From the browser, usually. */
        toDevice: string;
        /** From farmbot */
        toClient: string;
        status: string;
        logs: string;
        sync: string;
        fromAPI: string;
    };
    /** Low-level means of sending MQTT packets. Does not check format. Does not
     * acknowledge confirmation. Probably not the one you want. */
    publish: (msg: Corpus.RpcRequest, important?: boolean) => void;
    /** Low-level means of sending MQTT RPC commands to the bot. Acknowledges
     * receipt of message, but does not check formatting. Consider using higher
     * level methods like .moveRelative(), .calibrate(), etc....
    */
    send: (input: Corpus.RpcRequest) => Promise<{}>;
    /** Main entry point for all MQTT packets. */
    private _onmessage;
    /** Bootstrap the device onto the MQTT broker. */
    connect: () => Promise<{}>;
}
