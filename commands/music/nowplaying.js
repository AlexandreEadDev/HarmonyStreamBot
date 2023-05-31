const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "nowplaying",
  description: "veiw what is playing!",
  voiceChannel: true,

  execute({ client, interaction }) {
    const queue = client.player.getQueue(interaction.guildId);
    let currentSong
    let currentTime
    let totalTime
    let progressBar


    function convertTimeToSeconds(time) {
      const [minutes, seconds] = time.split(':').map(Number);
      return minutes * 60 + seconds;
    }

    function createProgressBar(currentTime, totalTime, barLength = 10) {
      const progress = Math.min((currentTime / totalTime) * barLength, barLength);
      const progressBar = '▬'.repeat(progress) + '🔘' + '▬'.repeat(barLength - progress);
      const percentage = Math.floor((currentTime / totalTime) * 100);

      return `${progressBar} ${percentage}%`;
    }




    if (!queue) {
      return interaction.reply({
        content: `No music currently playing ${interaction.member}... try again ? ❌`,
        ephemeral: true,
      })
    } else {
      currentSong = queue.songs[0]
      currentTime = convertTimeToSeconds(queue.formattedCurrentTime);
      totalTime = convertTimeToSeconds(currentSong.formattedDuration);
      progressBar = createProgressBar(currentTime, totalTime);
    }

    let repeat

    if (queue.repeatMode === 0) {
      repeat = "Disable"
    } else if (queue.repeatMode === 1) {
      repeat = "Enable for this song"
    } else if (queue.repeatMode === 2) {
      repeat = "Enable for all songs"
    }


    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setAuthor({
        name: `${currentSong.name} | ${currentSong.uploader.name}`,
      })
      .setThumbnail(currentSong.thumbnail)
      .setDescription(
        `Volume **${queue.volume
        }\nLoop mode :${repeat
        }**\nRequested by ${currentSong.user}`
      )
      .addFields(
        { name: 'Current Time', value: queue.formattedCurrentTime, inline: true },
        { name: 'Progress', value: progressBar, inline: true },
        { name: 'Total Time', value: currentSong.formattedDuration, inline: true }
      )

      .setTimestamp();

    const saveButton = new ButtonBuilder()
      .setLabel("Save this track")
      .setCustomId(JSON.stringify({ ffb: "savetrack" }))
      .setStyle("Danger");

    const volumeup = new ButtonBuilder()
      .setLabel("Volume up")
      .setCustomId(JSON.stringify({ ffb: "volumeup" }))
      .setStyle("Primary");

    const volumedown = new ButtonBuilder()
      .setLabel("Volume Down")
      .setCustomId(JSON.stringify({ ffb: "volumedown" }))
      .setStyle("Primary");

    const loop = new ButtonBuilder()
      .setLabel("Loop")
      .setCustomId(JSON.stringify({ ffb: "loop" }))
      .setStyle("Danger");

    const resumepause = new ButtonBuilder()
      .setLabel("Resume & Pause")
      .setCustomId(JSON.stringify({ ffb: "resume&pause" }))
      .setStyle("Success");

    const row = new ActionRowBuilder().addComponents(
      volumedown,
      saveButton,
      resumepause,
      loop,
      volumeup
    );

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
