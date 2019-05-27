"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MqttChanName;
(function (MqttChanName) {
    MqttChanName["fromApi"] = "from_api";
    MqttChanName["fromClients"] = "from_clients";
    MqttChanName["fromDevice"] = "from_device";
    MqttChanName["logs"] = "logs";
    MqttChanName["legacyStatus"] = "status";
    MqttChanName["statusV8"] = "status_v8";
    MqttChanName["sync"] = "sync";
    /** THIS ONE IS SPECIAL. */
    MqttChanName["publicBroadcast"] = "public_broadcast";
    MqttChanName["pong"] = "pong";
})(MqttChanName = exports.MqttChanName || (exports.MqttChanName = {}));
/** Not to be confused with MqttChanNames or
 * MQTT.js event names */
var FbjsEventName;
(function (FbjsEventName) {
    /** This can be removed 60 days after FBOS v8 release. */
    FbjsEventName["legacy_status"] = "legacy_status";
    /** When a log is received */
    FbjsEventName["logs"] = "logs";
    /** When an unexpected message is received */
    FbjsEventName["malformed"] = "malformed";
    /** Unreliable. */
    FbjsEventName["offline"] = "offline";
    /** Fired on connect. */
    FbjsEventName["online"] = "online";
    /** Fires when the API sends an MQTT message to users. */
    FbjsEventName["publicBroadcast"] = "public_broadcast";
    /** Fires after any message is sent from current client. */
    FbjsEventName["sent"] = "sent";
    /** Used by resource auto-sync. */
    FbjsEventName["sync"] = "sync";
    /** When a key is removed from the device state tree. */
    FbjsEventName["remove"] = "remove";
    /** When a key is updated/inserted from the device state tree. */
    FbjsEventName["upsert"] = "upsert";
})(FbjsEventName = exports.FbjsEventName || (exports.FbjsEventName = {}));
var Misc;
(function (Misc) {
    /** Channel delimiter for MQTT channels. */
    Misc["MQTT_DELIM"] = "/";
    /** Namespace delimiter used by `sync_v7` */
    Misc["PATH_DELIM"] = ".";
    /** A null value when dealing with empty `pair` nodes in CeleryScript. */
    Misc["NULL"] = "null";
    /** Reconnect internval for MQTT.js */
    Misc[Misc["RECONNECT_THROTTLE_MS"] = 1000] = "RECONNECT_THROTTLE_MS";
})(Misc = exports.Misc || (exports.Misc = {}));
