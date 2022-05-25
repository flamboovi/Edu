const mongoose = require("mongoose");
const { Schema } = mongoose;
const ReportSchema = new Schema({
  status: {
    type: String,
    enum: ["open", "close"],
    default: "open",
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: [true, "PostId is required!"],
    ref: "postFeed",
  },
  reportText: {
    type: String,
  },
  reportType: {
    type: String,
    enum: ["spam", "violate community standards"],
    required: [true, "Report post type is required!"],
    default: "spam",
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: [true, "CreatedBy is required!"],
    ref: "user",
  },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
});

ReportSchema.index({ status: 1 });
ReportSchema.index({ postId: 1 });
ReportSchema.index({ updatedOn: 1 });
ReportSchema.index({ createdOn: 1 });
module.exports = mongoose.model("reportPost", ReportSchema);
