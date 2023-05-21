let requestedData;
let dataArray = [];
let dataMin;
let dataMax;
let canvas;
let c1, c2;
let fireData;
let clientLocation;
let clientData;
let closestFire;

// Called once when the program starts just before setup().
// Use this to load external data, i.e. make your API calls here.
// See https://p5js.org/reference/#/p5/preload
function preload() {
  myFont = loadFont('data/BebasNeue-Regular.otf');
  // infoFont2 = loadFont('data/LinlegreyRegular-Oo3O.ttf');
  infoFont = loadFont('data/OpenSansCondensed-Light.ttf');
  loadFireData();
  getWeatherData();
  loadClientLocation();
  loadAirPollutionData();
}

// Called once when the program starts.
// See https://p5js.org/reference/#/p5/setup
function setup() {
  getClientPosition().then((data) => {
    clientData = data;
    closestFire = getClosestFire(clientData.coords, fireData);
  });

  frameRate(3);
  textFont(myFont);

  background(23, 20, 100);

  //Canvas as Background
  canvas = createCanvas(1519, 739);
  canvas.style('z-index', '-1');

  // closestFire = getClosestFire(clientData, fireData)
  // console.log(closestFire)
}

// Called over and over to refresh your visualisation.
// See https://p5js.org/reference/#/p5/draw
function draw() {
  c1 = color(0);
  c2 = color(62, 64, 86);

  push(); // Gradient Color for Background
  for (let y = 0; y < height; y++) {
    n = map(y, 0, height, 0, 1);
    let newc = lerpColor(c1, c2, n);
    stroke(newc);
    line(0, y, width, y);
  }
  pop();

  push();
  fireMap();
  pop();
  drawTempIcon();
  drawCloudIcon();
  drawHumidity();
  mapBorder();
  sideLines();
  sideTitle();
  airPollutionSketch();
  hoverFire();
  hoverWeather();
  hoverAir();
  try {
    hoverIamhere();
    clientMap();
  } catch (error) {}
}

function fireMap() {
  // if (fireData.columns[0] == "Exceeding allowed transaction limit.") {
  //      return console.log("Exceeding allowed transaction limit.")
  //  }
  circleOpp = random(100, 200);
  noStroke();
  fill(255, 0, 0, circleOpp);
  for (var i = 0; i < fireData.rows.length; i++) {
    let element = fireData.rows[i].obj;
    ellipse(width / 2 + element.longitude * 2.22, height / 2 + element.latitude * 2.22, element.brightness / 20);
  }
}

function hoverFire() {
  //let d = dist(mouseX, mouseY, width/2, height/2);
  noStroke();
  if (mouseX > width / 2 - 400 && mouseX < width / 2 + 400 && mouseY > height / 2 - 200 && mouseY < height / 2 + 200) {
    let fireHead = 'FIRE MAP';
    textAlign(CENTER);
    textSize(80);
    fill(255, 0, 0);
    text(fireHead, width / 2, 100);
    let fireInfo = 'There is a total of ' + fireData.rows.length + ' fires on earth right now!';
    textSize(40);
    fill(200, 0, 0);
    text(fireInfo, width / 2, 639);
  }
}

function hoverIamhere() {
  let d = dist(mouseX, mouseY, width / 2 + clientData.coords.longitude * 2.22, height / 2 + clientData.coords.latitude * 2.22);
  if (d < 15) {
    push();
    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text(`You are here and the next fire is ${closestFire.distance} km away`, width / 2, height - 30);
    pop();
  }
}

function clientMap() {
  fill(0);
  ellipse(width / 2 + clientData.coords.longitude * 2.22, height / 2 + clientData.coords.latitude * 2.22, 8);
}

function mapBorder() {
  noFill();
  rectMode(CENTER);
  stroke(255);
  rect(width / 2, height / 2, 800, 400);
}

