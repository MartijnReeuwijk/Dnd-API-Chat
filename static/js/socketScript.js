console.log("iets");
(function() {
  let keywords = ["cast", "!rules"];

  let socket = io();
  document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    let message = document.querySelector("#m").value;
    socket.emit("chat message", message);
    document.querySelector("#m").value = "";
    return false;
  });

  socket.on("chat message", function(msg) {
    let newLi = document.createElement("li");
    let keyWordCheck = keywords.indexOf(msg) > -1;
    newLi.textContent = msg;
    document.querySelector("#messages").append(newLi);
  });

  socket.on("errors", function(error) {
    let newp = document.createElement("p");
    newp.textContent = error;
    document.querySelector(".error").append(newp);
  });

  socket.on("botMessage", function(msg) {
    // can make this like one function i guess
    let newLi = document.createElement("li");
    newLi.textContent = msg;
    document.querySelector(".help").append(newLi);
  });

  // Add dice type on the roll
  socket.on("roll", function(msg) {
    let dice = new Audio("sounds/dice.mp3");
    let epic = new Audio("sounds/epic.mp3");
    let fail = new Audio("sounds/dice.mp3");
    let newLi = document.createElement("li");
    dice.pause();
    dice.currentTime = 0;
    newLi.textContent = msg;
    dice.play();
    if (msg === 1) {
      newLi.classList.add("natOne");
      fail.play();
    }
    if (msg === 20) {
      newLi.classList.add("nat20");
      epic.play();
    }
    document.querySelector(".dice").append(newLi);
  });

  socket.on("gameRules", function(msg) {
    let newRules = document.createElement("div");
    newRules.className = "rules";
    let newLi = document.createElement("li");
    newLi.textContent = msg;
    document.querySelector(".rules").append(newLi);
  });


  socket.on("visual", function(rollCount) {
    datavisual(rollCount)
  });






})();

function split(text) {
  let spiltString = text.trim().split(/(\s+)/);
  console.log(spiltString);
  return spiltString;
}

function rollAssist() {
  let rollbuttons = document.getElementsByClassName("rollButton");
  let rollbuttonsArray = Array.from(rollbuttons);
  rollbuttonsArray.forEach(diceButtons => {
    diceButtons.addEventListener("click", function() {
      document.querySelector("#m").value = this.value;
    });
  });
}

function showdatavisual(){
document.getElementsByClassName('datavisual')[0].classList.toggle("outOfview")
}


document.getElementsByClassName('showdatavisual')[0].addEventListener("click", showdatavisual);
rollAssist();
