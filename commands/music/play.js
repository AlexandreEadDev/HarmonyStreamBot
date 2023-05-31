const { ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  name: "play",
  description: "Play a song!",
  voiceChannel: true,
  options: [
    {
      name: "song",
      description: "The song you want to play",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async execute({ client, interaction }) {



    const name = interaction.options.getString('song')

    if (!name) return interaction.reply({ content: "Écrivez le nom de la piste que vous souhaitez rechercher. ❌", ephemeral: true }).catch(e => { })

    await interaction.reply({ content: "Chargement de musique(s)... 🎧" }).catch(e => { })
    try {
      await client.player.play(interaction.member.voice.channel, name, {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction
      })

      const queue = player.getQueue(interaction.guild);


      if (queue) {
        if (queue.songs.length >= 2) {
          const lastSong = queue.songs[queue.songs.length - 1];
          queue?.textChannel?.send({ content: `🎵 Ajouter à la liste: ${lastSong.name}🎧` }).catch(e => { });
        } else {
          queue?.textChannel?.send({ content: `🎵 En cours de lecture: ${queue.songs[0].name}🎧` }).catch(e => { });
        }
      }
    } catch (e) {
      await interaction.editReply({ content: `Aucun résultat trouvé! ❌`, ephemeral: true }).catch(e => { })
    }
  }
}


