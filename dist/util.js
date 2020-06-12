"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./util/coordinate"));
__export(require("./util/is_celery_script"));
__export(require("./util/is_node"));
__export(require("./util/pick"));
__export(require("./util/rpc_request"));
__export(require("./util/uuid"));
function stringToBuffer(str) {
    var regular_array = str.split("").map(function (x) { return x.charCodeAt(0); });
    var data16 = new Uint8Array(regular_array);
    return data16;
}
exports.stringToBuffer = stringToBuffer;
var UPGRADE_NODE = "\nYour platform does not support the TextDecoder API. Please\nconsider upgrading NodeJS / Browser to a newer version.\n\nExpected to find window.TextDecoder or util.TextDecoder.\nFound neither.\nYour session will not support unicode.\n";
function newDecoder() {
    if (typeof util !== "undefined" && util.TextDecoder) {
        return new util.TextDecoder();
    }
    if (typeof window !== "undefined" && window.TextDecoder) {
        return new window.TextDecoder();
    }
    console.warn(UPGRADE_NODE);
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
exports.bufferToString = function (b) { return td.decode(b); };
