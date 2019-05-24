
const express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  port = process.env.PORT || 5000,
  fs = require("fs"),
  rp = require("request-promise");
  // Rooms = require("./models/rooms");
// Data = require("./models/fetchData");
// SplitAfterCast = require("./models/splitAfterKey");
// console.log(Rooms);
app
  .set("view engine", "ejs")
  .set("views", "views")

  .use(express.static("static/"))
  .use(bodyParser.urlencoded({
    extended: true
  }))

  .get("/", room);

const rollCount = {};

function spells() {
  return new Promise((resolve, reject) => {
    request("http://dnd5eapi.co/api/spells/?", function(error, response, body) {
      let spellsData = JSON.parse(body);
      resolve(spellsData);
      reject(this.statusText);
    });
  });
}

async function room(req, res) {
  let spellsResults = await spells();
  res.render("index.ejs", {
    spells: spellsResults["results"]
  });
}

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.broadcast.emit("hi");
  socket.on("chat message", function(msg) {
    if (msg.includes("!help")) {
      io.emit("botMessage", "You can use these commands");
      io.emit("botMessage", "- Rules (!Rules)[falldamage]");
      io.emit("botMessage", '- I cast [spell] (message contains "cast")');
      io.emit("botMessage", "- roll [Number]D[Number] for the type and amound");
    }
    if (msg.includes("roll")) {
      let split = "roll";
      let requestOn = splitAfterKey(split, msg);
      let dice = rollDice(requestOn);
      io.emit("gameRules", dice);
    }

    if (msg.includes("cast")) {
      let type = "spells";
      let split = "cast";
      let requestOn = splitAfterKey(split, msg);
      apiRequest(type, requestOn).then(result => io.emit("gameRules", result));
    }

    // This could be one
    if (msg.includes("summon")) {
      let type = "monsters";
      let split = "summon";
      let requestOn = splitAfterKey(split, msg);
      console.log(requestOn);
      apiRequest(type, requestOn).then(result => io.emit("gameRules", result));
    }
    io.emit("chat message", msg);
  });
});

io.on("disconnect", function() {
  socket.broadcast.emit("Bye");
  console.log("user disconnected");
});

//  overige functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function rollDice(string) {
  let numbers = string.match(/\d+/g).map(Number);
  const dType = String(numbers[1]);
  const dAmount = numbers[0];
  if (dType in rollCount) {
    rollCount[dType] = rollCount[dType] + dAmount;
  } else {
    rollCount[dType] = dAmount;
  }
  io.emit("visual", rollCount);
  return getRandomInt(dType, dAmount);
}

function getRandomInt(max, aantal) {
  var total = 0;
  const min = 0;
  max = Math.floor(max);
  for (let i = 0; i < aantal; i++) {
    total += Math.floor(Math.random() * max) + 1;
  }
  return total;
}

function splitAfterKey(split, msg) {
  let text = msg;
  let words = text.split(" ");
  let splitIndex = words.findIndex(word => word == split);
  let nextWord = words[splitIndex + 1];
  return capitalizeFirstLetter(nextWord);
}
function apiRequest(type, endpoint) {
  let name = "/?name=";
  let apiUrl = "http://dnd5eapi.co/api/" + type + name + endpoint;
  return new Promise((resolve, reject) => {
    request(apiUrl, async function(error, response, body) {
      let apiData = JSON.parse(body);
      if (apiData["results"][0] === undefined) {
        reject(this.statusText);
      } else {
        let responseUrl = apiData["results"][0]["url"];
        console.log("error:", error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
        resolve(await urlRequest(responseUrl));
      }
    });
  });
}

function urlRequest(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, body) {
      console.log("error:", error);
      console.log("statusCode:", response && response.statusCode);
      let apiDataJson = JSON.parse(body);
      let results = makeObject(apiDataJson);
      resolve(results);
      reject(this.statusText);
    });
  });
}

function makeObject(data) {
  let resultData = {
    name: data.name ? data.name : undefined,
    size: data.size ? data.size : undefined,
    type: data.type ? data.type : undefined,
    alignment: data.alignment ? data.alignment : undefined,
    armor_class: data.armor_class ? data.armor_class : undefined,
    hit_points: data.hit_points ? data.hit_points : undefined,
    speed: data.speed ? data.speed : undefined,
    strength: data.strength ? data.strength : undefined,
    dexterity: data.dexterity ? data.dexterity : undefined,
    constitution: data.constitution ? data.constitution : undefined,
    intelligence: data.intelligence ? data.intelligence : undefined,
    wisdom: data.wisdom ? data.wisdom : undefined,
    charisma: data.charisma ? data.charisma : undefined,
    senses: data.senses ? data.senses : undefined,
    desc: data.desc ? data.desc[0] : undefined,
    page: data.page ? data.page : undefined,
    range: data.range ? data.range : undefined,
    components: data.components ? data.components[0] : undefined,
    material: data.material ? data.material : undefined,
    duration: data.duration ? data.duration : undefined,
    concentration: data.concentration ? data.concentration : undefined
  };
  Object.keys(resultData).forEach(key => {
    if (resultData[key] === undefined) {
      delete resultData[key];
    }
  });
  return resultData;
}


http.listen(port, () => {
});
