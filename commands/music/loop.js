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
  execute({ client, interaction }) {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      });
    switch (
    interaction.options._hoistedOptions.map((x) => x.value).toString()
    ) {

      case "enable_loop_queue": {
        if (queue.repeatMode === 2)
          return interaction.reply({
            content: `You must first disable the current music in the loop mode (/loop Disable) ${interaction.member}... try again ? ❌`,
            ephemeral: true,
          });

        const success1 = queue.setRepeatMode(2)

        return interaction.reply({
          content: success1
            ? "Queue Loop Mode 🔁"
            : `Something went wrong ${interaction.member}... try again ? ❌`,
        });
      }

      case "disable_loop": {
        if (queue.repeatMode === 0)
          return interaction.reply({
            content: "Loop mode is already inactive. ❌",
            ephemeral: true,
          });

        const success2 = queue.setRepeatMode(0)

        return interaction.reply({
          content: success2
            ? `Something went wrong ${interaction.member}... try again ? ❌`
            : `Loop Mode **Closed** 🔁`,
        });
      }


      case "enable_loop_song": {
        if (queue.repeatMode === 1)
          return interaction.reply({
            content: `You must first disable the current music in the loop mode (/loop Disable) ${interaction.member}... try again ? ❌`,
            ephemeral: true,
          });

        const success3 = queue.setRepeatMode(1);

        return interaction.reply({
          content: success3
            ? "Now Playing Music Loop Mode 🔁"
            : `Something went wrong ${interaction.member}... try again ? ❌`,
        });

      }
    }
  },
};
