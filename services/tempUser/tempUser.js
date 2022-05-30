const TempUserModel = require("../../models/tempUser.model");
var TempEmailModel = require("../../models/tempemail.model");
//find one in temp user
module.exports.findTempUser = async (conditions) => {
  try {
    return await TempUserModel.findOne(conditions);
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};

module.exports.registerTempUser = async (insert) => {
  try {
    let tempuser = new TempUserModel(insert);
    return tempuser.save();
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};

module.exports.tempEmailSave = async (insert) => {
  try {
    let user = new TempEmailModel(insert);
    return await user.save();
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};

module.exports.updateTempUser = async (id, updateDate) => {
  try {
    return await TempUserModel.findByIdAndUpdate(id, updateDate, {
      new: true,
    });
  } catch (err) {
    logger.error(err.message, err);
    throw err;
  }
};

module.exports.deleteTempUser = async (id) => {
  try {
    return await TempUserModel.findByIdAndDelete(id);
  } catch (err) {
    logger.error(err.message, err);
    throw err;
  }
};
