module.exports = {
  name: 'avatar',
  description: 'avatar',
  execute(message, ags) {
    const Discord = require('discord.js');
    const avatarList = message.mentions.users.map(user => {
		  return `${user.username}'s avatar: <${user.displayAvatarURL}>`;
	  });
    message.channel.send(avatarList);
  },
};
