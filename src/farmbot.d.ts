/// <reference path="../typings/main.d.ts" />
import { FB } from "./interfaces/interfaces";
export declare class Farmbot {
    private _events;
    private _state;
    client: MqttClient;
    constructor(input: FB.ConstructorParams);
    _decodeThatToken(): void;
    getState(key?: string): any;
    setState(key: string, val: string | number | boolean): string | number | boolean;
    emergencyStop(): Promise<{}>;
    execSequence(sequence: FB.Sequence): Promise<{}>;
    homeAll(opts: FB.CommandOptions): Promise<{}>;
    homeX(opts: FB.CommandOptions): Promise<{}>;
    homeY(opts: FB.CommandOptions): Promise<{}>;
    homeZ(opts: FB.CommandOptions): Promise<{}>;
    moveAbsolute(opts: FB.CommandOptions): Promise<{}>;
    moveRelative(opts: FB.CommandOptions): Promise<{}>;
    pinWrite(opts: FB.CommandOptions): Promise<{}>;
    readStatus(): Promise<{}>;
    syncSequence(): Promise<{}>;
    updateCalibration(params: FB.CalibrationParams): Promise<{}>;
    static config: {
        requiredOptions: string[];
        defaultOptions: {
            speed: number;
            timeout: number;
        };
    };
    event(name: string): Function[];
    on(event: string, callback: Function): void;
    emit(event: string, data: any): void;
    /** Validates RPCPayloads. Also adds optional fields if missing. */
    buildMessage(input: FB.RPCPayload): FB.RPCMessage;
    channel(name: string): string;
    send(input: FB.RPCPayload): Promise<{}>;
    _onmessage(channel: string, buffer: Uint8Array): void;
    connect(): Promise<{}>;
    static defer(label: string): Promise<{}>;
    static timerDefer(timeout: Number, label: string): Promise<{}>;
    static extend(target: any, mixins: any[]): any;
    static requireKeys(input: any, required: string[]): void;
    static uuid(): string;
    static VERSION: string;
}
