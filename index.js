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
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// Max de listeners pour eviter les fuites de mémoires
client.setMaxListeners(20);

client.config = require("./config");

// --- GESTION DES COOKIES YOUTUBE ---
let youtubeCookies = undefined;
try {
  // On tente de charger le fichier cookies.json
  youtubeCookies = require("./cookies.json");
  console.log("✅ Cookies YouTube chargés avec succès.");
} catch (e) {
  console.log("⚠️ Aucun fichier cookies.json trouvé ou fichier invalide.");
}

// Initialisation du player de musique DisTube
client.player = new DisTube(client, {
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  // Note: On ne met PAS youtubeCookie ici, c'est ce qui causait l'erreur INVALID_KEY
  plugins: [
    new SpotifyPlugin(),
    new DeezerPlugin(),
    new YtDlpPlugin({
      update: true, // Met à jour yt-dlp pour avoir les derniers correctifs
      cookies: youtubeCookies, // <--- C'est ICI qu'il faut mettre les cookies en v5
    }),
  ],
});

// Rend le player de DisTube accessible globalement pour d'autres parties du code
global.player = client.player;

// Charge des fichiers externes
require("./loader");

// Connecte le bot à Discord
client.login(client.config.app.token);
