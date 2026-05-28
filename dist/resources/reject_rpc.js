"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectRpc = void 0;
const support_1 = require("./support");
const rejectRpc = () => Promise.reject(support_1.internalError);
exports.rejectRpc = rejectRpc;
