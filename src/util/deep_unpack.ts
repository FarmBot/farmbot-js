type Value =
  | number
  | boolean
  | string
  | undefined;

interface DeepObject {
  [key: string]: Value | DeepObject;
}

function recurse(target: DeepObject, keys: string[], val: Value) {
  const key = keys.shift() as string;
  const nextTarget: DeepObject = {};
  target[key] = nextTarget;

  if (keys.length > 0) {
    recurse(target[key] as {}, keys, val);
  } else {
    target[key] = val;
  }
};

export function deepUnpack(path: string, val: Value): DeepObject {
  const target = {};
  recurse(target, path.split("."), val);
  return target;
}

