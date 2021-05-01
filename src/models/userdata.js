const mongoose = require("mongoose");

const UserDataSchema = mongoose.Schema({
  userHandler: {
    type: String,
    required: true,
  },
  platform: String,
  data: Object,
});

module.exports = mongoose.model("UserData", UserDataSchema);
