"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOrReject = exports.internalError = exports.outboundChanFor = void 0;
var outboundChanFor = function (username, op, kind, uuid, id) {
    if (id === void 0) { id = 0; }
    var segments = ["bot", username, "resources_v0", op, kind, uuid, id];
    return segments.join("/");
};
exports.outboundChanFor = outboundChanFor;
// Auto-reject if client is not connected yet.
exports.internalError = {
    kind: "rpc_error",
    args: { label: "BROWSER_LEVEL_FAILURE" },
    body: [
        {
            kind: "explanation",
            args: { message: "Tried to perform batch operation before connect." }
        }
    ]
};
var resolveOrReject = function (res, rej) {
    return function (m) { return (m.kind == "rpc_ok" ? res : rej)(m); };
};
exports.resolveOrReject = resolveOrReject;
