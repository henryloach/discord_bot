const fetch = require('node-fetch');
const { dictAPIId: id, dictAPIKey: key } = require('../config.json');
const language = "en-gb";
module.exports = {
  name: 'word',
	description: 'word',
	execute(message, args) {
    if ( args.length > 1 ) {
      message.channel.send("Command takes one word");
      return;
    }
    const word = args[0];
    const url = `https://od-api.oxforddictionaries.com:443/api/v2/lemmas/${language}/${word}`.toLowerCase();
    fetch( url, { headers: {'Accept': 'application/json','app_id': id, 'app_key': key} } )
    .then( response => response.json())
    .then( data => {
      console.log('Success:', data);
      const entries = data.results[0].lexicalEntries;
      let out = `Word:\t\`"${word}"\`\n`;
      for (let index = 0; index < entries.length; index++) {
        const element = entries[index];
        const category = element.lexicalCategory.id;
        const root = element.inflectionOf[0].id;
        out += `Entry ${index + 1}:\n\tCategory:\t\`${category}\``;
        out += `\tInflection of:\t\`${root}\`\n`;
      }
      message.channel.send(out);
    }).catch( error => {
      console.log('Error', error);
      message.channel.send(`\`${word}\` is not a word!`);
    });
  }
}
