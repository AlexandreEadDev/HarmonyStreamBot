const { EmbedBuilder } = require("discord.js");
module.exports = async ({ interaction, queue }) => {
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
      }\nLoop mode ${repeat
      }**\nRequested by ${currentSong.user}`
    )
    .addFields(
      { name: 'Current Time', value: queue.formattedCurrentTime, inline: true },
      { name: 'Progress', value: progressBar, inline: true },
      { name: 'Total Time', value: currentSong.formattedDuration, inline: true }
    )

    .setTimestamp();
  interaction.reply({ embeds: [embed], ephemeral: true });
};
