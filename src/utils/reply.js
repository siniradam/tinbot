exports.reply = (client, channel, message) => {
  try {
    if (message) {
      if (client.say) {
        //Twitch
        client.say(channel, message);
      } else if (client.reply) {
        //Discord
        const regex = /([@#][\w_-]+)/;
        client.reply(message.replace(regex, "").trim());
      }
    } else {
      console.log(message);
    }
  } catch (error) {
    console.log(" ===== Reply Error ===== ");
    console.log(message);
    console.log(error);
  }
};
