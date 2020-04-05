const ytdl = require('ytdl-core');

module.exports = {
	name: 'skip',
	description: 'skip',
	execute(message, args) {
    if ( !servers[message.guild.id] ) {
      message.channel.send('Nothing to skip.');
      return;
    }
    const server = servers[message.guild.id];
    const queue = servers[message.guild.id].queue;
    message.channel.send(`skipping from ${message.author.username}...\n`);
    server.dispatcher.end();
  }
}
