import { CeleryNode } from "..";

export function isCeleryScript(x: any): x is CeleryNode {
  // REMEMBER: (typeof null === "object"). PS: Sorry :(
  const isObj = (o: any) => o && JSON.stringify(o)[0] === "{";
  const hasKind = (o: any) => typeof o.kind === "string";
  const hasArgs = (o: any) => isObj(o) && !!o.args;

  return isObj(x) && hasKind(x) && hasArgs(x);
}
