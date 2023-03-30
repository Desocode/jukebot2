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
exports.pauseCommand = void 0;
const discord_player_1 = require("discord-player");
exports.pauseCommand = {
    name: "pause",
    description: "Pauses the currently playing song",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.guild && interaction.channel) {
                const queue = (0, discord_player_1.useQueue)(interaction.guild.id);
                if (queue) {
                    queue === null || queue === void 0 ? void 0 : queue.node.setPaused(!queue.node.isPaused()); //isPaused() returns true if that player is already paused
                    interaction;
                }
            }
        });
    },
};
