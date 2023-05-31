const { EmbedBuilder } = require("discord.js");
module.exports = async ({ client, interaction, queue }) => {
  let currentSong


  if (!queue) {
    return interaction.reply({
      content: `No music currently playing ${interaction.member}... try again ? ❌`,
      ephemeral: true,
    })
  } else {
    currentSong = queue.songs[0]
  }

  if (!currentSong)
    return interaction.reply({
      content: `No music in the queue after the current one ${interaction.member}... try again ? ❌`,
      ephemeral: true,
    });

  const methods = ["", "🔁", "🔂"];

  const songsList = queue.songs.length;

  const nextSongs =
    songsList > 5
      ? `And **${songsList - 5}** other song(s)...`
      : `In the playlist **${songsList}** song(s)...`;

  const tracks = queue.songs.slice(1).map(
    (track, i) =>
      `**${i + 1}** - ${track.name} | ${track.uploader.name} (requested by : ${track.user
      })`
  );


  const embed = new EmbedBuilder()
    .setColor("#ff0000")
    .setThumbnail(currentSong.thumbnail)
    .setAuthor({
      name: `Server queue - ${interaction.guild.name} ${methods[queue.repeatMode]
        }`,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
    })
    .setDescription(
      `Current: ${currentSong.name} | ${currentSong.uploader.name}\n\n${tracks
        .slice(0, 5)
        .join("\n")}\n\n${nextSongs}`
    )
    .setTimestamp()
  interaction.reply({ embeds: [embed], ephemeral: true });
};
