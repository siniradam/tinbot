const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const UserData = require("../models/userdata");

/**
 * @description Stores a user data with platform info.
 */
exports.add = asyncHandler(async (username, platform, data, callback) => {
  const record = await UserData.create({
    userHandler: username,
    platform,
    data,
  });
  callback({ success: true });
});

/**
 * @description Returns previously fetched user data.
 */
exports.retrieve = asyncHandler(async (username, platform, data, callback) => {
  const record = UserData.findOne({ userHandler: username, platform });
  callback(record);
});
