module.exports = {
	name: 'love',
	description: 'love',
	execute(message, args) {
    const ids = message.mentions.users;
    if ( ids.size !== 2 || args.length !== 2 ) {
      return message.channel.send(`This command requires two mentions as arguments`)
    }
    const id1 = parseInt( args[0].slice(2, -1).slice(1) );
    const id2 = parseInt( args[1].slice(2, -1).slice(1) );

		console.log("id1: " + id1);
		console.log("id2: " + id2);
		console.log(id1 + id2);

    const score = ( id1 + id2 ) % 100;
    let out = `Score: ${score}\t- `;
    if ( score > 90 ) {
      out += 'Love is in the air.';
    } else if ( score > 80 ) {
      out += 'You were clearly meant to be together';
    } else if ( score > 70 ) {
      out += 'Things are going well.';
    } else if ( score > 60 ) {
      out += 'Your relationship has prommise.';
    } else if ( score > 50 ) {
      out += 'Things aren\'t looking so good. Try harder.';
    } else if ( score > 40 ) {
      out += 'With some counciling, you may be able to salvage your relationship.'
    } else {
      out += 'Give it up. It just wasn\'t mean to be. You will only hurt each other.'
    }
    message.channel.send(out);
	},
};
