const mongoose = require("mongoose");

const ChannelDataSchema = mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  channel: String,
  language: String,
});

module.exports = mongoose.model("Channels", ChannelDataSchema);
