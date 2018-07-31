import { Coordinate } from "..";

export function coordinate(x: number, y: number, z: number): Coordinate {
  return { kind: "coordinate", args: { x, y, z } };
}
