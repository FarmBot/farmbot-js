export namespace FB {
    export interface Dictionary<T> {
        [key: string]: T;
    }

    export interface ConstructorParams {
      /** API token which can be retrieved by logging into REST server or my.farmbot.io */
      token: string;
      /** Default time to wait (ms) before considering operation a failure. */
      timeout?: number;
      /** Default physical speed for operations. (steps/s?) */
      speed?: number;
      /** DEPRECATED. This information is now encoded into `token`. */
      meshServer?: string;
    }

    export interface APIToken {
        /** URL of MQTT server. REST server is not the same as MQTT server. */
        mqtt: string;
        /** UUID of current bot. */
        bot: string;
    }

    export type RPCMethod = "single_command.EMERGENCY STOP"
                            | "exec_sequence"
                            | "single_command.HOME ALL"
                            | "single_command.HOME X"
                            | "single_command.HOME Y"
                            | "single_command.HOME Z"
                            | "single_command.MOVE ABSOLUTE"
                            | "single_command.MOVE RELATIVE"
                            | "single_command.PIN WRITE"
                            | "read_status"
                            | "sync_sequence"
                            | "update_calibration" ;

    export interface RPCPayload {
      params: {};
      method: RPCMethod;
    }

    export interface RPCMessage extends RPCPayload {
      id: string;
    }

    export interface CommandOptions {
      x?: number;
      y?: number;
      z?: number;
      pin?: number;
      value?: string;
      speed?: number;
      mode?: number;
      message_type?: string;
    };
};