const fireIcon =
  'data:image/svg+xml;charset=UTF-8;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJmaXJlIiBjbGFzcz0ic3ZnLWlubGluZS0tZmEgZmEtZmlyZSBmYS13LTEyIiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDM4NCA1MTIiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTIxNiAyMy44NmMwLTIzLjgtMzAuNjUtMzIuNzctNDQuMTUtMTMuMDRDNDggMTkxLjg1IDIyNCAyMDAgMjI0IDI4OGMwIDM1LjYzLTI5LjExIDY0LjQ2LTY0Ljg1IDYzLjk5LTM1LjE3LS40NS02My4xNS0yOS43Ny02My4xNS02NC45NHYtODUuNTFjMC0yMS43LTI2LjQ3LTMyLjIzLTQxLjQzLTE2LjVDMjcuOCAyMTMuMTYgMCAyNjEuMzMgMCAzMjBjMCAxMDUuODcgODYuMTMgMTkyIDE5MiAxOTJzMTkyLTg2LjEzIDE5Mi0xOTJjMC0xNzAuMjktMTY4LTE5My0xNjgtMjk2LjE0eiI+PC9wYXRoPjwvc3ZnPg==';

function drawCloudIcon() {
  rectMode(CENTER);
  if (cloud == 'Clouds') {
    fill(155, 200, 220);
    rect(220, 300, 55, 70);
  } else if (cloud == 'Clear') {
    fill(219, 233, 243);
    rect(220, 300, 55, 70);
  } else if (cloud == 'Smoke') {
    fill(161, 161, 156);
    rect(220, 300, 55, 70);
  } else if (cloud == 'Mist') {
    fill(240, 239, 226);
    rect(220, 300, 55, 70);
  } else if (cloud == 'Drizzle') {
    fill(119, 172, 197);
    rect(220, 300, 55, 70);
  } else if (cloud == 'Rain') {
    fill(87, 136, 174);
    rect(220, 300, 55, 70);
  } else {
    fill(95, 158, 160, 150);
    rect(220, 300, 55, 70);
  }

  push();
  fill(255);
  textAlign(RIGHT);
  textSize(60);
  noStroke();
  text(cloud, 210, 324);
  pop();
}

function drawTempIcon() {
  noStroke();

  if (tempCelsius < 0.0) {
    fill(145, 158, 186, 170);
    rect(220, 425, 55, 70);
  } else if (tempCelsius > 0.0 && tempCelsius < 10.0) {
    fill(182, 217, 216, 170);
    rect(220, 425, 55, 70);
  } else if (tempCelsius > 10.0 && tempCelsius < 24.0) {
    fill(222, 152, 180, 170);
    rect(220, 425, 55, 70);
  } else {
    fill(198, 114, 157, 170);
    rect(220, 425, 55, 70);
  }

  fill(255);
  textAlign(RIGHT);
  textSize(70);
  noStroke();
  text(tempCelsius + '°C', 210, 450);
  pop();
}

function drawHumidity() {
  push();
  noStroke();
  rectMode(CENTER);
  fill(255, 250, 182);
  rect(220, 550, 55, 70);
  fill(0, 255 - humidity * 2);
  rect(220, 550, 55, 70);

  push();
  fill(255);
  textAlign(RIGHT);
  textSize(70);
  text(humidity + '%', 210, 575);
  pop();
}

function sideLines() {
  stroke(255);
  //RIGHT
  line(width / 2 + 400, height / 2, width / 2 + 450, height / 2);
  line(width / 2 + 450, height / 2 - 200, width / 2 + 450, height / 2 + 260);
  line(width / 2 + 450, height / 2 - 200, width / 2 + 500, height / 2 - 200);
  line(width / 2 + 450, height / 2 + 260, width / 2 + 500, height / 2 + 260);

  //LEFT
  line(width / 2 - 400, height / 2, width / 2 - 450, height / 2);
  line(width / 2 - 450, height / 2 - 200, width / 2 - 450, height / 2 + 260);
  line(width / 2 - 450, height / 2 - 200, width / 2 - 500, height / 2 - 200);
  line(width / 2 - 450, height / 2 + 260, width / 2 - 500, height / 2 + 260);
}

