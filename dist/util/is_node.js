"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNode = void 0;
function isNode() {
    return typeof window === "undefined";
}
exports.isNode = isNode;
