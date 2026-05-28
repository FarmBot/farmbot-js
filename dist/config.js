"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConfig = exports.FIX_ATOB_FIRST = exports.CONFIG_DEFAULTS = void 0;
const util_1 = require("./util");
const ERR_TOKEN_PARSE = "Unable to parse token. Is it properly formatted?";
exports.CONFIG_DEFAULTS = {
    speed: 100,
};
const ERR_MISSING_MQTT_USERNAME = "MISSING_MQTT_USERNAME";
exports.FIX_ATOB_FIRST = `NOTE TO NODEJS USERS:

This library requires an 'atob()' function.
Please fix this first.
SOLUTION: https://github.com/FarmBot/farmbot-js/issues/33`;
const parseToken = (input) => {
    try {
        return JSON.parse(atob(input.split(".")[1]));
    }
    catch (e) {
        console.warn(e);
        throw new Error(ERR_TOKEN_PARSE);
    }
};
const generateConfig = (input) => {
    if ((0, util_1.isNode)() && !global.atob) {
        throw new Error(exports.FIX_ATOB_FIRST);
    }
    const t = parseToken(input.token);
    return {
        speed: input.speed || exports.CONFIG_DEFAULTS.speed,
        token: input.token,
        secure: input.secure === false ? false : true,
        mqttServer: (0, util_1.isNode)() ? `mqtt://${t.mqtt}:1883` : t.mqtt_ws,
        mqttUsername: t.bot || ERR_MISSING_MQTT_USERNAME,
        LAST_PING_OUT: 0,
        LAST_PING_IN: 0,
    };
};
exports.generateConfig = generateConfig;
