import { Farmbot } from "../farmbot";
import { Client } from "mqtt";
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
    publish: Client["publish"];
}
export declare type ResourceName = TaggedResource["kind"];
export declare type RpcResponse = RpcOk | RpcError;
