module.exports = {
	name: 'queue',
	description: 'queu',
	execute(message, args) {
    if ( !servers[message.guild.id] ) {
      message.channel.send('There is no queue.');
      return;
    }
		const server = servers[message.guild.id];
    const queue = servers[message.guild.id].queue;
		out = `Now Playing: \t${server.playing.title}\t\tfrom:\t${server.playing.name}\n\n`
		if ( queue.length !== 0 ) {
			out += 'Queue:\n\n';
			for (let i = 0; i < queue.length && i < 6; i++) {
				const { title, name } = queue[i];
				out += `${i + 1}:\t${title}\t\tfrom:\t${name}\n`
			}
			out += "\n"
			if ( queue.length > 6 ) {
				out += `...${queue.length - 6} more items.\n`
			}
		}
    message.channel.send( block(out) );
  }
}
