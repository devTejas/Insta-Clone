const express = require("express");
const router = express.Router();
const User = require("mongoose").model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const requireLogin = require("../middleware/requireLogin");

// signup
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(422).json({ error: "Please fill all the fields!" });

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser)
        return res
          .status(422)
          .json({ error: "User already exists with that email!" });
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user
          .save()
          .then((user) => res.json({ message: "Saved successfully!" }))
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
});

// signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(422).json({ error: "Invalid Email or Password!" });

  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser)
        return res.status(422).json({ error: "Invalid Email or Password!" });

      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            res.json({ token });
          } else
            return res
              .status(422)
              .json({ error: "Invalid Email or Password!" });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

module.exports = router;
