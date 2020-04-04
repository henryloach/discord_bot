const ytdl = require('ytdl-core');

module.exports = {
	name: 'pause',
	description: 'pause',
	execute(message, args) {
    if ( !servers[message.guild.id] ) {
      message.channel.send('Nothing to pause.');
      return;
    }
    const server = servers[message.guild.id];
    const queue = servers[message.guild.id].queue;
    console.log('skipping');
    if ( !server.dispatcher.paused ) {
      message.channel.send('Pausing.');
      server.dispatcher.paused = true;
    } else {
      message.channel.send('Resuming.');
      server.dispatcher.paused = false;
    }
  }
}
