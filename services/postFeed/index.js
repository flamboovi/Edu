const likePostService = require("./likePost");
const postFeedService = require("./postFeedService");

module.exports.createPost = postFeedService.createPost;
module.exports.getPostAfterLogin = postFeedService.getPostAfterLogin;
module.exports.updatePostFeed = postFeedService.updatePostFeed;
module.exports.createLike = postFeedService.createLike;
