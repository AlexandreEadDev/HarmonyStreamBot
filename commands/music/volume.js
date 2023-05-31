const maxVol = client.config.opt.maxVol;
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "adjust",
  voiceChannel: true,
  options: [
    {
      name: "volume",
      description: "the amount volume",
      type: ApplicationCommandOptionType.Number,
      required: true,
      minValue: 1,
      maxValue: maxVol,
    },
  ],

  execute({ client, interaction }) {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue)
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      });
    const vol = interaction.options.getNumber("volume");

    if (queue.volume === vol)
      return interaction.reply({
        content: `The volume you want to change is already the current one ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      });

    const success = queue.setVolume(vol);

    return interaction.reply({
      content: success
        ? `The volume has been modified to **${vol}**/**${maxVol}**% 🔊`
        : `Something went wrong ${interaction.member}... try again ? ❌`,
    });
  },
};
