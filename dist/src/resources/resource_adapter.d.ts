import { DeletionRequest, FarmbotLike, RpcResponse } from "./interfaces";
import { TaggedResource } from "./tagged_resource";
export declare class ResourceAdapter {
    parent: FarmbotLike;
    username: string;
    constructor(parent: FarmbotLike, username: string);
    destroy: (r: DeletionRequest) => Promise<RpcResponse>;
    save: (resource: TaggedResource) => Promise<RpcResponse>;
    destroyAll: (req: DeletionRequest[]) => Promise<RpcResponse[]>;
    private doDestroy;
    private doSave;
}
