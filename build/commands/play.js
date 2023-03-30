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
exports.playCommand = void 0;
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const embedMediaControls_1 = require("../messages/embedMediaControls");
exports.playCommand = {
    name: "play",
    description: "Play a song in your voice channel",
    options: [
        {
            name: "url",
            type: "STRING",
            description: "The YouTube URL of the song you want to play",
            required: true,
        },
    ],
    execute(interaction, player, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.member instanceof discord_js_1.GuildMember &&
                interaction.member.voice.channel &&
                query) {
                try {
                    const { track } = yield player.play(interaction.member.voice.channel, query, {
                        nodeOptions: {
                            metadata: interaction,
                            volume: 25,
                        },
                    });
                    if (track && interaction.channel && interaction.guildId) {
                        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
                        if (queue) {
                            (0, embedMediaControls_1.sendEmbedMediaControls)(interaction.channel, queue);
                            return true;
                        }
                    }
                }
                catch (e) {
                    interaction.followUp(`Something went wrong: ${e}`);
                    return false;
                }
            }
            else {
                interaction.followUp("You need to join a voice channel first!");
                return false;
            }
        });
    },
};
