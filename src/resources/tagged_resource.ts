import {
  Crop,
  DeviceAccountSettings,
  FarmwareEnv,
  FarmEvent,
  FarmwareInstallation,
  FbosConfig,
  FirmwareConfig,
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
  WebAppConfig,
  WebcamFeed,
} from "./api_resources";

export type ResourceName =
  | "Crop"
  | "Device"
  | "FarmwareEnv"
  | "DiagnosticDump"
  | "FarmEvent"
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
  | TaggedCrop
  | TaggedDevice
  | TaggedDiagnosticDump
  | TaggedFarmEvent
  | TaggedFarmwareInstallation
  | TaggedFbosConfig
  | TaggedFirmwareConfig
  | TaggedImage
  | TaggedLog
  | TaggedPeripheral
  | TaggedPinBinding
  | TaggedPlantTemplate
  | TaggedPoint
  | TaggedRegimen
  | TaggedSavedGarden
  | TaggedSensor
  | TaggedSensorReading
  | TaggedSequence
  | TaggedTool
  | TaggedUser
  | TaggedWebAppConfig
  | TaggedWebcamFeed;

export type TaggedCrop = Resource<"Crop", Crop>;
export type TaggedFarmwareEnv = Resource<"FarmwareEnv", FarmwareEnv>;
export type TaggedFbosConfig = Resource<"FbosConfig", FbosConfig>;
export type TaggedFirmwareConfig = Resource<"FirmwareConfig", FirmwareConfig>;
export type TaggedWebAppConfig = Resource<"WebAppConfig", WebAppConfig>;
export type TaggedUser = Resource<"User", User>;
export type TaggedDevice = Resource<"Device", DeviceAccountSettings>;
export type TaggedPinBinding = Resource<"PinBinding", PinBinding>;
export type TaggedRegimen = Resource<"Regimen", Regimen>;
export type TaggedTool = Resource<"Tool", Tool>;
export type TaggedSequence = Resource<"Sequence", SequenceResource>;
export type TaggedFarmEvent = Resource<"FarmEvent", FarmEvent>;
export type TaggedImage = Resource<"Image", Image>;
export type TaggedLog = Resource<"Log", Log>;
export type TaggedPeripheral = Resource<"Peripheral", Peripheral>;
export type TaggedSensorReading = Resource<"SensorReading", SensorReading>;
export type TaggedSensor = Resource<"Sensor", Sensor>;
export type TaggedSavedGarden = Resource<"SavedGarden", SavedGarden>;
export type TaggedPlantTemplate = Resource<"PlantTemplate", PlantTemplate>;
export type TaggedDiagnosticDump = Resource<"DiagnosticDump", DiagnosticDump>;

type PointUnion =
  | GenericPointer
  | PlantPointer
  | ToolSlotPointer;

export type TaggedGenericPointer = Resource<"Point", GenericPointer>;
export type TaggedPlantPointer = Resource<"Point", PlantPointer>;
export type TaggedToolSlotPointer = Resource<"Point", ToolSlotPointer>;
export type TaggedPoint = Resource<"Point", PointUnion>;
export type TaggedWebcamFeed = Resource<"WebcamFeed", WebcamFeed>;
export type TaggedFarmwareInstallation =
  Resource<"FarmwareInstallation", FarmwareInstallation>;

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

