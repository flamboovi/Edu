const mongoose = require("mongoose");

const logger = require("../../util/log");
const UserModel = require("../../models/user.model");
const tempUserService = require("../tempUser")


//find one in user
module.exports.findUser = async (conditions) => {
  try {
    const modelProperties = Object.keys(UserModel.schema.obj);
    let project = {};
    modelProperties.forEach((ele) => {
      project[ele] = 1;
    });
    return await UserModel.findOne(conditions, project);
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};

module.exports.search = async (filter, id) => {
  try {
    const user = await UserModel.findOne(filter, {}, {});
    if (user) {
      if (user._id == id) {
        return {
          isExist: false,
        };
      }
    }
    if (user) {
      return {
        isExist: true,
      };
    }
    return {
      isExist: false,
    };
  } catch (error) {
    throw error;
  }
};

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


module.exports.userSave = async (insert) => {
  try {
    insert.isPrivacyPolicyAccepted = true;

    // if (!insert.profilePicture) {
    //   insert.profilePicture = await this.assignRandomAvatar();
    // }

    let user = new UserModel(insert);
    logger.info(`inside user save function ${user}`);
    if (user.email) {
      // await userService.update_team_participant(
      //   {
      //     email: user.email,
      //     status: "invite_pending",
      //   },
      //   {
      //     $set: {
      //       status: "active",
      //       userId: user._id,
      //     },
      //   }
      // );
    }

    return await user.save();
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};



// const logger = require("../../util/log");
// const auth = require("../../services/auth");
// const accountService = require("../../services/account");
// const referralHistory = require("../../services/referralHistory");
// const reward = require("../../services/reward");
// const userPreferenceService = require("../../services/userPreferenes");

module.exports.createUser = async (req, res, user, platform) => {
  let body =  JSON.parse(req.body);
  if(body.dob){
    user.userFlag= true;
  }
    logger.info("createUser function started");
    logger.data("Moving to user collection");
    const userId = new mongoose.mongo.ObjectId();
    const accountId = new mongoose.mongo.ObjectId();
    const preferenceId = new mongoose.mongo.ObjectId();
    const insert = {
      _id: userId,
      accountType: platform === 'educative' ? user.accountType : "user",
      fullName: user.fullName,
      username: user.username,
      isPassword: true,///
      password: user.password,////
      phoneNumber: user.phoneNumber,
      dob: user.dob,
      gender: user.gender,
      phoneisVerified: true,
      email: user.email,
      emailisVerified: true,
      profilePicture: process.env.DEFAULT_IMAGE,///
      country: user.country,
     ///// parentalEmail: user.parentalEmail,
      createdBy: "system",
      updatedBy: "system",
      // accountId: accountId,
      // accountDetail: accountId,
      ////preference: preferenceId,//////
      updatedOn: new Date(),
      createdAgent: req.useragent,
      userFlag: user.userFlag,
      registrationSource: user.registrationSource,
      isAccountActivated: false
    };
    // // from maxis
    // if (platform === 'GENGGAMERS') {
    //   insert.accessLevel = user.accessLevel;
    // }
    logger.data("user inserting data", insert);
    // const accountInsert = {
    //   _id: accountId,
    //   user: userId,
    //   userDetail: userId,
    //   createdBy: "system",
    //   updatedBy: "system",
    //   referredBy: user.referredBy ? user.referredBy : "",
    // };
    // logger.data("account inserting data", accountInsert);
    // let updateData = {
    //   _id: preferenceId,
    //   userId: userId,
    // };
    // logger.data("preference inserting data", updateData);

    let inserteduser = await this.userSave(insert);

    // let accountData = await accountService.add_account(accountInsert);
    // if (accountData["referredBy"] != "") {
    //   let referralHistorySaveData = await referralHistory.save(accountData);
    //   accountData = JSON.parse(JSON.stringify(accountData));
    //   referralHistorySaveData = JSON.parse(
    //     JSON.stringify(referralHistorySaveData)
    //   );
    //   const getRefereeDetails = await accountService.getRefereeDetails({
    //     referralId: accountData["referredBy"],
    //   });
    //   if (getRefereeDetails.length > 0) {
    //     let referralReward = await reward.add_referral_reward({
    //       user: {
    //         userId: JSON.parse(JSON.stringify(getRefereeDetails[0]["user"])),
    //         name: getRefereeDetails[0]["fullName"],
    //         email: getRefereeDetails[0]["email"],
    //         phoneNumber: getRefereeDetails[0]["phoneNumber"],
    //       },
    //       referredTo: accountData["user"],
    //       referralHistoryId: referralHistorySaveData["_id"],
    //     });
    //     logger.data("referral reward point added", referralReward);
    //   }
    //   logger.data("referral History Save", referralHistorySaveData);
    // }
    // let preferenceData = await userPreferenceService.save(updateData);
    logger.data("user update", inserteduser);
    // logger.data("account update", accountData);
    // logger.data("preference update", preferenceData);

    let update = await tempUserService.deleteTempUser(user._id);
    logger.info("createUser function ended");
    return inserteduser; 
}