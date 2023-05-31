const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "del",
  description: "Delete an amount of messages",
  permissions: PermissionFlagsBits.BanMembers,
  options: [
    {
      name: "amount",
      description: "the amount of messages you want delete",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  async execute({ interaction }) {
    let amount = interaction.options.getNumber("amount");
    if (isNaN(amount)) {
      return interaction.reply("that doesn't seem to be a valid number.");
    } else if (amount <= 0 || amount > 100) {
      return interaction.reply("you need to input a number between 1 and 100.");
    }
    interaction.channel.bulkDelete(amount + 1).catch((err) => {
      console.error(err);
      interaction.channel.send(
        "there was an error trying to prune messages in this channel!"
      );
    });
  },
};
