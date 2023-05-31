module.exports = {
  name: "stop",
  description: "Stop the track",
  voiceChannel: true,

  execute({ client, interaction }) {
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      });

    queue.stop();

    interaction.reply({
      content: `Music stopped intero this server, see you next time ✅`,
    });
  },
};
