const serverless = require("serverless-http");
const express = require("express");
const app = express();

const logger = require("../../util/log");
const coreDB = require("../../core/db");
const responser = require("../../core/responser")
const getMessage = require("../../core/translated-response").getMessage;

const userService = require("../../services/user");
const authenticationService = require("../../services/authentication");
const tempUserService = require("../../services/tempUser");
const tokenService = require("../../services/token");


const register = async (req, res) => {
   const db = await coreDB.openDBConnection()
  try {
    const body = JSON.parse(req.body);
    let response;
    //if (
    //(process.env.PLATFORM &&
    //process.env.PLATFORM.toLowerCase() == "stcplay.gg") ||
    //process.env.PLATFORM.toLowerCase() == "core.dynasty-dev.com"
    //) {

    body.type = "email";
    if (body.username) {
      const query = {
        username: body.username,
      };

      const data = await userService.search(query, null);

      if (data.isExist) {
        return responser.send(400, "authentication", "US_E002", req, res, {});
      }
      //}

      //if (body.referredBy) {
      //let userAccount = await accountService.getUserRefferredId({
      //referralId: body.referredBy,
      // });
      //if (!userAccount) {
      //return responser.send(500, "auth", "R_E016", req, res, {});
      //}
      //}
    }
    switch (body.type) {
      case "phone":
        response = await authenticationService.registerwithphone(body, req);
        break;
      case "email":
        response = await authenticationService.registerWithEmail(body, req);
        break;
      default:
        response = {
          statusCode: 400,
          message: await getMessage(
            "authentication",
            req.headers.locale || "en",
            "R_E006"
          ),
          messageCode: "R_E006",
        };
        break;
    }
    console.log("response", response)
    if (response.sendEmail || response.sendSMS) {
      // if (
      //   process.env.PLATFORM &&
      //     process.env.PLATFORM.toLowerCase() == "stcplay.gg"
      // ) {
      //   await sms.twilioSend(response.content.phoneNumber);
      //   logger.info(
      //     `twilio verify message send - phoneNumber: ${response.content.phoneNumber}`
      //   );
      // }
      //else
      let condition1 = process.env.PLATFORM &&
      process.env.PLATFORM.toLowerCase() == "educative"
      console.log({condition: condition1, a: process.env.PLATFORM, b: process.env.PLATFORM.toLowerCase()})
      if (
        process.env.PLATFORM &&
        process.env.PLATFORM.toLowerCase() == "educative"
      ) {
        // add to user table;
        let token = await tokenService.verify_token(response.data.token);
        let result = await tempUserService.findTempUser({
          _id: token.id,
        });
        logger.data("result", result);
        if (result) {
          if (result.Verified == true) {
            logger.info("Already verified");
            return responser.send(
              400,
              "authentication",
              "R_E008",
              req,
              res,
              {}
            );
          } else {
              let newUserData = await userService.createUser(req, res, result);
              logger.data("newUserData", newUserData);
              let loginData = await authenticationService.loginResponse(
                req,
                res,
                newUserData
              );
              logger.data("loginData", loginData);
             return responser.send(200, "authentication", "L_S001", req, res, loginData);
          }
        } else {
          return responser.send(400, "authentication", "R_E011", req, res, {});
        }
      } else {
        const type = response.sendEmail ? "email" : "sms";
        //////// await _sendEmailsAndMessages(response.content, "otp", type);
      }
    }

    return res.status(response.statusCode).send({
      message: response.message,
      ...(response.data && { data: response.data }),
      ...(response.messageCode && { messageCode: response.messageCode }),
    });
  } catch (err) {
    logger.error("REGISTER FAILED", err);
    /////////_support.createOrUpdate(req, res, err, "auth", "R_E002");
  } //finally {
  //   await coreDB.closeDBConnnection(db);
  // }
};


