// Importation des modules nécessaires depuis discord.js pour créer le bot Discord
const { Client, GatewayIntentBits, Partials } = require("discord.js");

// Importation de la bibliothèque DisTube pour la gestion de la musique,
// ainsi que des plugins pour Spotify, Deezer et YouTube (via YouTube-DLP)
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { DeezerPlugin } = require("@distube/deezer");
const { YtDlpPlugin } = require("@distube/yt-dlp");

// Importation de ffmpeg-static pour l'environnement local (Windows)
const ffmpegStatic = require("ffmpeg-static");

// Création d'une instance globale de Client pour le bot Discord avec des configurations spécifiques
global.client = new Client({
  partials: [Partials.Channel, Partials.GuildMember, Partials.User],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.setMaxListeners(20);

// Chargement de la config (qui sera accessible via client.config partout)
client.config = require("./config");

// --- CHARGEMENT DES COOKIES ---
let youtubeCookies = undefined;
try {
  youtubeCookies = require("./cookies.json");
  console.log("✅ Cookies YouTube chargés.");
} catch (e) {
  console.log("⚠️ Aucun fichier cookies.json trouvé.");
}

// Initialisation du player DisTube
client.player = new DisTube(client, {
  ffmpeg: {
    // Windows (Local) -> ffmpeg-static | Linux (Docker) -> "ffmpeg" global
    path: process.platform === "win32" ? ffmpegStatic : "ffmpeg",
  },
  // NOTE: Les options leaveOnEmpty/leaveOnFinish sont gérées manuellement dans src/events.js
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin(),
    new DeezerPlugin(),
    new YtDlpPlugin({
      update: true,
      cookies: youtubeCookies,
    }),
  ],
});

// Variables globales
global.player = client.player;

// --- IMPORTANT : Chargement des événements DisTube (src/events.js) ---
require("./src/events");

// Charge le loader (Commandes & Events Discord classiques)
require("./loader");

// Connexion
client.login(client.config.app.token);
