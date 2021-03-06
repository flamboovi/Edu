const Bcrypt = require("bcryptjs");

const logger = require("../../util/log");
const coreDB = require("../../core/db");
const getMessage = require("../../core/translated-response").getMessage;

const userService = require("../user");
const authenticationService = require("../authentication");
const tempUserService = require("../tempUser");
const tokenService = require("../token");

//user registration using mobile no
module.exports.registerwithphone = async (body, req) => {};

//user registration using email id
module.exports.registerWithEmail = async (body, req) => {
  try {
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!body.fullName || !body.password || !body.email) {
      return {
        message: await getMessage(
          "authentication",
          req.headers.locale || "en",
          "R_E004"
        ),
        messageCode: "R_E004",
        statusCode: 400,
      };
    } else if (!emailRegexp.test(body.email)) {
      return {
        message: await getMessage(
          "authentication",
          req.headers.locale || "en",
          "L_E006"
        ),
        messageCode: "L_E006",
        statusCode: 400,
      };
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const insert = {
      fullName: body.fullName,
      password: body.password,
      email: body.email,
      emailOTP: otp,
      emailOTPexp: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
      phoneNumber: body.email,
      dob: body.dob ? body.dob : null,
      username: body.username ? body.username : null,
    };
    let response;
    //check email id exist in temp user table
    const findTemp = await tempUserService.findTempUser({
      email: insert.email,
      Verified: false,
    });
    //check email id exist in user table
    const findUser = await userService.findUser({
      email: insert.phoneNumber,
      emailisVerified: true,
    });
    if (findTemp) {
      logger.data("Email id Already Registered but not verified");
      insert.password = Bcrypt.hashSync(insert.password, 10);
      const update = await tempUserService.updateTempUser(findTemp._id, insert);
      logger.data("Email id already register so updated", update);
      if (update) {
        //create token with registered user id
        const token = await tokenService.signToken(update._id);
        response = {
          statusCode: 200,
          message: "Register Successfully",
          messageCode: "R_S001",
          data: { token },
          content: {
            OTP: update.emailOTP,
            email: update.email,
            name: update.fullName,
          },
          sendEmail: true,
        };
      } else {
        response = {
          statusCode: 400,
          message: await getMessage(
            "authentication",
            req.headers.locale || "en",
            "R_E002"
          ),
          messageCode: "R_E002",
        };
      }
    } else if (findUser) {
      response = {
        statusCode: 400,
        message: await getMessage(
          "authentication",
          req.headers.locale || "en",
          "R_E005"
        ),
        messageCode: "R_E005",
      };
    } else {
      // if (body.referredBy) {
      //   insert["referredBy"] = body.referredBy;
      // }
      const data = await tempUserService.registerTempUser(insert);
      if (data) {
        //create token with registered user id
        const token = await tokenService.signToken(data._id);
        response = {
          statusCode: 200,
          message: await getMessage(
            "authentication",
            req.headers.locale || "en",
            "R_S001"
          ),
          messageCode: "R_S001",
          data: { token },
          content: {
            OTP: data.emailOTP,
            email: data.email,
            name: data.fullName,
          },
          sendEmail: true,
        };
      } else {
        response = {
          statusCode: 400,
          message: await getMessage(
            "auth",
            req.headers.locale || "en",
            "R_E002"
          ),
          messageCode: "R_E002",
        };
      }
    }
    return response;
  } catch (err) {
    throw err;
  }
};

module.exports.loginResponse = async (req, res, user) => {
  logger.info("inside login response");
  let token = await tokenService.signToken(user._id);
  let refreshToken = await tokenService.refreshToken(user._id);
  let tokenInsert = {
    user: user._id,
    jwtToken: token,
    refreshToken: refreshToken,
    createdByIp: req.ip,
    requestData: req.useragent,
  };
  let saveToken = await tokenService.saveToken(tokenInsert);
  logger.data("token save in database", saveToken);
  var date = new Date();

  // Get Unix milliseconds at current time plus 365 days
  date.setTime(+date + 30 * 86400000); //24 \* 60 \* 60 \* 100
  //for server
  let options = await tokenService.setCookieOption();
  res.cookie("refreshToken", refreshToken, options);
  if (user.accountType && user.accountType === "admin") {
    //TODO change login logger
    if (!req.userid) {
      req.userid = user._id;
    }
    // _analyticsService.adminLog(req , "Event_001", {
    //   referenceObject: `${user._id}_${user.fullName}`,
    // });
  }

  // _logTokenService.saveLogToken({
  //   user: user._id,
  //   jwtToken: token,
  //   refreshToken: refreshToken,
  //   createdByIp: req.ip,
  //   types: "login",
  //   requestData: req.useragent,
  //   createdOn: new Date(),
  //   updatedOn: new Date(),
  // });

  let reqData = JSON.parse(req.body);
  // if (reqData["device_id"] && reqData["advertisement_id"]) {
  //    let filter = {
  //      device_id: reqData.device_id,
  //      advertisement_id: reqData.advertisement_id,
  //    };

  //   let payload = {
  //     user: user._id,
  //     userAgent: req.useragent,
  //     updatedOn: new Date(),
  //   };
  //   let device_added = await _userService.addDevice(filter, payload);
  //   logger.data("device_added", device_added);
  // }

  // if (reqData["advertisement_table_id"]) {
  //   let filter = {
  //     _id: reqData.advertisement_table_id,
  //   };

  //   let payload = {
  //     user: user._id,
  //     userAgent: req.useragent,
  //     updatedOn: new Date(),
  //   };
  //   let device_added = await _userService.addDevice(filter, payload);
  //   logger.data("device_added", device_added);
  // }
  return {
    userFlag: user.userFlag,
    token: token,
    refreshToken: refreshToken,
    firstLogin: user.firstLogin,
    type: user.accountType,
    email: user.email,
    phoneNumber: user.phoneNumber,
    dob: user.dob,
  };
};
