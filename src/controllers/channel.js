const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const Channel = require("../models/channel");

/**
 *
 * @param {string} platform twitch, discord
 * @param {string} channelid unique of the server or channel
 * @param {string} channelname name of the server or channel
 * @param {string} language language code ie: en
 * @param {function} callback Callback method on success
 * @description Adds a Media Channel.
 */
exports.addChannel = async (
  platform,
  channelid,
  channelname,
  language,
  callback
) => {
  let result;

  try {
    let channelRecord = await Channel.update(
      {
        platform,
        channelid,
        channelname,
        language,
      },
      { upsert: true }
    );
    result = { success: true, channelRecord };
  } catch (error) {
    result = { success: false, ...error };
  }

  if (typeof callback == "function") {
    callback(result);
  }
};