function sideTitle() {
  push();
  textAlign(LEFT);
  strokeWeight(20);
  stroke(255);
  rect(150, 170, 200, 15, 0.5);
  pop();

  push();
  textSize(55);
  textAlign(LEFT);
  noFill();
  stroke(19, 145, 105);
  text('Weather', 70, 180);
  pop();

  push();
  if (mouseX > 100 && mouseX < 260 && mouseY > 140 && mouseY < 200) {
    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text('Your Weather', width / 2, height - 30);
  } else if (mouseX < width - 100 && mouseX > width - 260 && mouseY > 140 && mouseY < 200) {
    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text('Your Air Quality', width / 2, height - 30);
  }
  pop();

  push();
  textAlign(LEFT);
  strokeWeight(20);
  stroke(255);
  rect(width - 150, 170, 200, 15, 0.5);
  pop();

  push();
  textAlign(LEFT);
  textSize(55);
  //textFont("Bebas Neue");
  noFill();
  stroke(19, 145, 105);
  text('Air Quality', width - 245, 180);
  pop();
}

function airPollutionSketch() {
  push();
  noStroke();

  if (airQualityLevel < 50) {
    fill(144, 238, 144, 150);
    rect(width - 220, 300, 55, 70);
  } else if (airQualityLevel > 50 && airQualityLevel < 100) {
    fill(144, 238, 144, 100);
    rect(width - 220, 300, 55, 70);
  } else if (airQualityLevel > 100 && airQualityLevel < 150) {
    fill(144, 238, 144, 50);
    rect(width - 220, 300, 55, 70);
  }

  push();
  fill(219, 112, 147);
  textFont(myFont);
  textAlign(CENTER);
  textSize(20);
  circle(width - 100, 425, 20);
  fill(255);
  text('?', width - 100, 433);
  pop();

  if (pm10 < 25) {
    fill(219, 112, 147, 150);
    rect(width - 220, 425, 55, 70);
  } else if (pm10 > 26 && pm10 < 55) {
    fill(219, 112, 147, 200);
    rect(width - 220, 425, 55, 70);
  } else if (pm10 > 55 && pm10 < 250) {
    fill(219, 112, 147, 250);
    rect(width - 220, 425, 55, 70);
  }

  push();
  fill(221, 160, 221);
  textFont(myFont);
  textAlign(CENTER);
  textSize(20);
  circle(width - 100, 550, 20);
  fill(255);
  text('?', width - 100, 557);
  pop();

  if (pm25 < 25) {
    fill(221, 160, 221, 150);
    rect(width - 220, 550, 55, 70);
  } else if (pm25 > 26 && pm25 < 50) {
    fill(221, 160, 221, 220);
    rect(width - 220, 550, 55, 70);
  } else if (pm25 > 50 && pm25 < 250) {
    fill(221, 160, 221, 255);
    rect(width - 220, 550, 55, 70);
  }

  pop();

  push();
  text;
  fill(255);
  textAlign(LEFT);
  textSize(70);
  noStroke();
  text(airQualityLevel, width - 220, 325);
  text(pm10, width - 220, 450);
  text(pm25, width - 220, 575);
  pop();
}

function hoverWeather() {
  if (mouseX > 192.5 && mouseX < 247.5 && mouseY > 265 && mouseY < 335) {
    push();
    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text(cloudInfo, width / 2, height - 30);
    pop();
  } else if (mouseX > 192.5 && mouseX < 247.5 && mouseY > 390 && mouseY < 460) {
    push();

    let tempFeeling;
    if (tempCelsius < 0.0) {
      tempFeeling = 'You must be freezing.';
    } else if (tempCelsius > 0.0 && tempCelsius < 5.0) {
      tempFeeling = 'You must be super cold.';
    } else if (tempCelsius > 5.0 && tempCelsius < 10.0) {
      tempFeeling = 'You must be cold.';
    } else if (tempCelsius > 10.0 && tempCelsius < 15.0) {
      tempFeeling = 'That is pretty chilly.';
    } else if (tempCelsius > 15.0 && tempCelsius < 20.0) {
      tempCelsius = 'Fresh, but ok.';
    } else if (tempCelsius > 20.0 && tempCelsius < 25.0) {
      tempCelsius = 'Super nice!';
    } else if (tempCelsius > 25.0 && tempCelsius > 30.0) {
      tempCelsius = 'It feels like summer!';
    } else {
      tempCelsius = 'Are you melting yet?';
    }

    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text(tempFeeling, width / 2, height - 30);
    pop();
  } else if (mouseX > 192.5 && mouseX < 247.5 && mouseY > 515 && mouseY < 585) {
    push();

    let humid;
    if (humidity < 40) {
      humid = 'Pretty dry out there';
    } else if (humidity > 40 && humidity < 80) {
      humid = 'Nice and moist';
    } else {
      humid = "That's wet wet.";
    }

    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text(humid, width / 2, height - 30);
    pop();
  }
}

