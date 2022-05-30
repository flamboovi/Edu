const responser = require("../../core/responser");
const logger = require("../../util/log");
const postFeedService = require("../../services/postFeed");

const { POST_TYPE } = require("../../models/postFeed.model");

/**
 * Get posts afterlogin or get posts by user
 * @param {*} req
 * @param {*} res
 */
module.exports.postsAfterLogin = async (req, res) => {
  logger.info("START: Get Post After Login");
  const data = await postFeedService.getPostAfterLogin(req, res);
  return responser.send(200, "postFeed", "PF_P001", req, res, data);
};

/**
 * Method to post a post on social feed
 * @param {*} req
 * @param {*} res
 */
module.exports.createPost = async (req, res, next) => {
  logger.info("START: Create Post");
  const reqBody = req.body;
  const data = await postFeedService.createPost(req, reqBody);
  return responser.send(201, "postFeed", "PF_P002", req, res, data);
};

/**
 * Method to insert like
 * @param {*} req
 * @param {*} res
 */
module.exports.insertLike = async (req, res, next) => {
  logger.info("START: insert like");
  const { postId } = req.query;
  const reqBody = req.body;
  const data = await postFeedService.createLike(req, postId, reqBody);
  return responser.send(201, "postFeed", "LF_L002", req, res, data);
};

/**
 * Method to update a post on social feed
 * @param {*} req
 * @param {*} res
 */
module.exports.updatePost = async (req, res) => {
  logger.info("START: Update Post");
  const db = await coreDB.openDBConnnection();
  const reqBody = req.body;
  const _id = req.params.id;
  logger.data("request data", { _id, ...reqBody });
  const data = await postFeedService.updatePostFeed(reqBody, _id);
  return responser.send(200, "postFeed", "PF_P003", req, res, data);
};

//  const _insertLike = async (req, res) => {
//     logger.info("START: Insert Like ");
//     const db = await coreDB.openDBConnnection();
//     try {
//       const { postId } = req.query;
//       const reqBody = JSON.parse(req.body);
//       logger.data("request data: ", { postId, ...reqBody });
//       const createdBy = req.userid;
//       const likeFilter = { postId, createdBy, status: { $ne: 0 } };
//       const checkLikeExist = await likeIsExist(likeFilter);
//       if (checkLikeExist) {
//         return responser.send(500, handler, "LF_L000", req, res, {});
//       }
//       const payload = { postId, ...reqBody, createdBy };
//       const data = await likeService.saveLike(payload);
//       const updateQuery = { $push: { likes: data._id } };
//       await postService.updatePost({ _id: postId }, updateQuery);
//       return responser.send(201, handler, "LF_L002", req, res, data);
//     } catch (err) {
//       logger.error("Like Post Error", err);
//       return responser.send(500, handler, "CO_C002", req, res, {});
//     } finally {
//       // await coreDB.closeLogDBConnnection(db);
//     }
//   };

//   /**
//    * Method to update a like
//    * @param {*} req
//    * @param {*} res
//    */
//   const _editLike = async (req, res) => {
//     logger.info("START: Update Like");
//     const db = await coreDB.openDBConnnection();
//     try {
//       const id = req.params.id;
//       const { likeReact } = JSON.parse(req.body);
//       logger.data("request data: ", { id, likeReact });
//       const updatedBy = req.userid;
//       const updateQuery = { likeReact, updatedBy };
//       const data = await likeService.updateLike(id, updateQuery);
//       return responser.send(200, handler, "LF_L003", req, res, data);
//     } catch (err) {
//       logger.error("Edit Like Post Error", err);
//       return responser.send(500, handler, "CO_C002", req, res, {});
//     } finally {
//       // await coreDB.closeLogDBConnnection(req.db);
//     }
//   };

//   /**
//    * Method to remove like
//    * @param {} req
//    * @param {*} res
//    */
//   const _removeLike = async (req, res) => {
//     logger.info("START: Remove Like");
//     try {
//       const db = await coreDB.openDBConnnection();
//       const _id = req.params.id;
//       logger.data("request data: ", { id: _id });
//       const { postId } = req.payloadLike;
//       const updatePostQuery = { $pull: { likes: _id } };
//       const [updatePost, data] = await Promise.all([
//         postService.updatePost({ _id: postId }, updatePostQuery),
//         likeService.deleteOne({ _id }),
//       ]);
//       return responser.send(200, handler, "LF_L004", req, res, data);
//     } catch (err) {
//       logger.error("Remove Like Post Error", err);
//       return responser.send(500, handler, "CO_C002", req, res, {});
//     } finally {
//       // await coreDB.closeLogDBConnnection(req.db);
//     }
//   };