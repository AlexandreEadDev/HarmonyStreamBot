// Importation des modules nécessaires depuis discord.js pour créer le bot Discord
const { Client, GatewayIntentBits, Partials } = require("discord.js");

// Importation de la bibliothèque DisTube pour la gestion de la musique,
// ainsi que des plugins pour Spotify, Deezer et YouTube (via YouTube-DLP)
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { DeezerPlugin } = require("@distube/deezer");
const { YtDlpPlugin } = require("@distube/yt-dlp");

// Création d'une instance globale de Client pour le bot Discord avec des configurations spécifiques
global.client = new Client({
  partials: [Partials.Channel, Partials.GuildMember, Partials.User],
  // Types d'événements que le bot surveillera
  intents: [
    GatewayIntentBits.Guilds, // Permet de gérer les serveurs Discord (guildes)
    GatewayIntentBits.GuildMembers, // Permet d'accéder aux membres des serveurs
    GatewayIntentBits.GuildIntegrations, // Permet d'interagir avec les intégrations des guildes
    GatewayIntentBits.GuildVoiceStates, // Permet de surveiller l'état des channels vocaux
  ],
});

// Max de listeners pour eviter les fuites de mémoires
client.setMaxListeners(20);

client.config = require("./config");

// Initialisation du player de musique DisTube
client.player = new DisTube(client, {
  // Le bot quitte le channel vocal si la musique s'arrête
  leaveOnStop: client.config.opt.voiceConfig.leaveOnStop,
  // Le bot quitte également le channel après avoir fini de lire toutes les musiques de la file d'attente
  leaveOnFinish: client.config.opt.voiceConfig.leaveOnFinish,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  // Ajoute les plugins pour la compatibilité avec Spotify, YouTube-DLP (pour YouTube), et Deezer
  plugins: [new SpotifyPlugin(), new YtDlpPlugin(), new DeezerPlugin()],
});

// Rend le player de DisTube accessible globalement pour d'autres parties du code
global.player = client.player;

// Charge des fichiers externes
require("./src/loader");
require("./src/events");

// Connecte le bot à Discord en utilisant le token fourni dans le fichier de configuration
client.login(client.config.app.token);
