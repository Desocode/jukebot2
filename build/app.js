"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const play_1 = require("./commands/play");
const pause_1 = require("./commands/pause");
const skip_1 = require("./commands/skip");
const stop_1 = require("./commands/stop");
const embedMediaSelector_1 = require("./messages/embedMediaSelector");
const selectTrack_1 = require("./interactions/selectTrack");
require("dotenv").config();
let results;
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.Guilds,
    ],
});
const player = new discord_player_1.Player(client, {
    smoothVolume: true,
    ytdlOptions: {
        quality: "highestaudio",
    },
});
process.on("unhandledRejection", console.error);
client.on("ready", () => {
    var _a;
    console.log(`Here is ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}. Now even more powerful!`);
});
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand() ||
        !interaction.guildId ||
        !interaction.isChatInputCommand() ||
        !interaction.channel)
        return;
    switch (interaction.commandName) {
        case "play":
            const query = interaction.options.getString("url");
            const searchingForMessage = yield interaction.reply({
                ephemeral: true,
                content: `Searching for ${query}`,
            });
            if (query) {
                results = yield player.search(query);
            }
            yield (0, embedMediaSelector_1.sendMediaSelector)(interaction.channel, results);
            searchingForMessage.delete();
            break;
        case "pause":
            interaction.reply("pausing");
            pause_1.pauseCommand.execute(interaction);
            break;
        case "stop":
            stop_1.stopCommand.execute(interaction);
            break;
        case "skip":
            skip_1.skipCommand.execute(interaction);
            break;
        default:
            break;
    }
}));
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isButton())
        return;
    switch (interaction.customId) {
        case "pause":
            pause_1.pauseCommand.execute(interaction);
            interaction.reply("Pause Command");
            interaction.deleteReply();
            break;
        case "stop":
            stop_1.stopCommand.execute(interaction);
            break;
        case "rewind":
            break;
        case "skip":
            skip_1.skipCommand.execute(interaction);
            break;
        default:
            if ((interaction.customId.startsWith("track-"), results, player)) {
                yield play_1.playCommand.execute(interaction, player, (0, selectTrack_1.selectTrack)(interaction, results));
                interaction.message.delete();
            }
    }
}));
client.login(process.env.DISCORD_BOT_TOKEN);
