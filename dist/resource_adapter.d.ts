import { Dictionary, Farmbot } from ".";
export declare enum ResourceName {
    FarmEvent = "FarmEvent",
    FarmwareInstallations = "FarmwareInstallation",
    Image = "Image",
    Log = "Log",
    Peripheral = "Peripheral",
    PinBinding = "PinBinding",
    PlantTemplate = "PlantTemplate",
    Point = "Point",
    Regimen = "Regimen",
    SavedGarden = "SavedGarden",
    Sensor = "Sensor",
    SensorReading = "SensorReading",
    Sequence = "Sequence",
    Tool = "Tool",
    WebcamFeed = "WebcamFeed"
}
export interface BatchDestroyRequest {
    name: ResourceName;
    id: number;
}
export declare class ResourceAdapter {
    parent: Farmbot;
    username: string;
    cache: Dictionary<Promise<void>>;
    constructor(parent: Farmbot, username: string);
    private outboundChanFor;
    private inboundChannelFor;
    destroy: (req: BatchDestroyRequest) => Promise<void>;
}
