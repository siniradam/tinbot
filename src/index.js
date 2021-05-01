require("dotenv").config();
const colors = require("colors");
const connectDB = require("./utils/db");
connectDB();
const app = require("./app");
