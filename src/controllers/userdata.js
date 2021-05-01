const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const UserData = require("../models/userdata");

/**
 * @description Stores a user data with platform info.
 */
exports.add = async (username, platform, source, data, callback) => {
  UserData.findOneAndUpdate(
    { userHandler: username, platform, source }, //To match content
    { data }, //New Fetched Data
    { upsert: true, new: true, setDefaultsOnInsert: true } //Insert if not exists.
  )
    .then((result) => {
      return new Promise((resolve, reject) => {
        resolve(" time: " + new Date().getTime());
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return add(username, platform, source, data, callback);
      } else {
        console.log(err.code);
        //throw err;
      }
    });

  callback({ success: true });
};

/**
 * @description Returns previously fetched user data.
 */
exports.retrieve = async (username, platform, source, callback) => {
  const record = await UserData.findOne({
    userHandler: username,
    source,
    platform,
  });
  callback(record?.data);
};
