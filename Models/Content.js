const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContentSchema = Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum:['public','private']
  },
  commentAllowance: {
    type: Boolean,
    default: false,
  },
  comments:[{
    commentBody:{
      type:String,
    },
    commentingUser:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },
    commentDate:{
      type:Date,
      default:Date.now()
    }
  }],
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Content = mongoose.model("Content", ContentSchema);