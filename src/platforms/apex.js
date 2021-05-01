const fetch = require("node-fetch");
const ApexAPI = `https://api.mozambiquehe.re/bridge?version=5&platform=PC&player={username}&auth=${process.env.APEX_API_KEY}`;

let previousFetch = {
  time: 0,
  data: {},
};

exports.apex = (param1, param2, cb) => {
  if (!param1) {
    cb("For apex stats please type user pc username");
  } else if (!param2) {
    //General Info
    basicInfo(param1, cb);
  } else {
    switch (param2) {
      case "status":
        isOnline(param1, cb);
        break;
    }
  }
};

/**
 *
 * @param {string} username
 * @param {function} cb
 * @description Fetches user info from api.
 */
function getInfo(username, cb) {
  const lastFetch = Math.round((Date.now() - previousFetch.time) / 1000);

  if (lastFetch > 1) {
    //At least 1 second required for a new fetch
    let url = ApexAPI.replace("{username}", username ? username : "tinmank");
    let settings = { method: "Get" };
    previousFetch.time = Date.now();

    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        previousFetch.data = json;
        cb(json);
      });
  } else {
    cb(previousFetch.data);
  }
}

/**
 *
 * @param {string} username Player platform username
 * @param {Function} cb Calls function with basic user info
 */
function basicInfo(username, cb) {
  getInfo(username, (info) => {
    if (info.Error) {
      return cb("Couldn't find that player.");
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
  getInfo(username, (info) => {
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
