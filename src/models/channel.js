const mongoose = require("mongoose");

const ChannelDataSchema = mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  channelname: String,
  channelid: {
    type: String,
    unique: true,
  },
  language: String,
});

module.exports = mongoose.model("Channels", ChannelDataSchema);
