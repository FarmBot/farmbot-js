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
// export function assign(target: Dictionary<any>, ...others: Dictionary<any>[]) {
//   others.forEach(function (dict) {
//     for (let k in dict) {
//       target[k] = dict[k];
//     };
//   });
//   return target;
// }
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
// export function toPairs(input: Dictionary<string | number | boolean | undefined>): Corpus.Pair[] {
//   return Object.keys(input).map(function (key): Corpus.Pair {
//     return {
//       kind: "pair",
//       args: {
//         label: key,
//         value: input[key] || "null"
//       }
//     };
//   });
// }
function isNode() {
    return typeof window === "undefined";
}
exports.isNode = isNode;
