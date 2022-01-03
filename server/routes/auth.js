const express = require("express");
const router = express.Router();
const User = require("mongoose").model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

// signup
router.post("/signup", (req, res) => {
  const { name, email, password, imgURL } = req.body;
  if (!name || !email || !password)
    return res.status(422).json({ error: "Please fill all the fields!" });

  // console.log(name, email, password, imgURL);
  User.findOne({ email }) // {email : email}
    .then((savedUser) => {
      if (savedUser)
        return res.status(422).json({ error: "User already exists!" });
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          imgURL,
        });
        user
          .save()
          .then((user) => res.json({ message: "Saved successfully!" }))
          .catch((err) => {
            console.log(err);
            return res.status(422).json({ error: err });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(422).json({ error: err });
    });
});

// signin
router.post("/signin", (req, res) => {
  let { email, password, guestUser } = req.body;

  if (guestUser) {
    email = "zsh@zsh.com";
    password = "zeptalon";
  }

  // email/password are empty
  if (!email || !password)
    return res.status(422).json({ error: "Invalid Email or Password!" });

  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser)
        return res.status(422).json({ error: "Invalid Email or Password!" });

      bcrypt.compare(password, savedUser.password).then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, imgURL } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, imgURL },
          });
        } else
          return res.status(422).json({ error: "Invalid Email or Password!" });
      });
    })
    .catch((err) => res.status(422).json({ err }));
});

module.exports = router;
