import { Client, Events, GatewayIntentBits } from "discord.js";
import { Player, SearchResult } from "discord-player";

import { playCommand } from "./commands/play";
import { pauseCommand } from "./commands/pause";
import { skipCommand } from "./commands/skip";
import { stopCommand } from "./commands/stop";
import { sendMediaSelector as sendEmbedMediaSelector } from "./messages/embedMediaSelector";
import { selectTrack } from "./interactions/selectTrack";

require("dotenv").config();

let results: SearchResult;

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
  ],
});

const player = new Player(client, {
  smoothVolume: true,
  ytdlOptions: {
    quality: "highestaudio",
  },
});

process.on("unhandledRejection", console.error);

client.on("ready", () => {
  console.log(`Here is ${client.user?.tag}. Now even more powerful!`);
});

client.on("interactionCreate", async (interaction) => {
  if (
    !interaction.isCommand() ||
    !interaction.guildId ||
    !interaction.isChatInputCommand() ||
    !interaction.channel
  )
    return;

  switch (interaction.commandName) {
    case "play":
      const query = interaction.options.getString("url");
      const searchingForMessage = await interaction.reply({
        ephemeral: true,
        content: `Searching for ${query}`,
      });
      if (query) {
        results = await player.search(query);
      }
      await sendEmbedMediaSelector(interaction.channel, results);
      searchingForMessage.delete();
      break;
    case "pause":
      interaction.reply("pausing");
      pauseCommand.execute(interaction);
      break;
    case "stop":
      stopCommand.execute(interaction);
      break;
    case "skip":
      skipCommand.execute(interaction);
      break;
    default:
      break;
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  switch (interaction.customId) {
    case "pause":
      pauseCommand.execute(interaction);
      interaction.reply("Pause Command");
      interaction.deleteReply();
      break;
    case "stop":
      stopCommand.execute(interaction);
      break;
    case "rewind":
      break;
    case "skip":
      skipCommand.execute(interaction);
      break;
    default:
      if ((interaction.customId.startsWith("track-"), results, player)) {
        await playCommand.execute(
          interaction,
          player,
          selectTrack(interaction, results)
        );
        interaction.message.delete();
      }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
