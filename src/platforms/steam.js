const fetch = require("node-fetch");
const { reply } = require("../utils/reply");
const SteamAPI = `https://api.steampowered.com/{endpoint}/{apiV}/?key=${process.env.STEAM_API_KEY}`;
//EVERY SINGLE GAME IN API: https://api.steampowered.com/ISteamApps/GetAppList/v2/
//http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=3A2930E05C8994061C8983C34E6A582C&steamid=76561197971374396&format=json

//APPIDS:
//CSGO: 730
//APEX: 1172470
//Cyberpunk: 1091500
const SteamEndpoint = (endpoint, apiV, params) => {
  let param = "";
  Object.keys(params).forEach((key) => {
    param += `&key=${params[key]}`;
  });

  return (
    SteamAPI.replace("{apiV}", apiV).replace("{endpoint}", endpoint) + param
  );
};

//TinmanK Steam ID: "76561197971374396"
exports.steam = ({ username, channel, client }, param1, param2) => {
  reply(client, channel, `@${username} Tinman's Steam friend code 11108668`);
};
/* */
function getInfo(url, callback) {
  callback("");
}

//Steam Methods
function playerID(playername) {
  let endpoint = SteamEndpoint("ISteamUser/ResolveVanityURL", "v0002", {
    vanityurl: playername,
  });
  getInfo(endpoint, (data) => {});
}

function playerSummary(steamid) {
  let endpoint = SteamEndpoint("ISteamUser/GetPlayerSummaries", "v0001", {
    steamids: steamid, //This is plural, no mistake here.
  });
  getInfo(endpoint, (data) => {});
}

function playerOwns(steamid) {
  let endpoint = SteamEndpoint("ISteamUser/CheckAppOwnership", "v2", {
    steamid,
  });
  getInfo(endpoint, (data) => {});
}

/**
 * @description Returns owned games by steamid.
 */
function playerGames(steamid) {
  //Returns owned games.
  let endpoint = SteamEndpoint("IPlayerService/GetOwnedGames", "v0001", {
    steamid,
    include_appinfo: true,
  });
  getInfo(endpoint, (data) => {});
}

function recentlyPlayed(steamid) {
  let endpoint = SteamEndpoint("IPlayerService/GetRecentlyPlayedGames", "v1", {
    steamid,
  });
}
