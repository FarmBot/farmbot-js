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
})(MqttChanName = exports.MqttChanName || (exports.MqttChanName = {}));
/** Not to be confused with MqttChanNames or
 * MQTT.js event names */
var FbjsEventName;
(function (FbjsEventName) {
    FbjsEventName["legacy_status"] = "legacy_status";
    FbjsEventName["logs"] = "logs";
    FbjsEventName["malformed"] = "malformed";
    FbjsEventName["offline"] = "offline";
    FbjsEventName["online"] = "online";
    FbjsEventName["sent"] = "sent";
    FbjsEventName["status_v8"] = "status_v8";
    FbjsEventName["sync"] = "sync";
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
