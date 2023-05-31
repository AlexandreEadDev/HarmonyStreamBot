const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "seek",
  description: "skip back or foward in a song",
  voiceChannel: true,
  options: [
    {
      name: "time",
      description: "time that you want to skip to",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],


  async execute({ client, interaction }) {
    try {
      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: lang.msg5, ephemeral: true }).catch(e => { })

      let time = getSeconds(interaction.options.getString("time"))
      if (isNaN(time)) return interaction.reply({ content: "Incorrect usage. Example: `4:20` | `2:54:45`", ephemeral: true }).catch(e => { })

      queue.seek(time)
      interaction.reply({ content: `Playing time was set to ${queue.formattedCurrentTime} sucessfully` }).catch(e => { })

    } catch (e) { }
  },
};

function getSeconds(str) {
  var p = str.split(':')
  var sec = 0
  var min = 1
  while (p.length > 0) {
    sec += min * parseInt(p.pop(), 10);
    min *= 60;
  }
  return sec;
};

