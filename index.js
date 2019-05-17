// const dotenv = require("dotenv").config();
// import dataRequests from './models/fetchData.js';
const express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http),
  port = process.env.PORT || 5000,
  Rooms = require("./models/rooms");
// Data = require("./models/fetchData");
// SplitAfterCast = require("./models/splitAfterKey");
// console.log(Rooms);
app
  .set("view engine", "ejs")
  .set("views", "views")

  .use(express.static("static/"))
  .use(bodyParser.urlencoded({ extended: true }))

  .get("/", room);

function spells() {
  return new Promise((resolve, reject) => {
    request("http://dnd5eapi.co/api/spells/?", function(error, response, body) {
      let spellsData = JSON.parse(body);
      // let spellsDataString = JSON.stringify(spellsData);
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

// Rooms.forEach(room => {
//   newNamespace(io.of('/' + room.name), room.name)
// })

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.broadcast.emit("hi");
  socket.on("chat message", function(msg) {
    // console.log("message: " + msg);
    if (msg.includes("!help")) {
      io.emit("botMessage", "You can use these commands");
      io.emit("botMessage", "- Rules (!Rules)[falldamage]");
      io.emit("botMessage", '- I cast [spell] (message contains "cast")');
    }
    if (msg.includes("roll")) {
      let requestOn = splitAfterRoll(msg);
      rollDice(requestOn)
      io.emit("roll", rollDice(requestOn) );

    }
    if (msg.includes("cast")) {
      let requestOn = splitAfterKey(msg);
      // let requestedResults = apiRequest("spells/?name=" + requestOn);
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
  var numbers = string.match(/\d+/g).map(Number);
  return getRandomInt(numbers[0]);
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function splitAfterKey(msg) {
  // dit kan anders door cast ziet hij roll niet
  let cast = "cast";
  let text = msg;
  let words = text.split(" ");
  let castIndex = words.findIndex(word => word == cast);
  let nextWord = words[castIndex + 1];
  return capitalizeFirstLetter(nextWord);
}

function splitAfterRoll(msg) {
  // dit kan anders door cast ziet hij roll niet
  let roll = "roll";
  let text = msg;
  let words = text.split(" ");
  let rollIndex = words.findIndex(word => word == roll);
  let nextWord = words[rollIndex + 1];
  return capitalizeFirstLetter(nextWord);
}


function apiRequest(endpoint) {
  let apiUrl = "http://dnd5eapi.co/api/" + endpoint;
  let test = request(apiUrl, function(error, response, body) {
    let apiData = JSON.parse(body);
    let responseUrl = apiData["results"][0]["url"];
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    // return responseUrl;
    // Dit werkt wel maar wil het niet zo
    return urlRequest(responseUrl);
    //  dit wil je eigelijk returnen zod at het los is maar misschien kan ik het van uit het diepen omhoog gooien
  });
  return test;
}

function urlRequest(url) {
  //  maar hier een new generiek object
  request(url, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    let spellDataJson = JSON.parse(body);
    let spellData = spellDataJson["desc"][0];
    io.emit("gameRules", spellData);
    // return spellData
  });
}

http.listen(port, () => {
  // console.log(port);
});
