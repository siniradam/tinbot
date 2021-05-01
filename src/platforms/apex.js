const fetch = require("node-fetch");
const ApexAPI = `https://api.mozambiquehe.re/bridge?version=5&platform={platform}&player={username}&auth=${process.env.APEX_API_KEY}`;

const UserData = require("../controllers/userdata");
const { reply } = require("../utils/reply");

let previousFetch = {
  time: 0,
  data: {},
};

exports.apex = ({ username, channel, client }, param1, param2) => {
  if (!param1) {
    //Param1 missing give info
    reply(
      client,
      channel,
      `@${username} for apex stats please type platform then username`
    );
    //
  } else if (!param2) {
    //Param2 missing get steam info
    //General Info
    basicInfo("steam", param2, (text) => {
      reply(client, channel, `@${username} ${text}`);
    });
    //
  } else {
    //Param2 exists, check if command defined or not consider as a platform name

    switch (param2) {
      case "status":
        isOnline(param1, (text) => {
          reply(client, channel, `@${username} ${text}`);
        });
        break;

      default:
        basicInfo(param1, param2, (text) => {
          reply(client, channel, `@${username} ${text}`);
        });
        break;
    }
  }
};

const platforms = {
  steam: "PC",
  psn: "PS4",
  xbox: "X1",
  stadia: "",
};

/**
 *
 * @param {string} username
 * @param {function} cb
 * @description Fetches user info from api.
 */
function getInfo(platform, username, cb) {
  const lastFetch = Math.round((Date.now() - previousFetch.time) / 1000);

  //Retrieve data from API
  if (lastFetch > 2) {
    //At least 2 second required for a new fetch
    let url = ApexAPI.replace("{username}", username ? username : "tinmank") //Original API URL + username
      .replace("{platform}", platforms[platform]); //platform

    let settings = { method: "Get" };
    previousFetch.time = Date.now();

    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        //Fetched Data
        previousFetch.data = json;
        cb(json);

        //Store Data
        UserData.add(username, platform, "apex", json, () => {});
      });

    //Use Cached data
  } else {
    Promise.resolve(
      UserData.retrieve(username, platform, "apex", (data) => {
        cb(data);
      })
    ).catch((err) => {
      console.log("Get Info Retrieve Error");
      console.log(err);
    });
  }
}

/**
 *
 * @param {string} username Player platform username
 * @param {Function} cb Calls function with basic user info
 */
function basicInfo(platform, username, cb) {
  getInfo(platform, username, (info) => {
    if (typeof info != "object" || !info.global) {
      console.log(info);
      return cb(`Couldn't find ${username} player.`);
    }
    //
    let player = {
      username: info.global.name,
      level: info.global.level,
      rankName: `${info.global.rank.rankName} ${info.global.rank.rankDiv}`,
      rankLevel: info.global.rank.rankScore,
      legend: info.realtime.selectedLegend,
      inGame: info.realtime.isInGame,
    };
    //
    cb(
      `${player.username} Level: ${player.level}, Rank: ${player.rankName}, playing as ${player.legend}`
    );
  });
}

/**
 *
 * @param {string} username Player platform username
 * @param {function} cb Calls function with online status string
 * @description Returns is user online in game
 */
function isOnline(username, cb) {
  getInfo("steam", username, (info) => {
    if (info.Error) {
      return cb("Couldn't find that player.");
    }
    //
    let player = {
      username: info.global.name,
      inGame: info.realtime.isInGame,
      isOnline: info.realtime.isOnline,
    };
    //
    cb(
      `${player.username} is ${player.isOnline ? "online" : "offline"} in game.`
    );
  });
}
