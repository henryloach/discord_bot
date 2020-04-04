const ytdl = require('ytdl-core');
// const YouTube = require('simple-youtube-api');
// const youtube = new YouTube();
module.exports = {
	name: 'play',
	description: 'play',
	async execute(message, args) {

    if ( !message.member.voiceChannel ) {
      message.channel.send('You must be in a voice channel to queue a song!');
      return;
    }

		if ( !args[0] ) {
      message.channel.send('This command requires a song to search for!');
      return;
    }

		const permissions = message.member.voiceChannel.permissionsFor(message.client.user);
		if ( !permissions.has('CONNECT')) {
			return message.channel.send('Lacking permisions to join voice channel. Check permisions.')
		}
		if ( !permissions.has('SPEAK') ) {
			return message.channel.send('Lacking permisions to speak. Check permisions.')
		}

		if ( !servers[message.guild.id] ) servers[message.guild.id] = {
      queue: [],
			priorities: {}
    }
    const server = servers[message.guild.id];
    const search_string = args.join(' ');

    if ( !server.priorities[message.author.id] ) {
			server.priorities[message.author.id] = 1;
		} else {
			server.priorities[message.author.id] += 1;
		}

		let url;
		if ( !search_string.includes('.com') ) {
			const items = await ytdl.getInfo(search_string);
			url = items[0].url;
			console.log(items);
		} else {
			url = search_string;
		}

		const songInfo = await ytdl.getInfo(url);
		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
		}

		server.queue.push({
			title: song.title,
			url: song.url,
			id: message.author.id,
			name: message.author.username,
			priority: server.priorities[message.author.id]
		});

		server.queue.sort( (a, b) => {
			if ( a.priority > b.priority ) return 1;
			else return -1;
		});

		console.log(message.author.id + " " + server.priorities[message.author.id]);

		if ( !message.guild.voiceConnection ) {
			message.member.voiceChannel.join()
			.then( function(connection) {
				play(connection);
			}).catch( console.log('error...') );
		}

    function play(connection) {
			const { title, url, name } = server.queue[0];
      server.dispatcher = connection.playStream( ytdl( url, {filter: "audioonly"} ) );

			message.channel.send(`Now playing:\t\`${title}\`\tQueued by:\t${name}`);

			server.priorities[message.author.id] -= 1;
      server.queue.shift();

      server.dispatcher.on("end", () => {
        if ( server.queue[0] ) {
          play(connection);
        } else {
					console.log('disconecting');
          connection.disconnect();
        }
      });
    }

	},
};
