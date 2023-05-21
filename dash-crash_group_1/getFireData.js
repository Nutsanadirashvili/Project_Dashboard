// initialize object for saving client location

// initialize empty fire data for later use
let FireData;

function loadClientLocation() {
  let clientLocation = {longitude: null, latitude: null};

  // will be executed when retrieving the geolocation from the client
  const onSuccess = (position) => {
    const {longitude, latitude} = position.coords;
    clientLocation = {longitude, latitude};
    return clientLocation;
  };

  // will be executed when cannot retrieve geolocation from client
  const onFail = (_) => {
    console.log('failed to load geolocation');
  };

  if (window.navigator.geolocation) {
    // geolocation is available
    window.navigator.geolocation.getCurrentPosition(onSuccess, onFail);
  }
}

// helper function to transform csv data into a JavaScript Object
function csvJSON(csv) {
  const lines = csv.split('\n');

  let result = [];

  // headers of each
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    const currentLine = lines[i].split(',');

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }

    result.push(obj);
  }

  return result;
}

function getClosestFire(clientLocation, fires) {
  let result = {
    longitude: null,
    latitude: null,
    distance: null,
  };

  for (let fire of fires.rows) {
    fire = fire.obj;
    let distance = calcCrow(clientLocation.latitude, clientLocation.longitude, fire.latitude, fire.longitude);
    if (!result.distance || (result.distance > distance && distance != NaN)) {
      result.longitude = fire.longitude;
      result.latitude = fire.latitude;
      result.distance = distance.toFixed(0);
    }
  }
  return result;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) {
  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

function getClientPosition() {
  return new Promise((resolve, reject) => {
    if (window.navigator.geolocation) {
      // geolocation is available
      window.navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

// function loadFireData() {
//   return loadTable('./data/movis_mock.csv', 'csv', 'header', (data) => {
//     fireData = data;
//   });
// }

function loadFireData() {
  return loadTable(
    'https://firms.modaps.eosdis.nasa.gov/api/area/csv/684308222f76da18b0ae8bd85f1f02d0/MODIS_NRT/world/1',
    'csv',
    'header',
    (data) => {
      fireData = data;
    }
  );
}
