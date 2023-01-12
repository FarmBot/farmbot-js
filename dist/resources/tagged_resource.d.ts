import { Curve, Crop, DeviceAccountSettings, FarmEvent, FarmwareEnv, FarmwareInstallation, Folder, GenericPointer, Image, Log, Peripheral, PinBinding, PlantPointer, PlantTemplate, PointGroup, Regimen, SavedGarden, Sensor, SensorReading, SequenceResource, Telemetry, Tool, ToolSlotPointer, User, WebcamFeed, WeedPointer, WizardStepResult } from "./api_resources";
import { FbosConfig } from "./configs/fbos";
import { FirmwareConfig } from "./configs/firmware";
import { WebAppConfig } from "./configs/web_app";
import { Alert } from "../interfaces";
export declare type ResourceName = "Alert" | "Crop" | "Curve" | "Device" | "FarmEvent" | "FarmwareEnv" | "FarmwareInstallation" | "FbosConfig" | "FirmwareConfig" | "Folder" | "Image" | "Log" | "Peripheral" | "PinBinding" | "Plant" | "PlantTemplate" | "Point" | "PointGroup" | "Regimen" | "SavedGarden" | "Sensor" | "SensorReading" | "Sequence" | "Telemetry" | "Tool" | "User" | "WebAppConfig" | "WizardStepResult" | "WebcamFeed";
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
export interface RestResource<T extends ResourceName, U extends object> extends TaggedResourceBase {
    kind: T;
    body: U;
}
export declare type TaggedResource = TaggedAlert | TaggedCrop | TaggedCurve | TaggedDevice | TaggedFarmEvent | TaggedFarmwareEnv | TaggedFarmwareInstallation | TaggedFbosConfig | TaggedFirmwareConfig | TaggedFolder | TaggedImage | TaggedLog | TaggedPeripheral | TaggedPinBinding | TaggedPlantTemplate | TaggedPoint | TaggedPointGroup | TaggedRegimen | TaggedSavedGarden | TaggedSensor | TaggedSensorReading | TaggedSequence | TaggedTelemetry | TaggedTool | TaggedUser | TaggedWebAppConfig | TaggedWizardStepResult | TaggedWebcamFeed;
declare type PointUnion = GenericPointer | PlantPointer | ToolSlotPointer | WeedPointer;
export declare type TaggedAlert = RestResource<"Alert", Alert>;
export declare type TaggedCrop = RestResource<"Crop", Crop>;
export declare type TaggedCurve = RestResource<"Curve", Curve>;
export declare type TaggedDevice = RestResource<"Device", DeviceAccountSettings>;
export declare type TaggedFolder = RestResource<"Folder", Folder>;
export declare type TaggedFarmEvent = RestResource<"FarmEvent", FarmEvent>;
export declare type TaggedFarmwareEnv = RestResource<"FarmwareEnv", FarmwareEnv>;
export declare type TaggedFarmwareInstallation = RestResource<"FarmwareInstallation", FarmwareInstallation>;
export declare type TaggedFbosConfig = RestResource<"FbosConfig", FbosConfig>;
export declare type TaggedFirmwareConfig = RestResource<"FirmwareConfig", FirmwareConfig>;
export declare type TaggedGenericPointer = RestResource<"Point", GenericPointer>;
export declare type TaggedImage = RestResource<"Image", Image>;
export declare type TaggedLog = RestResource<"Log", Log>;
export declare type TaggedPeripheral = RestResource<"Peripheral", Peripheral>;
export declare type TaggedPinBinding = RestResource<"PinBinding", PinBinding>;
export declare type TaggedPlantPointer = RestResource<"Point", PlantPointer>;
export declare type TaggedPlantTemplate = RestResource<"PlantTemplate", PlantTemplate>;
export declare type TaggedPoint = RestResource<"Point", PointUnion>;
export declare type TaggedPointGroup = RestResource<"PointGroup", PointGroup>;
export declare type TaggedRegimen = RestResource<"Regimen", Regimen>;
export declare type TaggedSavedGarden = RestResource<"SavedGarden", SavedGarden>;
export declare type TaggedSensor = RestResource<"Sensor", Sensor>;
export declare type TaggedSensorReading = RestResource<"SensorReading", SensorReading>;
export declare type TaggedSequence = RestResource<"Sequence", SequenceResource>;
export declare type TaggedTelemetry = RestResource<"Telemetry", Telemetry>;
export declare type TaggedTool = RestResource<"Tool", Tool>;
export declare type TaggedToolSlotPointer = RestResource<"Point", ToolSlotPointer>;
export declare type TaggedUser = RestResource<"User", User>;
export declare type TaggedWebAppConfig = RestResource<"WebAppConfig", WebAppConfig>;
export declare type TaggedWebcamFeed = RestResource<"WebcamFeed", WebcamFeed>;
export declare type TaggedWizardStepResult = RestResource<"WizardStepResult", WizardStepResult>;
export declare type TaggedWeedPointer = RestResource<"Point", WeedPointer>;
export declare type PointerType = TaggedToolSlotPointer | TaggedGenericPointer | TaggedPlantPointer | TaggedWeedPointer;
export {};
