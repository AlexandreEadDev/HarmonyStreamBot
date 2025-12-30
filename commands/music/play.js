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
    const name = interaction.options.getString("song");

    if (!name)
      return interaction
        .reply({
          content:
            "Écrivez le nom de la piste que vous souhaitez rechercher. ❌",
          ephemeral: true,
        })
        .catch((e) => {});

    // On utilise deferReply car la recherche peut prendre du temps
    await interaction.deferReply().catch((e) => {});

    try {
      await client.player.play(interaction.member.voice.channel, name, {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction,
        metadata: interaction.channel, // Important pour que events.js puisse envoyer des messages
      });

      // On ne répond pas ici "En cours de lecture" car l'event 'trackStart' le fera,
      // ou 'addList' si c'est une playlist.
      // On peut supprimer le message de chargement ou le laisser tel quel.
      await interaction
        .editReply({ content: "Recherche terminée... 🎧" })
        .catch((e) => {});
    } catch (e) {
      console.error(e);
      await interaction
        .editReply({
          content: `Aucun résultat trouvé ou erreur lors de la lecture! ❌`,
          ephemeral: true,
        })
        .catch((e) => {});
    }
  },
};
