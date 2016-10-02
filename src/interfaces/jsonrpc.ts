export namespace JSONRPC {
  export let JSON_RPC_VERSION = "1.0";

  /** JSON RPC 1.0 notification. http://json-rpc.org/wiki/specification#a1.3Notification */
  export interface Notification<T extends Array<any>> {
    /** MUST BE NULL TO COMPLY WITH JSONRPC 1.0 */
    id: void;
    method: string;
    params: T;
  }

  /** JSON RPC 1.0 method invocation.
   *  http://json-rpc.org/wiki/specification#a1.1Requestmethodinvocation */
  export interface Request<T extends Array<any>> {
    id: string;
    method: string;
    params: T;
  }

  /** Successful JSON RPC 1.0 method invocation.
   *  http://json-rpc.org/wiki/specification#a1.2Response */
  export interface Response<T extends Array<any>> {
    id: string;
    error: void;
    result: T;
  }

  /** Failed JSON RPC 1.0 method invocation.
   *  http://json-rpc.org/wiki/specification#a1.2Response */
  export interface ErrorResponse {
    id: string;
    error: {
      /** Identifier for the error. */
      name: string;
      /** Human readable explanation of the failure. */
      message: string;
    };
    result: void;
  }

  /** A JSONRPC response whose result (success, failure) is unknown.  */
  export type Uncategorized = JSONRPC.Response<any[]>|JSONRPC.ErrorResponse;
}
