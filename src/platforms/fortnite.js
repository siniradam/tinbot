const FortniteAPI = "https://fortnite-api.theapinetwork.com/";
const fetch = require("node-fetch");

//users/id?username=Ninja

const getInfo = (endpoint) => {
  fetch(FortniteAPI + endpoint, {
    headers: { "Content-Type": "application/json", Authorization: "" },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
    });
};
