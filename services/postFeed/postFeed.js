//Package Imports

//Other Imports
const logger = require("../../util/log");
const LikePostModel = require("../../models/likePost.model");
const { PostFeedModel } = require("../../models/postFeed.model");

/**
 * service method from finding post feed
 */
module.exports.getPosts = async (
  { filter, projection, option },
  count = true
) => {
  try {
    if (!count) {
      const posts = await PostFeedModel.find(filter, projection, option);
      return { posts };
    }
    const [posts, total] = await Promise.all([
      PostFeedModel.find(filter, projection, option),
      PostFeedModel.countDocuments(filter),
    ]);
    return { posts, total };
  } catch (error) {
    throw error;
  }
};

/**
 * service method to save post feed
 * @param {*} data
 */
module.exports.savePost = async (data) => {
  try {
    return await PostFeedModel.create(data);
  } catch (error) {
    throw error;
  }
};

/**
 * service method to update post feed
 * @param {*} condition
 * @param {*} updateQuery
 */
module.exports.updatePost = async (condition, updateQuery) => {
  try {
    updateQuery.updatedOn = new Date();
    return await PostFeedModel.findOneAndUpdate(condition, updateQuery, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * service method to delete a post feed
 * @param {*} condition
 */
module.exports.removePost = async (condition) => {
  try {
    const data = await PostFeedModel.findOneAndDelete(condition);
    return Boolean(data);
  } catch (error) {
    throw error;
  }
};