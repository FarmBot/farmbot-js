import {
  Curve,
  Crop,
  DeviceAccountSettings,
  FarmEvent,
  FarmwareEnv,
  FarmwareInstallation,
  Folder,
  GenericPointer,
  Image,
  Log,
  Peripheral,
  PinBinding,
  PlantPointer,
  PlantTemplate,
  PointGroup,
  Regimen,
  SavedGarden,
  Sensor,
  SensorReading,
  SequenceResource,
  Telemetry,
  Tool,
  ToolSlotPointer,
  User,
  WebcamFeed,
  WeedPointer,
  WizardStepResult,
} from "./api_resources";
import { FbosConfig } from "./configs/fbos";
import { FirmwareConfig } from "./configs/firmware";
import { WebAppConfig } from "./configs/web_app";
import { Alert } from "../interfaces";

export type ResourceName =
  | "Alert"
  | "Crop"
  | "Curve"
  | "Device"
  | "FarmEvent"
  | "FarmwareEnv"
  | "FarmwareInstallation"
  | "FbosConfig"
  | "FirmwareConfig"
  | "Folder"
  | "Image"
  | "Log"
  | "Peripheral"
  | "PinBinding"
  | "Plant"
  | "PlantTemplate"
  | "Point"
  | "PointGroup"
  | "Regimen"
  | "SavedGarden"
  | "Sensor"
  | "SensorReading"
  | "Sequence"
  | "Telemetry"
  | "Tool"
  | "User"
  | "WebAppConfig"
  | "WizardStepResult"
  | "WebcamFeed";

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
export enum SpecialStatus {
  /** The local copy is different than the one on the remote end. */
  DIRTY = "DIRTY",
  /** The local copy is being saved on the remote end right now? */
  SAVING = "SAVING",
  /** API and FE are in sync. Using "" for now because its falsey like old
   * `undefined` value */
  SAVED = ""
}

export interface RestResource<T extends ResourceName, U extends object>
  extends TaggedResourceBase {
  kind: T;
  body: U;
}

export type TaggedResource =
  | TaggedAlert
  | TaggedCrop
  | TaggedCurve
  | TaggedDevice
  | TaggedFarmEvent
  | TaggedFarmwareEnv
  | TaggedFarmwareInstallation
  | TaggedFbosConfig
  | TaggedFirmwareConfig
  | TaggedFolder
  | TaggedImage
  | TaggedLog
  | TaggedPeripheral
  | TaggedPinBinding
  | TaggedPlantTemplate
  | TaggedPoint
  | TaggedPointGroup
  | TaggedRegimen
  | TaggedSavedGarden
  | TaggedSensor
  | TaggedSensorReading
  | TaggedSequence
  | TaggedTelemetry
  | TaggedTool
  | TaggedUser
  | TaggedWebAppConfig
  | TaggedWizardStepResult
  | TaggedWebcamFeed;

type PointUnion =
  | GenericPointer
  | PlantPointer
  | ToolSlotPointer
  | WeedPointer;

export type TaggedAlert = RestResource<"Alert", Alert>;
export type TaggedCrop = RestResource<"Crop", Crop>;
export type TaggedCurve = RestResource<"Curve", Curve>;
export type TaggedDevice = RestResource<"Device", DeviceAccountSettings>;
export type TaggedFolder = RestResource<"Folder", Folder>;
export type TaggedFarmEvent = RestResource<"FarmEvent", FarmEvent>;
export type TaggedFarmwareEnv = RestResource<"FarmwareEnv", FarmwareEnv>;
export type TaggedFarmwareInstallation = RestResource<"FarmwareInstallation", FarmwareInstallation>;
export type TaggedFbosConfig = RestResource<"FbosConfig", FbosConfig>;
export type TaggedFirmwareConfig = RestResource<"FirmwareConfig", FirmwareConfig>;
export type TaggedGenericPointer = RestResource<"Point", GenericPointer>;
export type TaggedImage = RestResource<"Image", Image>;
export type TaggedLog = RestResource<"Log", Log>;
export type TaggedPeripheral = RestResource<"Peripheral", Peripheral>;
export type TaggedPinBinding = RestResource<"PinBinding", PinBinding>;
export type TaggedPlantPointer = RestResource<"Point", PlantPointer>;
export type TaggedPlantTemplate = RestResource<"PlantTemplate", PlantTemplate>;
export type TaggedPoint = RestResource<"Point", PointUnion>;
export type TaggedPointGroup = RestResource<"PointGroup", PointGroup>;
export type TaggedRegimen = RestResource<"Regimen", Regimen>;
export type TaggedSavedGarden = RestResource<"SavedGarden", SavedGarden>;
export type TaggedSensor = RestResource<"Sensor", Sensor>;
export type TaggedSensorReading = RestResource<"SensorReading", SensorReading>;
export type TaggedSequence = RestResource<"Sequence", SequenceResource>;
export type TaggedTelemetry = RestResource<"Telemetry", Telemetry>;
export type TaggedTool = RestResource<"Tool", Tool>;
export type TaggedToolSlotPointer = RestResource<"Point", ToolSlotPointer>;
export type TaggedUser = RestResource<"User", User>;
export type TaggedWebAppConfig = RestResource<"WebAppConfig", WebAppConfig>;
export type TaggedWebcamFeed = RestResource<"WebcamFeed", WebcamFeed>;
export type TaggedWizardStepResult = RestResource<"WizardStepResult", WizardStepResult>;
export type TaggedWeedPointer = RestResource<"Point", WeedPointer>;

export type PointerType =
  | TaggedToolSlotPointer
  | TaggedGenericPointer
  | TaggedPlantPointer
  | TaggedWeedPointer;
