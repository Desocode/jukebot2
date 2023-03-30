import { SearchResult } from "discord-player";
import { ButtonInteraction } from "discord.js";

export const selectTrack = (
  interaction: ButtonInteraction,
  results: SearchResult
) => {
  const choiceIndex = Number(interaction.customId.split("").pop());
  console.log(interaction.customId);
  return results.tracks[choiceIndex];
};
