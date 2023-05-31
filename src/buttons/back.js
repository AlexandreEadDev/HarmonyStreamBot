module.exports = async ({ interaction, queue }) => {
  if (!queue || !queue.playing)
    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });

  if (!queue.previousSongs[0])
    return interaction.reply({
      content: `There was no music played before ${interaction.member}... try again ? ❌`,
      ephemeral: true,
    });

  await queue.previous();

  interaction.reply({
    content: `Playing the **previous** track ✅`,
    ephemeral: true,
  });
};
