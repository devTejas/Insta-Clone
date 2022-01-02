const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

// get user details & posts
router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) return res.status(422).json({ error: err });
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ error: "User Not Found!" });
    });
});

// FOLLOW USER

/* user-A -> follower of user-B, user-B -> user-A following user-B
- if user-A follows user-B, then definitely here user-A is the currentUser. Hence user-A will be available in `req.user`.
- So first followers of user-B are updated by passing his _id.
- then following of user-A are updated, as the user_followed _id is passed in the body.
*/
router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $push: { following: req.body.followId } },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).json({ error: err });
      User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user._id } },
        { new: true }
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
});

// UNFOLLOW USER - Same as follow user
// here followId is the unfollowId of the user to be unfollowed
router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { following: req.body.followId } },
    { new: true },
    (err, result) => {
      if (err) return res.status(422).json({ error: err });
      User.findByIdAndUpdate(
        req.body.followId,
        { $pull: { followers: req.user._id } },
        { new: true }
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => res.status(422).json({ error: err }));
    }
  );
});

module.exports = router;
