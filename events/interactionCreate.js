const { EmbedBuilder, InteractionType } = require("discord.js");

// Exporte une fonction qui prend en paramètre le client et l'interaction
module.exports = (client, interaction) => {
  // Vérifie si l'interaction est une commande d'application (slash command)
  if (interaction.type === InteractionType.ApplicationCommand) {
    const DJ = client.config.opt.DJ; // Récupère les paramètres de configuration pour les commandes DJ
    const command = client.commands.get(interaction.commandName); // Récupère la commande correspondante au nom de la commande utilisée

    // Si la commande n'existe pas, envoie un message d'erreur et la supprime des commandes slash
    if (!command)
      return (
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000") // Couleur rouge pour l'erreur
              .setDescription("❌ | Error! Please contact Developers!"), // Message d'erreur
          ],
          ephemeral: true, // Le message est visible uniquement par l'utilisateur
        }),
        client.slash.delete(interaction.commandName) // Supprime la commande si elle n'existe pas
      );

    // Vérifie si l'utilisateur a les permissions requises pour exécuter la commande
    if (
      command.permissions &&
      !interaction.member.permissions.has(command.permissions)
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
              `❌ | You do not have the proper permissions to execute this command`
            ), // Message si l'utilisateur n'a pas les permissions
        ],
        ephemeral: true, // Le message est visible uniquement par l'utilisateur
      });

    // Vérifie si la commande nécessite le rôle DJ et si l'utilisateur ne possède pas ce rôle
    if (
      DJ.enabled &&
      DJ.commands.includes(command) &&
      !interaction.member._roles.includes(
        interaction.guild.roles.cache.find((x) => x.name === DJ.roleName).id
      )
    )
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("#ff0000").setDescription(
            `❌ | This command is reserved for members with \`${DJ.roleName}\`` // Message si la commande est réservée au rôle DJ
          ),
        ],
        ephemeral: true,
      });

    // Si la commande nécessite que l'utilisateur soit dans un canal vocal
    if (command.voiceChannel) {
      // Vérifie si l'utilisateur n'est pas dans un canal vocal
      if (!interaction.member.voice.channel)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(`❌ | You are not in a Voice Channel`), // Message si l'utilisateur n'est pas dans un canal vocal
          ],
          ephemeral: true,
        });

      // Vérifie si l'utilisateur et le bot ne sont pas dans le même canal vocal
      if (
        interaction.guild.members.me.voice.channel &&
        interaction.member.voice.channel.id !==
          interaction.guild.members.me.voice.channel.id
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(`❌ | You are not in the same Voice Channel`), // Message si l'utilisateur et le bot ne sont pas dans le même canal vocal
          ],
          ephemeral: true,
        });
    }

    // Exécute la commande si toutes les vérifications sont réussies
    command.execute({ interaction, client });
  }

  // Vérifie si l'interaction est un composant de message (bouton)
  if (interaction.type === InteractionType.MessageComponent) {
    const customId = JSON.parse(interaction.customId); // Décode l'ID personnalisé de l'interaction (lié aux boutons)
    const file_of_button = customId.ffb; // Récupère l'ID de la fonction du bouton (ffb)
    const queue = player.getQueue(interaction.guildId); // Récupère la file d'attente pour la guilde (serveur)

    // Si un fichier de bouton est présent
    if (file_of_button) {
      // Supprime le cache du fichier de bouton pour permettre le rechargement
      delete require.cache[
        require.resolve(`../src/buttons/${file_of_button}.js`)
      ];
      // Charge le fichier de bouton correspondant
      const button = require(`../src/buttons/${file_of_button}.js`);

      // Si le fichier de bouton est trouvé, exécute la fonction associée au bouton
      if (button) return button({ client, interaction, customId, queue });
    }
  }
};
