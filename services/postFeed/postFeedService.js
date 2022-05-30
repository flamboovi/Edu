//Package Imports

//Other Imports
const logger = require("../../util/log");
const LikePostModel = require("../../models/likePost.model");
const { POST_TYPE } = require("../../models/postFeed.model");
const likeService = require("./likePost");
const postService = require("./postFeed");

const urlRegex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const regex = new RegExp(urlRegex);

/**
 * Get posts afterlogin or get posts by user
 * @param {*} req
 * @param {*} res
 */
module.exports.getPostAfterLogin = async (req, res) => {
  logger.info("START: Get Post After Login");
  const reqQuery = queryBuilder.buildDefault(req.query);
  logger.data("request query: ", reqQuery);
  const userId = req.userid;
  if (!reqQuery["filter"]["createdBy"]) {
    const userQuery = queryBuilder.build();
    userQuery["filter"]["isAuthor"] = 0;
    userQuery["filter"]["isInfluencer"] = 0;
    userQuery["projection"]["_id"] = 1;
    const [followUsers, admin] = await Promise.all([
      userFolloweService.getFollowUser(userId),
      userService.getUser(userQuery),
    ]);
    let followers = followUsers.map((follow) => follow.followingID);
    let users = admin.map((user) => user._id);
    users = [...new Set([...users, ...followers, userId])];
    reqQuery["filter"]["createdBy"] = { $in: users };
    reqQuery["filter"]["isPrivate"] = false;
  }
  userId != reqQuery["filter"]["createdBy"]
    ? (reqQuery["filter"]["isPrivate"] = false)
    : delete reqQuery["filter"]["isPrivate"];
  reqQuery["option"]["populate"].push(likesPopulate);
  reqQuery["option"]["populate"].push(postPopulate);
  reqQuery["projection"] = postService.defaultPostProjection;
  let data = await postService.getPosts(reqQuery);
  //data["posts"] = formatGetPost(data["posts"], userId);
  return data; //responser.send(200, handler, "PF_P001", req, res, data);
};

/**
 * Method to update a post on social feed
 * @param {*} req
 * @param {*} res
 */
module.exports.updatePostFeed = async (reqBody, _id) => {
  logger.data("request data", { _id, ...reqBody });
  const { videoLink, imagesLink, message, url, postType } = reqBody;
  let payload = {};
  switch (postType) {
    case POST_TYPE.MEDIA:
      if (!(videoLink?.length >= 1 || imagesLink?.length >= 1 || message)) {
        return new AppError(400, "postFeed", "CO_C003");
      }
      payload = { videoLink, imagesLink, message };
      break;
    case POST_TYPE.LINK:
      if (!url?.match(regex)) {
        return new AppError(400, "postFeed", "CO_C003");
      }
      payload = { url, message };
      break;
    case POST_TYPE.SHARE:
      if (!message) {
        return new AppError(400, "postFeed", "CO_C003");
      }
      payload = { message };
      break;
    case POST_TYPE.BROAD_CAST:
      payload = { ...reqBody };
      break;
    default:
      return new AppError(400, "postFeed", "CO_C003");
  }
  payload["updatedBy"] = req.userid;
  payload["isPrivate"] =
    postType == POST_TYPE.SHARE || postType == POST_TYPE.BROAD_CAST
      ? false
      : reqBody.isPrivate || false;
  logger.data("payload: ", payload);
  const data = await postService.updatePost({ _id }, payload);
  return data;
};

/**
 * Method to post a post on social feed
 * @param {*} req
 * @param {*} res
 */
module.exports.createPost = async (req, reqBody) => {
  const { videoLink, imagesLink, message, url } = reqBody;
  let payload = {};
  const postType = reqBody?.postType || POST_TYPE.MEDIA;
  switch (postType) {
    case POST_TYPE.MEDIA:
      const videoAmount = videoLink?.length || 0;
      const imagesAmount = imagesLink?.length || 0;
      const totalsFile = videoAmount + imagesAmount;
      if (!(message || totalsFile <= maxFileAmount)) {
        throw new AppError(400, "postFeed", "CO_C003");
        //return responser.send(400, handler, "CO_C003", req, res, {});
      }
      payload = { videoLink, imagesLink, message };
      break;
    case POST_TYPE.LINK:
      if (!url?.match(regex)) {
        throw new AppError(400, "postFeed", "CO_C003");
        //return responser.send(400, handler, "CO_C003", req, res, {});
      }
      payload = { url, message };
      break;
    case POST_TYPE.BROAD_CAST:
      payload = { ...req.body };
      break;
    default:
      throw new AppError(400, "postFeed", "CO_C002");
    //return responser.send(500, handler, "CO_C002", req, res, {});
  }
  payload["isPrivate"] = reqBody?.isPrivate || false;
  payload["createdBy"] = req.userid;
  payload["postType"] = postType;
  const data = await postService.savePost(payload);
  return data;
};

/**
 * service method to save like
 * @param {*} data
 */
module.exports.createLike = async () => {
  const createdBy = req.userid;
  const likeFilter = { postId, createdBy, status: { $ne: 0 } };
  const checkLikeExists = await likeIsExist(likeFilter);
  if (checkLikeExists) {
    throw new AppError(400, "postFeed", "LF_L000");
  }
  const payload = { postId, ...reqBody, createdBy };
  const data = await likeService.saveLike(payload);
  const updateQuery = { $push: { likes: data._id } };
  await postService.updatePost({ _id: postId }, updateQuery);
  return data;
};

/**
 * Method to check report exist ?
 * @param {*} filter
 */
const likeIsExist = async (filter) => {
  try {
    const like = await likeService.getLike(filter);
    if (!like) return false;
    return like;
  } catch (error) {
    throw error;
  }
};