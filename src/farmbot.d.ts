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
    emergencyStop(): FB.Thenable<{}>;
    execSequence(sequence: FB.Sequence): FB.Thenable<{}>;
    homeAll(opts: FB.CommandOptions): FB.Thenable<{}>;
    homeX(opts: FB.CommandOptions): FB.Thenable<{}>;
    homeY(opts: FB.CommandOptions): FB.Thenable<{}>;
    homeZ(opts: FB.CommandOptions): FB.Thenable<{}>;
    moveAbsolute(opts: FB.CommandOptions): FB.Thenable<{}>;
    moveRelative(opts: FB.CommandOptions): FB.Thenable<{}>;
    pinWrite(opts: FB.CommandOptions): FB.Thenable<{}>;
    readStatus(): FB.Thenable<{}>;
    syncSequence(): FB.Thenable<{}>;
    updateCalibration(params: FB.CalibrationParams): FB.Thenable<{}>;
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
    send(input: FB.RPCPayload): FB.Thenable<{}>;
    _onmessage(channel: string, buffer: Uint8Array): void;
    connect(): FB.Thenable<Farmbot>;
    static timerDefer<T>(timeout: Number, label?: string): FBPromise<T>;
    static extend(target: any, mixins: any[]): any;
    static requireKeys(input: any, required: string[]): void;
    static uuid(): string;
    static VERSION: string;
}
