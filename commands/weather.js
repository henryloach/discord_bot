const fetch = require('node-fetch');
const flags = require('../flags.js');
const countryList = Object.values(flags);
const { weatherAPIKey } = require('../config.json')
module.exports = {
	name: 'weather',
	description: 'weather',
	execute(message, args) {
    if ( !args[0] ) message.channel.send("Need a city as an argument")
    const city = args[0];
    console.log(weatherAPIKey);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}`)
      .then(response => {
        return response.json();
      })
      .then(parseWeather => {
        if (parseWeather.cod === '404') {
          message.channel.send("Something went wrong 404.")
        } else {
          console.log(parseWeather);
          message.channel.send(
            `
            The current weather
            Location: ${parseWeather.name}, ${parseWeather.sys.country} ${getFlag(parseWeather.sys.country)}
            Forecast: ${parseWeather.weather[0].main}
            Curret Temperature: ${Math.round(parseWeather.main.temp - 273.15)} °C
            `
          )
        }
      })
	},
};

function getFlag(searchName) {
	for (let i = 0; i < countryList.length; i++) {
		if ( countryList[i].code == searchName ) {
			return countryList[i].emoji;
		}
	}
}
