const colors = require("colors");
const env = require("dotenv").config();
if (env.error) {
  throw "No environment file is found.".red;
}

const connectDB = require("./src/utils/db");
connectDB();
const app = require("./src/app");