function hoverAir() {
  if (mouseX < width - 192.5 && mouseX > width - 247.5 && mouseY > 265 && mouseY < 335) {
    push();
    let goodAir;
    if (airQualityLevel < 50) {
      goodAir = 'Good Air Quality';
    } else if (airQualityLevel > 50 && airQualityLevel < 100) {
      goodAir = 'Mediocre Air Quality';
    } else if (airQualityLevel > 100 && airQualityLevel < 150) {
      goodAir = 'Bad Air Quality';
    }

    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text(goodAir, width / 2, height - 30);
    pop();
  } else if (mouseX < width - 192.5 && mouseX > width - 247.5 && mouseY > 390 && mouseY < 460) {
    push();
    let levelPm10;
    if (pm10 < 25) {
      levelPm10 = 'Low PM10 Level';
    } else if (pm10 > 26 && pm10 < 55) {
      levelPm10 = 'Medium PM10 Level';
    } else if (pm10 > 55 && pm10 < 250) {
      levelPm10 = 'Medium PM10 Level';
    }

    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text(levelPm10, width / 2, height - 30);
    pop();
  } else if (mouseX < width - 50 && mouseX > width - 150 && mouseY > 400 && mouseY < 450) {
    // let sourcePM10 = "Main sources are combustion processes (e.g. indoor heating, wildfires), mechanical processes (e.g. construction, mineral dust, agriculture) and biological particles (e.g. pollen, bacteria, mold)."
    let effectsPM10 =
      'Inhalable particles can penetrate into the lungs. Short term exposure can cause irritation of the airways, coughing, and aggravation of heart and lung diseases, expressed as difficulty breathing, heart attacks and even premature death.';
    push();
    textFont(infoFont);
    textAlign(CENTER);
    textSize(20);
    fill(255);
    text(effectsPM10, width / 2, height - 40, 900, 100);
    pop();
  } else if (mouseX < width - 192.5 && mouseX > width - 247.5 && mouseY > 515 && mouseY < 585) {
    push();
    let levelPM25;
    if (pm25 < 25) {
      levelPM25 = 'Low PM2.5 Level';
    } else if (pm25 > 26 && pm25 < 50) {
      levelPM25 = 'Medium PM2.5 Level';
    } else if (pm25 > 50 && pm25 < 250) {
      levelPM25 = 'High PM2.5 Level';
    }

    textFont(infoFont);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text(levelPM25, width / 2, height - 30);
    pop();
  } else if (mouseX < width - 50 && mouseX > width - 150 && mouseY > 520 && mouseY < 570) {
    // let sourcePM25 = "Main sources are combustion processes (e.g. power plants, indoor heating, car exhausts, wildfires), mechanical processes (e.g. construction, mineral dust) and biological particles (e.g. bacteria, viruses)."
    let effectsPM25 =
      'Fine particles can penetrate into the lungs and bloodstream. Short term exposure can cause irritation of the airways, coughing and aggravation of heart and lung diseases, expressed as difficulty breathing, heart attacks and even premature death.';
    push();
    textFont(infoFont);
    textAlign(CENTER);
    textSize(20);
    fill(255);
    text(effectsPM25, width / 2, height - 65, 900, 100);
    pop();
  }
}
