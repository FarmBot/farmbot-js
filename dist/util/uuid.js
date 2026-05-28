"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = uuid;
function uuid() {
    const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    const replaceChar = function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    };
    return template.replace(/[xy]/g, replaceChar);
}
