const { EmbedBuilder } = require("discord.js");

module.exports = async ({ interaction, queue }) => {
  let currentSong

  if (!queue || !queue.playing) {

    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });
  } else {
    currentSong = queue.songs[0]

  }

  interaction.member
    .send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle(`:arrow_forward: ${currentSong.name}`)
          .setURL(currentSong.url)
          .addFields(
            {
              name: ":hourglass: Duration:",
              value: `\`${currentSong.formattedDuration}\``,
              inline: true,
            },
            {
              name: "Song by:",
              value: `\`${currentSong.uploader.name}\``,
              inline: true,
            },
            {
              name: "Views :eyes:",
              value: `\`${Number(currentSong.views).toLocaleString()}\``,
              inline: true,
            },
            { name: "Song URL:", value: `\`${currentSong.url}\`` }
          )
          .setThumbnail(currentSong.thumbnail)
          .setFooter({
            text: `from the server ${interaction.member.guild.name}`,
            iconURL: interaction.member.guild.iconURL({ dynamic: false }),
          }),
      ],
    })
    .then(() => {
      return interaction.reply({
        content: `I have sent you the title of the music by private messages ✅`,
        ephemeral: true,
      });
    })
    .catch((error) => {
      return interaction.reply({
        content: `Unable to send you a private message... try again ? ❌`,
        ephemeral: true,
      });
    });
};
