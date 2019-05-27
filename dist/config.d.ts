export interface FarmBotInternalConfig {
    speed: number;
    token: string;
    secure: boolean;
    mqttServer: string;
    mqttUsername: string;
    LAST_PING_OUT: number;
    LAST_PING_IN: number;
    /** INTERIM FLAG: Delete after FBOS <v8 support window ends. - RC, 17 MAY 19
     *
     * WHY:      FarmbotOS v7 will ignore `rpc_request`s with extra args
     *           FarmbotOS v8 added a new `priority` tag to said requests.
     *           We (and by we, I mean everyone that uses this lib
     *           including Farmbot inc.) need a way of knowing the
     *           client's FBOS version, but that information is not
     *           available.
     *
     * SOLUTION: Use a flag to selectively delete the `priority` tag.
     * DEFAULT:  `true`
     */
    interim_flag_is_legacy_fbos: boolean;
}
export interface FarmbotConstructorParams extends Partial<FarmBotInternalConfig> {
    /** All inputs are optional, except for `token`. */
    token: string;
}
export declare const CONFIG_DEFAULTS: {
    speed: number;
    interim_flag_is_legacy_fbos: boolean;
};
export declare const FIX_ATOB_FIRST = "NOTE TO NODEJS USERS:\n\nThis library requires an 'atob()' function.\nPlease fix this first.\nSOLUTION: https://github.com/FarmBot/farmbot-js/issues/33";
export declare const generateConfig: (input: FarmbotConstructorParams) => FarmBotInternalConfig;
