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
exports.updatePause = exports.sendEmbedMediaControls = void 0;
const builders_1 = require("@discordjs/builders");
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
let nowPlayingMessage;
const sendEmbedMediaControls = (channel, queue) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTrack = queue.currentTrack;
    const components = [mediaButtonRowBuilder(queue)];
    const queueRowComponent = queueRow(queue);
    if (queueRowComponent) {
        components.push(queueRowComponent);
    }
    if (nowPlayingMessage) {
        yield nowPlayingMessage.delete();
    }
    if (!currentTrack) {
        return;
    }
    try {
        nowPlayingMessage = yield channel.send({
            embeds: [mediaPlayerEmbed(currentTrack, queue)],
            components,
            tts: false,
        });
    }
    catch (err) {
        throw err;
    }
});
exports.sendEmbedMediaControls = sendEmbedMediaControls;
const updatePause = (interaction) => {
    if (interaction.guildId) {
        const queue = (0, discord_player_1.useQueue)(interaction.guildId);
        if (queue) {
            interaction.update({
                components: [mediaButtonRowBuilder(queue)],
            });
        }
    }
};
exports.updatePause = updatePause;
const mediaButtonRowBuilder = (queue) => {
    const buttonBuilders = [
        new builders_1.ButtonBuilder()
            .setCustomId("rewind")
            .setLabel("⏮")
            .setStyle(1)
            .setDisabled(false),
        new builders_1.ButtonBuilder()
            .setCustomId("stop")
            .setLabel("⏹")
            .setStyle(4)
            .setDisabled(false),
        new builders_1.ButtonBuilder()
            .setCustomId("pause")
            .setLabel(queue.node.isPaused() ? "⏵" : "⏸")
            .setStyle(1)
            .setDisabled(false),
        new builders_1.ButtonBuilder()
            .setCustomId("skip")
            .setLabel("⏭")
            .setStyle(1)
            .setDisabled(!Boolean(queue.size && queue.size > 0)),
    ];
    return new discord_js_1.ActionRowBuilder().addComponents(buttonBuilders);
};
const queueRow = (queue) => {
    if (queue) {
        const options = queue.tracks
            .toArray()
            .map((t) => {
            return {
                label: `${t.author} - ${t.title} ${t.requestedBy ? `: ${t.requestedBy}` : ""}`,
                value: t.id,
            };
        })
            .slice(0, 25);
        if (options.length > 0) {
            const actionRowBuilder = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.SelectMenuBuilder()
                .setCustomId("select-queue")
                .setPlaceholder("Queue")
                .addOptions(options));
            return actionRowBuilder;
        }
    }
    return undefined;
};
const mediaPlayerEmbed = (currentTrack, queue) => {
    const { title, source, duration, thumbnail, author, url } = currentTrack;
    const [nextTrack] = queue.tracks.toArray() || [];
    const embedBuilder = new discord_js_1.EmbedBuilder()
        .setColor(0x586eff)
        .setTitle(title)
        .setDescription(`Source: ${source} | ${duration}`)
        .setThumbnail(thumbnail)
        .setAuthor({ name: author })
        .setURL(url);
    if (nextTrack) {
        embedBuilder.setFooter({
            text: `Up next: ${nextTrack.author} - ${nextTrack.title} | ${nextTrack.source}`,
            iconURL: nextTrack.thumbnail,
        });
    }
    return embedBuilder;
};
