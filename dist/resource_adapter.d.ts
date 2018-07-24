import { Farmbot, RpcError, RpcOk } from ".";
export declare type ResourceName = "FarmEvent" | "FarmwareInstallation" | "Image" | "Log" | "Peripheral" | "PinBinding" | "PlantTemplate" | "Point" | "Regimen" | "SavedGarden" | "Sensor" | "SensorReading" | "Sequence" | "Tool" | "WebcamFeed";
export interface BatchDestroyRequest {
    name: ResourceName;
    id: number;
}
declare type Response = RpcOk | RpcError;
export declare class ResourceAdapter {
    parent: Farmbot;
    username: string;
    constructor(parent: Farmbot, username: string);
    private outboundChanFor;
    destroy: (req: BatchDestroyRequest) => Promise<Response>;
    destroyAll: (req: BatchDestroyRequest[]) => Promise<Response[]>;
}
export {};
