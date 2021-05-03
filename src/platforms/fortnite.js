const fetch = require("node-fetch");
const { reply } = require("../utils/reply");
const FortniteAPI = "https://api.fortnitetracker.com/v1/";
//Dev's Note: I couldn't find a stable Fortnite api ATM, so this one is using fortnite tracker.gg network.

exports.fortnite = ({ username, channel, client }, platform, player) => {
  if (!platform || !player) {
    reply(
      client,
      channel,
      `@${username} Please type platform and epic username`
    );
    return;
  }
  getUserStats(platform, player, (text) => {
    reply(client, channel, `@${username} ${text}`);
  });
};

/**
 *
 * @param {string} platform Platform name
 * @param {string} playername Player name handle
 * @param {function} cb Returns result this callback as string
 */
const getUserStats = (platform, playername, cb) => {
  const endpoint = `profile/${platform}/${playername}`;

  getInfo(endpoint, (result) => {
    if (result["error"]) {
      //Error from API
      cb(result["error"]);
    } else {
      let stats = trnStatRenamer(result.lifeTimeStats);
      let player = {
        name: result.epicUserHandle,
        totalKills: stats.kills,
        totalPlays: stats.matchesplayed,
        totalWins: stats.wins,
        winPercentage: stats.winPer,
      };
      cb(
        `${player.name}: ${player.totalKills} kills, ${player.totalWins} wins.`
      );
    }
  });
};

/**
 *
 * @param {string} endpoint API Endpoint
 * @param {function} cb //Return retrieved object to this function
 */
const getInfo = (endpoint, cb) => {
  fetch(FortniteAPI + endpoint, {
    headers: { "TRN-Api-Key": process.env.TRN_KEY },
  })
    .then((res) => res.json())
    .then((json) => {
      cb(json);
    });
};

function trnStatRenamer(statArray) {
  let stats = {};

  statArray.forEach((element) => {
    let statName = element.key
      .toLocaleLowerCase()
      .replace(`/`, "")
      .replace(/\s/g, "")
      .replace("%", "Per");
    stats[statName] = element.value;
  });
  return stats;
}
