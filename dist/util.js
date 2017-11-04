"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function uuid() {
    var template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    var replaceChar = function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    };
    return template.replace(/[xy]/g, replaceChar);
}
exports.uuid = uuid;
function pick(target, value, fallback) {
    var result = target[value];
    return (typeof result === undefined) ? fallback : result;
}
exports.pick = pick;
// TODO: Make this a generic.
function assign(target) {
    var others = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        others[_i - 1] = arguments[_i];
    }
    others.forEach(function (dict) {
        for (var k in dict) {
            target[k] = dict[k];
        }
        ;
    });
    return target;
}
exports.assign = assign;
function isCeleryScript(x) {
    // REMEMBER: (typeof null === "object"). PS: Sorry :(
    var isObj = function (o) { return o && JSON.stringify(o)[0] === "{"; };
    var hasKind = function (o) { return typeof o.kind === "string"; };
    var hasArgs = function (o) { return isObj(o) && !!o.args; };
    return isObj(x) && hasKind(x) && hasArgs(x);
}
exports.isCeleryScript = isCeleryScript;
function coordinate(x, y, z) {
    return { kind: "coordinate", args: { x: x, y: y, z: z } };
}
exports.coordinate = coordinate;
function rpcRequest(body) {
    return {
        kind: "rpc_request",
        args: { label: uuid() },
        body: body
    };
}
exports.rpcRequest = rpcRequest;
function toPairs(input) {
    return Object.keys(input).map(function (key) {
        return {
            kind: "pair",
            args: {
                label: key,
                value: input[key] || "null"
            }
        };
    });
}
exports.toPairs = toPairs;
function isNode() {
    return typeof window === "undefined";
}
exports.isNode = isNode;
