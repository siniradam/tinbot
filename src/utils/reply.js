exports.reply = (client, channel, message) => {
  if (client.say) {
    //Twitch
    client.say(channel, message);
  } else if (client.reply) {
    //Discord
    const regex = /([@#][\w_-]+)/;
    client.reply(message.replace(regex, "").trim());
  }
};
