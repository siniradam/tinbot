const mongoose = require("mongoose");

const UserDataSchema = mongoose.Schema(
  {
    userHandler: {
      type: String,
      required: true,
    },
    platform: String, //psn, xbox, stadia, steam
    source: String, //Data source name, usually game
    data: Object,
  },
  { timestamps: true }
);

UserDataSchema.index(
  { userHandler: 1, platform: 1, source: 1 },
  { unique: true }
);

UserDataSchema.on;

module.exports = mongoose.model("UserData", UserDataSchema);
