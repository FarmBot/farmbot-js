declare type Value = number | boolean | string | undefined;
interface DeepObject {
    [key: string]: Value | DeepObject;
}
export declare function deepUnpack(path: string, val: Value): DeepObject;
export {};
