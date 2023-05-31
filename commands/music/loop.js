const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "loop",
  description: "enable or disable looping of song's or the whole queue",
  voiceChannel: true,
  options: [
    {
      name: "action",
      description: "what action you want to preform on the loop",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Queue", value: "enable_loop_queue" },
        { name: "Disable", value: "disable_loop" },
        { name: "Song", value: "enable_loop_song" },
      ],
    },
  ],
  execute({ interaction }) {
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      });
    switch (
    interaction.options._hoistedOptions.map((x) => x.value).toString()
    ) {
      case "enable_loop_queue": {
        if (queue.repeatMode === 1)
          return interaction.reply({
            content: `You must first disable the current music in the loop mode (/loop Disable) ${interaction.member}... try again ? ❌`,
            ephemeral: true,
          });

        const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);

        return interaction.reply({
          content: success
            ? `Repeat mode **enabled** the whole queue will be repeated endlessly 🔁`
            : `Something went wrong ${interaction.member}... try again ? ❌`,
        });
        break;
      }
      case "disable_loop": {
        const success = queue.setRepeatMode(QueueRepeatMode.OFF);

        return interaction.reply({
          content: success
            ? `Repeat mode **disabled**`
            : `Something went wrong ${interaction.member}... try again ? ❌`,
        });
        break;
      }
      case "enable_loop_song": {
        if (queue.repeatMode === 2)
          return interaction.reply({
            content: `You must first disable the current music in the loop mode (/loop Disable) ${interaction.member}... try again ? ❌`,
            ephemeral: true,
          });

        const success = queue.setRepeatMode(QueueRepeatMode.TRACK);

        return interaction.reply({
          content: success
            ? `Repeat mode **enabled** the current song will be repeated endlessly (you can end the loop with /loop disable)`
            : `Something went wrong ${interaction.member}... try again ? ❌`,
        });
        break;
      }
    }
  },
};
