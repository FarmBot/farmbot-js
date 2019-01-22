export enum MqttChanName {
  fromApi = "from_api",
  fromClients = "from_clients",
  fromDevice = "from_device",
  logs = "logs",
  legacyStatus = "status",
  statusV8 = "status_v8",
  sync = "sync",
}

/** Not to be confused with MqttChanNames or
 * MQTT.js event names */
export enum FbjsEventName {
  legacy_status = "legacy_status",
  logs = "logs",
  malformed = "malformed",
  offline = "offline",
  online = "online",
  sent = "sent",
  status_v8 = "status_v8",
  sync = "sync",
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
