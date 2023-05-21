// https://rapidapi.com/community/api/open-weather-map/
let clientWeatherURL;
let cloud;
let cloudInfo;
let tempCelsius;
let humidity;

function createWeatherURL() {
  // Koordinaten von Client
  return getClientPosition()
    .then((clientPosition) => {
      const weatherKEY = 'e2a734112ed988ea3505d6790ff4d9bc';
      let lon = clientPosition.coords.longitude;
      let lat = clientPosition.coords.latitude;
      clientWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKEY}`;
      return clientWeatherURL;
    })
    .catch((error) => console.log(error));
}

function myWeatherData(data) {
  console.log('General:', data.weather[0].main, ' and ', data.weather[0].description);
  cloud = data.weather[0].main;
  cloudInfo = data.weather[0].description;
  console.log('Temperature', data.main.temp, 'in Celsius');
  tempCelsius = data.main.temp;
  console.log('Humidity:', data.main.humidity);
  humidity = data.main.humidity;
}

function getWeatherData() {
  createWeatherURL().then((clientWeatherURL) => loadJSON(clientWeatherURL, myWeatherData));
}

// Beispiel- Data: {"coord":{"lon":6.7762,"lat":51.2217},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":39.04,"feelslike":35.65,"tempmin":32.43,"temp_max":41.97,"pressure":1033,"humidity":83},"visibility":10000,"wind":{"speed":4.61,"deg":70},"clouds":{"all":90},"dt":1643053478,"sys":{"type":2,"id":2019396,"country":"DE","sunrise":1643008888,"sunset":1643040486},"timezone":3600,"id":2934246,"name":"Düsseldorf","cod":200}
// useful: weather.main & weather.description & main.temp & main.pressure & main.humidity & wind.speed
