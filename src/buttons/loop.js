
module.exports = async ({ interaction, queue }) => {
  const methods = ["disabled", "track", "queue"];

  if (!queue || !queue.playing)
    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });

  const repeatMode = queue.repeatMode;

  if (repeatMode === 0) queue.setRepeatMode(1);

  if (repeatMode === 1) queue.setRepeatMode(2);

  if (repeatMode === 2) queue.setRepeatMode(0);

  return interaction.reply({
    content: `loop made has been set to **${methods[queue.repeatMode]}**.✅`,
  });
};
