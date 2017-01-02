import * as FB from "./interfaces";

export function uuid() {
  let template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  let replaceChar = function (c: string) {
    let r = Math.random() * 16 | 0;
    let v = c === "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  };
  return template.replace(/[xy]/g, replaceChar);
};

export function pick<T>(target: { [k: string]: T | undefined },
  value: string,
  fallback: T) {
  return target[value] || fallback;
}

export function assign(target: FB.Dictionary<any>, ...others: FB.Dictionary<any>[]) {
  others.forEach(function (dict) {
    for (let k in dict) {
      target[k] = dict[k];
    };
  });
  return target;
}