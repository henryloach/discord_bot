module.exports = {
	name: 'ping',
	description: 'ping',
	execute(message, args) {
    message.channel.send(`Pong. ${Math.round(message.client.ping)} ms`);
	},
};
