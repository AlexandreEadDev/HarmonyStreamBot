module.exports = {
  name: "resume",
  description: "Resume the track",
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

    if (!queue.paused)
      return interaction.reply({
        content: `The track is already running, ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      });

    const success = queue.resume();

    return interaction.reply({
      content: success
        ? `Current music ${currentSong.name} resumed ✅`
        : `Something went wrong ${interaction.member}... try again ? ❌`,
    });
  },
};
