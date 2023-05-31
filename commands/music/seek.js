const ms = require("ms");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "seek",
  description: "skip back or foward in a song",
  voiceChannel: true,
  options: [
    {
      name: "time",
      description: "time that you want to skip to",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async execute({ interaction }) {
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return interaction.reply({
        content: `No music currently playing ${interaction.reply}... try again ? ❌`,
        ephemeral: true,
      });

    const timeToMS = ms(interaction.options.getString("time"));

    if (timeToMS >= queue.current.durationMS)
      return interaction.reply({
        content: `The indicated time is higher than the total time of the current song ${interaction.member}... try again ? ❌\n*Try for example a valid time like **5s, 10s, 20 seconds, 1m**...*`,
        ephemeral: true,
      });

    await queue.seek(timeToMS);

    interaction.reply({
      content: `Time set on the current song **${ms(timeToMS, {
        long: true,
      })}** ✅`,
    });
  },
};
