interface Notification<T extends Array<any>> {
    /** MUST BE NULL TO COMPLY WITH JSONRPC 1.0 */
    id: void;
    method: string;
    params: T;
}

interface Request<T extends Array<any>> {
    id: string;
    method: string;
    params: T;
}

interface Success<T extends Array<any>> {
    id: string;
    error: void;
    result: T;
}

interface Failure<T extends Array<any>> {
    id: string;
    error: T;
    result: void;
}
