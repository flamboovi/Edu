var BillingModel = require("../models/billing.model");
const response = require("../core/response");
const logger = require("../util/log");

module.exports.findAll = async () => {
  try {
    return await BillingModel.find({});
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};
