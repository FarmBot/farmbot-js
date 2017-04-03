import * as Corpus from "./corpus";
import { StateTree, MqttClient, Dictionary, ConstructorParams, McuParams, Configuration } from "./interfaces";
export declare const NULL = "null";
export declare class Farmbot {
    static VERSION: string;
    static defaults: {
        speed: number;
        timeout: number;
    };
    /** Storage area for all event handlers */
    private _events;
    private _state;
    client: MqttClient;
    constructor(input: ConstructorParams);
    _decodeThatToken(): void;
    getState(): StateTree;
    setState(key: string, val: string | number | boolean): string | number | boolean;
    installFarmware(url: string): Promise<{}>;
    updateFarmware(pkg: string): Promise<{}>;
    removeFarmware(pkg: string): Promise<{}>;
    powerOff(): Promise<{}>;
    reboot(): Promise<{}>;
    checkUpdates(): Promise<{}>;
    checkArduinoUpdates(): Promise<{}>;
    /** THIS WILL RESET EVERYTHING! Be careful!! */
    factoryReset(): Promise<{}>;
    /** Lock the bot from moving. This also will pause running regimens and cause
     *  any running sequences to exit
     */
    emergencyLock(): Promise<{}>;
    /** Unlock the bot when the user says it is safe. */
    emergencyUnlock(): Promise<{}>;
    execSequence(sequence_id: number): Promise<{}>;
    execScript(/** Filename of the script */ label: string, 
        /** Optional ENV vars to pass the script */
        envVars?: Corpus.Pair[] | undefined): Promise<{}>;
    home(args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }): Promise<{}>;
    moveAbsolute(args: {
        x: number;
        y: number;
        z: number;
        speed?: number;
    }): Promise<{}>;
    moveRelative(args: {
        x: number;
        y: number;
        z: number;
        speed?: number;
    }): Promise<{}>;
    writePin(args: {
        pin_number: number;
        pin_value: number;
        pin_mode: number;
    }): Promise<{}>;
    togglePin(args: {
        pin_number: number;
    }): Promise<{}>;
    readStatus(args?: {}): Promise<{}>;
    takePhoto(args?: {}): Promise<{}>;
    sync(args?: {}): Promise<{}>;
    /** Update the arduino settings */
    updateMcu(update: Partial<McuParams>): Promise<{}>;
    /** Set user ENV vars (usually used by 3rd party scripts).
     * Set value to `undefined` to unset.
     */
    setUserEnv(configs: Dictionary<(string | undefined)>): Promise<{}>;
    /** Update a config */
    updateConfig(update: Partial<Configuration>): Promise<{}>;
    calibrate(args: {
        axis: Corpus.ALLOWED_AXIS;
    }): Promise<{}>;
    /** Lets the bot know that some resources it has in cache are no longer valid.
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
    readonly channel: {
        toDevice: string;
        toClient: string;
        status: string;
        logs: string;
    };
    publish(msg: Corpus.RpcRequest): void;
    send(input: Corpus.RpcRequest): Promise<{}>;
    /** Main entry point for all MQTT packets. */
    _onmessage(chan: string, buffer: Uint8Array): void;
    connect(): Promise<{}>;
}
