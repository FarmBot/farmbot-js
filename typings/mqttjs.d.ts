type MQTTEventName = "connect" | "message";

declare class MqttClient {
  public publish: (channel: String, payload: any) => void;
  public subscribe: (channel: String|String[]) => void;
  public on: (type: MQTTEventName, listener: any) => void;
  public once: (type: MQTTEventName, listener: any) => void;
}

interface IMQTTConnectOptions {
  keepalive?: Number;
  clientId?: String;
  protocolId?: String;
  protocolVersion?: Number;
  clean?: Boolean;
  reconnectPeriod?: Number;
  connectTimeout?: Number;
  username?: String;
  password?: String;
  topic?: String
  qos?: Number;
  retain?: Boolean;
  // outgoingStore: a Store for the outgoing packets
  // will: a message that will sent by the broker automatically when the client disconnect badly. The format is:
  // payload: the message to publish
  // incomingStore: a Store for the incoming packets
}

declare module "mqtt" {
    export function connect(String, IMQTTConnectOptions): MqttClient;
}
