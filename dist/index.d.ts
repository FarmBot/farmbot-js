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
    powerOff(): FB.Thenable<{}>;
    reboot(): FB.Thenable<{}>;
    checkUpdates(): FB.Thenable<{}>;
    checkArduinoUpdates(): FB.Thenable<{}>;
    emergencyStop(): FB.Thenable<{}>;
    execSequence(sequence: FB.Sequence): FB.Thenable<{}>;
    homeAll(i: BotCommand.Params.Speed): FB.Thenable<{}>;
    homeX(i: BotCommand.Params.Speed): FB.Thenable<{}>;
    homeY(i: BotCommand.Params.Speed): FB.Thenable<{}>;
    homeZ(i: BotCommand.Params.Speed): FB.Thenable<{}>;
    moveAbsolute(i: BotCommand.MovementRequest): FB.Thenable<{}>;
    moveRelative(i: BotCommand.MovementRequest): FB.Thenable<{}>;
    writePin(i: BotCommand.WritePinParams): FB.Thenable<{}>;
    togglePin(i: BotCommand.TogglePinParams): FB.Thenable<{}>;
    readStatus(): FB.Thenable<{}>;
    sync(): FB.Thenable<{}>;
    /** Update the arduino settings */
    updateMcu(i: BotCommand.Params.McuConfigUpdate): FB.Thenable<{}>;
    /** Update a config */
    updateConfig(i: BotCommand.Params.BotConfigUpdate): FB.Thenable<{}>;
    startRegimen(id: number): FB.Thenable<{}>;
    stopRegimen(id: number): FB.Thenable<{}>;
    event(name: string): Function[];
    on(event: string, callback: Function): void;
    emit(event: string, data: any): void;
    readonly channel: {
        toDevice: string;
        toClient: string;
    };
    publish(msg: JSONRPC.Request<any> | JSONRPC.Notification<any>): void;
    send<T extends Array<any>>(input: BotCommand.Request<T>): FB.Thenable<{}>;
    _onmessage(_: string, buffer: Uint8Array): void;
    connect(): FB.Thenable<Farmbot>;
}
