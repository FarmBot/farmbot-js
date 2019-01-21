type Value =
  | number
  | boolean
  | string
  | undefined
  | null

interface DeepObject {
  [key: string]: Value | DeepObject;
}


function recurse(target: DeepObject, keys: string[], val: Value):
  DeepObject | undefined {
  const key = keys.shift() as string;
  const nextTarget: DeepObject = {};
  target[key] = nextTarget;

  if (keys.length > 0) {
    return recurse(target[key] as {}, keys, val);
  } else {
    target[key] = val;
    return;
  }
};

export function deepUnpack(path: string, val: Value): DeepObject {
  const target = {};
  recurse(target, path.split("."), val);
  return target;
}

