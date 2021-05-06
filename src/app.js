console.log("Initializing".yellow);

const {
  //Twitch
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
  //Discord
  onDiscordConnect,
  onDiscordConnectionError,
  onDiscordReconnecting,
  onDiscordReconnected,
} = require("./events");

const { messageHandler } = require("./messages");

//Discord Library
const { Client } = require("discord.js");
const DiscordClient = new Client();

//Twitch Library
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
  channels: process.env.TWITCH_CHANNELS.split(","),
};
const TwitchClient = new tmi.Client(options);

//Twitch Definitions
TwitchClient.connect().catch(console.error);

/*Twitch Connection Methods */
TwitchClient.on("disconnected", (reason) => {
  onDisconnectedHandler(reason);
});

TwitchClient.on("connected", (address, port) => {
  onConnectedHandler(address, port);
});

/* Twitch Message Handling. */
TwitchClient.on("message", (channel, tags, message, self) => {
  messageHandler(TwitchClient, channel, tags, message, self);
});

/* Twitch EVENTS */
TwitchClient.on("hosted", (channel, username, viewers, autohost) => {
  onHostedHandler(TwitchClient, channel, username, viewers, autohost);
});

TwitchClient.on(
  "subscription",
  (channel, username, method, message, userstate) => {
    onSubscriptionHandler(
      TwitchClient,
      channel,
      username,
      method,
      message,
      userstate
    );
  }
);

TwitchClient.on("raided", (channel, username, viewers) => {
  onRaidedHandler(TwitchClient, channel, username, viewers);
});

TwitchClient.on("cheer", (channel, userstate, message) => {
  onCheerHandler(TwitchClient, channel, userstate, message);
});

TwitchClient.on("giftpaidupgrade", (channel, username, sender, userstate) => {
  onGiftPaidUpgradeHandler(TwitchClient, channel, username, sender, userstate);
});

TwitchClient.on("hosting", (channel, target, viewers) => {
  onHostingHandler(TwitchClient, channel, target, viewers);
});

TwitchClient.on("reconnect", () => {
  reconnectHandler();
});

TwitchClient.on(
  "resub",
  (channel, username, months, message, userstate, methods) => {
    resubHandler(
      TwitchClient,
      channel,
      username,
      months,
      message,
      userstate,
      methods
    );
  }
);

TwitchClient.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    subGiftHandler(
      TwitchClient,
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
//TwitchClient.isMod()

TwitchClient.on("part", (channel, username) => {
  // Do your stuff.
  //onPart(TwitchClient, channel, username);
});

//Discord Definitions
DiscordClient.on("ready", () => {
  onDiscordConnect(DiscordClient);
});

DiscordClient.on("shardError", () => {
  onDiscordConnectionError(DiscordClient);
});

DiscordClient.on("shardReconnecting", () => {
  onDiscordReconnecting(DiscordClient);
});

DiscordClient.on("shardResumed", () => {
  onDiscordReconnected(DiscordClient);
});

DiscordClient.on("message", (message) => {
  messageHandler(
    message,
    message.channel.general,
    {
      username: message.author.username,
      bot: message.author.bot,
      "display-name": message.author.username,
      type: message.type,
    },
    message.content,
    message.author.bot
  );
});

DiscordClient.login(process.env.DISCORD_TOKEN);

console.log("So far so good".green);
