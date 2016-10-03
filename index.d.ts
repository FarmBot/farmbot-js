import * as FB from "./interfaces";
import * as JSONRPC from "./jsonrpc";
import * as BotCommand from "./bot_commands";
export declare class Farmbot {
    static VERSION: string;
    static defaults: {
        speed: number;
        timeout: number;
    };
    private _events;
    private _state;
    client: FB.MqttClient;
    constructor(input: FB.ConstructorParams);
    _decodeThatToken(): void;
    getState(): FB.StateTree;
    setState(key: string, val: string | number | boolean): string | number | boolean;
    emergencyStop(): any;
    execSequence(sequence: FB.Sequence): any;
    homeAll(i: BotCommand.Params.Speed): any;
    homeX(i: BotCommand.Params.Speed): any;
    homeY(i: BotCommand.Params.Speed): any;
    homeZ(i: BotCommand.Params.Speed): any;
    moveAbsolute(i: BotCommand.MovementRequest): any;
    moveRelative(i: BotCommand.MovementRequest): any;
    writePin(i: BotCommand.WritePinParams): any;
    readStatus(): any;
    syncSequence(): any;
    updateCalibration(i: BotCommand.Params.UpdateCalibration): any;
    event(name: string): Function[];
    on(event: string, callback: Function): void;
    emit(event: string, data: any): void;
    readonly channel: string;
    publish(msg: JSONRPC.Request<any> | JSONRPC.Notification<any>): void;
    send<T extends Array<any>>(input: BotCommand.Request<T>): any;
    _onmessage(_: string, buffer: Uint8Array): void;
    connect(): any;
}
