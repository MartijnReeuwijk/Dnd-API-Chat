console.log("iets");
(function() {

let keywords = ["cast", "!rules"]

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
    let keyWordCheck = (keywords.indexOf(msg) > -1);
    newLi.textContent = msg;
    document.querySelector("#messages").append(newLi);
  });

  socket.on("botMessage", function(msg) {
    let newLi = document.createElement("li");
    newLi.textContent = msg;
    document.querySelector(".rules").append(newLi);
  });

  socket.on("roll", function(msg) {
    let newLi = document.createElement("li");
    newLi.textContent = msg;
    document.querySelector(".rules").append(newLi);
  });

  socket.on("gameRules", function(msg) {
    let newRules = document.createElement("div");
    newRules.className = "rules"
    let newLi = document.createElement("li");
    newLi.textContent = msg;
    document.querySelector(".rules").append(newLi);
  });

})();

function split(text) {
  let spiltString = text.trim().split(/(\s+)/);
  console.log(spiltString);
  return spiltString;
}

// document.getElementById('button').addEventListener("click", checkFrom);
