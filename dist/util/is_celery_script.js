"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCeleryScript = isCeleryScript;
exports.hasLabel = hasLabel;
var isObj = function (o) { return !!(o && typeof o === "object"); };
var hasKind = function (o) { return typeof o.kind === "string"; };
var hasArgs = function (o) { return isObj(o) && !!o.args; };
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
