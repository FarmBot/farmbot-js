import * as Corpus from "./corpus";
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
    powerOff(): Promise<{}>;
    reboot(): Promise<{}>;
    checkUpdates(): Promise<{}>;
    checkArduinoUpdates(): Promise<{}>;
    /** Lock the bot from moving. This also will pause running regimens and cause
     *  any running sequences to exit
     */
    emergencyLock(): Promise<{}>;
    /** Unlock the bot when the user says it is safe. */
    emergencyUnlock(): Promise<{}>;
    execSequence(sub_sequence_id: number): Promise<{}>;
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
    sync(args?: {}): Promise<{}>;
    /** Update the arduino settings */
    updateMcu(update: Partial<McuParams>): Promise<{}>;
    /** Update a config */
    updateConfig(update: Partial<Configuration>): Promise<{}>;
    startRegimen(args: {
        regimen_id: number;
    }): Promise<{}>;
    stopRegimen(args: {
        regimen_id: number;
    }): Promise<{}>;
    calibrate(args: {
        axis: Corpus.ALLOWED_AXIS;
    }): Promise<{}>;
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
