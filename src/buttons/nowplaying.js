const { EmbedBuilder } = require("discord.js");
module.exports = async ({ client, interaction, queue }) => {
  if (!queue || !queue.playing)
    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });

  const track = queue.current;

  const methods = ["disabled", "track", "queue"];

  const timestamp = queue.getPlayerTimestamp();

  const trackDuration =
    timestamp.progress == "Infinity" ? "infinity (live)" : track.duration;

  const progress = queue.createProgressBar();

  const embed = new EmbedBuilder()
    .setAuthor({
      name: track.title,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
    })
    .setThumbnail(track.thumbnail)
    .setDescription(
      `Volume **${queue.volume
      }**%\nDuration **${trackDuration}**\nProgress ${progress}\nLoop mode **${methods[queue.repeatMode]
      }**\nRequested by ${track.requestedBy}`
    )
    .setColor("ff0000")
    .setTimestamp();

  interaction.reply({ embeds: [embed], ephemeral: true });
};
