const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const User = require("mongoose").model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // if there is an error we don't want to execute further hence we write return for res.json
  if (!authorization)
    return res.status(401).json({ error: "You must be logged in!" });
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: "You must be logged in!" });

    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
