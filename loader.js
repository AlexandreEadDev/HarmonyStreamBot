const { readdirSync } = require("fs"); // Permet de lire le contenu des répertoires
const { Collection, Events } = require("discord.js"); // Ajout de Events pour la compatibilité
const path = require("path");

// Initialisation des collections pour stocker les commandes
client.commands = new Collection();
const CommandsArray = []; // Tableau pour stocker toutes les commandes à enregistrer

// Définition des chemins absolus pour éviter les erreurs de dossier
const eventsPath = path.join(__dirname, "events");
const commandsPath = path.join(__dirname, "commands");

// --- CHARGEMENT DES EVENTS ---
try {
  const events = readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
  console.log(`Loading events...`);

  for (const file of events) {
    const event = require(path.join(eventsPath, file));
    console.log(`-> [Loaded Event] ${file.split(".")[0]}`);
    // Le loader utilise le nom du fichier comme nom d'événement
    client.on(file.split(".")[0], event.bind(null, client));
    delete require.cache[require.resolve(path.join(eventsPath, file))];
  }
} catch (error) {
  console.log("Erreur lors du chargement des events : " + error);
}

// --- CHARGEMENT DES COMMANDES ---
console.log(`Loading commands...`);

try {
  readdirSync(commandsPath).forEach((dirs) => {
    const dirPath = path.join(commandsPath, dirs);
    const commands = readdirSync(dirPath).filter((files) =>
      files.endsWith(".js")
    );

    for (const file of commands) {
      const command = require(path.join(dirPath, file));
      if (command.name && command.description) {
        CommandsArray.push(command);
        console.log(`-> [Loaded Command] ${command.name.toLowerCase()}`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(path.join(dirPath, file))];
      } else {
        console.log(`[failed Command]  ${command.name.toLowerCase()}`);
      }
    }
  });
} catch (error) {
  console.log("Erreur lors du chargement des commandes : " + error);
}

// Événement "clientReady" (anciennement "ready") déclenché lorsque le bot est prêt
// Utilise "clientReady" pour éviter le DeprecationWarning
client.on("clientReady", (client) => {
  if (client.config.app.global) {
    client.application.commands.set(CommandsArray);
    console.log("Commandes globales enregistrées !");
  } else {
    const guild = client.guilds.cache.get(client.config.app.guild);
    if (guild) {
      guild.commands.set(CommandsArray);
      console.log(`Commandes enregistrées pour la guilde: ${guild.name}`);
    } else {
      console.log(
        "Impossible de trouver la guilde configurée pour les commandes locales."
      );
    }
  }
});
