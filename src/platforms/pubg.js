const fetch = require("node-fetch");
const { reply } = require("../utils/reply");
const PubgAPI = "https://api.pubg.com/shards/"; //shards/$platform/players?filter[playerNames]=$playerName
//Limits: 10 RPM
//Platforms: kakao,steam,psn,stadia,xbox

/**
 * @typedef {string} Platforms
 **/

/**
 * @enum {Platforms}
 */
const platforms = {
  kakao: "kakao",
  steam: "steam",
  psn: "psn",
  stadia: "stadia",
  xbox: "xbox",
};

/**
 * @description Default PUBG Method.
 */
exports.pubg = ({ username, channel, client }, platform, player) => {
  lifteTimeStats(platform, player, (LTStats) => {
    if (LTStats) {
      let response = `@${username} ${player} alltime PUBG stats: \nSquad Kills: ${LTStats.squad.kills}, Squad Wins: ${LTStats.squad.wins}`;
      reply(client, channel, response);
    }
  });
};

/**
 *
 * @param {string} endpoint URL
 * @param {string} params Query string parameters
 * @param {function} cb Callback method to pass response.
 */
const getInfo = (endpoint, params, cb) => {
  let param = "?";
  Object.keys(params).forEach((key) => {
    param += `&${key}=${params[key]}`;
  });
  let url = `${PubgAPI}${endpoint}${param}`;
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PUBG_API_KEY}`,
      Accept: "application/vnd.api+json",
    },
  })
    .then((res) => res.json())
    .then((json) => {
      cb(json);
    });
};

/**
 *
 * @param {Platforms} platform Platform name
 * @param {string} playerName Name of the player
 * @description User ID and links
 */
function getPlayerID(platform, playerName, cb) {
  let endpoint = `${platform}/players`; //?filter[playerNames]=${playerName}
  getInfo(endpoint, { "filter[playerNames]": playerName }, cb);
}

/**
 *
 * @param {Platforms} platform
 * @param {int} playerId
 * @param {*} seasonId
 * @description User season spesific stats
 */
function rankStats(platform, player, seasonId, cb) {
  let gamepad = platform == "steam" ? false : true;

  const getStats = (playerId) => {
    //Get Stats
    let endpoint = `${platform}/players/${playerId}/seasons/${seasonId}/ranked`;
    getInfo(endpoint, { "filter[gamepad]": gamepad }, console.log); //TODO: Season only ranked data.
  };

  if (player.startsWith("account")) {
    getStats(player);
  } else {
    //Get player ID
    getPlayerID(platform, player, (data) => {
      if (data.errors) return;

      getStats(data[0].id);
    });
  }

  //Get Stats
}

/**
 *
 * @param {Platforms} platform
 * @param {int} accountId
 * @description Lifetime stats for a player
 */
function lifteTimeStats(platform, player, cb) {
  let gamepad = platform == "steam" ? false : true;

  const getStats = (playerId) => {
    //Get Stats
    let endpoint = `${platform}/players/${playerId}/seasons/lifetime`;
    getInfo(endpoint, { "filter[gamepad]": gamepad }, (LTStats) => {
      const stats = {
        solo: {
          wins: LTStats.data.attributes.gameModeStats.solo.wins,
          kills: LTStats.data.attributes.gameModeStats.solo.kills,
          assists: LTStats.data.attributes.gameModeStats.solo.assists,
          damageDealt: LTStats.data.attributes.gameModeStats.solo.damageDealt,
          losses: LTStats.data.attributes.gameModeStats.solo.losses,
          top10s: LTStats.data.attributes.gameModeStats.solo.top10s,
        },

        duo: {
          wins: LTStats.data.attributes.gameModeStats.duo.wins,
          kills: LTStats.data.attributes.gameModeStats.duo.kills,
          assists: LTStats.data.attributes.gameModeStats.duo.assists,
          damageDealt: LTStats.data.attributes.gameModeStats.duo.damageDealt,
          losses: LTStats.data.attributes.gameModeStats.duo.losses,
          top10s: LTStats.data.attributes.gameModeStats.squad.top10s,
        },

        squad: {
          wins: LTStats.data.attributes.gameModeStats.squad.wins,
          kills: LTStats.data.attributes.gameModeStats.squad.kills,
          assists: LTStats.data.attributes.gameModeStats.squad.assists,
          damageDealt: LTStats.data.attributes.gameModeStats.squad.damageDealt,
          losses: LTStats.data.attributes.gameModeStats.squad.losses,
          top10s: LTStats.data.attributes.gameModeStats.squad.top10s,
        },
        bestRankPoint: LTStats.data.attributes.bestRankPoint,
      };

      cb(stats);
    });
  };

  if (player.startsWith("account")) {
    getStats(player);
  } else {
    //Get player ID
    getPlayerID(platform, player, (data) => {
      if (data.errors) return;
      if (data.data[0]) getStats(data.data[0].id);
      else console.log(data);
    });
  }
}
