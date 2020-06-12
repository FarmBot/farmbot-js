import { isNode } from "./util/is_node";

export * from "./util/coordinate";
export * from "./util/is_celery_script";
export * from "./util/is_node";
export * from "./util/pick";
export * from "./util/rpc_request";
export * from "./util/uuid";

export function stringToBuffer(str: string) {
  const regular_array = str.split("").map(x => x.charCodeAt(0));
  const data16 = new Uint8Array(regular_array);
  return data16;
}

declare const util: { TextDecoder: typeof TextDecoder };
const td = new (isNode() ? util.TextDecoder : TextDecoder)();

/** We originally called buffer.toString(),
 *  but that suffers from inconsistent behavior
 * between environments, leading to testing
 * difficulty. */
export const bufferToString = (b: Uint8Array) => td.decode(b);
