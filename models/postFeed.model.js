const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const POST_TYPE = Object.freeze({
  MEDIA: "media",
  LINK: "link",
  SHARE: "share",
  BROAD_CAST: "broadcast",
});
const PostFeedSchema = new Schema({
  message: { type: String },
  url: { type: String },
  videoLink: [{ type: String }],
  imagesLink: [{ type: String }],
  isPrivate: { type: Boolean, default: false },
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "postFeed" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "likePost" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "commentPost" }],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "reportPost" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
  originalPostId: { type: mongoose.Schema.Types.ObjectId, ref: "postFeed" },
  postType: {
    type: String,
    enum: Object.values(POST_TYPE),
    default: POST_TYPE.MEDIA,
  },
});
PostFeedSchema.index({ updatedOn: -1 });
PostFeedSchema.index({ createdOn: -1 });
const PostFeedModel = mongoose.model("postFeed", PostFeedSchema);
module.exports = { POST_TYPE, PostFeedModel };
