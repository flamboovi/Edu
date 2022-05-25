

var billing = mongoose.model("billing", billingSchema);
module.exports = billing;



const billing = require("../services/billing");
const response = require("../core/response");
const responser = require("../core/responser");
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const coreDB = require("../core/db");
// Data sanitization against NoSQL query injection
const mongoSanitize = require("../core/mongoSanitizer");
app.use(mongoSanitize);

app.use(cors());
app.use(auth.verifyToken);
const security = require("./PostHandler");
security.securityHeader(app);

let _getBillList = async (req, next) => {
  const db = await coreDB.openDBConnnection();
  try {
    let billings = await billing.findAll();
    next(null, billings);
  } catch (err) {
    next(err, null);
  } finally {
    await coreDB.closeDBConnnection(db);
  }
};

app.get("/billing/all", function (req, res) {
  _getBillList(req, (err, billingList) => {
    if (err) {
      res.status(500).send({
        message: "Something went wrong",
        err: err,
      });
    } else {
      res.json({
        message: "List of Bills ",
        success: true,
        data: billingList,
        totals: {
          count: billingList.length,
        },
      });
    }
  });
});

// Global Error Handler: This middleware will always be at the end
app.use((err, req, res, next) => {
  return responser.globalErrorHandler(req, res, err);
});

module.exports.handler = serverless(app, {
  callbackWaitsForEmptyEventLoop: false,
});
