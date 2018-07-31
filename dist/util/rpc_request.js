"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("./uuid");
function rpcRequest(body) {
    return {
        kind: "rpc_request",
        args: { label: uuid_1.uuid() },
        body: body
    };
}
exports.rpcRequest = rpcRequest;
