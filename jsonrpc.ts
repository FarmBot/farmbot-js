interface ArrayLike {
    length: number;
    [name: number]: any;
}
interface Request<T extends ArrayLike> {
    id: string;
    method: string;
    params: T;
}

interface Notification<T extends ArrayLike> {
    id: void;
    method: string;
    params: T;
}

interface Success<T extends ArrayLike> {
    id: string;
    error: void;
    result: T;
}

interface Failure<T extends ArrayLike> {
    id: string;
    error: T;
    result: void;
}

let isString = (inp: any) => (typeof inp === 'string' || inp instanceof String) && "string";
let isNull = (inp: any) => (String(inp) === "null") && "null";
let isArray = (inp: any) => (Array.isArray(inp)) && "array";
let isObject = (inp: any) => (typeof inp === "object") && "object";

let determine = (i: any) => (isArray(i) || isNull(i) || isString(i) || isObject(i) || "_");

type messageTag = "invalid" | "request" | "notification" | "success" | "failure";

export function categorizeMessage(x: any): messageTag {
    let o = Object(x);
    let pattern = [
        determine(o.error),
        determine(o.id),
        determine(o.method),
        determine(o.params),
        determine(o.result)
    ].join(".");
    switch (pattern) {
        case "_.string.string.array._": return "request";
        case "_.null.string.array._": return "notification";
        case "null.string._.array._": return "success";
        case "object.string._._.null": return "failure";
        default:
            console.warn("Bad data received.", o);
            return "invalid";
    }
}

export function tagMessage(x: any, disposalFn: Function) {
    switch(Object.keys(x).sort().join(".")) {
        case "error.id.result":
        case "id.method.params":
          return { value: x, tag: categorizeMessage(x) };
        default:
          disposalFn(x);
          return { value: x, tag: "failure" }
    };
    
    
}
