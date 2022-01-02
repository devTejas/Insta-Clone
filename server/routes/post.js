const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin");

// get your posts
router.get("/mypost", requireLogin, (req, res) => {
  try {
    Post.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name")
      .then((myPosts) => res.json({ myPosts }))
      .catch((err) => {
        console.log(err);
        return res.status(422).json({ error: "It's not you, it's us!" });
      });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "It's not you, it's us!" });
  }
});

// get all posts
router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => res.json({ posts }))
    .catch((err) => {
      console.log(err);
      return res.status(422).json({ error: "It's not you, it's us!" });
    });
});

// get all following posts
router.get("/post", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => res.json({ posts }))
    .catch((err) => {
      console.log(err);
      return res.status(422).json({ error: "It's not you, it's us!" });
    });
});

// https://docs.mongodb.com/manual/reference/operator/query/ -> $nin or $ne
// get all posts from people you don't follow
router.get("/notfollowpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $nin: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => res.json({ posts }))
    .catch((err) => {
      console.log(err);
      return res.status(422).json({ error: "It's not you, it's us!" });
    });
});

// create post
router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, photo } = req.body;
  if (!title || !body)
    return res.status(422).json({ error: "Please add all the fields" });

  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((err) => {
      console.log(err);
      return res.status(422).json({ error: err });
    });
});

// update likes
router.put("/like", requireLogin, (req, res) => {
  const isPostLiked = req.body.postLiked; // if postLiked=true so post is already liked
  const doPushOrPull = isPostLiked
    ? { $pull: { likes: req.user._id } }
    : { $push: { likes: req.user._id } };

  // find id, update the item
  Post.findByIdAndUpdate(req.body.postId, doPushOrPull, { new: true }).exec(
    (err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    }
  );
});

// comment post
router.put("/comment", requireLogin, (req, res) => {
  const comment = { text: req.body.text, postedBy: req.user._id };
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  try {
    Post.findOne({ _id: req.params.postId })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) throw err;
        if (post.postedBy._id.toString() === req.user._id.toString())
          post
            .remove()
            .then((result) => res.json({ message: "Successfully Deleted!" }))
            .catch((error) => {
              console.log("from line 101 - deletepost", err);
              return res.status(422).json({ error: err });
            });
      });
  } catch (error) {
    console.log("from line 106 - deletepost", err);
    return res.status(422).json({ error: err });
  }
});

module.exports = router;

// get single post
// router.get("/post/:id", (req, res) => {
//   try {
//     Post.findOne({ _id: req.params.id })
//       .populate("postedBy", "_id name")
//       .populate("comments.postedBy", "_id name")
//       .then((posts) => res.json({ posts }))
//       .catch((err) => {
//         console.log(err);
//         return res.status(422).json({ err });
//       });
//   } catch (err) {
//     console.log(err);
//     return res.status(422).json({ err });
//   }
// });

// dislike post -> we have used /like for both like & dislike
// router.put("/unlike", requireLogin, (req, res) => {
//   Post.findByIdAndUpdate(
//     req.body.postId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   ).exec((err, result) => {
//     if (err) return res.status(422).json({ error: err });
//     else res.json(result);
//   });
// });
