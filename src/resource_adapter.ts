import { uuid, Dictionary, Farmbot } from ".";

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

export class ResourceAdapter {
  public cache: Dictionary<Promise<void>> = {};

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
      client.emit(-1);
      // Generate a UUID
      const requestId = uuid();
      const outputChan = this.outboundChanFor(req, requestId);
      const p: Promise<void> = new Promise((resolve, _reject) => {
        this.parent.on(this.inboundChannelFor(req), () => {
          resolve();
          throw new Error("Stopped here");
        });
      });
      // Put it in the cache
      this.cache[requestId] = p;
      // Subscribe to response chan
      // publish RPC
      // return promise
      return p;
    }
    return Promise.reject();
  }
}
