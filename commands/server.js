module.exports = {
  name: 'server',
  description: 'server',
  execute(message, ags) {
    message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  },
};
