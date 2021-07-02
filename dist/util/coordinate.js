"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordinate = void 0;
function coordinate(x, y, z) {
    return { kind: "coordinate", args: { x: x, y: y, z: z } };
}
exports.coordinate = coordinate;
