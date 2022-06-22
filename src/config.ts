import { APIToken } from "./interfaces";
import { isNode } from "./util";

declare var atob: (i: string) => string;
declare var global: typeof window;

export interface FarmBotInternalConfig {
  speed: number;
  token: string;
  secure: boolean;
  mqttServer: string;
  mqttUsername: string;
  LAST_PING_OUT: number;
  LAST_PING_IN: number;
}

export interface FarmbotConstructorParams extends Partial<FarmBotInternalConfig> {
  /** All inputs are optional, except for `token`. */
  token: string;
}

const ERR_TOKEN_PARSE = "Unable to parse token. Is it properly formatted?";

export const CONFIG_DEFAULTS = {
  speed: 100,
};

const ERR_MISSING_MQTT_USERNAME = "MISSING_MQTT_USERNAME";
export const FIX_ATOB_FIRST =
  `NOTE TO NODEJS USERS:

This library requires an 'atob()' function.
Please fix this first.
SOLUTION: https://github.com/FarmBot/farmbot-js/issues/33`;

const parseToken = (input: string): APIToken => {
  try {
    return JSON.parse(atob(input.split(".")[1]));
  } catch (e) {
    console.warn(e);
    throw new Error(ERR_TOKEN_PARSE);
  }
};

export const generateConfig = (input: FarmbotConstructorParams): FarmBotInternalConfig => {
  if (isNode() && !global.atob) { throw new Error(FIX_ATOB_FIRST); }
  const t = parseToken(input.token);

  return {
    speed: input.speed || CONFIG_DEFAULTS.speed,
    token: input.token,
    secure: input.secure === false ? false : true,
    mqttServer: isNode() ? `mqtt://${t.mqtt}:1883` : t.mqtt_ws,
    mqttUsername: t.bot || ERR_MISSING_MQTT_USERNAME,
    LAST_PING_OUT: 0,
    LAST_PING_IN: 0,
  };
}
