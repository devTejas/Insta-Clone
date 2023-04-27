const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require("./config/keys");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () =>
  console.log(
    "Connected to https://cloud.mongodb.com/v2/619a1d08b20c407fd4476838#clusters"
  )
);
mongoose.connection.on("error", (err) =>
  console.log("Error connecting to mongodb", err)
);

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  console.log(__dirname, path, PORT);
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
