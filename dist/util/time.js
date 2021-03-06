"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = void 0;
/** Returns a timestamp in ms. */
function timestamp() {
    return Math.round((new Date()).getTime() / 100);
}
exports.timestamp = timestamp;
// type RejectFn = (reason?: any) => void;
// type ResolveFn<T> = (value?: T | PromiseLike<T>) => void;
// interface Executor<T> {
//   (x: (resolve: ResolveFn<T>, reject: RejectFn) => void): Promise<T>;
// }
// export function timeoutPromise<T>(time: number, executor: Executor<T>): Promise<T> {
//   return new Promise(executor);
// }
