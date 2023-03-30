import { ButtonBuilder, SelectMenuBuilder } from "@discordjs/builders";
import { GuildQueue, Track, useQueue } from "discord-player";
import {
  EmbedBuilder,
  ActionRowBuilder,
  TextBasedChannel,
  Message,
  ButtonInteraction,
} from "discord.js";

let nowPlayingMessage: Message;

export const sendEmbedMediaControls = async (
  channel: TextBasedChannel,
  queue: GuildQueue
) => {
  const currentTrack = queue.currentTrack;
  const components: any[] = [mediaButtonRowBuilder(queue)];
  const queueRowComponent = queueRow(queue);
  if (queueRowComponent) {
    components.push(queueRowComponent);
  }

  if (nowPlayingMessage) {
    await nowPlayingMessage.delete();
  }

  if (!currentTrack) {
    return;
  }
  try {
    nowPlayingMessage = await channel.send({
      embeds: [mediaPlayerEmbed(currentTrack, queue)],
      components,
      tts: false,
    });
  } catch (err) {
    throw err;
  }
};

export const updatePause = (interaction: ButtonInteraction) => {
  if (interaction.guildId) {
    const queue = useQueue(interaction.guildId);
    if (queue) {
      interaction.update({
        components: [mediaButtonRowBuilder(queue)],
      });
    }
  }
};

const mediaButtonRowBuilder = (queue: GuildQueue) => {
  const buttonBuilders = [
    new ButtonBuilder()
      .setCustomId("rewind")
      .setLabel("⏮")
      .setStyle(1)
      .setDisabled(false),
    new ButtonBuilder()
      .setCustomId("stop")
      .setLabel("⏹")
      .setStyle(4)
      .setDisabled(false),
    new ButtonBuilder()
      .setCustomId("pause")
      .setLabel(queue.node.isPaused() ? "⏵" : "⏸")
      .setStyle(1)
      .setDisabled(false),
    new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("⏭")
      .setStyle(1)
      .setDisabled(!Boolean(queue.size && queue.size > 0)),
  ];

  return new ActionRowBuilder<ButtonBuilder>().addComponents(buttonBuilders);
};

const queueRow = (queue: GuildQueue) => {
  if (queue) {
    const options = queue.tracks
      .toArray()
      .map((t) => {
        return {
          label: `${t.author} - ${t.title} ${
            t.requestedBy ? `: ${t.requestedBy}` : ""
          }`,
          value: t.id,
        };
      })
      .slice(0, 25);

    if (options.length > 0) {
      const actionRowBuilder =
        new ActionRowBuilder<SelectMenuBuilder>().addComponents(
          new SelectMenuBuilder()
            .setCustomId("select-queue")
            .setPlaceholder("Queue")
            .addOptions(options)
        );
      return actionRowBuilder;
    }
  }
  return undefined;
};

const mediaPlayerEmbed = (currentTrack: Track, queue: GuildQueue) => {
  const { title, source, duration, thumbnail, author, url } = currentTrack;
  const [nextTrack] = queue.tracks.toArray() || [];

  const embedBuilder = new EmbedBuilder()
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
