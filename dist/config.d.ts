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
export declare const CONFIG_DEFAULTS: {
    speed: number;
};
export declare const generateConfig: (input: FarmbotConstructorParams) => FarmBotInternalConfig;
