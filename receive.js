require("dotenv").config();
const utf8 = require("utf8");
var sha1 = require("sha1");
const axios = require("axios");
const Game = require("./models/Game");
const Profile = require("./models/Profile");
var redis = require("redis");
var client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
});
var q = "tasks";
var q2 = "profiles";
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
var open = require("amqplib").connect(url);
var Sequelize = require("sequelize"),
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    port: 5432,
    host: "ec2-34-197-171-33.compute-1.amazonaws.com",
    dialectOptions: {
      ssl: true
    },
    logging: false
  });

function generateToken(email) {
  var encodeString = utf8.encode(`${email}${process.env.SECRET_KEY}`);
  return sha1(encodeString);
}

async function add(value) {
  client.get("store", function(err, reply) {
    console.log(Number(reply));
    client.set("store", String(Number(reply) + value));
  });
}

async function persist(data) {
  console.log(data);
  var game = new Game(data);
  await game.save();

  let receiver = data.email;
  let sender = process.env.GAME_EMAIL;

  if (data.status == "loser") {
    receiver = [sender, (sender = receiver)][0];
    add(data.amount);
  } else if (data.status == "winner") {
    add(-data.amount);
  } else return;

  axios
    .get(
      `${process.env.EUREKOIN_BASE_URL}api/transfer/?token=${generateToken(
        sender
      )}&amount=${data.amount}&email=${receiver}`
    )
    .then(response => console.log(response.data))
    .catch(err => console.log(err));
}

// Consumer
open
  .then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
      ch.assertQueue(q);
      ch.assertQueue(q2);
      ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          persist(JSON.parse(msg.content.toString()));
          ch.ack(msg);
        }
      });

      ch.consume(q2, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          Profile(msg.content.toString());
          // persist(JSON.parse(msg.content.toString()));
          ch.ack(msg);
        }
      });
    });
    return ok;
  })
  .then(null, console.warn);
