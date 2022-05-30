const mongoose = require("mongoose");

var TempEmailSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name is required!"],
    minLength: [4, "Name is too short!"],
  },
  phoneisVerified: { type: Boolean, default: false },
  phoneNumber: {
    type: String,
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
  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
  userAgent: Object,
});

var tempemail = mongoose.model("tempemail", TempEmailSchema);
module.exports = tempemail;
