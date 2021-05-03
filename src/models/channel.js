const mongoose = require("mongoose");

const ChannelDataSchema = mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  channel: String,
  command: String,
  response: String,
  language: String,
});

module.exports = mongoose.model("Channels", ChannelDataSchema);
