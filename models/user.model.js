const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");

// arbitary max length
const usernameMaxLength = 100;

/** @see https://stackoverflow.com/a/574698 */
const emailMaxLength = 256;

const userSchema = mongoose.Schema(
  {
    accountType: { type: String, required: true, default: "user" },
    fullName: {
      type: String,
      required: [true, "fullName required"],
      minLength: [1, "{VALUE} is too short, minimum length is 1"],
      maxLength: [100, `{VALUE} is too long, maximum length is 100`],
    },
    userName: {
      type: String,
      unique: true,
      maxLength: [
        usernameMaxLength,
        `{VALUE} is too long, maximum length is ${usernameMaxLength}`,
      ],
    },
    phoneNumber: {
      type: String,
      maxLength: [30, "{VALUE} is too long, maximum length is 30"],
    },
    email: {
      type: String,
      lowercase: true,
      maxLength: [
        emailMaxLength,
        `{VALUE} is too long, maximum length is ${emailMaxLength}`,
      ],
    },
    phoneisVerified: { type: Boolean, default: false },
    emailisVerified: { type: Boolean, default: false },
    isPassword: { type: Boolean, default: false },
    password: { type: String, select: false },
    accessLevel: [{ type: Schema.Types.String }],
    dob: { type: Date },
    gender: { type: String, maxLength: [20, "{VALUE} is too long"] },
    country: {
      type: String,
      maxLength: [55, "{VALUE} is too long, max length is 55"],
    },
    state: {
      type: String,
      maxLength: [50, "{VALUE} is too long, max length is 50"],
    },
    city: {
      type: String,
      maxLength: [60, "{VALUE} is too long, max length is 60"],
    },
    postalCode: {
      type: String,
      maxLength: [9, "{VALUE} is too long, max length is 9"],
    },
    profilePicture: { type: String },
    customPronoun: { type: String },
    createdAgent: Object,
    updatedAgent: Object,
    emailOtpVerifyAttempts: {
      type: Number,
      default: 0,
    },
    phoneOtpVerifyAttempts: {
      type: Number,
      default: 0,
    },
    phoneLockUntil: {
      type: Date,
      default: Date.now(),
    },
    emailLockUntil: {
      type: Date,
      default: Date.now(),
    },
    credentialsChangedAt: Date,
    userFlag: { type: Boolean, default: false },
    registrationSource: { type: String },
    isAccountActivated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);
module.exports = user;