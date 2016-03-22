declare class MqttClient {
  public publish: (String, any) => void;
  public subscribe: (String) => void;
  public on: (String, any) => void;
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
// incomingStore: a Store for the incoming packets
// outgoingStore: a Store for the outgoing packets
// will: a message that will sent by the broker automatically when the client disconnect badly. The format is:
// topic: the topic to publish
// payload: the message to publish
// qos: the QoS
// retain: the retain flag
}

declare module "mqtt" {
    export function connect(String, IMQTTConnectOptions): MqttClient;
}
