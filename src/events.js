const S = {
  HOST: "host",
  HOSTING: "hosting",
  RAID: "raid",
  SUBSCRIBE: "subscribe",
  CHEER: "cheer",
  GIFTSUB: "giftsub",
  RESUB: "resub",
  GIFTUPRGRADE: "giftUpgrade",
  JUSTLEFT: "justleft",
};

const sentences = {
  en: {
    host: `Thank you @variable1 for the host of variable2!`,
    raid: `Thank you @variable for the raid of variable2!`,
    subscribe: `Thank you @variable1 for subscribing!`,
    cheer: `Thank you @variable1 for the variable2 bits!`,
    giftUpgrade: `Thank you @variable1 for continuing your gifted sub!`,
    hosting: `We are now hosting variable1 with variable2 viewers!`,
    resub: `Thank you variable1 for the variable2 sub!`,
    giftsub: `Thank you variable1 for gifting a sub to variable2}}.`,
    justleft: `variable1 just left. See you.`,
  },
  tr: {
    host: `Getirdigin variable2 kisi icin tesekkurler @variable1!`,
    raid: `variable2 Kisi ile yaptigin baskin isin tesekkurler @variable for!`,
    subscribe: `Abone oldugun icin tesekkurler @variable1!`,
    cheer: `Gonderdigin variable2 bit icin tesekkurler @variable1`,
    giftUpgrade: `Aboneliginin devami icin tesekkurler @variable1`,
    hosting: `variable2 kisiyle variable1 izliyoruz!`,
    resub: `variable2 aylik aboneligin icin tesekkurler @variable1!`,
    giftsub: `@variable2 hediye abonelik aldi, tesekkurler @variable1 }}.`,
    justleft: `variable1 aramizdan ayrildi.`,
  },
};

function getMessage(channel, sentence, var1, var2, var3) {
  let lang = channel == "#tutkuyildirim" ? "tr" : "en";
  let toSend = sentences[lang][sentence];
  if (var1) {
    toSend = toSend.replace("variable1", var1);
  }
  if (var2) {
    toSend = toSend.replace("variable2", var2);
  }
  if (var3) {
    toSend = toSend.replace("variable3", var3);
  }
  return toSend;
}

exports.onDisconnectedHandler = (reason) => {
  console.log(`Disconnected: ${reason}`);
};

exports.onConnectedHandler = (address, port) => {
  console.log(`Connected: ${address}:${port}`);
};

exports.onHostedHandler = (client, channel, username, viewers, autohost) => {
  let m = getMessage(channel, S.HOST, username, viewers);
  client.say(channel, m);
};

exports.onRaidedHandler = (client, channel, username, viewers) => {
  let m = getMessage(channel, S.RAID, username, viewers);
  client.say(channel, m);
};

exports.onSubscriptionHandler = (
  client,
  channel,
  username,
  method,
  message,
  userstate
) => {
  let m = getMessage(channel, S.SUBSCRIBE, username);
  client.say(channel, m);
};

exports.onCheerHandler = (client, channel, userstate, message) => {
  let m = getMessage(channel, S.CHEER, userstate.username, userstate.bits);
  client.say(channel, m);
};

exports.onGiftPaidUpgradeHandler = (
  client,
  channel,
  username,
  sender,
  userstate
) => {
  let m = getMessage(channel, S.GIFTUPRGRADE, username);
  client.say(channel, m);
};

exports.onHostingHandler = (client, channel, target, viewers) => {
  let m = getMessage(channel, target, viewers);
  client.say(channel, m);
};

exports.reconnectHandler = () => {
  console.log("Reconnecting...");
};

exports.resubHandler = (
  client,
  channel,
  username,
  months,
  message,
  userstate,
  methods
) => {
  const cumulativeMonths = userstate["msg-param-cumulative-months"];
  let m = getMessage(channel, S.RESUB, username, cumulativeMonths);
  client.say(channel, m);
};

exports.subGiftHandler = (
  client,
  channel,
  username,
  streakMonths,
  recipient,
  methods,
  userstate
) => {
  let m = getMessage(channel, S.GIFTSUB, username, recipient);
  client.say(channel, m);
};

exports.onPart = (client, channel, username) => {
  client.say(channel, getMessage(channel, S.JUSTLEFT, username));
};
