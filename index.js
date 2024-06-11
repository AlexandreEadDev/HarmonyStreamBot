const { Client, GatewayIntentBits, Partials } = require("discord.js");

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { DeezerPlugin } = require("@distube/deezer");
const { YtDlpPlugin } = require("@distube/yt-dlp");

global.client = new Client({
  partials: [Partials.Channel, Partials.GuildMember, Partials.User],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.setMaxListeners(20);
client.config = require("./config");

client.player = new DisTube(client, {
  leaveOnStop: client.config.opt.voiceConfig.leaveOnStop,
  leaveOnFinish: client.config.opt.voiceConfig.leaveOnFinish,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin(), new YtDlpPlugin(), new DeezerPlugin()],
});

global.player = client.player;

require("./src/loader");
require("./src/events");

client.login(client.config.app.token);
