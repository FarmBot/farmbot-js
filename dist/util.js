"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferToString = void 0;
exports.stringToBuffer = stringToBuffer;
__exportStar(require("./util/coordinate"), exports);
__exportStar(require("./util/is_celery_script"), exports);
__exportStar(require("./util/is_node"), exports);
__exportStar(require("./util/pick"), exports);
__exportStar(require("./util/rpc_request"), exports);
__exportStar(require("./util/uuid"), exports);
function stringToBuffer(str) {
    var regular_array = str.split("").map(function (x) { return x.charCodeAt(0); });
    var data16 = new Uint8Array(regular_array);
    return data16;
}
function newDecoder() {
    if (typeof util !== "undefined" && util.TextDecoder) {
        return new util.TextDecoder();
    }
    if (typeof window !== "undefined" && window.TextDecoder) {
        return new window.TextDecoder();
    }
    return {
        decode: function (buffer) {
            var chars = [];
            buffer.forEach(function (x) { return chars.push(String.fromCharCode(x)); });
            return chars.join("");
        }
    };
}
var td = newDecoder();
/** We originally called buffer.toString(),
 *  but that suffers from inconsistent behavior
 * between environments, leading to testing
 * difficulty. */
var bufferToString = function (b) { return td.decode(b); };
exports.bufferToString = bufferToString;
