const fetch = require("node-fetch");
const { reply } = require("../utils/reply");
const CoincapAPI = "https://pro-api.coinmarketcap.com/v1/";

/**
 *
 * @param {object} param0
 * @param {string} param1
 * @param {string} param2
 * @description Default method.
 */
exports.coin = ({ username, channel, client }, param1, param2) => {
  if (!param1) {
    reply(client, channel, "Please type coin name after your command.");
    return;
  }
  getCoinPrice(param1, (response) => {
    reply(client, channel, response);
  });
};

const previousFetch = { time: 0, data: {} }; //Coin=>price

/**
 *
 * @param {string} currency
 * @param {function} cb
 * @description Returns string
 */
function getCoinPrice(currency, cb) {
  let endpoint = "cryptocurrency/quotes/latest";
  let query = {
    slug: currency,
  };

  getInfo(endpoint, query, (data) => {
    let response = "";

    try {
      data = data.data[Object.keys(data.data)[0]];
      response = `${data.name}/${data.symbol} $ ${data.quote.USD.price}`;
    } catch (error) {
      previousFetch.time = 0;
      console.log(data);
      response =
        "Couldn't find it. Please check your coin name if it is spelled correctly.";
    }

    cb(response);
  });
}

/**
 *
 * @param {string} endpoint
 * @param {string} params
 * @param {function} cb
 */
function getInfo(endpoint, params, cb) {
  const lastFetch = Math.round((Date.now() - previousFetch.time) / 1000);

  let param = "?";

  Object.keys(params).forEach((key) => {
    param += `${key}=${params[key]}&`;
  });

  let url = CoincapAPI + endpoint + param;

  //Retrieve data from API
  if (lastFetch > 180) {
    //3min. required
    console.log("Querying", url);
    previousFetch.time = Date.now();

    let settings = {
      method: "Get",
      headers: { "X-CMC_PRO_API_KEY": process.env.COINCAP_KEY },
    };

    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        //Fetched Data
        previousFetch.data[param] = json;
        cb(json);

        //Store Data
      });

    //Use Cached data
  } else {
    console.log("Cached result", param);
    cb(previousFetch.data[param]);
  }
}
