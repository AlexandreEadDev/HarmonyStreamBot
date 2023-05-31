module.exports = {
  name: "help",
  description: "help commands",
  async execute({ interaction }) {
    const prefix = "/";
    interaction.reply(
      `**${prefix}help**: List all commands
    **${prefix}jokes**: Tell a joke
    **${prefix}portfolio**: Redirect to my portfolio page
    **${prefix}profile**: Get data from a League of Legends user
    **Music Commands**
    **${prefix}play**: Play a song
    **${prefix}back**: Go back to the previous song
    **${prefix}controller**: Show the music controller
    **${prefix}loop**: Loop the queue or song
    **${prefix}nowplaying**: Show the currently playing song
    **${prefix}pause**: Pause the music
    **${prefix}queue**: Show the music queue
    **${prefix}resume**: Resume the music
    **${prefix}seek**: Seek to a specific time in the song
    **${prefix}skip**: Skip the current song
    **${prefix}stop**: Stop the music
    **${prefix}volume**: Change the volume of the music`
    );
  },
};
