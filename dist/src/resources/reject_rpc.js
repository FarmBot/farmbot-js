"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var support_1 = require("./support");
exports.rejectRpc = function () { return Promise.reject(support_1.internalError); };
