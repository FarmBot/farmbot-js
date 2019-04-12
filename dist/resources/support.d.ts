import { RpcResponse } from "./interfaces";
import { RpcError } from "..";
declare type OpType = "destroy" | "save";
export declare const outboundChanFor: (username: string, op: OpType, kind: "Peripheral" | "Sensor" | "Device" | "FarmEvent" | "Image" | "Log" | "Point" | "Regimen" | "Sequence" | "Tool" | "User" | "Crop" | "DiagnosticDump" | "Enigma" | "FarmwareEnv" | "FarmwareInstallation" | "FbosConfig" | "FirmwareConfig" | "PinBinding" | "PlantTemplate" | "SavedGarden" | "SensorReading" | "WebAppConfig" | "WebcamFeed", uuid: string, id?: number) => string;
export declare const internalError: RpcError;
export declare const resolveOrReject: (res: Function, rej: Function) => (m: RpcResponse) => any;
export {};
