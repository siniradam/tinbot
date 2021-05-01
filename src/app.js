console.log("Initializing".yellow);

const {
  onDisconnectedHandler,
  onConnectedHandler,
  onHostedHandler,
  onRaidedHandler,
  onSubscriptionHandler,
  onCheerHandler,
  onGiftPaidUpgradeHandler,
  onHostingHandler,
  resubHandler,
  subGiftHandler,
  reconnectHandler,
  onPart,
} = require("./events");

const { messageHandler } = require("./messages");

const tmi = require("tmi.js");
const options = {
  options: {
    debug: false,
    messagesLogLevel: "info",
    joinInterval: 1000,
    messagesLogLevel: "info",
  },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: process.env.USERNAME,
    password: `oauth:${process.env.TOKEN}`,
  },
  channels: ["tinmank", "tutkuyildirim"],
};
const client = new tmi.Client(options);

client.connect().catch(console.error);

/*Twitch Connection Methods */
client.on("disconnected", (reason) => {
  onDisconnectedHandler(reason);
});

client.on("connected", (address, port) => {
  onConnectedHandler(address, port);
});

/* Twitch Message Handling. */
client.on("message", (channel, tags, message, self) => {
  messageHandler(client, channel, tags, message, self);
});

/* Twitch EVENTS */
client.on("hosted", (channel, username, viewers, autohost) => {
  onHostedHandler(client, channel, username, viewers, autohost);
});

client.on("subscription", (channel, username, method, message, userstate) => {
  onSubscriptionHandler(client, channel, username, method, message, userstate);
});

client.on("raided", (channel, username, viewers) => {
  onRaidedHandler(client, channel, username, viewers);
});

client.on("cheer", (channel, userstate, message) => {
  onCheerHandler(client, channel, userstate, message);
});

client.on("giftpaidupgrade", (channel, username, sender, userstate) => {
  onGiftPaidUpgradeHandler(client, channel, username, sender, userstate);
});

client.on("hosting", (channel, target, viewers) => {
  onHostingHandler(client, channel, target, viewers);
});

client.on("reconnect", () => {
  reconnectHandler();
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
  resubHandler(client, channel, username, months, message, userstate, methods);
});

client.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    subGiftHandler(
      client,
      channel,
      username,
      streakMonths,
      recipient,
      methods,
      userstate
    );
  }
);

//Twitch Mod Check;
//client.isMod()

client.on("part", (channel, username) => {
  // Do your stuff.
  onPart(client, channel, username);
});

console.log("So far so good".green);
