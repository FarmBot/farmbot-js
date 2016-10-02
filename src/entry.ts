import * as farmbot from "./farmbot";
import * as interfaces from "./interfaces/interfaces";
import * as jsonrpc from "./interfaces/jsonrpc";
import * as bot_commands from "./interfaces/bot_commands";

export let { Farmbot } = farmbot;
export let { FB } = interfaces;
export let { JSONRPC } = jsonrpc;
export let { BotCommand } = bot_commands;
