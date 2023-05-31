module.exports = {
  name: "skip",
  description: "skip to the next song",
  voiceChannel: true,

  execute({ client, interaction }) {
    const queue = client.player.getQueue(interaction.guildId);
    let currentSong
    let success

    if (!queue) {
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      })
    } else {
      currentSong = queue.songs[0]
    }

    if (queue.songs.length <= 1) {
      return interaction.reply({
        content: `There is no music played after${interaction.member}... try again ? ❌`,
        ephemeral: true,
      });
    } else {
      success = queue.skip();

    }


    return interaction.reply({
      content: success
        ? `Current music ${currentSong.name} skipped ✅`
        : `Something went wrong ${interaction.member}... try again ? ❌`,
    });
  },
};