//to verify user
const verify_user = async (req, res) => {
  const db = await coreDB.openDBConnnection();
  try {
    let reqData = JSON.parse(req.body);
    if (reqData.token && reqData.otp && reqData.type) {
      //to verify user phone no
      // if (reqData.type == "phone") {
      //   let token = await tokenservice.verify_token(reqData.token);
      //   logger.data("Decoded Token", token);
      //   let result = await auth.findTempUser({
      //     _id: token.id,
      //     phoneOTP: reqData.otp,
      //   });
      //   if (result) {
      //     if (new Date() > result.phoneOTPexp) {
      //       res.status(400).send({
      //         message: await getMessage(
      //           "auth",
      //           req.headers.locale || "en",
      //           "R_E007"
      //         ),
      //         messageCode: "R_E007",
      //       });
      //     } else if (result.Verified == true) {
      //       res.status(400).send({
      //         message: await getMessage(
      //           "auth",
      //           req.headers.locale || "en",
      //           "R_E008"
      //         ),
      //         messageCode: "R_E008",
      //       });
      //     } else {
      //       logger.data("Moving to user collection");
      //       const userId = new mongoose.mongo.ObjectId();
      //       const accountId = new mongoose.mongo.ObjectId();
      //       const preferenceId = new mongoose.mongo.ObjectId();
      //       let userFlag = false;
      //       if (result.dob && result.phoneNumber && result.email) {
      //         userFlag = true;
      //       }
      //       let insert = {
      //         _id: userId,
      //         accountType: "user",
      //         fullName: result.fullName,
      //         username: result.username ? result.username : " ",
      //         isPassword: true,
      //         password: result.password,
      //         phoneNumber: result.phoneNumber,
      //         phoneisVerified: true,
      //         email: result.email,
      //         emailisVerified: false,
      //         profilePicture: process.env.DEFAULT_IMAGE,
      //         dob: result.dob ? result.dob : null,
      //         gender: result.gender ? result.gender : null,
      //         country: result.country ? result.country : null,
      //         parentalEmail: result.parentalEmail ? result.parentalEmail : null,
      //         createdBy: "system",
      //         updatedBy: "system",
      //         accountId: accountId,
      //         accountDetail: accountId,
      //         preference: preferenceId,
      //         updatedOn: new Date(),
      //         createdAgent: req.useragent,
      //         registrationSource: result.registrationSource
      //           ? result.registrationSource
      //           : "",
      //         userFlag: userFlag,
      //       };
      //       if (result.userTypeDetail) {
      //         insert.userTypeDetail = mongoose.Types.ObjectId(
      //           result.userTypeDetail
      //         );
      //       }
      //       logger.data("user inserting data", insert);
      //       const accountInsert = {
      //         _id: accountId,
      //         user: userId,
      //         userDetail: userId,
      //         createdBy: "system",
      //         updatedBy: "system",
      //         referredBy: result.referredBy ? result.referredBy : "",
      //       };
      //       logger.data("account inserting data", accountInsert);
      //       let updateData = {
      //         _id: preferenceId,
      //         userId: userId,
      //       };
      //       logger.data("preference inserting data", updateData);

      //       let inserteduser = await auth.userSave(insert);
      //       let accountData = await accountService.add_account(accountInsert);
      //       if (accountData["referredBy"] != "") {
      //         let referralHistorySaveData = await referralHistory.save(
      //           accountData
      //         );
      //         accountData = JSON.parse(JSON.stringify(accountData));
      //         referralHistorySaveData = JSON.parse(
      //           JSON.stringify(referralHistorySaveData)
      //         );
      //         const getRefereeDetails = await accountService.getRefereeDetails({
      //           referralId: accountData["referredBy"],
      //         });
      //         if (getRefereeDetails.length > 0) {
      //           let referralReward = await reward.add_referral_reward({
      //             user: {
      //               userId: JSON.parse(
      //                 JSON.stringify(getRefereeDetails[0]["user"])
      //               ),
      //               name: getRefereeDetails[0]["fullName"],
      //               email: getRefereeDetails[0]["email"],
      //               phoneNumber: getRefereeDetails[0]["phoneNumber"],
      //             },
      //             referredTo: accountData["user"],
      //             referralHistoryId: referralHistorySaveData["_id"],
      //           });
      //           logger.data("referral reward point added", referralReward);
      //         }
      //         logger.data("referral History Save", referralHistorySaveData);
      //       }
      //       let preferenceData = await userPreferenceService.save(updateData);

      //       logger.data("user update", inserteduser);
      //       logger.data("account update", accountData);
      //       logger.data("preference update", preferenceData);

      //       if (inserteduser) {
      //         // let tempUpdateData = {
      //         //   Verified: true,
      //         //   updatedOn: new Date(),
      //         // };
      //         let update = await auth.delete_temp(result._id);
      //         let loginData = await _loginResponse.loginResponse(
      //           req,
      //           res,
      //           inserteduser
      //         );
      //         if (update) {
      //           res.status(200).send({
      //             message: await getMessage(
      //               "auth",
      //               req.headers.locale || "en",
      //               "R_S002"
      //             ),
      //             messageCode: "R_S002",
      //             data: loginData,
      //           });
      //         } else {
      //           res.status(400).send({
      //             message: await getMessage(
      //               "auth",
      //               req.headers.locale || "en",
      //               "R_E009"
      //             ),
      //             messageCode: "R_E009",
      //           });
      //         }
      //       } else {
      //         res.status(400).send({
      //           message: await getMessage(
      //             "auth",
      //             req.headers.locale || "en",
      //             "R_E010"
      //           ),
      //           messageCode: "R_E010",
      //         });
      //       }
      //     }
      //   } else {
      //     res.status(400).send({
      //       message: await getMessage(
      //         "auth",
      //         req.headers.locale || "en",
      //         "R_E011"
      //       ),
      //       messageCode: "R_E011",
      //     });
      //   }
      // } else 
      if (reqData.type == "email") {
        let token = await tokenService.verify_token(reqData.token);
        logger.data(token);
        let result = await tempUserService.findTempUser({
          _id: token.id,
          emailOTP: reqData.otp,
        });
        if (result) {
          if (new Date() > result.emailOTPexp) {
            res.status(400).send({
              message: await getMessage(
                "auth",
                req.headers.locale || "en",
                "R_E007"
              ),
              messageCode: "R_E007",
            });
          } else if (result.Verified == true) {
            res.status(400).send({
              message: await getMessage(
                "auth",
                req.headers.locale || "en",
                "R_E008"
              ),
              messageCode: "R_E008",
            });
          } else {
            logger.data("Moving to user collection");
            let insert = {
              fullName: result.fullName,
              password: result.password,
              isPassword: true,
              phoneNumber: result.phoneNumber,
              emailisVerified: true,
              email: result.email,
              profilePicture: "",
              createdBy: "system",
              updatedBy: "system",
            };

            let inserteduser = await auth.tempEmailSave(insert);
            if (inserteduser) {
              logger.data(
                "User detail moved from temp collection to temp email collection",
                inserteduser
              );

              let updateData = {
                Verified: true,
                updatedOn: new Date(),
              };
              let update = await auth.delete_temp(result._id);
              if (update) {
                res.status(200).send({
                  message: await getMessage(
                    "auth",
                    req.headers.locale || "en",
                    "R_S002"
                  ),
                  messageCode: "R_S002",
                });
              } else {
                res.status(400).send({
                  message: await getMessage(
                    "auth",
                    req.headers.locale || "en",
                    "R_E009"
                  ),
                  messageCode: "R_E009",
                });
              }
            } else {
              res.status(400).send({
                message: await getMessage(
                  "auth",
                  req.headers.locale || "en",
                  "R_E010"
                ),
                messageCode: "R_E010",
              });
            }
          }
        } else {
          res.status(400).send({
            message: await getMessage(
              "auth",
              req.headers.locale || "en",
              "R_E011"
            ),
            messageCode: "R_E011",
          });
        }
      } else {
        res.status(400).send({
          message: "Invalid registration type!",
        });
      }
    } else {
      res.status(400).send({
        message: "Token, OTP and type required!",
      });
    }
  } catch (err) {
    // _support.createOrUpdate(req, res, err, "auth", "R_E012");
  } finally {
    await coreDB.closeDBConnnection(db);
  }
};




app.post("/auth/verify", verify_user);

app.get("/auth", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/auth/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from auth path!",
  });
});

app.post("/auth/register", register);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);