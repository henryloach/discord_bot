const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const { ytAPIKey: key } = require('../config.json');
const youtube = new YouTube(key);

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
			return message.channel.send('Lacking permisions to join voice channel. Check permisions.');
		}
		if ( !permissions.has('SPEAK') ) {
			return message.channel.send('Lacking permisions to speak. Check permisions.');
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

		if ( !search_string.includes('.com') ) {
			try {
				const videos = await youtube.searchVideos(search_string, 1);
				var vidId = videos[0].id;
			} catch (e) {
				console.log(e);
				return message.channel.send(`search failed. The dialy quota is probably exceded. urls should still work.`);
			}
			var url = `https://www.youtube.com/watch?v=${vidId}`;
		} else {
			var url = search_string;
		}

		let songInfo = {};
		let song = {};
		try {
			songInfo = await ytdl.getInfo(url);
			song = {
				title: songInfo.title,
				url: songInfo.video_url,
			}
		} catch(e) {
			console.log(e);
			message.channel.send(`That url didn't seem to work.`);
			return;
		}

		message.channel.send(`Queueing:\t\`${song.title}\``);
		server.queue.push({
			title: song.title,
			url: song.url,
			id: message.author.id,
			name: message.author.username,
			priority: server.priorities[message.author.id]
		});

		server.queue.sort( (a, b) => {
			if ( a.priority >= b.priority ) return 1;
			else return -1;
		});

		if ( !message.guild.voiceConnection ) {
			message.member.voiceChannel.join()
			.then( function(connection) {
				play(connection);
			}).catch( error => {
				console.log(error);
				return;
			})
		}

    function play(connection) {

			const { title, url, name } = server.queue[0];
			message.channel.send(`Now playing:\t\`${title}\`\tQueued by:\t${name}`);
      server.dispatcher = connection.playStream( ytdl( url, {filter: "audioonly"} ) );

			server.playing = { title: title, name: name };
			server.priorities[message.author.id] -= 1;
			server.queue.shift();

      server.dispatcher.on('end', () => {
        if ( server.queue[0] ) {
          play(connection);
        } else {
					console.log('disconecting');
          connection.disconnect();
        }
				for (const item of server.queue) {
					item.priority -= 1;
				}
      })
			.on('error', error => {
				console.log(error);
				message.channel.send('There was an error');
			});
    }

	},
};
