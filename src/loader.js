const { readdirSync } = require("fs"); // Permet de lire le contenu des répertoires
const { Collection } = require("discord.js"); // Collection pour stocker les commandes

// Initialisation des collections pour stocker les commandes
client.commands = new Collection();
CommandsArray = []; // Tableau pour stocker toutes les commandes à enregistrer

// Lecture du répertoire "events/" pour obtenir tous les fichiers d'événements
const events = readdirSync("./events/").filter((file) => file.endsWith(".js")); // Filtre uniquement les fichiers .js

console.log(`Loading events...`);

// Boucle pour charger chaque fichier d'événement
for (const file of events) {
  const event = require(`../events/${file}`); // Importation du fichier d'événement
  console.log(`-> [Loaded Event] ${file.split(".")[0]}`); // Affiche l'événement chargé
  client.on(file.split(".")[0], event.bind(null, client)); // Associe l'événement au client Discord
  delete require.cache[require.resolve(`../events/${file}`)]; // Supprime le cache du module pour pouvoir recharger les fichiers si besoin
}

console.log(`Loading commands...`); // Indique le début du chargement des commandes

// Lecture du répertoire "commands/" pour obtenir toutes les sous-dossiers contenant des commandes
readdirSync("./commands/").forEach((dirs) => {
  // Pour chaque sous-dossier de commandes
  const commands = readdirSync(`./commands/${dirs}`).filter((files) =>
    files.endsWith(".js")
  ); // Filtre uniquement les fichiers .js dans chaque sous-dossier

  // Boucle pour charger chaque commande du sous-dossier
  for (const file of commands) {
    const command = require(`../commands/${dirs}/${file}`); // Importation de la commande
    if (command.name && command.description) {
      // Vérifie si la commande a un nom et une description
      CommandsArray.push(command); // Ajoute la commande dans le tableau des commandes
      console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`); // Affiche la commande chargée
      client.commands.set(command.name.toLowerCase(), command); // Enregistre la commande dans la collection des commandes du bot
      delete require.cache[require.resolve(`../commands/${dirs}/${file}`)]; // Supprime le cache pour permettre le rechargement des fichiers
    } else {
      console.log(`[failed Command]  ${command.name.toLowerCase()}`); // Message si la commande est mal définie
    }
  }
});

// Événement "ready" déclenché lorsque le bot est prêt
client.on("ready", (client) => {
  // Si l'option globale est activée dans la configuration, enregistre les commandes globales
  if (client.config.app.global) client.application.commands.set(CommandsArray);
  // Sinon, enregistre les commandes pour un serveur spécifique
  else
    client.guilds.cache
      .get(client.config.app.guild) // Récupère le serveur configuré
      .commands.set(CommandsArray); // Enregistre les commandes pour ce serveur
});
