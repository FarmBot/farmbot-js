"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNode = isNode;
function isNode() {
    return typeof window === "undefined";
}
