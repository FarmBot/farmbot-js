import { uuid, Dictionary, Farmbot, RpcError, RpcOk } from ".";

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

  private inboundChannelFor = (req: BatchDestroyRequest): string => [
    `bot`,
    this.username,
    `from_api`,
    `${req.id}`,
  ].join("/");

  destroy = (req: BatchDestroyRequest): Promise<void> => {
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
          .on(requestId, (m: Response) => (m.kind == "rpc_ok") ? res() : rej());
        client.publish(outputChan, "");
      });
    }
    // Auto-reject if client is not connected yet.
    return Promise.reject();
  }
}
