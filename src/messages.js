//

const { apex } = require("./platforms/apex");
const { steam } = require("./platforms/steam");

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
        client.say(channel, sayHi(tags.username));
        break;

      case "saat":
        client.say(channel, sayTime());

        break;

      case "apex":
        apex(param1, param2, (text) => {
          client.say(channel, text);
        });
        break;

      case "steam":
        steam(param1, param2, (text) => {
          client.say(channel, text);
        });
        break;

      default:
        break;
    }
  } else {
    if (message === "!hello") {
      client.say(channel, `@${tags.username}, heya!`);
      //
    } else if (message === "!tinbot") {
      client.say(channel, `@${tags.username}, beep boop!`);
      //
    } else if (message.indexOf("tinman") !== -1) {
      client.say(channel, `@${tags.username}, 🙋🏻‍♂️`);
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
