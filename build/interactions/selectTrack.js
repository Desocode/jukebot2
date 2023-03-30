"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTrack = void 0;
const selectTrack = (interaction, results) => {
    const choiceIndex = Number(interaction.customId.split("").pop());
    console.log(interaction.customId);
    return results.tracks[choiceIndex];
};
exports.selectTrack = selectTrack;
