"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = pick;
function pick(target, value, fallback) {
    const result = target[value];
    return (typeof result === undefined) ? fallback : result;
}
