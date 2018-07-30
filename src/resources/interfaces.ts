import { Farmbot } from "../farmbot";
import { Client } from "mqtt";
import { RpcOk, RpcError } from "..";

export interface MqttLike {
  publish: Client["publish"];
}

export interface FarmbotLike {
  on: Farmbot["on"];
  client?: MqttLike;
}


export type ResourceName =
  | "FarmEvent"
  | "FarmwareInstallation"
  | "Image"
  | "Log"
  | "Peripheral"
  | "PinBinding"
  | "PlantTemplate"
  | "Point"
  | "Regimen"
  | "SavedGarden"
  | "Sensor"
  | "SensorReading"
  | "Sequence"
  | "Tool"
  | "WebcamFeed";

export interface BatchDestroyRequest { name: ResourceName; id: number; }

export type RpcResponse = RpcOk | RpcError;
