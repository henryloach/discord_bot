const Discord = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'avatar',
  execute(message, args) {
    const avatarList = message.mentions.users.map(user => {
		  return {name: user.username, url: user.displayAvatarURL};
	  });

    for ( const item of avatarList ) {
      message.channel.send(`${item.name}'s avatar:\n`)
      message.channel.send(item.url);
    }

  },
};
