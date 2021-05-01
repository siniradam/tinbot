//

const { apex } = require("./platforms/apex");
const { steam } = require("./platforms/steam");
const { reply } = require("./utils/reply");

exports.messageHandler = (client, channel, tags, message, self) => {
  if (self) return;

  message = message.toLowerCase();

  if (message.slice(0, 1) == "!") {
    message = message.slice(1).trim();
    messageData = message.split(/\s+/);
    let command = messageData[0];
    let param1 = messageData[1];
    let param2 = messageData[2];

    switch (command) {
      case "hello":
      case "hi":
      case "howdy":
        reply(client, channel, sayHi(tags.username));
        break;

      case "saat":
      case "time":
        reply(client, channel, sayTime());

        break;

      case "apex":
        apex({ username: tags.username, channel, client }, param1, param2);
        break;

      case "steam":
        steam({ username: tags.username, channel, client }, param1, param2);
        break;

      case "dice":
        rollTheDice({ username: tags.username, channel, client }, param1);

        break;

      default:
        break;
    }
  } else {
    if (message === "!hello") {
      reply(client, channel, `@${tags.username}, heya!`);
      //
    } else if (message === "!tinbot") {
      reply(client, channel, `@${tags.username}, beep boop!`);
      //
    } else if (message.indexOf("tinman") !== -1) {
      reply(client, channel, `@${tags.username}, 🙋🏻‍♂️`);
      //
    }
  }
};

function sayHi(username) {
  return `@${username}, 🙋🏻‍♂️`;
}

function sayTime() {
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  return datetime;
}

function rollTheDice({ username, channel, client }, diceNumber) {
  reply(
    client,
    channel,
    `@${username} ${Math.floor(Math.random() * diceNumber)}`
  );
}
