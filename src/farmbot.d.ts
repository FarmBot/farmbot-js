/// <reference path="fbpromise.d.ts" />
/// <reference path="mqttjs.d.ts" />
/// <reference path="../typings/main.d.ts" />
export declare class Farmbot {
    private _events;
    private _state;
    client: MqttClient;
    constructor(input: any);
    _decodeThatToken(): void;
    getState(key?: any): any;
    setState(key: any, val: any): any;
    emergencyStop(): Promise<{}>;
    execSequence(sequence: any): Promise<{}>;
    homeAll(opts: any): Promise<{}>;
    homeX(opts: any): Promise<{}>;
    homeY(opts: any): Promise<{}>;
    homeZ(opts: any): Promise<{}>;
    moveAbsolute(opts: any): Promise<{}>;
    moveRelative(opts: any): Promise<{}>;
    pinWrite(opts: any): Promise<{}>;
    readStatus(): Promise<{}>;
    syncSequence(): Promise<{}>;
    updateCalibration(params: any): Promise<{}>;
    static config: {
        requiredOptions: string[];
        defaultOptions: {
            speed: number;
            timeout: number;
        };
    };
    event(name: any): any;
    on(event: any, callback: any): void;
    emit(event: any, data: any): void;
    buildMessage(input: any): any;
    channel(name: String): string;
    send(input: any): Promise<{}>;
    _onmessage(channel: String, buffer: Uint8Array, message: any): void;
    connect(callback: any): Promise<{}>;
    static defer(label: any): Promise<{}>;
    static timerDefer(timeout: Number, label: String): Promise<{}>;
    static extend(target: any, mixins: any): any;
    static requireKeys(input: any, required: any): void;
    static uuid(): string;
    static MeshErrorResponse(input: any): {
        error: {
            method: string;
            error: any;
        };
    };
}
