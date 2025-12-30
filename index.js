// Importation des modules nécessaires depuis discord.js pour créer le bot Discord
const { Client, GatewayIntentBits, Partials } = require("discord.js");

// Importation de la bibliothèque DisTube pour la gestion de la musique,
// ainsi que des plugins pour Spotify, Deezer et YouTube (via YouTube-DLP)
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { DeezerPlugin } = require("@distube/deezer");
const { YtDlpPlugin } = require("@distube/yt-dlp");

// Note : On retire ffmpeg-static car on utilise désormais le ffmpeg installé dans le Dockerfile
// const ffmpeg = require("ffmpeg-static");

// Création d'une instance globale de Client pour le bot Discord avec des configurations spécifiques
global.client = new Client({
  partials: [Partials.Channel, Partials.GuildMember, Partials.User],
  // Types d'événements que le bot surveillera
  intents: [
    GatewayIntentBits.Guilds, // Permet de gérer les serveurs Discord (guildes)
    GatewayIntentBits.GuildMembers, // Permet d'accéder aux membres des serveurs
    GatewayIntentBits.GuildIntegrations, // Permet d'interagir avec les intégrations des guildes
    GatewayIntentBits.GuildVoiceStates, // Permet de surveiller l'état des channels vocaux
    GatewayIntentBits.MessageContent, // Souvent nécessaire pour lire le contenu des messages
  ],
});

// Max de listeners pour eviter les fuites de mémoires
client.setMaxListeners(20);

client.config = require("./config");

// --- CHARGEMENT DES COOKIES ---
let youtubeCookies = undefined;
try {
  youtubeCookies = require("./cookies.json");
  console.log("✅ Cookies YouTube chargés.");
} catch (e) {
  console.log("⚠️ Aucun fichier cookies.json trouvé.");
}

// Initialisation du player de musique DisTube
client.player = new DisTube(client, {
  ffmpeg: {
    path: "ffmpeg", // On utilise "ffmpeg" (le binaire système installé via Docker)
  },
  // On injecte ici les options définies dans config.js (qualité, buffer)
  ytdlOptions: client.config.opt.discordPlayer.ytdlOptions,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin(),
    new DeezerPlugin(),
    new YtDlpPlugin({
      update: true, // Force la mise à jour des définitions youtube
      cookies: youtubeCookies, // Utilise les cookies pour la recherche
    }),
  ],
});

// Rend le player de DisTube accessible globalement pour d'autres parties du code
global.player = client.player;

// Charge des fichiers externes
require("./loader");

// Connecte le bot à Discord en utilisant le token fourni dans le fichier de configuration
client.login(client.config.app.token);
