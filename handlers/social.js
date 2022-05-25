/**
 * Method to check user permission of post
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const postPermission = async (req, res, next) => {
  const db = await coreDB.openDBConnnection();
  try {
    const id = req.params["id"];
    const post = await postService.getPostById(id, {
      createdBy: 1,
      postType: 1,
    });
    if (!post) {
      return responser.send(400, handler, "CO_C003", req, res, {});
    }
    if (post.createdBy._id != req.userid) {
      return responser.send(403, handler, "CO_C001", req, res, {});
    }
    req.postType = post?.postType;
    return next();
  } catch (error) {
    return responser.send(500, handler, "CO_C002", req, res, {});
  } finally {
    await coreDB.closeDBConnnection(db);
  }
};

app.patch("/social/post/:id", postPermission, _updatePost);
