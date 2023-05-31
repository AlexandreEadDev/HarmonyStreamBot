const maxVol = client.config.opt.maxVol;
module.exports = async ({ interaction, queue }) => {
  if (!queue || !queue.playing)
    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });

  const vol = Math.floor(queue.volume + 5);

  if (vol > maxVol)
    return interaction.reply({
      content: `I can not move the volume up any more ${interaction.member}... try again ? ❌`,
      ephemeral: true,
    });

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
    ephemeral: true,
  });
};
