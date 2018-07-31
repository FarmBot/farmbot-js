"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pick(target, value, fallback) {
    var result = target[value];
    return (typeof result === undefined) ? fallback : result;
}
exports.pick = pick;
