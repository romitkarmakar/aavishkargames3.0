require("dotenv").config();
const express = require("express");
const utf8 = require("utf8");
const app = express();
var sha1 = require("sha1");
const axios = require("axios");

app.use(require("cors")());
app.use(express.json());

function generateToken(email) {
  var encodeString = utf8.encode(`${email}${process.env.SECRET_KEY}`);
  console.log(sha1(encodeString));
  return sha1(encodeString);
}

app.get("/", function(req, res) {
  res.send("Hello from server");
});

app.post("/create", async function(req, res) {
  let receiver = req.body.email;
  let sender = process.env.GAME_EMAIL;

  if (req.body.status == "loser") {
    receiver = [sender, (sender = receiver)][0];
  }

  var response = await axios.get(
    `${process.env.EUREKOIN_BASE_URL}api/transfer/${generateToken(
      sender
    )}?amount=10&email=${receiver}`
  );

  if (response.data.status == "0")
    res.send({
      message: "Status updated"
    });
  else res.send("ERROR");
});

app.post("/coins", function(req, res) {
  axios
    .get(
      `${process.env.EUREKOIN_BASE_URL}api/coins/?token=${generateToken(
        req.body.email
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
