const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "unmute",
  description: "remove an user from Muted role",
  permissions: PermissionFlagsBits.BanMembers,
  options: [
    {
      name: "user",
      description: "the name of the user",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async execute({ interaction }) {
    const mutedRole = interaction.guild.roles.cache.find(
      (role) => role.name === "Muted"
    );
    if (!mutedRole) {
      return interaction.channel.send("There is no Muted role on this server");
    }
    const target = interaction.options.getMember("user");
    if (!target.roles.cache.some((role) => role.name === "Muted")) {
      return interaction.channel.send("There is no Muted role on this user");
    } else {
      await target.roles.remove(mutedRole).catch(console.error);
      return interaction.channel.send(`The user have been Unmute`);
    }
  },
};
