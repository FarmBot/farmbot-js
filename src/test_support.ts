import { Farmbot, stringToBuffer } from ".";
import { FarmbotLike } from "./resources/interfaces";

export const FAKE_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZ" +
  "G1pbkBhZG1pbi5jb20iLCJpYXQiOjE1MDIxMjcxMTcsImp0aSI6IjlhZjY2NzJmLTY5NmEtNDh" +
  "lMy04ODVkLWJiZjEyZDlhYThjMiIsImlzcyI6Ii8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE1M" +
  "DU1ODMxMTcsIm1xdHQiOiJsb2NhbGhvc3QiLCJvc191cGRhdGVfc2VydmVyIjoiaHR0cHM6Ly9" +
  "hcGkuZ2l0aHViLmNvbS9yZXBvcy9mYXJtYm90L2Zhcm1ib3Rfb3MvcmVsZWFzZXMvbGF0ZXN0I" +
  "iwiZndfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvRmFybUJ" +
  "vdC9mYXJtYm90LWFyZHVpbm8tZmlybXdhcmUvcmVsZWFzZXMvbGF0ZXN0IiwiYm90IjoiZGV2a" +
  "WNlXzE1In0.XidSeTKp01ngtkHzKD_zklMVr9ZUHX-U_VDlwCSmNA8ahOHxkwCtx8a3o_McBWv" +
  "OYZN8RRzQVLlHJugHq1Vvw2KiUktK_1ABQ4-RuwxOyOBqqc11-6H_GbkM8dyzqRaWDnpTqHzkH" +
  "GxanoWVTTgGx2i_MZLr8FPZ8prnRdwC1x9zZ6xY7BtMPtHW0ddvMtXU8ZVF4CWJwKSaM0Q2pTx" +
  "I9GRqrp5Y8UjaKufif7bBPOUbkEHLNOiaux4MQr-OWAC8TrYMyFHzteXTEVkqw7rved84ogw6E" +
  "KBSFCVqwRA-NKWLpPMV_q7fRwiEGWj7R-KZqRweALXuvCLF765E6-ENxA";

export const fakeFarmbot =
  (token = FAKE_TOKEN) => {
    const bot = new Farmbot({ token, speed: 100, secure: false })
    const fakeClient: any = {
      emit: jest.fn((chan: string, payload: Uint8Array) => {
        bot._onmessage(chan, payload);
      }),
      publish: jest.fn(),
    };
    bot.client = fakeClient;
    return bot;
  };

export function fakeMqttEmission<T>(bot: Farmbot,
  chan: string,
  payload: T) {

  (bot.client as any).emit(chan, stringToBuffer(JSON.stringify(payload)));
}

export function expectEmitFrom(bot: Farmbot) {
  return expect((bot.client as any).emit)
}

export const fakeFarmbotLike =
  (): FarmbotLike => ({ on: jest.fn(), client: { publish: jest.fn() } });
