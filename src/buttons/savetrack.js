const { EmbedBuilder } = require("discord.js");

module.exports = async ({ interaction, queue }) => {
  if (!queue || !queue.playing)
    return interaction.reply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });

  interaction.member
    .send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle(`:arrow_forward: ${queue.current.title}`)
          .setURL(queue.current.url)
          .addFields(
            {
              name: ":hourglass: Duration:",
              value: `\`${queue.current.duration}\``,
              inline: true,
            },
            {
              name: "Song by:",
              value: `\`${queue.current.author}\``,
              inline: true,
            },
            {
              name: "Views :eyes:",
              value: `\`${Number(queue.current.views).toLocaleString()}\``,
              inline: true,
            },
            { name: "Song URL:", value: `\`${queue.current.url}\`` }
          )
          .setThumbnail(queue.current.thumbnail)
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
