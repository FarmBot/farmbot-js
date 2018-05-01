"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var ERR_TOKEN_PARSE = "Unable to parse token. Is it properly formatted?";
exports.CONFIG_DEFAULTS = { speed: 100 };
var ERR_MISSING_MQTT_USERNAME = "MISSING_MQTT_USERNAME";
var FIX_ATOB_FIRST = "NOTE TO NODEJS USERS:\n\nThis library requires an 'atob()' function.\nPlease fix this first.\nSOLUTION: https://github.com/FarmBot/farmbot-js/issues/33";
var parseToken = function (input) {
    try {
        return JSON.parse(atob(input.split(".")[1]));
    }
    catch (e) {
        console.warn(e);
        throw new Error(ERR_TOKEN_PARSE);
    }
};
exports.generateConfig = function (input) {
    if (util_1.isNode() && !global.atob) {
        throw new Error(FIX_ATOB_FIRST);
    }
    var t = parseToken(input.token);
    return {
        speed: input.speed || exports.CONFIG_DEFAULTS.speed,
        token: input.token,
        secure: input.secure === false ? false : true,
        mqttServer: util_1.isNode() ? "mqtt://" + t.mqtt + ":1883" : t.mqtt_ws,
        mqttUsername: t.bot || ERR_MISSING_MQTT_USERNAME,
        LAST_PING_OUT: 0,
        LAST_PING_IN: 0,
    };
};
