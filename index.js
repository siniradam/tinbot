const colors = require("colors");
const path = require("path");
const env = require("dotenv").config({ path: path.join(__dirname, ".env") });
if (env.error) {
  throw "No environment file is found.".red;
}

const connectDB = require("./src/utils/db");
connectDB();
const app = require("./src/app");
