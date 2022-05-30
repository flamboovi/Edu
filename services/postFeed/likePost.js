//Other Imports
const logger = require("../../util/log");
const LikePostModel = require("../../models/likePost.model");

module.exports.saveLike = async (data) => {
  try {
    return await LikePostModel.create(data);
  } catch (error) {
    throw error;
  }
};

/**
 * service method to get like
 * @param {*} filter
 * @param {*} projection
 * @param {*} option
 */
module.exports.getLike = async (filter, projection, option) => {
  try {
    return await LikePostModel.findOne(filter, projection, option);
  } catch (error) {
    throw error;
  }
};
