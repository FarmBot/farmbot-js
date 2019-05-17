/// <reference types="jest" />
import { Farmbot } from ".";
import { FarmbotLike } from "./resources/interfaces";
export declare const FAKE_TOKEN: string;
export declare const fakeFarmbot: (token?: string) => Farmbot;
export declare function fakeEmit(bot: Farmbot, chan: string, payload: Uint8Array): void;
export declare function expectEmitFrom(bot: Farmbot): jest.Matchers<any>;
export declare const fakeFarmbotLike: () => FarmbotLike;
