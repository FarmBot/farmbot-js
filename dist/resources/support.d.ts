import { RpcResponse } from "./interfaces";
import { RpcError } from "..";
declare type OpType = "destroy" | "save";
export declare const outboundChanFor: (username: string, op: OpType, kind: "Sequence" | "Regimen" | "Crop" | "Device" | "FarmwareEnv" | "DiagnosticDump" | "FarmEvent" | "FarmwareInstallation" | "FbosConfig" | "FirmwareConfig" | "Image" | "Log" | "Peripheral" | "PinBinding" | "PlantTemplate" | "Point" | "SavedGarden" | "Sensor" | "SensorReading" | "Tool" | "User" | "WebAppConfig" | "WebcamFeed", uuid: string, id?: number) => string;
export declare const internalError: RpcError;
export declare const resolveOrReject: (res: Function, rej: Function) => (m: RpcResponse) => any;
export {};
