const { EmbedBuilder, InteractionType } = require("discord.js");

module.exports = (client, interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const DJ = client.config.opt.DJ;
    const command = client.commands.get(interaction.commandName);

    if (!command)
      return (
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription("❌ | Error! Please contact Developers!"),
          ],
          ephemeral: true,
        }),
        client.slash.delete(interaction.commandName)
      );
    if (
      command.permissions &&
      !interaction.member.permissions.has(command.permissions)
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
              `❌ | You need do not have the proper permissions to exacute this command`
            ),
        ],
        ephemeral: true,
      });
    if (
      DJ.enabled &&
      DJ.commands.includes(command) &&
      !interaction.member._roles.includes(
        interaction.guild.roles.cache.find((x) => x.name === DJ.roleName).id
      )
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
              `❌ | This command is reserved For members with \`${DJ.roleName}\` `
            ),
        ],
        ephemeral: true,
      });
    if (command.voiceChannel) {
      if (!interaction.member.voice.channel)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(`❌ | You are not in a Voice Channel`),
          ],
          ephemeral: true,
        });
      if (
        interaction.guild.members.me.voice.channel &&
        interaction.member.voice.channel.id !==
          interaction.guild.members.me.voice.channel.id
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(`❌ | You are not in the same Voice Channel`),
          ],
          ephemeral: true,
        });
    }
    command.execute({ interaction, client });
  }
  if (interaction.type === InteractionType.MessageComponent) {
    const customId = JSON.parse(interaction.customId);
    const file_of_button = customId.ffb;
    const queue = player.getQueue(interaction.guildId);
    if (file_of_button) {
      delete require.cache[
        require.resolve(`../src/buttons/${file_of_button}.js`)
      ];
      const button = require(`../src/buttons/${file_of_button}.js`);
      if (button) return button({ client, interaction, customId, queue });
    }
  }
};
