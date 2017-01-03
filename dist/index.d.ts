import * as FB from "./interfaces";
import * as Corpus from "./corpus";
import { McuParams, Configuration, Partial } from "./interfaces";
export declare class Farmbot {
    static VERSION: string;
    static defaults: {
        speed: number;
        timeout: number;
    };
    /** Storage area for all event handlers */
    private _events;
    private _state;
    client: FB.MqttClient;
    constructor(input: FB.ConstructorParams);
    _decodeThatToken(): void;
    getState(): FB.StateTree;
    setState(key: string, val: string | number | boolean): string | number | boolean;
    powerOff(): FB.Thenable<{}>;
    reboot(): FB.Thenable<{}>;
    checkUpdates(): FB.Thenable<{}>;
    checkArduinoUpdates(): FB.Thenable<{}>;
    /** Lock the bot from moving. This also will pause running regimens and cause
     *  any running sequences to exit
     */
    emergencyLock(): FB.Thenable<{}>;
    /** Unlock the bot when the user says it is safe. */
    emergencyUnlock(): FB.Thenable<{}>;
    execSequence(sub_sequence_id: number): FB.Thenable<{}>;
    home(args: {
        speed: number;
        axis: Corpus.ALLOWED_AXIS;
    }): FB.Thenable<{}>;
    moveAbsolute(args: {
        x: number;
        y: number;
        z: number;
        speed?: number;
    }): FB.Thenable<{}>;
    moveRelative(args: {
        x: number;
        y: number;
        z: number;
        speed?: number;
    }): FB.Thenable<{}>;
    writePin(args: {
        pin_number: number;
        pin_value: number;
        pin_mode: number;
    }): FB.Thenable<{}>;
    togglePin(args: {
        pin_number: number;
    }): FB.Thenable<{}>;
    readStatus(args?: {}): FB.Thenable<{}>;
    sync(args?: {}): FB.Thenable<{}>;
    /** Update the arduino settings */
    updateMcu(update: Partial<McuParams>): FB.Thenable<{}>;
    /** Update a config */
    updateConfig(update: Partial<Configuration>): FB.Thenable<{}>;
    startRegimen(args: {
        regimen_id: number;
    }): FB.Thenable<{}>;
    stopRegimen(args: {
        regimen_id: number;
    }): FB.Thenable<{}>;
    calibrate(args: {
        axis: Corpus.ALLOWED_AXIS;
    }): FB.Thenable<{}>;
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
    send(input: Corpus.RpcRequest): FB.Thenable<{}>;
    /** Main entry point for all MQTT packets. */
    _onmessage(chan: string, buffer: Uint8Array): void;
    connect(): FB.Thenable<Farmbot>;
}
