const asyncHandler = (fn) => (username, platform, source, data, callback) => {
  Promise.resolve(fn(username, platform, source, data, callback)).catch(
    callback
  );
};

module.exports = asyncHandler;
