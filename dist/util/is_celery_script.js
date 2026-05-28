"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCeleryScript = isCeleryScript;
exports.hasLabel = hasLabel;
const isObj = (o) => !!(o && typeof o === "object");
const hasKind = (o) => typeof o.kind === "string";
const hasArgs = (o) => isObj(o) && !!o.args;
function isCeleryScript(x) {
    return isObj(x) && hasKind(x) && hasArgs(x);
}
function hasLabel(x) {
    if (isCeleryScript(x)) {
        return typeof x.args.label === "string";
    }
    else {
        return false;
    }
}
