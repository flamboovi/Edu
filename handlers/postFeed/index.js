//Package Imports
const express = require("express");
const cors = require("cors");
const useragent = require("express-useragent");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

//Custom Module/File Imports
const postFeedHandler = require("./postFeedHandler");
const catchError = require("../../core/catchError");
const coreDB = require("../../core/db");
const auth = require("../../auth/VerifyToken");

const router = express.Router();

//Middlewares
router.use(cors());
router.use(express.json({ limit: "5mb" }));
router.use(useragent.express());
//Data sanitization against NoSQL query injection
router.use(mongoSanitize());
//Data sanitization against XSS
router.use(xss());

//Open a DB connection
coreDB.openDBConnection();

module.exports = router;
