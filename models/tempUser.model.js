const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var TempUserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name is required!"],
    minLength: [4, "Name is too short!"],
  },
  username: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone No is required!"],
    unique: true,
  },
  phoneOTP: {
    type: Number,
  },
  phoneOTPexp: {
    type: Date,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    lowercase: true,
  },
  signupFrom: { type: String }, //from where user signed up. eg- Email, phone, Gmail, Facebook
  emailOTP: {
    type: Number,
  },
  emailOTPexp: {
    type: Date,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  Verified: {
    type: Boolean,
    default: false,
  },
  dob: { type: Date },
  gender: { type: String },
  country: {
    type: String,
  },
  referredBy: {
    type: String,
  },
  parentalEmail: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  updatedOn: {
    type: Date,
    default: Date.now(),
  },
  userAgent: Object,
  emailOtpVerifyAttempts: {
    type: Number,
    default: 0,
  },
  phoneOtpVerifyAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: Date.now(),
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  userAccTypeNo: {
    type: Number,
    default: 0,
  },
  registrationSource: { type: String },
  userTypeDetail: {
    type: Schema.Types.ObjectId,
    ref: "userTypeDetail",
  },
  phoneNumberLockedUntil : {
    type: Date,
    default: Date.now()
  }
});

TempUserSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

TempUserSchema.index({ phoneNumber: 1, phoneOTP: 1 });
TempUserSchema.index({ email: 1, emailOTP: 1 });

var tempUser = mongoose.model("tempUser", TempUserSchema);
module.exports = tempUser;