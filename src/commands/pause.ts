import { useQueue } from "discord-player";
import { Interaction } from "discord.js";

export const pauseCommand = {
  name: "pause",
  description: "Pauses the currently playing song",
  async execute(interaction: Interaction) {
    if (interaction.guild && interaction.channel) {
      const queue = useQueue(interaction.guild.id);
      if (queue) {
        queue?.node.setPaused(!queue.node.isPaused()); //isPaused() returns true if that player is already paused
        interaction;
      }
    }
  },
};
