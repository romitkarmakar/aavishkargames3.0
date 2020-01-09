require("dotenv").config();
const express = require("express");
const app = express();
const Config = require("./models/Config");

app.use(require("cors")());
app.use(express.json());

app.use("/sevenup", require("./controllers/sevenupController"));
app.use("/profile", require("./controllers/profileController"));

app.get("/install", async function(req, res) {
  var config = Config({
    type: "store",
    value: 0
  });

  await config.save();

  res.send("Installed Successfully");
});

app.listen(process.env.PORT, () =>
  console.log(`Server started at port ${process.env.PORT}`)
);
