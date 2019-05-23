![Demo pic](https://github.com/MartijnReeuwijk/websockets/blob/master/readmeassets/hero.png)

# Real time web

Het idee is om een Dungeons and Dragons chat room te maken met het intergreren van de DND API, zodat de players en de DM het spell sneller kunnen spelen en niet 100x de boeken moeten openen. waar door het spel sneller werkt.

# Tabel of content

-   [Web design](#web-design)
-   [Tabel of content](#tabel-of-content)
    -   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Running](#running)
    -   [Linting](#linting)
    -   [Build With](#build-with)
-   [Concept](#concept)
    -   [Eye tracking](#eye-tracking)
    -   [Voice controlled](#voice-controlled)
    -   [Keybind support](#keybind-support)
-   [User scenario](#user-scenario)
    -   [User needs](#user-needs)
-   [Keybinds](#keybinds)
    -   [Keybinds zonders visual clue](#keybinds-zonders-visual-clue)
    -   [Keybinds visual clue](#keybinds-visual-clue)
        -   [Keybinds code](#keybinds-code)
    -   [Authors](#authors)
    -   [License](#license)
    -   [Acknowledgments and Thanks](#acknowledgments-and-thanks)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites

You will need the following things properly installed on your computer.

-   [Git](https://git-scm.com/)
-   [Google Chrome](https://google.com/chrome/)

## Installation

-   `git@github.com:MartijnReeuwijk/websockets.git`
-   `cd websockets`
-   `npm install`

## Running

`node index.js`
localhost 5000.

## Linting

For linting i used CleanCss and Prettier
To run the Prettier use the code below

-   `npm run clean`

## Build With

-   [Prettier](https://prettier.io/docs/en/options.html) - Prettier.io - Linter
-   [Node.js](https://nodejs.org/en/) - nodejs
-   [Express](https://expressjs.com/) - Express

# Concept

dit doe ik door het gebruiken van een DND API waar de data van de regels uit het spel zijn. Voor nu heb ik de intergratie van spells en rolls al in de app.

## API calls / endpoint
For now the app works with the `http://www.dnd5eapi.co` api and its endpoints.
- `http://dnd5eapi.co/api/classes/`
- `http://dnd5eapi.co/api/features/`
- `http://dnd5eapi.co/api/monsters/?name=`
- `http://dnd5eapi.co/api/spells/?name=`

For now i only use the spells with a `?name=` search on the api after that call you will get a result that looks

like:
`"count": 1,
	"results": [
		{
			"name": "Acid Arrow",
			"url": "http://www.dnd5eapi.co/api/spells/1"
		}
	]`

  - after that you that i do a new call on the newly gotten `url` and get the data you actually need.
  `"_id":"5bce91f95b7768e7920184d6","index":1,"name":"Acid Arrow","desc":["A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn."],"higher_level":["When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd."],"page":"phb 259","range":"90 feet","components":["V","S","M"],"material":"Powdered rhubarb leaf and an adderâ€™s stomach.","ritual":"no","duration":"Instantaneous","concentration":"no","casting_time":"1 action","level":2,"school":{"name":"Evocation","url":"http://www.dnd5eapi.co/api/magic-schools/5"},"classes":[{"url":"http://www.dnd5eapi.co/api/classes/12","name":"Wizard"}],"subclasses":[{"url":"http://www.dnd5eapi.co/api/subclasses/2","name":"Lore"},{"url":"http://www.dnd5eapi.co/api/subclasses/4","name":"Land"}],"url":"http://www.dnd5eapi.co/api/spells/1"`

As you can see this is a huge mess of data and i dont want to overwhelm the players with useless data.
So i do a cleaning function that will work for both the summoned monsters and the spells so the server only need to do one function

## Npm request
With the use of npm request (works as a fetch) i request the data from the API.

```js
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
```

## sockets front-end
On the front-end site i connect with the Chat `"chat message"` socket on the server ping the code makes a message item on the site.
```js
socket.on("chat message", function(msg) {
  let newLi = document.createElement("li");
  let keyWordCheck = keywords.indexOf(msg) > -1;
  newLi.textContent = msg;
  document.querySelector("#messages").append(newLi);
});
```

## sockets back-end
On the back-end i check if the message from the front-end contains a few words and then do the according functions like these below.

```js
if (msg.includes("roll")) {
  let requestOn = splitAfterRoll(msg);
  let dice = rollDice(requestOn)
  io.emit("roll", dice );
}
```
After the server has rolled the dice it will add this to an object for the datavisual.

## datavisual
![Demo pic](https://github.com/MartijnReeuwijk/websockets/blob/master/readmeassets/pie.png);

 For the datavisual u use D3 to make the pie chart.
 The pie chart is based on the dice rolled and not on the total amount, it will show the dominance of the D20 in the game. The chart shows the % of dice used in you session / game later i will add a visual to get the total amount of damaged rolled per dice and popularity of spells and their damage dice.

## Sound sockets
To make the game more real, I added a dice rolling sound so everyone knows when the someone is rolling dice!
When the player or dm rolls a 20 on the dice the app will play "Epic.mp3" and it will send it over the sockets so all the users can hear your epic gamer moment.

# Data flow
The server talks with the DND api where i request all my data




## DND nerd feedback
![Feedback](https://github.com/MartijnReeuwijk/websockets/blob/master/readmeassets/feedback.png);

For feedback i have ask the DCA fan server where all the DND players gather who are fan off the official show.
Nova an experience DND player has given me some feedback on the functions of the app and what it needs.
i have added the feedback items to the todo list


## Todo
- [] Able to cast from the list
- [] Able to summon from a monster list
- [] Refactor to Async
- [] More Rules
- [] Change rules to out of view items
- [] Add dice type by results
