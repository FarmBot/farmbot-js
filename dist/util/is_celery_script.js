"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// REMEMBER: (typeof null === "object"). PS: Sorry :(
var isObj = function (o) { return o && JSON.stringify(o)[0] === "{"; };
var hasKind = function (o) { return typeof o.kind === "string"; };
var hasArgs = function (o) { return isObj(o) && !!o.args; };
function isCeleryScript(x) {
    return isObj(x) && hasKind(x) && hasArgs(x);
}
exports.isCeleryScript = isCeleryScript;
