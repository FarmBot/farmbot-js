import { FB } from "./interfaces/interfaces";
import { FBPromise } from "./fbpromise";
export declare class Farmbot {
    private _events;
    private _state;
    client: FB.MqttClient;
    constructor(input: FB.ConstructorParams);
    _decodeThatToken(): void;
    getState(key?: string): any;
    setState(key: string, val: string | number | boolean): string | number | boolean;
    emergencyStop(): FBPromise<{}>;
    execSequence(sequence: FB.Sequence): FBPromise<{}>;
    homeAll(opts: FB.CommandOptions): FBPromise<{}>;
    homeX(opts: FB.CommandOptions): FBPromise<{}>;
    homeY(opts: FB.CommandOptions): FBPromise<{}>;
    homeZ(opts: FB.CommandOptions): FBPromise<{}>;
    moveAbsolute(opts: FB.CommandOptions): FBPromise<{}>;
    moveRelative(opts: FB.CommandOptions): FBPromise<{}>;
    pinWrite(opts: FB.CommandOptions): FBPromise<{}>;
    readStatus(): FBPromise<{}>;
    syncSequence(): FBPromise<{}>;
    updateCalibration(params: FB.CalibrationParams): FBPromise<{}>;
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
    send(input: FB.RPCPayload): FBPromise<{}>;
    _onmessage(channel: string, buffer: Uint8Array): void;
    connect(): FBPromise<{}>;
    static timerDefer<T>(timeout: Number, label?: string): FBPromise<T>;
    static extend(target: any, mixins: any[]): any;
    static requireKeys(input: any, required: string[]): void;
    static uuid(): string;
    static VERSION: string;
}
