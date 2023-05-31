module.exports = {
  name: "portfolio",
  description: "redirect to Alexandre's github page",

  async execute({ interaction }) {
    interaction.user.send("https://github.com/PropZii");
  },
};
