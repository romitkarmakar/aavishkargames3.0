require("dotenv").config();
var redis = require("redis");
var client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
});

client.set("store", 0, function(err, reply) {
    console.log(reply);
    process.exit(0);
})