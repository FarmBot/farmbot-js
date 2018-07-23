import { uuid, Farmbot, RpcError, RpcOk } from ".";

export enum ResourceName {
  FarmEvent = "FarmEvent",
  FarmwareInstallations = "FarmwareInstallation",
  Image = "Image",
  Log = "Log",
  Peripheral = "Peripheral",
  PinBinding = "PinBinding",
  PlantTemplate = "PlantTemplate",
  Point = "Point",
  Regimen = "Regimen",
  SavedGarden = "SavedGarden",
  Sensor = "Sensor",
  SensorReading = "SensorReading",
  Sequence = "Sequence",
  Tool = "Tool",
  WebcamFeed = "WebcamFeed",
}

export interface BatchDestroyRequest {
  name: ResourceName;
  id: number;
}

type Response = RpcOk | RpcError;

export class ResourceAdapter {
  constructor(public parent: Farmbot, public username: string) {

  }

  private outboundChanFor =
    (req: BatchDestroyRequest, uuid_: string): string => [
      `bot`,
      this.username,
      `resources_v0`,
      `${req.name}`,
      `${req.id}`,
      `${uuid_}`,
    ].join("/");

  destroy = (req: BatchDestroyRequest): Promise<Response> => {
    const { client } = this.parent;
    if (client) {
      return new Promise((res, rej) => {
        // Generate a UUID
        const requestId = uuid();
        // Figure out which channel it needs to be published to.
        const outputChan = this.outboundChanFor(req, requestId);
        // Setup the response handler.
        this
          .parent
          .on(requestId, (m: Response) => {
            (m.kind == "rpc_ok" ? res : rej)(m);
          });
        client.publish(outputChan, "");
      });
    }
    // Auto-reject if client is not connected yet.
    const internalError: RpcError = {
      kind: "rpc_error",
      args: {
        label: "BROWSER_LEVEL_FAILURE"
      },
      body: [
        {
          kind: "explanation",
          args: {
            message: "Tried to perform batch operation before connect."
          }
        }
      ]
    };
    return Promise.reject(internalError);
  }
}
