"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOrReject = exports.internalError = exports.outboundChanFor = void 0;
const outboundChanFor = (username, op, kind, uuid, id = 0) => {
    const segments = [`bot`, username, `resources_v0`, op, kind, uuid, id];
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
const resolveOrReject = (res, rej) => {
    return (m) => (m.kind == "rpc_ok" ? res : rej)(m);
};
exports.resolveOrReject = resolveOrReject;
