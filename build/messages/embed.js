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
exports.sendEmbed = void 0;
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
let nowPlayingMessage;
const sendEmbed = (channel, track) => __awaiter(void 0, void 0, void 0, function* () {
    const components = [mediaButtonRow(track)];
    const queueRowComponent = queueRow(track);
    if (queueRowComponent) {
        components.push(queueRowComponent);
    }
    if (nowPlayingMessage) {
        yield nowPlayingMessage.delete();
    }
    nowPlayingMessage = yield channel.send({
        embeds: [mediaPlayerEmbed(track)],
        components,
        tts: false,
    });
});
exports.sendEmbed = sendEmbed;
const mediaButtonRow = (track) => {
    var _a, _b, _c;
    track.player;
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
            .setCustomId("play")
            .setLabel(((_a = track.queue) === null || _a === void 0 ? void 0 : _a.isPlaying()) ? "⏸" : "⏵")
            .setStyle(1)
            .setDisabled(false),
        new builders_1.ButtonBuilder()
            .setCustomId("skip")
            .setLabel("⏭")
            .setStyle(1)
            .setDisabled(!Boolean(((_b = track.queue) === null || _b === void 0 ? void 0 : _b.size) && ((_c = track.queue) === null || _c === void 0 ? void 0 : _c.size) > 0)),
    ];
    return new discord_js_1.ActionRowBuilder().addComponents(buttonBuilders);
};
const queueRow = (track) => {
    const queue = track.queue;
    if (queue) {
        const options = queue.tracks.toArray().map((t) => {
            return {
                label: `${t.author} - ${t.title} ${t.requestedBy ? `: ${t.requestedBy}` : ""}}`,
                value: t.id,
            };
        });
        const actionRowBuilder = new discord_js_1.ActionRowBuilder().addComponents(new builders_1.SelectMenuBuilder()
            .setCustomId("select-queue")
            .setPlaceholder("Queue")
            .addOptions(options));
        return actionRowBuilder;
    }
    return undefined;
};
const mediaPlayerEmbed = (track) => {
    const { title, source, duration, thumbnail, author, url, queue } = track;
    const [nextTrack] = (queue === null || queue === void 0 ? void 0 : queue.tracks.toArray()) || [];
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
