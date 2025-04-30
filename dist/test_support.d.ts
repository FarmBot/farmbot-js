import { Farmbot } from ".";
import { FarmbotLike } from "./resources/interfaces";
export declare const FAKE_TOKEN: string;
export declare const fakeFarmbot: (token?: string) => Farmbot;
export declare function fakeMqttEmission<T>(bot: Farmbot, chan: string, payload: T): void;
export declare function expectEmitFrom(bot: Farmbot): jest.JestMatchers<any>;
export declare const fakeFarmbotLike: () => FarmbotLike;
