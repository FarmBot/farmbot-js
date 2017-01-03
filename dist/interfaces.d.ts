export interface APIToken {
    /** URL of MQTT server. REST server is not the same as MQTT server. */
    mqtt: string;
    /** UUID of current bot. */
    bot: string;
}
