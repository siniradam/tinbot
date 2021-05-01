const fetch = require("node-fetch");
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

const getInfo = (endpoint, params, cb) => {
  let param = "?";
  Object.keys(params).forEach((key) => {
    param += `&key=${params[key]}`;
  });

  fetch(`${PubgAPI}${endpoint}${param}`, {
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
function getPlayerID(platform, playerName) {
  let endpoint = `${platform}/players`; //?filter[playerNames]=${playerName}
  getInfo(endpoint, { "filter[playerNames]": playerName }, cb());
}

/**
 *
 * @param {Platforms} platform
 * @param {int} playerId
 * @param {*} seasonId
 * @description User season spesific stats
 */
function rankStats(platform, playerId, seasonId) {
  let endpoint = `${platform}/players/${playerId}/seasons/${seasonId}/ranked`;
  getInfo(endpoint, {}, console.log);
}

/**
 *
 * @param {Platforms} platform
 * @param {int} accountId
 * @description Lifetime stats for a player
 */
function lifteTimeStats(platform, accountId) {
  let endpoint = `${platform}/players/${accountId}/seasons/lifetime`;
  getInfo(endpoint, {}, console.log);
}
