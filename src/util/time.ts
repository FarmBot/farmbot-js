/** Returns a timestamp in ms. */
export function timestamp() {
  return Math.round((new Date()).getTime() / 100);
}

// type RejectFn = (reason?: any) => void;
// type ResolveFn<T> = (value?: T | PromiseLike<T>) => void;

// interface Executor<T> {
//   (x: (resolve: ResolveFn<T>, reject: RejectFn) => void): Promise<T>;
// }

// export function timeoutPromise<T>(time: number, executor: Executor<T>): Promise<T> {
//   return new Promise(executor);
// }
