const { catAPIKey: key } = require('../config.json');
const fetch = require('node-fetch');
const r2          = require('r2');
const querystring = require('querystring');

module.exports = {
	name: 'meow',
	description: 'meow',
	async execute(message, args) {

    messageRecieved(message);
    // console.log(key);

    async function messageRecieved(message) {
      try {
        // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
        const images = await loadImage();

        // get the Image, and first Breed from the returned object.
        const image = images[0];
        const breed = image.breeds[0];

				console.log(image.url);

        // console.log('message processed','showing', breed)
        // use the *** to make text bold, and * to make italic
        message.channel.send( "***"+breed.name + "*** \r *"+breed.temperament+"*", { files: [ image.url ] } );
        // if you didn't want to see the text, just send the file

      } catch (e) {
        console.log(e)
      }
    }

    async function loadImage() {

      const headers = {
        'X-API-KEY': key
      }
      const query_params = {
        'has_breeds': true, // we only want images with at least one breed data object - name, temperament etc
        'mime_types': 'jpg,png', // we only want static images as Discord doesn't like gifs
        'size': 'small',   // get the small images as the size is prefect for Discord's 390x256 limit
        'limit' : 1       // only need one
      }

      const queryString = querystring.stringify(query_params);

      try {
        const url = `https://api.thecatapi.com/v1/images/search?${queryString}`
        var response = await r2.get(url, {headers} ).json
      } catch (e) {
        console.log(e);
        return;
      }

      return response;
    }

  },
};
