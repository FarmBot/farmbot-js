import { CeleryNode } from "..";

const isObj = (o: unknown) => !!(o && typeof o === "object");
const hasKind = (o: any) => typeof o.kind === "string";
const hasArgs = (o: Record<string, any>) => isObj(o) && !!o.args;

export function isCeleryScript(x: unknown): x is CeleryNode {
  return isObj(x) && hasKind(x) && hasArgs(x);
}

export function hasLabel(x: unknown) {
  if (isCeleryScript(x)) {
    return typeof (x.args as any).label === "string";
  } else {
    return false;
  }
}
