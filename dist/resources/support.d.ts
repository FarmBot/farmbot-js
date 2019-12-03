import { RpcResponse } from "./interfaces";
import { RpcError } from "..";
declare type OpType = "destroy" | "save";
export declare const outboundChanFor: (username: string, op: OpType, kind: "Peripheral" | "Sensor" | "Device" | "Point" | "Sequence" | "Regimen" | "Alert" | "Crop" | "DiagnosticDump" | "FarmEvent" | "FarmwareEnv" | "FarmwareInstallation" | "FbosConfig" | "FirmwareConfig" | "Folder" | "Image" | "Log" | "PinBinding" | "PlantTemplate" | "PointGroup" | "SavedGarden" | "SensorReading" | "Tool" | "User" | "WebAppConfig" | "WebcamFeed", uuid: string, id?: number) => string;
export declare const internalError: RpcError;
export declare const resolveOrReject: (res: Function, rej: Function) => (m: RpcResponse) => any;
export {};
