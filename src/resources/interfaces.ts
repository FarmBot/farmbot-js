import { Farmbot } from "../farmbot";
import { MqttClient } from "mqtt";
import { RpcOk, RpcError } from "..";
import { TaggedResource } from "./tagged_resource";

export interface FarmbotLike {
  on: Farmbot["on"];
  client?: MqttLike;
}

export interface DeletionRequest {
  id: number;
  kind: ResourceName;
}

export interface MqttLike {
  publish: MqttClient["publish"];
}

export type ResourceName = TaggedResource["kind"];

export type RpcResponse = RpcOk | RpcError;
