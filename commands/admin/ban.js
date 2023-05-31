const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "Select a member and ban them.",
  permissions: PermissionFlagsBits.BanMembers,
  options: [
    {
      name: "user",
      description: "the name of the user",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "the reason why you ban the user",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute({ interaction }) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";

    await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
    await interaction.guild.members.ban(target);
  },
};
