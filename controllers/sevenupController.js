require("dotenv").config();
const express = require("express");
var router = express.Router();
const Sevenup = require("../models/Sevenup");
const Config = require("../models/Config");
var Profile = require("../models/Profile");

router.post("/toss", async function(req, res) {
  doc = await Config.findOne({
    type: "store"
  });
  if (doc.value < -50) {
    res.send({
      result: -1
    });
  } else if (doc.value > 50) {
    res.send({
      result: 1
    });
  } else {
    res.send({
      result: 0
    });
  }
});

router.post("/create", async function(req, res) {
  // Save Session Data
  var sevenup = new Sevenup({
    email: req.body.email,
    status: req.body.status
  });

  await sevenup.save();

  // Save Store Data
  config = await Config.findOne({
    type: "store"
  });

  if (req.body.status == "winner") config.value -= 10;
  if (req.body.status == "loser") config.value += 10;

  await config.save();

  // Save Profile Data
  profile = await Profile.findOne({
    email: req.body.email
  });

  if (req.body.status == "winner") profile.coins += 10;
  if (req.body.status == "loser") profile.coins -= 10;

  await profile.save();

  res.send({
    coins: profile.coins
  });
});

module.exports = router;
