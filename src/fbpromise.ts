import { FB } from "./interfaces/interfaces";
declare var Promise: any;

/** ES6 Promise wrapper that adds a label and a "finished" property. */
export class FBPromise<T> {
    public promise: FB.Thenable<T>;
    public finished: boolean;
    public label: string;
    public reject: (e: Error) => void;
    public resolve: (value: T) => void;

    constructor(label: string) {
        let $reject: Function,
            $resolve: Function;

        this.promise = new Promise(
            (res: any, rej: any) => [$reject, $resolve] = [rej, res]
        ) as FB.Thenable<T>;

        this.finished = false;

        this.reject = (error: Error) => {
            this.finished = true;
            $reject.apply(this, [error]);
        };

        this.resolve = (value: T) => {
            this.finished = true;
            $resolve.apply(this, [value]);
        };

        this.label = label || "a promise";
    }
}