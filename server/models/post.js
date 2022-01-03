const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  photo: { type: String, required: true }, // photoURL
  // image: { data: "Buffer", contentType: "String", default: [] },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [{ text: String, postedBy: { type: ObjectId, ref: "User" } }],
  postedBy: { type: ObjectId, ref: "User" },
});

mongoose.model("Post", postSchema);

/**
 * title -> User of the post
 * body -> text in the post
 * ...
 * comments -> { text -> textOfComment, title -> UserName of comment user }
 */
