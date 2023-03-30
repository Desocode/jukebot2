import { Interaction } from "discord.js";
import { useQueue } from "discord-player";

export const skipCommand = {
  async execute(interaction: Interaction) {
    const queue = useQueue(interaction.guildId!);
    if (queue && queue.isPlaying()) {
      queue.node.skip();
      return true;
    } else {
      return false;
    }
  },
};
