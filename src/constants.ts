export enum MqttChanName {
  fromApi = "from_api",
  fromClients = "from_clients",
  fromDevice = "from_device",
  logs = "logs",
  status = "status",
  sync = "sync",
  /** THIS ONE IS SPECIAL. */
  publicBroadcast = "public_broadcast",
  pong = "pong"
}

/** Not to be confused with MqttChanNames or
 * MQTT.js event names */
export enum FbjsEventName {
  /** This can be removed 60 days after FBOS v8 release. */
  status = "status",
  /** When a log is received */
  logs = "logs",
  /** When an unexpected message is received */
  malformed = "malformed",
  /** Unreliable. */
  offline = "offline",
  /** Fired on connect. */
  online = "online",
  /** Fires when the API sends an MQTT message to users. */
  publicBroadcast = "public_broadcast",
  /** Fires after any message is sent from current client. */
  sent = "sent",
  /** Used by resource auto-sync. */
  sync = "sync",
  /** When a key is removed from the device state tree. */
  remove = "remove",
  /** When a key is updated/inserted from the device state tree. */
  upsert = "upsert"
}

export enum Misc {
  /** Channel delimiter for MQTT channels. */
  MQTT_DELIM = "/",
  /** Namespace delimiter used by `sync_v7` */
  PATH_DELIM = ".",
  /** A null value when dealing with empty `pair` nodes in CeleryScript. */
  NULL = "null",
  /** Reconnect internval for MQTT.js */
  RECONNECT_THROTTLE_MS = 1000,
}
