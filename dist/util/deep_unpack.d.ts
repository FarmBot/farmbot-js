import { Primitive } from "../interfaces";
interface DeepObject {
    [key: string]: Primitive | DeepObject | undefined;
}
export declare function deepUnpack(path: string, val: Primitive | undefined): DeepObject;
export {};
