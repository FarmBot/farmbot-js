"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Misc = exports.FbjsEventName = exports.MqttChanName = void 0;
var MqttChanName;
(function (MqttChanName) {
    MqttChanName["fromApi"] = "from_api";
    MqttChanName["fromClients"] = "from_clients";
    MqttChanName["fromDevice"] = "from_device";
    MqttChanName["logs"] = "logs";
    MqttChanName["status"] = "status";
    MqttChanName["sync"] = "sync";
    /** THIS ONE IS SPECIAL. */
    MqttChanName["publicBroadcast"] = "public_broadcast";
    MqttChanName["pong"] = "pong";
})(MqttChanName || (exports.MqttChanName = MqttChanName = {}));
/** Not to be confused with MqttChanNames or
 * MQTT.js event names */
var FbjsEventName;
(function (FbjsEventName) {
    /** State tree update. */
    FbjsEventName["status"] = "status";
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
})(FbjsEventName || (exports.FbjsEventName = FbjsEventName = {}));
var Misc;
(function (Misc) {
    /** Channel delimiter for MQTT channels. */
    Misc["MQTT_DELIM"] = "/";
    /** A null value when dealing with empty `pair` nodes in CeleryScript. */
    Misc["NULL"] = "null";
    /** Reconnect interval for MQTT.js */
    Misc[Misc["RECONNECT_THROTTLE_MS"] = 1000] = "RECONNECT_THROTTLE_MS";
})(Misc || (exports.Misc = Misc = {}));
