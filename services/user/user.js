/**
 *
 * Function will return all users from the given query
 */
module.exports.getUsers = async ({ filter, projection, option }) => {
  logger.data("START: get all the users with filter ", filter);
  logger.data("Get all users with projection ", projection);
  logger.data("Get all the users with option ", option);
  try {
    return await UserModel.find(filter, projection, option).sort({
      createdAt: -1,
    });
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};
