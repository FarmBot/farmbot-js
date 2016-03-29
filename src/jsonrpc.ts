// Some day, I will actually use these typings.
export interface JSONRPCRequest {
    method: string;
    params: any;
    id: string;
};

export interface JSONRPCResponse {
  result: {[key: string]: any};
  error?: void;
  id: String;
};


export interface JSONRPCError {
  result?: void;
  error: Error;
  id: String;
};
