const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "delete",
  description: "Delete a specified number of messages from the channel.",
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages, // Required permissions to use this command
  options: [
    {
      name: "amount",
      description: "Number of messages to delete",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      choices: null, // You can add choices if needed
      minValue: 1,
      maxValue: 100, // Example: Limit to 100 messages per bulk delete
    },
  ],

  execute: async ({ client, interaction }) => {
    const amount = interaction.options.getInteger("amount");

    // Verify if the user has the required permissions
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true, // Makes the response visible only to the user who used the command
      });
    }

    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      interaction.reply({
        content: `Successfully deleted ${messages.size} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error deleting messages:", error);
      if (error.code === 50001) {
        interaction.reply({
          content:
            "Missing access to delete messages. Ensure the bot has the necessary permissions.",
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: "Failed to delete messages.",
          ephemeral: true,
        });
      }
    }
  },
};
