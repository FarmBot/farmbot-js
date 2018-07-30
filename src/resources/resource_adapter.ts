import { uuid } from "..";
import {
  BatchDestroyRequest,
  FarmbotLike,
  MqttLike,
  Response
} from "./interfaces";
import { outboundChanFor, internalError } from "./support";

export class ResourceAdapter {
  constructor(public parent: FarmbotLike, public username: string) { }

  destroy = (req: BatchDestroyRequest) => {
    const { client } = this.parent;
    return (client ? this.doDestroy(client, req) : this.dontDestroy());
  };

  destroyAll =
    (req: BatchDestroyRequest[]) => Promise.all(req.map(r => this.destroy(r)));

  private doDestroy =
    (client: MqttLike, req: BatchDestroyRequest): Promise<Response> => {
      return new Promise((res, rej) => {
        const requestId = uuid();
        this
          .parent
          .on(requestId, (m: Response) => (m.kind == "rpc_ok" ? res : rej)(m));
        client.publish(outboundChanFor(this.username, req, requestId), "");
      });
    }

  private dontDestroy = () => Promise.reject(internalError);
}
