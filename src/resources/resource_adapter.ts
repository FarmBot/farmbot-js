import { uuid } from "..";
import {
  BatchDestroyRequest,
  FarmbotLike,
  MqttLike,
  RpcResponse
} from "./interfaces";
import {
  outboundChanFor,
  resolveOrReject
} from "./support";
import { rejectRpc } from "./reject_rpc";
import { TaggedResource } from "./tagged_resource";

export class ResourceAdapter {
  constructor(public parent: FarmbotLike, public username: string) { }

  destroy = (req: BatchDestroyRequest) => {
    const { client } = this.parent;
    return (client ? this.doDestroy(client, req) : rejectRpc());
  };

  update = (_: TaggedResource) => {
    throw new Error("Hmmm");
  };

  destroyAll =
    (req: BatchDestroyRequest[]) => Promise.all(req.map(r => this.destroy(r)));

  private doDestroy =
    (client: MqttLike, req: BatchDestroyRequest): Promise<RpcResponse> => {
      return new Promise((res, rej) => {
        const requestId = uuid();
        this.parent.on(requestId, resolveOrReject(res, rej));
        client.publish(outboundChanFor(this.username, req, requestId), "");
      });
    }
}
