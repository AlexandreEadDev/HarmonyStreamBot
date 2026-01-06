module.exports = async (client, oldState, newState) => {
  // Si le bot n'est pas connecté ou s'il n'y a pas de changement de channel, on ignore
  if (oldState.channelId === newState.channelId) return;

  // On récupère la queue/le player pour ce serveur
  const queue = client.player.getQueue(oldState.guild.id);

  // Si le bot ne joue rien ou n'est pas connecté, on s'arrête là
  if (!queue || !queue.voice.channel) return;

  // On vérifie si le mouvement concerne le salon où se trouve le bot
  // (C'est-à-dire : est-ce que quelqu'un vient de quitter le salon du bot ?)
  if (oldState.channelId === queue.voice.channel.id) {
    // On regarde combien de personnes restent dans le salon
    // members.size === 1 signifie qu'il ne reste que le bot
    if (oldState.channel.members.size === 1) {
      const leaveConfig = client.config.opt.voiceConfig.leaveOnEmpty;

      if (leaveConfig.status) {
        // Envoi du message d'avertissement
        if (queue.metadata && !queue.metadata.deleted) {
          queue.metadata
            .send(
              `Nobody is in the voice channel, leaving in ${leaveConfig.cooldown} seconds... ❌`
            )
            .catch(() => {});
        }

        // Lancement du compte à rebours
        setTimeout(() => {
          // --- VÉRIFICATION APRÈS LE DÉLAI ---

          // On récupère l'état actuel du bot sur le serveur
          const guild = client.guilds.cache.get(oldState.guild.id);
          const botMember = guild.members.me;

          // Si le bot est toujours dans le même salon vocal
          if (botMember && botMember.voice.channelId === oldState.channelId) {
            // Et qu'il est toujours tout seul (personne n'est revenu)
            if (botMember.voice.channel.members.size === 1) {
              if (queue.metadata && !queue.metadata.deleted) {
                queue.metadata
                  .send("Voice channel empty, I'm leaving now 🏃")
                  .catch(() => {});
              }

              // Déconnexion propre via DisTube
              client.player.voices.leave(guild.id);
            } else {
              // Quelqu'un est revenu entre temps
              if (queue.metadata && !queue.metadata.deleted) {
                queue.metadata
                  .send("Someone joined! I'm staying 🥳")
                  .catch(() => {});
              }
            }
          }
        }, leaveConfig.cooldown * 1000);
      }
    }
  }
};
