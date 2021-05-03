const colors = require("colors");
const env = require("dotenv").config();
if (env.error) {
  throw "Environment file is required.".red;
}

const connectDB = require("./utils/db");
connectDB();
const app = require("./app");
