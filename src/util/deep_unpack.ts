import { Primitive } from "../interfaces";
import { Misc } from "../constants";

interface DeepObject {
  [key: string]: Primitive | DeepObject | undefined;
}

const recurse =
  (target: DeepObject, keys: string[], val: Primitive | undefined) => {
    const key = keys.shift() as string;
    const nextTarget: DeepObject = {};
    target[key] = nextTarget;

    if (keys.length > 0) {
      recurse(target[key] as {}, keys, val);
    } else {
      target[key] = val;
    }
  };

export function deepUnpack(path: string, val: Primitive | undefined): DeepObject {
  const target = {};
  recurse(target, path.split(Misc.PATH_DELIM), val);
  return target;
}

