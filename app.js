require("dotenv").config();
const express = require("express");
const utf8 = require("utf8");
const app = express();
var sha1 = require("sha1");
const axios = require("axios");
const Game = require("./models/Game");

app.use(require("cors")());
app.use(express.json());

function generateToken(email) {
  var encodeString = utf8.encode(`${email}${process.env.SECRET_KEY}`);
  return sha1(encodeString);
}

app.post("/toss", async function(req, res) {
  axios
    .get(
      `${process.env.EUREKOIN_BASE_URL}api/coins/?token=${generateToken(
        process.env.GAME_EMAIL
      )}`
    )
    .then(response => {
      if (response.data.coins > 0) {
        res.send({
          status: 0
        });
      } else {
        res.send({
          status: -1
        });
      }
    })
    .catch(err => res.send(err));
});

app.post("/create", async function(req, res) {
  console.log(req.body);
  var game = new Game(req.body);
  await game.save();

  let receiver = req.body.email;
  let sender = process.env.GAME_EMAIL;

  if (req.body.status == "loser") {
    receiver = [sender, (sender = receiver)][0];
  }

  var response = await axios
    .get(
      `${process.env.EUREKOIN_BASE_URL}api/transfer/?token=${generateToken(
        sender
      )}&amount=${req.body.amount}&email=${receiver}`
    )
    .then(response => res.send(response))
    .catch(err => res.send(err));
});

app.get("/list/:game", function(req, res) {
  Game.find({ type: req.params.game })
    .limit(10).sort({ timestamp: -1 })
    .exec((err, docs) => {
      res.send({
        result: docs
      });
    });
});

app.get("/coins/:email", function(req, res) {
  axios
    .get(
      `${process.env.EUREKOIN_BASE_URL}api/coins/?token=${generateToken(
        req.params.email
      )}`
    )
    .then(response => res.send(response.data))
    .catch(err => res.send(err));
});

// Handle 404 error
app.use(function(req, res, next) {
  return res.status(404).send({ status: "404", message: "Api doesn't exists" });
});

// Handle 500 error
app.use(function(err, req, res, next) {
  return res
    .status(500)
    .send({ status: "404", message: "Server Error", error: err });
});

app.listen(process.env.PORT, () =>
  console.log(`Server started at port ${process.env.PORT}`)
);
