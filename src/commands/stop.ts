import { Interaction } from "discord.js";
import { useQueue } from "discord-player";

export const stopCommand = {
  async execute(interaction: Interaction) {
    const queue = useQueue(interaction.guildId!);
    if (queue) {
      queue.delete;
      return true;
    }
    return false;
  },
};
