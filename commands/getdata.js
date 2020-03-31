const fs = require('fs');
const Discord = require('discord.js');
module.exports = {
	name: 'getdata',
	description: 'getdata',
	async execute(message, args) {
		const nMessages = 100;
		let messageCount = 0;

		if (!message.mentions.users.size) {
			return message.channel.send(`No users mentioned.`);
		}

		// Initialise data object.
		let data = [];
		const userList = message.mentions.users;
		userList.forEach((outerItem, i) => {
			let userInfo = {
				name: outerItem.username,
				id: outerItem.id,
				connections: []
			}
			userList.forEach((innerItem, j) => {
				if ( i === j ) return;
				let connection = {
					name: innerItem.username,
					id: innerItem.id,
					num: 0
				}
			  userInfo.connections.push(connection);
			});
			data.push(userInfo);
		});

		// Get the data.
    let messageCollection = new Discord.Collection();

		message.channel.send(`Fetching data...`);
		console.log("Fetching Messages.");
    let channelMessages = await message.channel.fetchMessages( { limit: nMessages } )
    	.catch(err => { console.log(err) });

		messageCount += channelMessages.size;
    messageCollection = messageCollection.concat(channelMessages);

		while ( channelMessages.size === 100) {
			sleep(15000); //Sleep 15 seconds between requests so I don't get banned. Could sleep less time.
			console.log("Fetching Messages.");
			let lastMessageId = channelMessages.lastKey();
			channelMessages = await message.channel.fetchMessages( { limit: nMessages, before: lastMessageId  } )
				.catch(err => { console.log(err) });
			messageCount += channelMessages.size;
			if ( channelMessages ) messageCollection = messageCollection.concat(channelMessages);
		}

		// Analyse data.
		console.log("Message collection size: " + messageCollection.size);
		message.channel.send(`Analysing data...\n`)
		messageCollection.forEach((item, i) => {
			for (let n = 0; n < data.length; n++) {
				if ( data[n].id != getUserFromMention(item.author) ) continue;
			 	for (let m = 0; m < data[n].connections.length; m++) {
			 		item.mentions.users.forEach((messageItem, j) => {
			 			if ( getUserFromMention(messageItem)== data[n].connections[m].id ) data[n].connections[m].num += 1;
			 		});
			 	}
			}
		});

		// Write JSON.
		fs.writeFile("./data.json", JSON.stringify(data, null, 2), (err) => {
		if (err) {
				console.error(err);
				return;
		};
		console.log("File has been created");

		// Write output in Discord.
		let outString = `\nResults:\nIn \`${messageCount}\` messages:\n`;
		for (let i = 0; i < data.length; i++) {
			outString += `\n\`${data[i].name}\` mentioned:\n`;
			for (let j = 0; j < data[i].connections.length; j++) {
				outString += `\t\`${data[i].connections[j].name}\`\t\`${data[i].connections[j].num}\` times.\n`;
			}
		}
		message.channel.send(outString);

});

  }
}

function getUserFromMention(mention) {
	mention = mention.toString()
	if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		return mention;
	}
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e9; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
