import * as Corpus from "./corpus";
import { Client as MqttClient } from "mqtt";
import { StateTree, Dictionary, ConstructorParams, McuParams, Configuration } from "./interfaces";
export declare const NULL = "null";
export declare class Farmbot {
    static VERSION: string;
    static defaults: {
        speed: number;
        timeout: number;
        secure: boolean;
    };
    /** Storage area for all event handlers */
    private _events;
    private _state;
    client: MqttClient | undefined;
    constructor(input: ConstructorParams);
    private _decodeThatToken;
    /** Returns a READ ONLY copy of the local configuration. */
    getState(): StateTree;
    /** Write a configuration value for local use.
     * Eg: setState("timeout", 999)
     */
    setState(key: string, val: string | number | boolean): string | number | boolean;
    /** Installs a "Farmware" (plugin) onto the bot's SD card.
     * URL must point to a valid Farmware manifest JSON document.
     */
    installFarmware(url: string): Promise<{}>;
    /** Checks for updates on a particular Farmware plugin when given the name of
     * a farmware. `updateFarmware("take-photo")`
     */
    updateFarmware(pkg: string): Promise<{}>;
    /** Uninstall a Farmware plugin. */
    removeFarmware(pkg: string): Promise<{}>;
    /** Deactivate FarmBot OS completely. */
    powerOff(): Promise<{}>;
    /** Cycle device power. */
    reboot(): Promise<{}>;
    /** Check for new versions of FarmBot OS. */
    checkUpdates(): Promise<{}>;
    /** THIS WILL RESET THE SD CARD! Be careful!! */
    resetOS(): void;
    resetMCU(): Promise<{}>;
    /** Lock the bot from moving. This also will pause running regimens and cause
     *  any running sequences to exit */
    emergencyLock(): Promise<{}>;
    /** Unlock the bot when the user says it is safe. Currently experiencing
     * issues. Consider reboot() instead. */
    emergencyUnlock(): Promise<{}>;
    /** Execute a sequence by its ID on the API. */
    execSequence(sequence_id: number): Promise<{}>;
    /** Run a preloaded Farmware / script on the SD Card. */
    execScript(/** Filename of the script */ label: string, 
        /** Optional ENV vars to pass the script */
        envVars?: Corpus.Pair[] | undefined): Promise<{}>;
    /** Bring a particular axis (or all of them) to position 0. */
    home(args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }): Promise<{}>;
    /** Use end stops or encoders to figure out where 0,0,0 is.
     *  WON'T WORK WITHOUT ENCODERS OR ENDSTOPS! */
    findHome(args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }): Promise<{}>;
    /** Move gantry to an absolute point. */
    moveAbsolute(args: {
        x: number;
        y: number;
        z: number;
        speed?: number;
    }): Promise<{}>;
    /** Move gantry to position relative to its current position. */
    moveRelative(args: {
        x: number;
        y: number;
        z: number;
        speed?: number;
    }): Promise<{}>;
    /** Set a GPIO pin to a particular value. */
    writePin(args: {
        pin_number: number;
        pin_value: number;
        pin_mode: number;
    }): Promise<{}>;
    /** Reverse the value of a digital pin. */
    togglePin(args: {
        pin_number: number;
    }): Promise<{}>;
    /** Read the status of the bot. Should not be needed unless you are first
     * logging in to the device, since the device pushes new states out on
     * every update. */
    readStatus(args?: {}): Promise<{}>;
    /** Snap a photo and send to the API for post processing. */
    takePhoto(args?: {}): Promise<{}>;
    /** Download all of the latest JSON resources (plants, account info...)
     * from the FarmBot API. */
    sync(args?: {}): Promise<{}>;
    /** Set the position of the given axis to 0 at the current position of said
     * axis. Example: Sending bot.setZero("x") at x: 255 will translate position
     * 255 to 0. */
    setZero(axis: Corpus.ALLOWED_AXIS): Promise<{}>;
    /** Update the Arduino settings */
    updateMcu(update: Partial<McuParams>): Promise<{}>;
    /** Set user ENV vars (usually used by 3rd party Farmware scripts).
     * Set value to `undefined` to unset. */
    setUserEnv(configs: Dictionary<(string | undefined)>): Promise<{}>;
    /** Update a config option for FarmBot OS. */
    updateConfig(update: Partial<Configuration>): Promise<{}>;
    calibrate(args: {
        axis: Corpus.ALLOWED_AXIS;
    }): Promise<{}>;
    /** Let the bot know that some resources it has in cache are no longer valid.
     *
     * Hopefully, some day we will not need this. Ideally, sending this message
     * would be handled by the API, but currently the API is REST only and does
     * not support push state messaging.
     */
    dataUpdate(value: Corpus.DataChangeType, input: Partial<Record<Corpus.ResourceName, string>>): void;
    /** Retrieves all of the event handlers for a particular event.
     * Returns an empty array if the event did not exist.
      */
    event(name: string): Function[];
    on(event: string, callback: Function): void;
    emit(event: string, data: any): void;
    /** Dictionary of all relevant MQTT channels the bot uses. */
    readonly channel: {
        toDevice: string;
        toClient: string;
        status: string;
        logs: string;
    };
    /** Low level means of sending MQTT packets. Does not check format. Does not
     * acknowledge confirmation. Probably not the one you want. */
    publish(msg: Corpus.RpcRequest, important?: boolean): void;
    /** Low level means of sending MQTT RPC commands to the bot. Acknowledges
     * receipt of message, but does not check formatting. Consider using higher
     * level methods like .moveRelative(), .calibrate(), etc....
    */
    send: (input: Corpus.RpcRequest) => Promise<{}>;
    /** Main entry point for all MQTT packets. */
    private _onmessage(chan, buffer);
    /** Bootstrap the device onto the MQTT broker. */
    connect: () => Promise<{}>;
}
