module.exports = async ({ interaction, queue }) => {
  let currentSong


  if (!queue) {
    return interaction.reply({
      content: `No music currently playing ${interaction.member}... try again ? ❌`,
      ephemeral: true,
    })
  } else {
    currentSong = queue.songs[0]
  }
  const isPaused = queue.paused;

  if (isPaused === false) queue.pause()

  console.log(isPaused);

  if (isPaused === true) queue.resume()



  return interaction.reply({
    content: `${isPaused
      ? `Current music ${currentSong.name} resumed  ✅`
      : `Current music ${currentSong.name} paused  ✅`
      }`,
    ephemeral: true,
  });
};
