const fetch = require("node-fetch");
const TwitchAPI = `https://api.twitch.tv/helix/`;
const { reply } = require("../utils/reply");

let previousFetch = {
  time: 0,
  data: {},
};

exports.twitch = ({ username, channel, client }, param1, param2) => {
  //Return Online Status
  isBroadcasterOnline(param1, (response) => {
    reply(client, channel, response);
  });
};

function isBroadcasterOnline(channel, callback) {
  // tutkuyildirim
  getInfo(`search/channels?query=${channel}`, (data) => {
    let result = {};
    for (let broadcaster in data.data) {
      if (broadcaster.broadcaster_login == channel) {
        result = broadcaster;
        break;
      }
    }

    //🟠🟡🔵🟣
    //Parse
    if (result.is_live) {
      callback(`${channel} is 🔴`);
    } else {
      callback(`${channel} is 🟢`);
    }
  });
}

/**
 *
 * @param {string} username
 * @param {function} cb
 * @description Fetches user info from api.
 */
function getInfo(endpoint, method, cb) {
  const lastFetch = Math.round((Date.now() - previousFetch.time) / 1000);
  previousFetch.time = Date.now();

  let settings = {
    method,
    headers: {
      "client-id": process.env.TWITCH_CLIENT_ID,
      Authorization: `Bearer ${process.env.TWITCH_TOKEN}`,
    },
  };

  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      //Fetched Data
      //previousFetch.data[param] = json;
      cb(json);

      //Store Data
    });
}
