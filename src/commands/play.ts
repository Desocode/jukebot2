import { ButtonInteraction, GuildMember } from "discord.js";
import {
  Player,
  Playlist,
  SearchResult,
  Track,
  useQueue,
} from "discord-player";
import { sendEmbedMediaControls } from "../messages/embedMediaControls";

export const playCommand = {
  name: "play",
  description: "Play a song in your voice channel",
  options: [
    {
      name: "url",
      type: "STRING" as const,
      description: "The YouTube URL of the song you want to play",
      required: true,
    },
  ],
  async execute(
    interaction: ButtonInteraction,
    player: Player,
    query?: string | Track | SearchResult | Track[] | Playlist
  ) {
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel &&
      query
    ) {
      try {
        const { track } = await player.play(
          interaction.member.voice.channel,
          query,
          {
            nodeOptions: {
              metadata: interaction,
              volume: 25,
            },
          }
        );
        if (track && interaction.channel && interaction.guildId) {
          const queue = useQueue(interaction.guildId);
          if (queue) {
            sendEmbedMediaControls(interaction.channel, queue);
            return true;
          }
        }
      } catch (e) {
        interaction.followUp(`Something went wrong: ${e}`);
        return false;
      }
    } else {
      interaction.followUp("You need to join a voice channel first!");
      return false;
    }
  },
};
