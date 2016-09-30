/// <reference types="node" />
import { FB } from "./interfaces/interfaces";
/** ES6 Promise wrapper that adds a label and a "finished" property. */
export declare class FBPromise<T> {
    promise: FB.Thenable<T>;
    finished: boolean;
    label: string;
    reject: (e: Error) => void;
    resolve: (value: T) => void;
    constructor(label: string);
}
export declare function timerDefer<T>(timeout: Number, label?: string): FBPromise<T>;
