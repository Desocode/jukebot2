import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { SearchResult } from "discord-player";
import {
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  TextBasedChannel,
} from "discord.js";

export const sendMediaSelector = (
  channel: TextBasedChannel,
  results: SearchResult
) => {
  return channel.send({
    embeds: [embedBuilder],
    components: searchResultComponents(results),
    tts: false,
  });
};

const embedBuilder = new EmbedBuilder()
  .setTitle("Search Results")
  .setDescription("Top results for your search");

const searchResultComponents = (results: SearchResult) => {
  return results.tracks.slice(0, 3).map((track, index) => {
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`track-${index}`)
        .setLabel(
          `${track.author.substring(0, 40)} - ${track.title.substring(0, 40)}`
        )
        .setStyle(1)
        .setDisabled(false)
    );
  });
};
