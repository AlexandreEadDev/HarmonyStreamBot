const { QueueRepeatMode } = require("discord-player");
module.exports = async ({ interaction, queue }) => {
  const methods = ["disabled", "track", "queue"];

  if (!queue || !queue.playing)
    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });

  const repeatMode = queue.repeatMode;

  if (repeatMode === 0) queue.setRepeatMode(QueueRepeatMode.TRACK);

  if (repeatMode === 1) queue.setRepeatMode(QueueRepeatMode.QUEUE);

  if (repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF);

  return interaction.reply({
    content: `loop made has been set to **${methods[queue.repeatMode]}**.✅`,
  });
};
