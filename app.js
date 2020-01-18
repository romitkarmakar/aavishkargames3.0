require("dotenv").config();
const express = require("express");
const utf8 = require("utf8");
const app = express();
var sha1 = require("sha1");
const axios = require("axios");
const Game = require("./models/Game");
var redis = require("redis");
var client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
});
var q = 'tasks';
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var open = require('amqplib').connect(url);

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
  open.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
      ch.assertQueue(q);
      ch.sendToQueue(q, new Buffer(JSON.stringify(req.body)));
    });
    res.send("OK");
  }).then(null, console.warn);
});

app.get("/list/:game", function(req, res) {
  Game.find({ type: req.params.game })
    .limit(10)
    .sort({ timestamp: -1 })
    .exec((err, docs) => {
      res.send({
        result: docs
      });
    });
});

app.get("/list", function(req, res) {
  client.ltrim("list", 0, 10);
  client.lrange("list", 0, -1, function(err, reply) {
    valuesJson = reply.map(v => JSON.parse(v));
    res.send({
      value: valuesJson
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
