const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  // photoURL
  photo: {
    type: String,
    required: true,
  },
  // image: {
  //   data: "Buffer",
  //   contentType: "String",
  //   default: [],
  // },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
});

mongoose.model("Post", postSchema);
