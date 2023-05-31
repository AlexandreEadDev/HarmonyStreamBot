module.exports = async ({ interaction, queue }) => {
  let currentSong

  if (!queue || !queue.playing) {

    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    })
  } else {
    currentSong = queue.songs[0]
  }

  const success = queue.skip();

  return interaction.reply({
    content: success
      ? `Current music ${currentSong.name} skipped ✅`
      : `Something went wrong ${interaction.member}... try again ? ❌`,
    ephemeral: true,
  });
};
