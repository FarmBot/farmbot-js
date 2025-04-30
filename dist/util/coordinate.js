"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordinate = coordinate;
function coordinate(x, y, z) {
    return { kind: "coordinate", args: { x: x, y: y, z: z } };
}
