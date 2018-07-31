"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Denotes special status of resource */
var SpecialStatus;
(function (SpecialStatus) {
    /** The local copy is different than the one on the remote end. */
    SpecialStatus["DIRTY"] = "DIRTY";
    /** The local copy is being saved on the remote end right now? */
    SpecialStatus["SAVING"] = "SAVING";
    /** API and FE are in sync. Using "" for now because its falsey like old
     * `undefined` value */
    SpecialStatus["SAVED"] = "";
})(SpecialStatus = exports.SpecialStatus || (exports.SpecialStatus = {}));
