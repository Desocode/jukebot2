"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMediaSelector = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const sendMediaSelector = (channel, results) => {
    return channel.send({
        embeds: [embedBuilder],
        components: searchResultComponents(results),
        tts: false,
    });
};
exports.sendMediaSelector = sendMediaSelector;
const embedBuilder = new discord_js_1.EmbedBuilder()
    .setTitle("Search Results")
    .setDescription("Top results for your search");
const searchResultComponents = (results) => {
    return results.tracks.slice(0, 3).map((track, index) => {
        return new builders_1.ActionRowBuilder().addComponents(new builders_1.ButtonBuilder()
            .setCustomId(`track-${index}`)
            .setLabel(`${track.author.substring(0, 40)} - ${track.title.substring(0, 40)}`)
            .setStyle(1)
            .setDisabled(false));
    });
};
