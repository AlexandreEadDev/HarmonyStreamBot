module.exports = {
  name: "skip",
  description: "stop the track",
  voiceChannel: true,

  execute({ client, interaction }) {
    const queue = client.player.getQueue(interaction.guildId);
    let currentSong


    if (!queue) {
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again ? ❌`,
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
    });
  },
};
