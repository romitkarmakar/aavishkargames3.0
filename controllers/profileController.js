require("dotenv").config();
const express = require("express");
var router = express.Router();
var Profile = require('../models/Profile')

router.post("/register", async function(req, res) {
    profile = new Profile({
      email: req.body.email,
      coins: 100
    })

    await profile.save()
    
    res.send({
      coins: 100
    })
});

module.exports = router;
