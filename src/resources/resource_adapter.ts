import { uuid } from "..";
import {
  DeletionRequest,
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

  destroy = (r: DeletionRequest) => {
    const { client } = this.parent;
    return (client ? this.doDestroy(client, r.kind, r.id) : rejectRpc());
  }

  save = (resource: TaggedResource) => {
    const { client } = this.parent;
    return (client ? this.doSave(client, resource) : rejectRpc());
  }

  destroyAll = (req: DeletionRequest[]) => Promise.all(req.map(r => this.destroy(r)));

  private doDestroy = (client: MqttLike,
    kind: DeletionRequest["kind"],
    id: number): Promise<RpcResponse> => {

    return new Promise((res, rej) => {
      const requestId = uuid();
      this.parent.on(requestId, resolveOrReject(res, rej));
      client.publish(outboundChanFor(this.username, "destroy", kind, requestId, id), "");
    });
  }

  private doSave =
    (client: MqttLike, r: TaggedResource): Promise<RpcResponse> => {
      return new Promise((res, rej) => {
        const uid = uuid();
        this.parent.on(uid, resolveOrReject(res, rej));
        const chan =
          outboundChanFor(this.username, "save", r.kind, uid, r.body.id);
        client.publish(chan, JSON.stringify(r.body));
      });
    }
}
