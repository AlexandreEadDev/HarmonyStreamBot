// Importation des composants nécessaires depuis discord.js pour créer des boutons et des embeds
const {
  ApplicationCommandOptionType, // Type d'option pour les commandes d'application
  ActionRowBuilder, // Permet de créer une ligne contenant des composants interactifs (boutons)
  ButtonBuilder, // Permet de créer des boutons interactifs
  EmbedBuilder, // Permet de créer des embeds (messages enrichis) à envoyer dans Discord
} = require("discord.js");

//Déclenché quand une erreur survient dans la file d'attente
player.on("error", (queue, error) => {
  console.log(`Error emitted from the queue ${error.message}`);
});

//Déclenché quand une erreur de connexion survient
player.on("connectionError", (queue, error) => {
  console.log(`Error emitted from the connection ${error.message}`);
});

// Déclenché quand une nouvelle piste commence à jouer
player.on("trackStart", (queue, track) => {
  // Vérifie si l'option pour désactiver les messages en boucle est activée
  // et si le mode de répétition n'est pas activé (0 = pas de boucle)
  if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;

  // Crée un embed (message enrichi) pour annoncer le début de la lecture d'une piste
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Started playing ${track.title} in ${queue.connection.channel.name} 🎧`, // Message d'annonce de la piste
      iconURL: track.requestedBy.avatarURL(), // Affiche l'avatar de la personne qui a demandé la piste
    })
    .setColor("#13f857"); // Définit la couleur de l'embed (ici vert)

  // Création de plusieurs boutons interactifs pour contrôler la musique
  const back = new ButtonBuilder()
    .setLabel("Back") // Étiquette du bouton
    .setCustomId(JSON.stringify({ ffb: "back" })) // ID personnalisé qui sera utilisé lors de l'interaction
    .setStyle("Primary"); // Style du bouton (couleur principale)

  const skip = new ButtonBuilder()
    .setLabel("Skip")
    .setCustomId(JSON.stringify({ ffb: "skip" }))
    .setStyle("Primary");

  const resumepause = new ButtonBuilder()
    .setLabel("Resume & Pause")
    .setCustomId(JSON.stringify({ ffb: "resume&pause" }))
    .setStyle("Danger"); // Style de danger (couleur rouge) pour indiquer une action importante

  const loop = new ButtonBuilder()
    .setLabel("Loop")
    .setCustomId(JSON.stringify({ ffb: "loop" }))
    .setStyle("Secondary"); // Style secondaire (couleur grise) pour des actions non critiques

  const queuebutton = new ButtonBuilder()
    .setLabel("Queue")
    .setCustomId(JSON.stringify({ ffb: "queue" }))
    .setStyle("Secondary");

  // Création d'une ligne d'action contenant tous les boutons précédemment créés
  const row1 = new ActionRowBuilder().addComponents(
    back,
    loop,
    resumepause,
    queuebutton,
    skip
  );

  // Envoie l'embed avec les boutons dans le channel Discord où la commande a été exécutée
  queue.metadata.send({ embeds: [embed], components: [row1] });
});

// Déclenché lorsqu'une piste est ajoutée à la file d'attente
player.on("trackAdd", (queue, track) => {
  // Envoie un message dans le channel pour indiquer qu'une piste a été ajoutée
  queue.metadata.send(`Track ${track.title} added in the queue ✅`);
});

// Déclenché quand le bot est manuellement déconnecté du channel vocal
player.on("botDisconnect", (queue) => {
  // Envoie un message dans le channel pour indiquer que le bot a été déconnecté et que la file d'attente est supprimée
  queue.metadata.send(
    "I was manually disconnected from the voice channel, clearing queue... ❌"
  );
});

// Déclenché quand tout le monde quitte le channel vocal
player.on("channelEmpty", (queue) => {
  // Envoie un message dans le channel pour indiquer que le channel vocal est vide et que le bot quitte le channel
  queue.metadata.send(
    "Nobody is in the voice channel, leaving the voice channel... ❌"
  );
});

// Déclenché quand la file d'attente est terminée (toutes les pistes ont été jouées)
player.on("queueEnd", (queue) => {
  // Envoie un message dans le channel pour indiquer que la file d'attente est terminée
  queue.metadata.send("I finished reading the whole queue ✅");
});

// Déclenché lorsqu'une playlist entière est ajoutée à la file d'attente
player.on("tracksAdd", (queue, tracks) => {
  // Envoie un message pour indiquer que toutes les pistes de la playlist ont été ajoutées à la file d'attente
  queue.metadata.send(`All the songs in playlist added into the queue ✅`);
});
