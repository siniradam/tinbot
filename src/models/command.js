const mongoose = require("mongoose");

const CommanDataSchema = mongoose.Schema({
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  command: String,
  response: String,
});

module.exports = mongoose.model("Command", CommanDataSchema);
