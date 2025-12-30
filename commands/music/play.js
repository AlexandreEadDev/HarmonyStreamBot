const { ApplicationCommandOptionType } = require("discord.js");
const ytSearch = require("yt-search");

module.exports = {
  name: "play",
  description: "Play a song!",
  voiceChannel: true,
  options: [
    {
      name: "song",
      description: "The song you want to play (name or link)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async execute({ client, interaction }) {
    let name = interaction.options.getString("song");

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
      // Vérification : Est-ce une URL ou une recherche ?
      // Si ce n'est PAS un lien http/https, on effectue une recherche manuelle
      if (!name.startsWith("http")) {
        // On cherche la vidéo via yt-search
        const searchResult = await ytSearch(name);

        // Si aucun résultat n'est trouvé
        if (
          !searchResult ||
          !searchResult.videos ||
          searchResult.videos.length === 0
        ) {
          return interaction.editReply({
            content: `Aucun résultat trouvé pour cette recherche ! ❌`,
            ephemeral: true,
          });
        }

        // On prend la première vidéo trouvée (la plus pertinente)
        // On met à jour la variable 'name' avec l'URL de la vidéo
        name = searchResult.videos[0].url;
      }

      // On lance la lecture avec l'URL (soit celle fournie par l'utilisateur, soit celle trouvée par la recherche)
      await client.player.play(interaction.member.voice.channel, name, {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction,
        metadata: interaction.channel, // Important pour que events.js puisse envoyer des messages
      });

      // On ne répond pas ici "En cours de lecture" car l'event 'trackStart' le fera,
      // ou 'addList' si c'est une playlist.
      await interaction
        .editReply({ content: "Recherche terminée... 🎧" })
        .catch((e) => {});
    } catch (e) {
      console.error(e);
      await interaction
        .editReply({
          content: `Erreur lors de la lecture ! Vérifiez que le lien est valide. ❌`,
          ephemeral: true,
        })
        .catch((e) => {});
    }
  },
};
