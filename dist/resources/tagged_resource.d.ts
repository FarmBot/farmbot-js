import { Crop, DeviceAccountSettings, FarmwareEnv, FarmEvent, FarmwareInstallation, GenericPointer, Image, Log, Peripheral, PinBinding, PlantPointer, PlantTemplate, Regimen, SavedGarden, Sensor, SensorReading, SequenceResource, Tool, ToolSlotPointer, User, WebcamFeed } from "./api_resources";
import { FbosConfig } from "./configs/fbos";
import { FirmwareConfig } from "./configs/firmware";
import { WebAppConfig } from "./configs/web_app";
export declare type ResourceName = "Crop" | "Device" | "FarmwareEnv" | "DiagnosticDump" | "FarmEvent" | "FarmwareInstallation" | "FbosConfig" | "FirmwareConfig" | "Image" | "Log" | "Peripheral" | "PinBinding" | "Plant" | "PlantTemplate" | "Point" | "Regimen" | "SavedGarden" | "Sensor" | "SensorReading" | "Sequence" | "Tool" | "User" | "WebAppConfig" | "WebcamFeed";
export interface TaggedResourceBase {
    kind: ResourceName;
    /** Unique identifier and index key.
     * We can't use the object's `id` attribute as a local index key because
     * unsaved objects don't have one.
     */
    uuid: string;
    body: object;
    /** Indicates if the resource is saved, saving or dirty.
     * `undefined` denotes that the resource is saved. */
    specialStatus: SpecialStatus;
}
/** Denotes special status of resource */
export declare enum SpecialStatus {
    /** The local copy is different than the one on the remote end. */
    DIRTY = "DIRTY",
    /** The local copy is being saved on the remote end right now? */
    SAVING = "SAVING",
    /** API and FE are in sync. Using "" for now because its falsey like old
     * `undefined` value */
    SAVED = ""
}
export interface Resource<T extends ResourceName, U extends object> extends TaggedResourceBase {
    kind: T;
    body: U;
}
export declare type TaggedResource = TaggedCrop | TaggedDevice | TaggedDiagnosticDump | TaggedFarmEvent | TaggedFarmwareEnv | TaggedFarmwareInstallation | TaggedFbosConfig | TaggedFirmwareConfig | TaggedImage | TaggedLog | TaggedPeripheral | TaggedPinBinding | TaggedPlantTemplate | TaggedPoint | TaggedRegimen | TaggedSavedGarden | TaggedSensor | TaggedSensorReading | TaggedSequence | TaggedTool | TaggedUser | TaggedWebAppConfig | TaggedWebcamFeed;
export declare type TaggedCrop = Resource<"Crop", Crop>;
export declare type TaggedFarmwareEnv = Resource<"FarmwareEnv", FarmwareEnv>;
export declare type TaggedFbosConfig = Resource<"FbosConfig", FbosConfig>;
export declare type TaggedFirmwareConfig = Resource<"FirmwareConfig", FirmwareConfig>;
export declare type TaggedWebAppConfig = Resource<"WebAppConfig", WebAppConfig>;
export declare type TaggedUser = Resource<"User", User>;
export declare type TaggedDevice = Resource<"Device", DeviceAccountSettings>;
export declare type TaggedPinBinding = Resource<"PinBinding", PinBinding>;
export declare type TaggedRegimen = Resource<"Regimen", Regimen>;
export declare type TaggedTool = Resource<"Tool", Tool>;
export declare type TaggedSequence = Resource<"Sequence", SequenceResource>;
export declare type TaggedFarmEvent = Resource<"FarmEvent", FarmEvent>;
export declare type TaggedImage = Resource<"Image", Image>;
export declare type TaggedLog = Resource<"Log", Log>;
export declare type TaggedPeripheral = Resource<"Peripheral", Peripheral>;
export declare type TaggedSensorReading = Resource<"SensorReading", SensorReading>;
export declare type TaggedSensor = Resource<"Sensor", Sensor>;
export declare type TaggedSavedGarden = Resource<"SavedGarden", SavedGarden>;
export declare type TaggedPlantTemplate = Resource<"PlantTemplate", PlantTemplate>;
export declare type TaggedDiagnosticDump = Resource<"DiagnosticDump", DiagnosticDump>;
declare type PointUnion = GenericPointer | PlantPointer | ToolSlotPointer;
export declare type TaggedGenericPointer = Resource<"Point", GenericPointer>;
export declare type TaggedPlantPointer = Resource<"Point", PlantPointer>;
export declare type TaggedToolSlotPointer = Resource<"Point", ToolSlotPointer>;
export declare type TaggedPoint = Resource<"Point", PointUnion>;
export declare type TaggedWebcamFeed = Resource<"WebcamFeed", WebcamFeed>;
export declare type TaggedFarmwareInstallation = Resource<"FarmwareInstallation", FarmwareInstallation>;
export interface DiagnosticDump {
    id: number;
    device_id: number;
    ticket_identifier: string;
    fbos_commit: string;
    fbos_version: string;
    firmware_commit: string;
    firmware_state: string;
    network_interface: string;
    fbos_dmesg_dump: string;
    created_at: string;
    updated_at: string;
}
export declare type PointerType = TaggedToolSlotPointer | TaggedGenericPointer | TaggedPlantPointer;
export {};
