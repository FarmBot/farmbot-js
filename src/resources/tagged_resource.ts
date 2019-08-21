import {
  Crop,
  DeviceAccountSettings,
  FarmwareEnv,
  FarmEvent,
  FarmwareInstallation,
  GenericPointer,
  Image,
  Log,
  Peripheral,
  PinBinding,
  PlantPointer,
  PlantTemplate,
  Regimen,
  SavedGarden,
  Sensor,
  SensorReading,
  SequenceResource,
  Tool,
  ToolSlotPointer,
  User,
  WebcamFeed,
  PointGroup,
} from "./api_resources";
import { FbosConfig } from "./configs/fbos";
import { FirmwareConfig } from "./configs/firmware";
import { WebAppConfig } from "./configs/web_app";
import { Alert } from "../interfaces";

export type ResourceName =
  | "Alert"
  | "Crop"
  | "Device"
  | "DiagnosticDump"
  | "FarmEvent"
  | "FarmwareEnv"
  | "FarmwareInstallation"
  | "FbosConfig"
  | "FirmwareConfig"
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
  | "Tool"
  | "User"
  | "WebAppConfig"
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

export interface Resource<T extends ResourceName, U extends object>
  extends TaggedResourceBase {
  kind: T;
  body: U;
}

export type TaggedResource =
  | TaggedAlert
  | TaggedCrop
  | TaggedDevice
  | TaggedDiagnosticDump
  | TaggedFarmEvent
  | TaggedFarmwareEnv
  | TaggedFarmwareInstallation
  | TaggedFbosConfig
  | TaggedFirmwareConfig
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
  | TaggedTool
  | TaggedUser
  | TaggedWebAppConfig
  | TaggedWebcamFeed;

type PointUnion =
  | GenericPointer
  | PlantPointer
  | ToolSlotPointer;

export type TaggedAlert = Resource<"Alert", Alert>;
export type TaggedCrop = Resource<"Crop", Crop>;
export type TaggedDevice = Resource<"Device", DeviceAccountSettings>;
export type TaggedDiagnosticDump = Resource<"DiagnosticDump", DiagnosticDump>;
export type TaggedFarmEvent = Resource<"FarmEvent", FarmEvent>;
export type TaggedFarmwareEnv = Resource<"FarmwareEnv", FarmwareEnv>;
export type TaggedFarmwareInstallation = Resource<"FarmwareInstallation", FarmwareInstallation>;
export type TaggedFbosConfig = Resource<"FbosConfig", FbosConfig>;
export type TaggedFirmwareConfig = Resource<"FirmwareConfig", FirmwareConfig>;
export type TaggedGenericPointer = Resource<"Point", GenericPointer>;
export type TaggedImage = Resource<"Image", Image>;
export type TaggedLog = Resource<"Log", Log>;
export type TaggedPeripheral = Resource<"Peripheral", Peripheral>;
export type TaggedPinBinding = Resource<"PinBinding", PinBinding>;
export type TaggedPlantPointer = Resource<"Point", PlantPointer>;
export type TaggedPlantTemplate = Resource<"PlantTemplate", PlantTemplate>;
export type TaggedPoint = Resource<"Point", PointUnion>;
export type TaggedPointGroup = Resource<"PointGroup", PointGroup>;
export type TaggedRegimen = Resource<"Regimen", Regimen>;
export type TaggedSavedGarden = Resource<"SavedGarden", SavedGarden>;
export type TaggedSensor = Resource<"Sensor", Sensor>;
export type TaggedSensorReading = Resource<"SensorReading", SensorReading>;
export type TaggedSequence = Resource<"Sequence", SequenceResource>;
export type TaggedTool = Resource<"Tool", Tool>;
export type TaggedToolSlotPointer = Resource<"Point", ToolSlotPointer>;
export type TaggedUser = Resource<"User", User>;
export type TaggedWebAppConfig = Resource<"WebAppConfig", WebAppConfig>;
export type TaggedWebcamFeed = Resource<"WebcamFeed", WebcamFeed>;

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

export type PointerType =
  | TaggedToolSlotPointer
  | TaggedGenericPointer
  | TaggedPlantPointer;
