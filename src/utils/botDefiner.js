const Channel = require("../controllers/channel");
const { reply } = require("./reply");

exports.setChannel = ({ username, channel, client }, tags, param) => {
  let platform = tags.platform;
  let channelid = tags.serverid;
  let channelname = tags.servername;
  let language = param;

  if (tags.isadmin) {
    Channel.addChannel(platform, channelid, channelname, language, (result) => {
      console.log(result);
      reply(client, channel, "Language set.");
    });
  } else {
    reply(client, channel, "Only server admin/broadcaster can set this.");
  }
};
