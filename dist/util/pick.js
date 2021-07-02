"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
function pick(target, value, fallback) {
    var result = target[value];
    return (typeof result === undefined) ? fallback : result;
}
exports.pick = pick;
