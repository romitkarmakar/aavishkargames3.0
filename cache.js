require("dotenv").config();
var redis = require("redis");
var client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
});
const Game = require("./models/Game");

Game.find({})
  .limit(10)
  .sort({ timestamp: -1 })
  .exec((err, docs) => {
    valuesJson = docs.map(v => v.toJSON());
    values = valuesJson.map(v => JSON.stringify(v));
    console.log(values);
    client.del("list");
    client.rpush(["list", ...values], function(err, reply) {
      console.log(reply);
      process.exit(0);
    });
  });
