// Parts of full API Path
const urlFirstPart = 'https://api.waqi.info/feed/';
let inputcity = 'here';
const AIRTOKEN = '/?token=c49be43ff090b5fc595e6dd9b7158e2ae8df123f';
let airQualityLevel;
let pm10;
let pm25;

// Here are all the Data from the JSON
function myData(Data) {
  airQualityLevel = Data.data.aqi;
  pm10 = Data.data.iaqi.pm10.v;
  pm25 = Data.data.iaqi.pm25 && Data.data.iaqi.pm25.v;

  console.log('Air Pollution Data');
  console.log('Status:', Data.status);
  console.log('Location:', Data.data.city.name);
  console.log('Air Pollution Level:', Data.data.aqi);
  console.log('PM10 Level:', Data.data.iaqi.pm10.v);
  console.log('PM2.5 Level:', Data.data.iaqi.pm25 && Data.data.iaqi.pm25.v);
}

//This is function to load the JSON Data from the URL and to put them on the myData
function loadAirPollutionData() {
  const urlIP = urlFirstPart + inputcity + AIRTOKEN;
  loadJSON(urlIP, myData);
}
